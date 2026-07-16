"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const CONSENT_KEY = "oram-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-5 right-5 z-50 mx-auto max-w-md md:left-auto md:right-6"
        >
          <div className="border border-line bg-surface-2/95 p-6 backdrop-blur-xl">
            <p className="text-sm leading-relaxed text-ink-dim">
              We use cookies to enhance your experience and analyze site
              traffic. By continuing, you agree to our{" "}
              <Link href="/privacy" className="link-line text-foreground">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="mt-5 flex items-center gap-6">
              <button type="button" onClick={accept} className="btn btn-primary">
                Accept
              </button>
              <button
                type="button"
                onClick={decline}
                className="btn-ghost link-line text-sm text-ink-dim"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
