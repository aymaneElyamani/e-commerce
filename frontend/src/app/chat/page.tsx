"use client";

import { useState, useRef, useEffect } from "react";
import useChatStore, { Conversation, Message } from "@/store/useChatStore";

export default function ChatPage() {
  const { conversations, activeId, setActiveId, setConversations, startNewChat } =
    useChatStore();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when conversations change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const active = conversations.find((c) => c.id === activeId);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading || !active) return;
    setInput("");

    const nextUser: Message = { role: "user", content: text };
    const nextMessages = [...active.messages, nextUser];

    // Update title if still default
    const newTitle = active.title === "New Chat" ? text.slice(0, 30) : active.title;

    setConversations((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, title: newTitle, messages: nextMessages } : c))
    );

    setLoading(true);
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opnai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await resp.json();
      const assistantMsg: Message = {
        role: "assistant",
        content:
          resp.ok
            ? (data?.message as string) ?? ""
            : data?.error || "Sorry, I had trouble responding. Please try again.",
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === active.id ? { ...c, messages: [...nextMessages, assistantMsg] } : c))
      );
    } catch {
      const assistantMsg: Message = {
        role: "assistant",
        content: "Network error. Please try again.",
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === active.id ? { ...c, messages: [...nextMessages, assistantMsg] } : c))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex ">
      {/* Sidebar with conversations */}
      <aside className="w-72 border-r bg-card p-3 flex flex-col gap-3 mt-10">
        <button
          onClick={() => {
            startNewChat();
            setInput("");
          }}
          className="w-full rounded-md bg-primary text-primary-foreground px-3 py-2 hover:bg-primary/90"
        >
          + New Chat
        </button>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-3 py-2 rounded-md mb-2 ${
                c.id === activeId ? "bg-muted" : "bg-muted/60"
              }`}
              title={c.title}
            >
              <div className="font-medium truncate">{c.title || "Untitled"}</div>
              <div className="text-sm text-muted-foreground truncate">
                {c.messages[c.messages.length - 1]?.content || ""}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Chat Assistant</h1>
        <div className="flex-1 overflow-y-auto rounded-lg border bg-card p-4 space-y-3">
          {(active?.messages || []).map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl bg-primary text-primary-foreground px-4 py-2"
                    : "max-w-[80%] rounded-2xl bg-muted px-4 py-2"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about products or orders..."
            className="flex-1 rounded-md border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading || !active}
            className="rounded-md bg-primary text-primary-foreground px-5 py-3 hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
