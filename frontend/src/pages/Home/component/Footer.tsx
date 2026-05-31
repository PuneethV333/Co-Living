// import { Twitter, Linkedin, Instagram, CircleFadingPlus } from "lucide-react";
import { CircleFadingPlus } from "lucide-react";
import { Link } from "react-router-dom";

const PLATFORM_LINKS = [
  { label: "Browse Rooms", to: "/home/browse" },
  { label: "Properties", to: "/home/properties" },
  { label: "Roommate Match", to: "/home/roommates" },
  { label: "List Property", to: "/list" },
];
<CircleFadingPlus />;

const COMPANY_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Careers", to: "/careers" },
  { label: "Press", to: "/press" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", to: "/help" },
  { label: "Safety", to: "/safety" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Use", to: "/terms" },
];

const FooterColumn = ({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; to: string }[];
}) => (
  <div className="flex flex-col gap-3">
    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
      {heading}
    </p>
    {links.map(({ label, to }) => (
      <Link
        key={label}
        to={to}
        className="text-[13px] text-zinc-500 hover:text-white transition"
      >
        {label}
      </Link>
    ))}
  </div>
);

const Footer = () => (
  <footer className="bg-[#0A0F1C] border-t border-white/5 mt-auto">
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <span className="text-[15px] font-semibold text-white tracking-tight">
              Co-Living
            </span>
          </div>
          <p className="text-[13px] text-zinc-500 leading-relaxed max-w-50">
            Connecting people to their perfect shared spaces across India.
            Verified, safe, and hassle-free.
          </p>
        </div>

        <FooterColumn heading="Platform" links={PLATFORM_LINKS} />
        <FooterColumn heading="Company" links={COMPANY_LINKS} />
        <FooterColumn heading="Support" links={SUPPORT_LINKS} />
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[12px] text-zinc-600">
          © 2025 Co-Living. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          {[
            { Icon: CircleFadingPlus, href: "https://twitter.com" },
            { Icon: CircleFadingPlus, href: "https://linkedin.com" },
            { Icon: CircleFadingPlus, href: "https://instagram.com" },
            //   {[
            //     { Icon: Twitter, href: "https://twitter.com" },
            //     { Icon: Linkedin, href: "https://linkedin.com" },
            //     { Icon: Instagram, href: "https://instagram.com" },
          ].map(({ Icon, href }) => (
            <a
              title={href}
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
