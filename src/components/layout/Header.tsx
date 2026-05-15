"use client";

import { useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname as useIntlPathname } from "@/navigation";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_KEYS = ["tools", "categories", "compare", "tutorials", "stats", "blog", "glossary"] as const;

export function Header() {
  const { theme, toggle } = useTheme();
  const rawPathname = usePathname(); // next/navigation — always the real URL path
  const intlPathname = useIntlPathname(); // @/navigation — path without locale prefix
  const locale = useLocale();
  const t = useTranslations("nav");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = locale === "en"
        ? `/search?q=${encodeURIComponent(searchQuery.trim())}`
        : `/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const allLocales = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "ko", label: "한국어" },
    { code: "ja", label: "日本語" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" },
    { code: "fr", label: "Français" },
  ];

  // Derive current locale from URL prefix
  const urlLocale = allLocales.find((l) => rawPathname === `/${l.code}` || rawPathname.startsWith(`/${l.code}/`))?.code || "en";

  // Strip locale prefix from URL to get the base path
  const basePath = urlLocale === "en"
    ? rawPathname
    : (rawPathname.replace(new RegExp(`^/${urlLocale}`), "") || "/");

  const switchLocale = (newLocale: string) => {
    const target = newLocale === "en" ? basePath : `/${newLocale}${basePath === "/" ? "" : basePath}`;
    window.location.href = target;
  };

  const [langOpen, setLangOpen] = useState(false);
  const currentLabel = allLocales.find((l) => l.code === urlLocale)?.label || "EN";

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-style shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block text-foreground">
              AITools<span className="text-primary">.</span>RealEstate
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_KEYS.map((key) => {
              const href = `/${key}`;
              return (
                <Link
                  key={key}
                  href={href}
                  className={cn(
                    "no-style px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    (intlPathname === href || intlPathname.startsWith(href + "/"))
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5",
                  )}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-1">
                <Input
                  type="search"
                  placeholder={t("search")}
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

            {/* Language Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs font-medium gap-1"
                onClick={() => setLangOpen(!langOpen)}
                onBlur={() => setTimeout(() => setLangOpen(false), 150)}
              >
                {currentLabel}
                <svg className="h-3 w-3 ml-0.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 8 5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l3 3 3-3"/></svg>
              </Button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg py-1 z-50 min-w-[110px]">
                  {allLocales.map((l) => (
                    <button
                      key={l.code}
                      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent/10 transition-colors ${l.code === urlLocale ? "text-primary font-medium" : "text-muted-foreground"}`}
                      onMouseDown={() => switchLocale(l.code)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                  <form onSubmit={handleSearch} className="mb-4">
                    <Input
                      type="search"
                      placeholder={t("search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </form>
                  {NAV_KEYS.map((key) => {
                    const href = `/${key}`;
                    return (
                      <Link
                        key={key}
                        href={href}
                        className={cn(
                          "no-style px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          (intlPathname === href || intlPathname.startsWith(href + "/"))
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {t(key)}
                      </Link>
                    );
                  })}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2 px-3">Language / 语言</p>
                    <div className="grid grid-cols-2 gap-1">
                      {allLocales.map((l) => (
                        <button
                          key={l.code}
                          className={`text-left px-3 py-1.5 rounded text-sm transition-colors ${l.code === urlLocale ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                          onClick={() => switchLocale(l.code)}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
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
