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
  try {
    const { message: userMessageContent, sessionId } = await req.json();

    if (!userMessageContent || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId is required" },
        { status: 400 }
      );
    }

    const recentMessages = await db
      .select({
        role: messageSchema.role,
        content: messageSchema.content,
      })
      .from(messageSchema)
      .where(eq(messageSchema.sessionId, sessionId))
      .orderBy(desc(messageSchema.createdAt))
      .limit(10);

    const chatHistory = recentMessages.reverse().map((msg) => ({
      role: mapRoleToGemini(msg.role),
      parts: [{ text: msg.content }],
    })) as Content[];

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    const result = await chat.sendMessage(userMessageContent);
    const response = await result.response;
    const reply = response.text();

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

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.log("Error calling Gemini API", error);
    return NextResponse.json(
      { error: "Failed to fetch AI response" },
      { status: 500 }
    );
  }
}
