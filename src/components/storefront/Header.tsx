import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full flex justify-between items-center px-8 py-1 bg-[#141414] transition-all duration-500">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          S
        </div>
        <span className="text-primary-500 text-xl font-bold uppercase tracking-wide">Store</span>
      </div>
      <nav className="flex gap-8 mr-12">
        {["Products", "About", "Contact", "Cart"].map((label) => (
          <Link
            key={label}
            href={`/${label.toLowerCase() === "home" ? "" : label.toLowerCase()}`}
            className="relative text-primary-500 text-base font-medium no-underline transition-all duration-300 hover:before:w-full before:content-[''] before:absolute before:bg-primary-500 before:w-0 before:h-[3px] before:bottom-0 before:left-0 before:transition-all before:duration-300"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
