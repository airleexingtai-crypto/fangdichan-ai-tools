import Link from "next/link";

const footerLinks = {
  About: [
    { href: "/en/about", label: "About Us" },
    { href: "/en/advertise", label: "Advertise" },
    { href: "/en/contact", label: "Contact" },
    { href: "/en/updates", label: "Changelog" },
  ],
  Resources: [
    { href: "/en/tools", label: "All Tools" },
    { href: "/en/categories", label: "Categories" },
    { href: "/en/tutorials", label: "Tutorials" },
    { href: "/en/glossary", label: "Glossary" },
  ],
  Categories: [
    { href: "/en/categories/crm", label: "AI CRM" },
    { href: "/en/categories/search", label: "AI Property Search" },
    { href: "/en/categories/analytics", label: "AI Analytics" },
    { href: "/en/categories/marketing", label: "AI Marketing" },
  ],
  Legal: [
    { href: "/en/privacy", label: "Privacy Policy" },
    { href: "/en/terms", label: "Terms of Service" },
    { href: "/en/disclosure", label: "Affiliate Disclosure" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4 text-foreground">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="no-style text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[10px]">AI</span>
            </div>
            <span className="text-sm text-muted-foreground">
              AITools.RealEstate &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md text-center sm:text-right">
            We may earn commissions from qualifying purchases made through links on this site.
            This does not affect our rankings, reviews, or recommendations.
          </p>
        </div>
      </div>
    </footer>
  );
}
