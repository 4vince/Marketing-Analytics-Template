import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // In a real app, send an email or save to DB.
    // For demo purposes, just log and acknowledge.
    console.log("Contact form submission:", { name, email, message });

    return NextResponse.json({ success: true, message: "Thank you for reaching out! We'll be in touch soon." });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
