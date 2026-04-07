"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "arielle_authed";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
    } else {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    if (authed === false) {
      inputRef.current?.focus();
    }
  }, [authed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.ok) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setAuthed(true);
      } else {
        setError(true);
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (authed === null) return null;

  if (authed) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background [&_*]:!cursor-auto" style={{ cursor: "auto" }}>
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm tracking-[0.3em] uppercase text-muted">
          Enter password
        </p>

        <div className="relative">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="w-56 border-b border-border bg-transparent px-2 py-2 text-center text-lg tracking-widest text-foreground outline-none transition-colors focus:border-foreground/40"
            autoComplete="off"
            disabled={loading}
          />
          <AnimatePresence>
            {error && (
              <motion.p
                className="absolute -bottom-6 left-0 w-full text-center text-xs text-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Try again
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !password}
          className="text-xs tracking-[0.2em] uppercase text-muted transition-colors hover:text-foreground disabled:opacity-30"
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "..." : "Enter"}
        </motion.button>
      </motion.form>
    </div>
  );
}
