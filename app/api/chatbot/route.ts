import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "../../lib/chatbot/agent";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const reply = await runAgent(message);
  return NextResponse.json({ reply });
}
