import { NextResponse } from "next/server";

const AI_SERVICE = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function POST(req: Request) {
  const body = await req.json();
  const aiRes = await fetch(`${AI_SERVICE}/chat/${body.conversationId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: body.message, catalog: body.catalog }),
  });
  const data = await aiRes.json();
  return NextResponse.json(data);
}
