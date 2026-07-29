"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions";
import AuthModal from "./AuthModal";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  BarChart3,
  LogOut,
  LogIn,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: BarChart3 },
];

export default function Header({ user }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (path) => pathname === path;
  const avatarLetter = user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Trakio
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(href)
                      ? "bg-brand/10 text-brand"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="md:hidden p-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>

            {user ? (
              <div className="relative hidden md:block" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
                    {avatarLetter}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-foreground leading-none">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover py-2 shadow-lg">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">
                        {user?.user_metadata?.full_name || user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            isActive(href)
                              ? "bg-brand/10 text-brand"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-border" />

                    <Dialog>
                      <DialogTrigger className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <LogOut className="h-6 w-6 text-destructive" />
                          </div>
                          <DialogTitle className="text-center text-lg">
                            Sign out?
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            You'll need to sign in again to access your products.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                          <DialogClose asChild>
                            <Button variant="outline" className="flex-1">
                              Cancel
                            </Button>
                          </DialogClose>
                          <form action={signOut} className="flex-1">
                            <Button type="submit" variant="destructive" className="w-full">
                              Sign Out
                            </Button>
                          </form>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className="hidden md:flex bg-brand hover:bg-brand-dark text-brand-foreground px-6 shadow-sm hover:shadow transition-shadow"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-72 bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Trakio
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {user ? (
              <>
                <div className="mb-6 p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
                      {avatarLetter}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground truncate">
                        {user?.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1">
                  {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                        isActive(href)
                          ? "bg-brand/10 text-brand"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-border">
                  <Dialog>
                    <DialogTrigger className="flex w-full items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                          <LogOut className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center text-lg">
                          Sign out?
                        </DialogTitle>
                        <DialogDescription className="text-center">
                          You'll need to sign in again to access your products.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2">
                        <DialogClose asChild>
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </DialogClose>
                        <form action={signOut} className="flex-1">
                          <Button type="submit" variant="destructive" className="w-full">
                            Sign Out
                          </Button>
                        </form>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60%] space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Track prices smarter
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sign in to start tracking your products
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full bg-brand hover:bg-brand-dark text-brand-foreground h-12 shadow-sm hover:shadow transition-shadow"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}