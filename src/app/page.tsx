import ChatApp from "../components/ChatApp";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-zinc-50 to-white font-sans">
      <main className="w-full px-6 py-12">
        <ChatApp />
      </main>
    </div>
  );
}
