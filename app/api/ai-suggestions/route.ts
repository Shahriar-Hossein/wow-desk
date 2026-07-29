import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();
    const lastMessage = messages[messages.length - 1]?.content ?? "";
    const suggestions = generateSuggestions(lastMessage, context);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}

function generateSuggestions(
  message: string,
  context: { priority: string; type: string },
): string[] {
  const lowerMessage = message.toLowerCase();
  const suggestions: string[] = [];

  if (
    lowerMessage.includes("plugin") ||
    lowerMessage.includes("theme") ||
    lowerMessage.includes("conflict")
  ) {
    suggestions.push(
      "Could you deactivate all plugins except WooCommerce and our plugin, then reload the page?",
    );
    suggestions.push("I can see your installed plugins from telemetry — checking for known conflicts now.");
  }

  if (
    lowerMessage.includes("license") ||
    lowerMessage.includes("activat") ||
    lowerMessage.includes("domain")
  ) {
    suggestions.push(
      "I've released the activation on our side — deactivate and re-activate the license key and it will bind to the new domain.",
    );
  }

  if (
    lowerMessage.includes("charge") ||
    lowerMessage.includes("refund") ||
    lowerMessage.includes("billing") ||
    lowerMessage.includes("invoice")
  ) {
    suggestions.push("Let me pull up your order and billing history to check this.");
    suggestions.push("I can process a refund for the duplicate charge right away.");
  }

  if (
    lowerMessage.includes("bug") ||
    lowerMessage.includes("error") ||
    lowerMessage.includes("broken") ||
    lowerMessage.includes("collapse") ||
    lowerMessage.includes("not firing") ||
    lowerMessage.includes("timeout")
  ) {
    suggestions.push("Could you send a screenshot or screen recording so I can see exactly what's happening?");
    suggestions.push("I can escalate this to engineering with your site's environment details attached.");
  }

  if (lowerMessage.includes("docs") || lowerMessage.includes("documentation") || lowerMessage.includes("guide")) {
    suggestions.push("Here's a direct link to the relevant docs page — let me know if a section is missing.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Thanks for reaching out — could you share a bit more detail so I can help?");
    if (context?.priority === "High" || context?.priority === "Urgent") {
      suggestions.push("I understand this is urgent — prioritizing this now.");
    }
  }

  return suggestions.slice(0, 3);
}
