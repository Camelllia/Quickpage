"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const router = useRouter();
  const supabaseConfigured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabaseConfigured]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#ff4d6d]"
        >
          내 페이지
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:border-[#ff4d6d] hover:text-[#ff4d6d]"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#ff4d6d]"
    >
      로그인
    </Link>
  );
}
