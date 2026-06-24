export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1">Message</label>
          <textarea className="w-full border rounded px-3 py-2" rows={5} required />
        </div>
        <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded">Send</button>
      </form>
    </div>
  );
}
