import { AVATAR_COLORS, type Conversation } from "./types";

export const seedConversations: Conversation[] = [
  {
    id: "c1",
    name: "Rafiq Hasan",
    email: "rafiq.hasan@mailbox.com",
    color: AVATAR_COLORS[1],
    order: "#10432",
    plugin: "WowRevenue Pro",
    tags: [
      { label: "Refund", tone: "blue" },
      { label: "Priority", tone: "amber" },
    ],
    assignee: "Rafi (Support)",
    notes: "Asked about a bundle refund, waiting on order lookup.",
    unread: false,
    messages: [
      {
        id: "c1-m1",
        from: "visitor",
        text: "Hi, I was charged twice for a bundle order, can you check?",
        time: "10:14 AM",
      },
      {
        id: "c1-m2",
        from: "agent",
        text: "Sorry about that! Let me pull up your order now.",
        time: "10:16 AM",
      },
    ],
  },
  {
    id: "c2",
    name: "Nusrat Alam",
    email: "n.alam@studio-demo.com",
    color: AVATAR_COLORS[2],
    order: "#10298",
    plugin: "WowStore",
    tags: [{ label: "License", tone: "blue" }],
    assignee: "Unassigned",
    notes: "",
    unread: true,
    messages: [
      {
        id: "c2-m1",
        from: "visitor",
        text: "My license key isn't activating on the new domain.",
        time: "9:02 AM",
      },
    ],
  },
];

export const cannedReplies = [
  {
    label: "Ask for order #",
    text: "Thanks for reaching out! Could you share your order number so I can take a look?",
  },
  {
    label: "Known issue",
    text: "This is a known issue and our team is already on it — I'll update you as soon as it's fixed.",
  },
  {
    label: "Wrap up",
    text: "Glad that solved it! Let us know if anything else comes up 🎉",
  },
];
