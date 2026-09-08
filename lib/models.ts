export const CHAT_MODELS = [
  { id: "gpt-5.6", label: "GPT-5.6" },
  { id: "gpt-5.5", label: "GPT-5.5" },
  { id: "gpt-5.4", label: "GPT-5.4" },
  { id: "gpt-5.4-mini", label: "GPT-5.4 Mini" },
  { id: "gpt-4.1", label: "GPT-4.1" },
  { id: "gpt-4o-mini", label: "GPT-4o Mini" },
] as const;

export type ChatModelId = (typeof CHAT_MODELS)[number]["id"];

export const DEFAULT_CHAT_MODEL: ChatModelId = "gpt-5.4";

export type ChatMode = "chat" | "search" | "image";
