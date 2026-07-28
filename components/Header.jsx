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
  Package,
  BarChart3,
  LogOut,
  LogIn,
  ChevronDown,
  AlertTriangle,
  LayoutDashboard,
  Menu,
  X,
  Activity,
} from "lucide-react";

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

  const isActive = (path) => pathname === path;

  const avatarLetter =
    user?.user_metadata?.full_name?.[0] ||
    user?.email?.[0] ||
    "U";

  return (
    <>
      <header className="sticky top-0 z-50 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="flex items-center justify-between rounded-2xl border border-gray-200/50 bg-white/80 px-5 py-2.5 shadow-sm backdrop-blur-xl transition-all duration-200 dark:border-gray-700/50 dark:bg-gray-900/80">
            {/* Brand */}
            <Link href="/" className="group flex shrink-0 items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-sm shadow-brand-300/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-brand-300/50">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  Trakio
                </span>
                <span className="hidden text-[10px] font-medium text-gray-400 dark:text-gray-500 sm:inline-block">
                  Smart Price Tracker
                </span>
              </div>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-1.5">
              <ThemeToggle />

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white px-2.5 py-1.5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-800 dark:hover:border-gray-600"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-muted to-brand-dark text-xs font-semibold text-white shadow-sm">
                      {avatarLetter}
                    </div>
                    <span className="hidden max-w-[100px] truncate text-sm font-medium text-gray-700 dark:text-gray-200 sm:inline-block">
                      {user?.user_metadata?.full_name || user?.email}
                    </span>
                    <ChevronDown
                      className={`hidden h-4 w-4 text-gray-400 transition-transform duration-200 sm:inline-block ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 animate-scale-in origin-top-right rounded-2xl border border-gray-200/50 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/95">
                      {/* User Info */}
                      <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-800 dark:to-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-muted to-brand-dark text-sm font-bold text-white shadow-sm">
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
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                          Tracking Active
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div className="mt-1 space-y-0.5">
                        <Link
                          href="/"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-brand-light hover:text-brand dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/products"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-brand-light hover:text-brand dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <BarChart3 className="h-4 w-4" />
                          Products
                        </Link>
                      </div>

                      <div className="my-1 border-t border-gray-100 dark:border-gray-700/50" />

                      {/* Danger Section */}
                      <Dialog>
                        <DialogTrigger
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
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
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="default"
                  className="h-9 gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-5 text-sm font-semibold text-white shadow-md shadow-brand/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30 active:scale-[0.97]"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-72 animate-slide-up flex-col bg-white shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark shadow-sm">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold text-gray-900 dark:text-white">Trakio</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {user && (
              <div className="border-b border-gray-100 p-4 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-muted to-brand-dark text-sm font-bold text-white">
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

            <div className="flex-1 space-y-1 p-3">
              {user ? (
                <>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive("/")
                        ? "bg-brand-light text-brand"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/products"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive("/products")
                        ? "bg-brand-light text-brand"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                    Products
                  </Link>
                  <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
                  <Dialog>
                    <DialogTrigger className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut className="h-5 w-5" />
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
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowAuthModal(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-4 py-3 text-sm font-semibold text-white shadow-md"
                >
                  <LogIn className="h-5 w-5" />
                  Sign In
                </button>
              )}
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
