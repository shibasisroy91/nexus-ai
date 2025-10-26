import ChatApp from "../components/ChatApp";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-zinc-50 to-white font-sans">
      <main className="w-full px-8 py-16">
        <ChatApp />
      </main>
    </div>
  );
}
