"use client";
import { useState } from "react";


export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to send message.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-primary-500 uppercase tracking-wide mb-8">Contact Us</h1>
      <p className="text-[#888] mb-10 max-w-lg">
        Have a question or feedback? We&apos;d love to hear from you. Send us a message and we&apos;ll respond promptly.
      </p>

      {status === "success" && (
        <div className="bg-green-600/20 border border-green-600 text-green-400 px-4 py-3 rounded-lg mb-6">
          Thank you for reaching out! We&apos;ll be in touch soon.
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg mb-6">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block mb-1 text-[#cccccc]">Name</label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[#1e1e1e] border border-[#333] text-[#e0e0e0] rounded px-3 py-2 focus:border-primary-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 text-[#cccccc]">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-[#1e1e1e] border border-[#333] text-[#e0e0e0] rounded px-3 py-2 focus:border-primary-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block mb-1 text-[#cccccc]">Message</label>
          <textarea
            id="message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-[#1e1e1e] border border-[#333] text-[#e0e0e0] rounded px-3 py-2 focus:border-primary-500 focus:outline-none"
            rows={5}
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
