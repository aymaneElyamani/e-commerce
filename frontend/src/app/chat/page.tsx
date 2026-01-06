"use client";

      import { useState, useRef, useEffect } from "react";

      type Message = { role: "user" | "assistant"; content: string };
      type Conversation = {
        id: string;
        title: string;
        messages: Message[];
        createdAt: string;
      };

      const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const defaultAssistantMsg: Message = {
        role: "assistant",
        content:
          "Hi! I’m your shopping assistant. Ask me about products, orders, or recommendations.",
      };

      export default function ChatPage() {
        const [conversations, setConversations] = useState<Conversation[]>([]);
        const [activeId, setActiveId] = useState<string | null>(null);
        const [input, setInput] = useState("");
        const [loading, setLoading] = useState(false);
        const bottomRef = useRef<HTMLDivElement | null>(null);

        // Load conversations from localStorage on mount
        useEffect(() => {
          try {
            const raw = localStorage.getItem("chat-conversations");
            if (raw) {
              const parsed = JSON.parse(raw) as Conversation[];
              if (Array.isArray(parsed) && parsed.length > 0) {
                setConversations(parsed);
                setActiveId(parsed[0].id);
                return;
              }
            }
          } catch {}
          const first: Conversation = {
            id: makeId(),
            title: "New Chat",
            messages: [defaultAssistantMsg],
            createdAt: new Date().toISOString(),
          };
          setConversations([first]);
          setActiveId(first.id);
        }, []);

        // Persist conversations
        useEffect(() => {
          try {
            localStorage.setItem("chat-conversations", JSON.stringify(conversations));
          } catch {}
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [conversations]);

        const active = conversations.find((c) => c.id === activeId);

        const startNewChat = () => {
          const conv: Conversation = {
            id: makeId(),
            title: "New Chat",
            messages: [defaultAssistantMsg],
            createdAt: new Date().toISOString(),
          };
          setConversations((prev) => [conv, ...prev]);
          setActiveId(conv.id);
          setInput("");
        };

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
              prev.map((c) =>
                c.id === active.id ? { ...c, messages: [...nextMessages, assistantMsg] } : c
              )
            );
          } catch {
            const assistantMsg: Message = {
              role: "assistant",
              content: "Network error. Please try again.",
            };
            setConversations((prev) =>
              prev.map((c) =>
                c.id === active.id ? { ...c, messages: [...nextMessages, assistantMsg] } : c
              )
            );
          } finally {
            setLoading(false);
          }
        };

        return (
          <div className="min-h-[calc(100vh-5rem)] flex">
            {/* Sidebar with conversations */}
            <aside className="w-72 border-r bg-white dark:bg-neutral-900 p-3 flex flex-col gap-3">
              <button
                onClick={startNewChat}
                className="w-full rounded-md bg-blue-600 text-white px-3 py-2 hover:bg-blue-700"
              >
                + New Chat
              </button>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-md mb-2 ${
                      c.id === activeId ? "bg-blue-50 dark:bg-neutral-800" : "bg-gray-100 dark:bg-neutral-800"
                    }`}
                    title={c.title}
                  >
                    <div className="font-medium truncate">{c.title || "Untitled"}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {c.messages[c.messages.length - 1]?.content || ""}
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col px-4 py-6">
              <h1 className="text-2xl font-semibold mb-4">Chat Assistant</h1>
              <div className="flex-1 overflow-y-auto rounded-lg border bg-white dark:bg-neutral-900 p-4 space-y-3">
                {(active?.messages || []).map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[80%] rounded-2xl bg-blue-600 text-white px-4 py-2"
                          : "max-w-[80%] rounded-2xl bg-gray-100 dark:bg-neutral-800 px-4 py-2"
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
                  className="flex-1 rounded-md border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900"
                />
                <button
                  type="submit"
                  disabled={loading || !active}
                  className="rounded-md bg-blue-600 text-white px-5 py-3 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        );
      }
