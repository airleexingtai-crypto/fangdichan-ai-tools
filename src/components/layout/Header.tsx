"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/stats", label: "Statistics" },
  { href: "/blog", label: "Blog" },
  { href: "/glossary", label: "Glossary" },
];

export function Header() {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const locale = useLocale();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Language switcher
  const switchTo = locale === "en" ? "zh" : "en";
  const cleanPath = locale === "en" ? pathname : (pathname.replace(/^\/zh/, "") || "/");
  const targetHref = switchTo === "en" ? cleanPath : `/${switchTo}${cleanPath}`;

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 no-style shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block text-foreground">
              AITools<span className="text-primary">.</span>RealEstate
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={cn(
                  "no-style px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith(`/${locale}${link.href}`)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle - Desktop */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-1">
                <Input
                  type="search"
                  placeholder="Search AI tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64 h-8 text-sm"
                  autoFocus
                />
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9" onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4" />
              </Button>
            )}

            {/* Language Toggle */}
            <Link href={targetHref} className="no-style">
              <Button variant="ghost" size="sm" className="h-9 text-xs font-medium">
                {switchTo === "zh" ? "中文" : "EN"}
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                <Menu className="h-4 w-4" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-12">
                <div className="flex flex-col gap-1">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-4">
                    <Input
                      type="search"
                      placeholder="Search AI tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </form>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={`/${locale}${link.href}`}
                      className={cn(
                        "no-style px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname.startsWith(`/${locale}${link.href}`)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link href={targetHref} className="no-style">
                      <Button variant="outline" size="sm" className="w-full text-sm">
                        {switchTo === "zh" ? "切换到中文" : "Switch to English"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
