"use client";
import { useEffect, useState } from "react";

interface Session {
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  };
  expires?: string;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data));
  }, []);

  return session;
} 