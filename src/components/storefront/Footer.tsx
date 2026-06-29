export default function Footer() {
  return (
    <footer className="w-full bg-[#141414] text-[#e0e0e0] py-6 px-4 mt-6 text-center border-t border-primary-500">
      <h2 className="text-primary-500 text-xl font-bold uppercase tracking-wide mb-3">Chickenoodle</h2>
      <p className="text-sm max-w-md mx-auto mb-1">Quality products curated for you.</p>
      <p className="text-sm max-w-md mx-auto mb-4">Have questions? Reach out to us anytime.</p>
      <div className="flex justify-center gap-6 flex-wrap mt-6">
        <a href="#" className="text-primary-500 no-underline text-sm hover:text-primary-600 transition-colors">
          <i className="fab fa-facebook-f mr-1" /> Facebook
        </a>
        <a href="#" className="text-primary-500 no-underline text-sm hover:text-primary-600 transition-colors">
          <i className="fab fa-instagram mr-1" /> Instagram
        </a>
        <a href="#" className="text-primary-500 no-underline text-sm hover:text-primary-600 transition-colors">
          <i className="fab fa-twitter mr-1" /> Twitter
        </a>
      </div>
    </footer>
  );
}
