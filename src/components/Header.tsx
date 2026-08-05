import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "#benefits", label: "Benefits" },
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
  { href: "#faq", label: "FAQ" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToExpertPanel = () => {
    setMobileMenuOpen(false);
    document.getElementById("expert-panel")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-lg shadow-australis-navy/5"
          : "bg-white/40 backdrop-blur-lg border-b border-transparent"
      }`}
    >
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <Logo className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />
          <span className="text-xl font-bold text-australis-navy tracking-tight">
            Australis
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-australis-navy/70 hover:text-australis-navy hover:bg-australis-navy/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/pricing"
            className="px-4 py-2 rounded-full text-sm font-medium text-australis-navy/70 hover:text-australis-navy hover:bg-australis-navy/5 transition-colors"
          >
            Pricing
          </Link>
          <Button
            size="sm"
            onClick={scrollToExpertPanel}
            className="ml-3 rounded-full bg-gradient-to-r from-australis-indigo to-australis-indigo/85 hover:shadow-lg hover:shadow-australis-indigo/30 transition-all duration-300"
          >
            Book a Demo
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-australis-navy/70 hover:text-australis-navy"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-xl">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-australis-navy/80 font-medium hover:bg-australis-navy/5"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-australis-navy/80 font-medium hover:bg-australis-navy/5"
            >
              Pricing
            </Link>
            <div className="pt-2 pb-1 px-4">
              <Button
                onClick={scrollToExpertPanel}
                className="w-full rounded-xl bg-gradient-to-r from-australis-indigo to-australis-indigo/85"
              >
                Book a Demo
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
