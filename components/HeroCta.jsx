"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function HeroCta() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowAuthModal(true)}
        size="lg"
        className="h-14 px-10 text-base bg-brand hover:bg-brand-dark text-brand-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-[1.02]"
      >
        <TrendingUp className="mr-2 h-5 w-5" />
        Start tracking now
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
