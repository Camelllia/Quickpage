const features = [
  {
    icon: "⚡",
    title: "10분 배포",
    description: "템플릿 선택 → 내용 입력 → URL 발급. 복잡한 설정 없이 바로 배포됩니다.",
    color: "from-rose-400 to-pink-300",
  },
  {
    icon: "🚀",
    title: "초경량 정적 페이지",
    description: "CDN에 최적화된 Static Page로 페이지 속도가 압도적입니다. SEO와 UX 모두 잡습니다.",
    color: "from-violet-400 to-purple-300",
  },
  {
    icon: "🎨",
    title: "코드 커스텀",
    description: "HTML/CSS/JS를 직접 수정할 수 있어 파워유저도 만족하는 유연성을 제공합니다.",
    color: "from-cyan-400 to-teal-300",
  },
  {
    icon: "📱",
    title: "완벽한 반응형",
    description: "모바일, 태블릿, PC 어디서든 깨지지 않는 반응형 레이아웃이 기본입니다.",
    color: "from-amber-400 to-orange-300",
  },
  {
    icon: "🔗",
    title: "커스텀 도메인",
    description: "Pro 플랜부터 자체 도메인을 연결해 브랜드 신뢰도를 높이세요.",
    color: "from-fuchsia-400 to-pink-300",
  },
  {
    icon: "📊",
    title: "분석 대시보드",
    description: "페이지 방문, CTA 클릭 등 핵심 지표를 한눈에 확인할 수 있습니다.",
    color: "from-emerald-400 to-green-300",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            이벤트 페이지에 필요한 모든 기능
          </h2>
          <p className="mt-3 text-gray-500">
            무겁고 느린 툴은 이제 그만. 퀵페이지는 빠르고 가볍습니다.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-hover rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-2xl`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
