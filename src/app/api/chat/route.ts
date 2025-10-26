import { GoogleGenerativeAI, Content, Part } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messages as messageSchema } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const mapRoleToGemini = (role: "user" | "assistant") => {
  return role === "user" ? "user" : "model";
};

export async function POST(req: Request) {
  type Body = { message?: string; sessionId?: string };
  let body: Body;
  try {
    body = await req.json();
  } catch (jsonErr) {
    console.error("Invalid JSON body for /api/chat POST", jsonErr);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userMessageContent = body?.message;
  const sessionId = body?.sessionId;

  if (!userMessageContent || !sessionId) {
    return NextResponse.json(
      { error: "`message` and `sessionId` are required in the request body" },
      { status: 400 }
    );
  }

  // 1) Fetch recent messages from DB (catch DB errors separately)
  let recentMessages: { role: "user" | "assistant"; content: string }[] = [];
  try {
    recentMessages = await db
      .select({ role: messageSchema.role, content: messageSchema.content })
      .from(messageSchema)
      .where(eq(messageSchema.sessionId, sessionId))
      .orderBy(desc(messageSchema.createdAt))
      .limit(10);
  } catch (dbErr) {
    console.error("DB query failed for sessionId", sessionId, dbErr);
    return NextResponse.json(
      { error: "Failed to retrieve chat history" },
      { status: 500 }
    );
  }

  const chatHistory = recentMessages.reverse().map((msg) => ({
    role: mapRoleToGemini(msg.role),
    parts: [{ text: msg.content }],
  })) as Content[];

  // 2) Call Gemini API (catch errors specifically and return 502 Bad Gateway on external failure)
  let reply = "";
  try {
    const systemPrompt = `You are Nexus AI, a friendly and helpful coding assistant... Be slightly witty when appropriate, but always prioritize clarity and accuracy.`;
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    const result = await chat.sendMessage(userMessageContent);
    const response = await result.response;
    reply = response.text();
  } catch (apiErr) {
    console.error("Gemini API call failed", {
      sessionId,
      userMessageContent,
      apiErr,
    });
    return NextResponse.json(
      { error: "AI service unavailable; please try again later" },
      { status: 502 }
    );
  }

  // 3) Persist messages, but don't fail the whole request if persistence fails — log and return a warning
  try {
    await Promise.all([
      db.insert(messageSchema).values({
        sessionId: sessionId,
        role: "user",
        content: userMessageContent,
      }),
      db.insert(messageSchema).values({
        sessionId: sessionId,
        role: "assistant",
        content: reply,
      }),
    ]);
  } catch (persistErr) {
    console.error(
      "Failed to persist messages for session",
      sessionId,
      persistErr
    );
    // Return the AI reply but include a non-sensitive warning
    return NextResponse.json(
      { response: reply, warning: "Failed to save conversation to database" },
      { status: 200 }
    );
  }

  return NextResponse.json({ response: reply });
}
