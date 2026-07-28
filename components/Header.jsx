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
  AlertTriangle,
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

  const avatarLetter =
    user?.user_metadata?.full_name?.[0] ||
    user?.email?.[0] ||
    "U";

  return (
    <>
      <header className="sticky top-3 z-50 px-3 sm:px-6">
        <nav className="mx-auto max-w-7xl flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 shadow-sm ring-1 ring-gray-200/50 backdrop-blur-xl transition-all duration-300 hover:shadow-md sm:px-5 dark:bg-gray-950/80 dark:ring-gray-800/50">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:shadow-brand-300/40 group-hover:scale-105">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white">
              Trakio
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1 mx-4">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(href)
                      ? "text-brand"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {isActive(href) && (
                    <span className="absolute inset-x-2 -bottom-0 h-0.5 rounded-full bg-gradient-to-r from-brand to-brand-dark" />
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />

            {user ? (
              <>
                <button
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation menu"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 md:hidden dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <Menu className="h-4 w-4" />
                </button>

                <div className="relative hidden md:block" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-lg border border-gray-200/60 bg-white/50 px-2.5 py-1.5 text-sm text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:shadow md:px-3 dark:border-gray-700/50 dark:bg-gray-900/50 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-muted to-brand-dark text-[10px] font-semibold text-white">
                      {avatarLetter}
                    </div>
                    <span className="hidden max-w-[100px] truncate sm:inline">
                      {user?.user_metadata?.full_name || user?.email}
                    </span>
                    <ChevronDown
                      className={`hidden h-3.5 w-3.5 text-gray-400 transition-transform duration-200 sm:inline-block ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 origin-top-right animate-scale-in rounded-xl border border-gray-200/50 bg-white/95 p-1.5 shadow-lg backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/95">
                      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-muted to-brand-dark text-xs font-bold text-white">
                            {avatarLetter}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {user?.user_metadata?.full_name || "User"}
                            </p>
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-1 space-y-0.5">
                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                              isActive(href)
                                ? "bg-brand-light text-brand"
                                : "text-gray-600 hover:bg-brand-light hover:text-brand dark:text-gray-300 dark:hover:bg-gray-800"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </Link>
                        ))}
                      </div>

                      <div className="my-1 border-t border-gray-100 dark:border-gray-700/50" />

                      <Dialog>
                        <DialogTrigger className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                          <DialogHeader>
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100 dark:bg-red-900/30 dark:ring-red-800/50">
                              <AlertTriangle className="h-7 w-7 text-red-500" />
                            </div>
                            <DialogTitle className="text-center text-lg">
                              Sign out?
                            </DialogTitle>
                            <DialogDescription className="text-center leading-relaxed">
                              Are you sure you want to sign out? You&apos;ll need
                              to sign in again to view your tracked products.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="mt-2 gap-2">
                            <DialogClose
                              render={
                                <Button
                                  variant="outline"
                                  className="flex-1 rounded-xl"
                                />
                              }
                            >
                              Cancel
                            </DialogClose>
                            <form action={signOut} className="flex-1">
                              <Button
                                type="submit"
                                variant="destructive"
                                className="w-full rounded-xl"
                              >
                                Sign Out
                              </Button>
                            </form>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="default"
                className="hidden md:inline-flex h-8 gap-1.5 rounded-lg bg-brand px-3.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-brand-dark active:scale-[0.97]"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl animate-slide-up dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark shadow-sm">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold text-gray-900 dark:text-white">Trakio</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {user && (
              <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-muted to-brand-dark text-sm font-bold text-white">
                    {avatarLetter}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 space-y-0.5 px-3 py-4">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Navigation
              </p>
              {user ? (
                <>
                  {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive(href)
                          ? "bg-brand-light text-brand shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive(href) ? "text-brand" : ""}`} />
                      {label}
                    </Link>
                  ))}
                  <div className="my-3 border-t border-gray-100 dark:border-gray-800" />
                  <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Account
                  </p>
                  <Dialog>
                    <DialogTrigger className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100 dark:bg-red-900/30 dark:ring-red-800/50">
                          <AlertTriangle className="h-7 w-7 text-red-500" />
                        </div>
                        <DialogTitle className="text-center text-lg">
                          Sign out?
                        </DialogTitle>
                        <DialogDescription className="text-center leading-relaxed">
                          Are you sure you want to sign out? You&apos;ll need to
                          sign in again to view your tracked products.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-2 gap-2">
                        <DialogClose
                          render={
                            <Button
                              variant="outline"
                              className="flex-1 rounded-xl"
                            />
                          }
                        >
                          Cancel
                        </DialogClose>
                        <form action={signOut} className="flex-1">
                          <Button
                            type="submit"
                            variant="destructive"
                            className="w-full rounded-xl"
                          >
                            Sign Out
                          </Button>
                        </form>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-3 py-3 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-all hover:shadow-xl hover:shadow-brand/30 active:scale-[0.98]"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In to Track Prices
                  </button>
                  <p className="px-1 text-center text-xs text-gray-400 dark:text-gray-500">
                    Track prices and get alerts on drops
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500">Theme</span>
                <ThemeToggle />
              </div>
            </div>
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
