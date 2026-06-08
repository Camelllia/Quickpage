interface FeaturesEditorProps {
  title: string;
  features: string[];
  onTitleChange: (title: string) => void;
  onFeatureChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function FeaturesEditor({
  title,
  features,
  onTitleChange,
  onFeatureChange,
  onAdd,
  onRemove,
}: FeaturesEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">섹션 제목</label>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="예: 이벤트 혜택"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
        />
      </div>
      {features.map((feature, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={feature}
            onChange={(e) => onFeatureChange(i, e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
            placeholder={`항목 ${i + 1}`}
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="shrink-0 rounded-xl border border-gray-200 px-3 text-gray-400 hover:border-red-200 hover:text-red-500"
            aria-label="항목 삭제"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="text-sm font-medium text-[#ff4d6d] hover:underline"
      >
        + 항목 추가
      </button>
    </div>
  );
}
