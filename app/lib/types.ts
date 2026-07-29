export type Sender = "visitor" | "agent";

export type Message = {
  id: string;
  from: Sender;
  text: string;
  time: string;
};

export type Tag = {
  label: string;
  tone: "blue" | "amber";
};

export type Conversation = {
  id: string;
  name: string;
  email: string;
  color: string;
  order: string;
  plugin: string;
  tags: Tag[];
  assignee: string;
  notes: string;
  messages: Message[];
  unread: boolean;
};

export const ASSIGNEES = [
  "Unassigned",
  "Shihab",
  "Rafi (Support)",
  "Nusrat (Support)",
];

export const AVATAR_COLORS = [
  "#00B39F",
  "#3A5DBB",
  "#B5730A",
  "#7C5CFF",
  "#E0527A",
];

/** The conversation the live widget writes into. */
export const LIVE_CONVERSATION_ID = "live";

export function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function timeNow() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
