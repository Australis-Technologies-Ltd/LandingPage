import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import Logo from '@/components/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Custom X (Twitter) logo SVG
  const XLogo = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  // Custom Bluesky logo SVG
  const BlueskyLogo = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.287-.04.455-.061-.525.4-1.607 1.357-2.181 2.091-1.818 2.322-.976 4.489-.976 4.489s3.036-1.204 4.695-3.368C9.702 15.62 10.656 14.299 12 10.8zm0 0c1.344 3.499 2.298 4.82 3 6.762 1.659 2.164 4.695 3.368 4.695 3.368s.842-2.167-.976-4.489c-.574-.734-1.656-1.691-2.181-2.091.168.021.319.041.455.061 2.67.296 5.568-.628 6.383-3.364.246-.829.624-5.789.624-6.479 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C17.046 4.747 14.087 8.686 13 10.8z"/>
    </svg>
  );

  const socials = [
    { href: "https://x.com/australisenergy", label: "X (formerly Twitter)", icon: <XLogo /> },
    { href: "https://www.linkedin.com/company/australis-energy/about/", label: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
    { href: "https://bsky.app/profile/australisenergy.bsky.social", label: "Bluesky", icon: <BlueskyLogo /> },
  ];

  return (
    <footer className="relative bg-australis-navy text-white overflow-hidden py-14">
      <div className="absolute inset-0 bg-grid-pattern-light pointer-events-none"></div>
      <div className="absolute -top-32 right-0 w-96 h-96 bg-australis-indigo/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo className="h-8 w-auto" color="white" />
              <h3 className="text-xl font-bold text-white">Australis</h3>
            </div>
            <p className="text-white/60 mb-6 max-w-sm leading-relaxed">
              De-Risking Your Pipeline. Accelerating Deployment.
            </p>
            <div className="flex space-x-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-australis-aqua hover:border-australis-aqua/30 hover:bg-white/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/90">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#benefits" className="text-white/55 hover:text-australis-aqua transition-colors">Benefits</a></li>
              <li><a href="#features" className="text-white/55 hover:text-australis-aqua transition-colors">Features</a></li>
              <li><a href="#demo" className="text-white/55 hover:text-australis-aqua transition-colors">Demo</a></li>
              <li><Link to="/pricing" className="text-white/55 hover:text-australis-aqua transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/90">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/privacy-policy" className="text-white/55 hover:text-australis-aqua transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-white/55 hover:text-australis-aqua transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-white/55 hover:text-australis-aqua transition-colors">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-white/40 text-sm">
          <p>&copy; {currentYear} Australis Technologies Ltd. All rights reserved.</p>
          <a href="mailto:hello@australis.energy" className="hover:text-australis-aqua transition-colors">hello@australis.energy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
