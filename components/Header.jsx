"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/app/actions";
import AuthModal from "./AuthModal";
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
import { Package, BarChart3, LogOut, LogIn, ChevronDown, AlertTriangle } from "lucide-react";

export default function Header({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-200/50 transition-transform group-hover:scale-105 duration-200">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Trakio
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full ml-2">
              v1.0
            </span>
          </div>
        </Link>

        <div className="relative" ref={menuRef}>
          {user ? (
            <>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-full border border-slate-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-semibold">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0] || "U"}
                </div>
                <span className="hidden sm:inline text-sm text-gray-700 font-medium max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/products"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Products
                  </Link>

                  <Dialog>
                    <DialogTrigger
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition-colors border-t border-slate-100 pt-3 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">Sign out?</DialogTitle>
                        <DialogDescription className="text-center">
                          Are you sure you want to sign out? You'll need to sign in
                          again to view your tracked products.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose
                          render={<Button variant="outline" className="w-full sm:w-auto" />}
                        >
                          Cancel
                        </DialogClose>
                        <form action={signOut}>
                          <Button
                            type="submit"
                            variant="destructive"
                            className="w-full sm:w-auto"
                          >
                            Sign Out
                          </Button>
                        </form>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </>
          ) : (
            <Button
              onClick={() => setShowAuthModal(true)}
              variant="default"
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          )}

          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        </div>
      </div>
    </header>
  );
}
