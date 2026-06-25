export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-primary-500 uppercase tracking-wide mb-8">Contact Us</h1>
      <form className="space-y-5">
        <div>
          <label className="block mb-1 text-[#cccccc]">Name</label>
          <input className="w-full bg-[#1e1e1e] border border-[#333] text-[#e0e0e0] rounded px-3 py-2 focus:border-primary-500 focus:outline-none" required />
        </div>
        <div>
          <label className="block mb-1 text-[#cccccc]">Email</label>
          <input type="email" className="w-full bg-[#1e1e1e] border border-[#333] text-[#e0e0e0] rounded px-3 py-2 focus:border-primary-500 focus:outline-none" required />
        </div>
        <div>
          <label className="block mb-1 text-[#cccccc]">Message</label>
          <textarea className="w-full bg-[#1e1e1e] border border-[#333] text-[#e0e0e0] rounded px-3 py-2 focus:border-primary-500 focus:outline-none" rows={5} required />
        </div>
        <button type="submit" className="bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors">Send Message</button>
      </form>
    </div>
  );
}
