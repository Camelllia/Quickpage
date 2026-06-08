const stats = [
  { value: "10분", label: "평균 페이지 생성 시간" },
  { value: "CDN", label: "최적화 정적 페이지" },
  { value: "6+", label: "이벤트 전용 템플릿" },
  { value: "₩9,900", label: "Pro 월 구독 시작" },
];

export default function Stats() {
  return (
    <section className="border-y border-gray-100 bg-white py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{stat.value}</div>
            <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
