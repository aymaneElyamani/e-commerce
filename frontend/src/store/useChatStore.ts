"use client";

import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

export type Message = { role: "user" | "assistant"; content: string };
export type Conversation = {
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

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  // updater receives previous conversations and returns next
  setConversations: (updater: (prev: Conversation[]) => Conversation[]) => void;
  startNewChat: () => void;
}

const initialFirstConversation: Conversation = {
  id: makeId(),
  title: "New Chat",
  messages: [defaultAssistantMsg],
  createdAt: new Date().toISOString(),
};

const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [initialFirstConversation],
      activeId: initialFirstConversation.id,

      setActiveId: (id) => set({ activeId: id }),

      setConversations: (updater) => {
        const next = updater(get().conversations);
        set({ conversations: next });
      },

      startNewChat: () => {
        const conv: Conversation = {
          id: makeId(),
          title: "New Chat",
          messages: [defaultAssistantMsg],
          createdAt: new Date().toISOString(),
        };
        set({ conversations: [conv, ...get().conversations], activeId: conv.id });
      },
    }),
    {
      name: "chat-conversations-store",
      getStorage: () => localStorage,
    } as PersistOptions<ChatState>
  )
);

export default useChatStore;
