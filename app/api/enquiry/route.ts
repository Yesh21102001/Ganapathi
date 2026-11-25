import { NextResponse } from "next/server";

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const enquiry = {
    name: clean(body.name, 100),
    phone: clean(body.phone, 20),
    email: clean(body.email, 150),
    message: clean(body.message, 1500),
    product: clean(body.product, 200),
    productHandle: clean(body.productHandle, 200),
    receivedAt: new Date().toISOString(),
  };

  if (!enquiry.name || !enquiry.phone || !enquiry.message) {
    return NextResponse.json(
      { error: "Please fill in your name, phone and message." },
      { status: 400 },
    );
  }
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  // Enquiries are forwarded to a webhook (Formspree, Zapier, Slack, Make, ...).
  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) {
    console.error("ENQUIRY_WEBHOOK_URL is not set; enquiry was NOT delivered:", enquiry);
    return NextResponse.json(
      { error: "Enquiries are temporarily unavailable. Please call us instead." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(enquiry),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("Enquiry delivery failed:", err);
    return NextResponse.json(
      { error: "Could not send your enquiry. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
