import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages?.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: `You are AtollDrift's Journey Finder — a helpful assistant for a premium authentic travel company in the southern Maldives. AtollDrift offers small-group journeys (6-10 people) to three atolls: Huvadhu (0°30'N, largest coral atoll on earth, 10-day and 7-day options from $1,490), Fuvahmulah (0°17'S, geological anomaly with tiger sharks and freshwater lakes, 8-day from $1,980), and Addu (0°41'S, southernmost Maldives with history and world-class diving, 9-day and 6-day dive options from $1,380). Keep responses concise, warm, and specific. Match people to real journeys based on interests. Speak with the AtollDrift voice: understated, knowledgeable, premium but never boastful.`,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("[AtollDrift] Anthropic error:", err);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[AtollDrift] Journey finder error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
