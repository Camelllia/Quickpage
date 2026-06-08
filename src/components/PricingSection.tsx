import Link from "next/link";
import { pricingPlans } from "@/lib/data";

export default function PricingSection() {
  return (
    <section className="bg-gradient-to-b from-white to-[#fff0f3] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">합리적인 요금제</h2>
          <p className="mt-3 text-gray-500">무료로 시작하고, 필요할 때 업그레이드하세요</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`card-hover relative flex flex-col rounded-2xl border bg-white p-8 ${
                plan.highlighted
                  ? "border-[#ff4d6d] shadow-xl shadow-[#ff4d6d]/10"
                  : "border-gray-100 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#ff4d6d] px-4 py-1 text-xs font-semibold text-white">
                  인기
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.price === 0 ? "₩0" : `₩${plan.price.toLocaleString()}`}
                </span>
                <span className="text-sm text-gray-500"> / {plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d6d]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/create"
                className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-[#ff4d6d] text-white shadow-md hover:bg-[#e63956]"
                    : "border border-gray-200 text-gray-700 hover:border-[#ff4d6d] hover:text-[#ff4d6d]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
