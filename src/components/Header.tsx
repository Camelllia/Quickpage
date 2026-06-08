"use client";

import Link from "next/link";
import { useState } from "react";
import AuthButton from "@/components/AuthButton";

const navItems = [
  { label: "템플릿", href: "/templates" },
  { label: "요금제", href: "/pricing" },
  { label: "기능", href: "/#features" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff4d6d] to-[#7c3aed] text-sm font-bold text-white">
            Q
          </span>
          <span className="text-lg font-bold text-gray-900">
            퀵<span className="text-[#ff4d6d]">페이지</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-[#ff4d6d]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <AuthButton />
          <Link
            href="/create"
            className="rounded-full bg-[#ff4d6d] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-[#ff4d6d]/25 transition-all hover:bg-[#e63956] hover:shadow-lg"
          >
            무료로 시작하기
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm font-medium text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/login" className="rounded-full border border-gray-200 py-2 text-center text-sm font-medium">
              로그인
            </Link>
            <Link href="/dashboard" className="rounded-full border border-gray-200 py-2 text-center text-sm font-medium">
              내 페이지
            </Link>
            <Link
              href="/create"
              className="rounded-full bg-[#ff4d6d] py-2 text-center text-sm font-semibold text-white"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
