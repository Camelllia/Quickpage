"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BannerDisplaySettings from "@/components/BannerDisplaySettings";
import BannerImageUploader from "@/components/BannerImageUploader";
import LayoutPicker from "@/components/editor/LayoutPicker";
import EditorSection from "@/components/editor/EditorSection";
import FeaturesEditor from "@/components/editor/FeaturesEditor";
import StylePanel from "@/components/editor/StylePanel";
import ToggleField from "@/components/editor/ToggleField";
import EventPageRenderer from "@/components/EventPageRenderer";
import LoginPromptModal from "@/components/LoginPromptModal";
import PageActionsMenu from "@/components/PageActionsMenu";
import { getTemplateById, getTemplatePreset } from "@/lib/data";
import { useSessionUser } from "@/hooks/useSessionUser";
import { applyLayout } from "@/lib/layouts";
import type { LayoutId, PageData } from "@/lib/types";

const EDITOR_DRAFT_KEY = "quickpage-editor-draft";

function CreateEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") || "event-classic";
  const editId = searchParams.get("edit");
  const template = getTemplateById(templateId);

  const [data, setData] = useState<PageData>(() => getTemplatePreset(templateId));
  const [previewMode, setPreviewMode] = useState<"split" | "full">("split");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [panelSide, setPanelSide] = useState<"left" | "right">("left");
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!editId);
  const [setupWarning, setSetupWarning] = useState<string | null>(null);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [loginReturnPath, setLoginReturnPath] = useState("/create");
  const { user, loading: authLoading, authRequired } = useSessionUser();

  useEffect(() => {
    const saved = localStorage.getItem("quickpage-editor-panel-side");
    if (saved === "left" || saved === "right") setPanelSide(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("quickpage-editor-panel-side", panelSide);
  }, [panelSide]);

  useEffect(() => {
    fetch("/api/setup")
      .then((res) => res.json())
      .then((json) => {
        if (json.mode === "supabase" && !json.ready) setSetupWarning(json.message);
      });
  }, []);

  useEffect(() => {
    if (editId) return;
    const draft = sessionStorage.getItem(EDITOR_DRAFT_KEY);
    if (!draft) return;
    try {
      setData(JSON.parse(draft) as PageData);
    } catch {
      // ignore invalid draft
    } finally {
      sessionStorage.removeItem(EDITOR_DRAFT_KEY);
    }
  }, [editId]);

  useEffect(() => {
    if (!editId) return;
    fetch(`/api/pages/${editId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setData(json.data);
      })
      .finally(() => setLoading(false));
  }, [editId]);

  const update = <K extends keyof PageData>(field: K, value: PageData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSection = (key: keyof PageData["sections"], value: boolean) => {
    setData((prev) => ({
      ...prev,
      sections: { ...prev.sections, [key]: value },
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const features = [...data.features];
    features[index] = value;
    update("features", features);
  };

  const removeFeature = (index: number) => {
    update("features", data.features.filter((_, i) => i !== index));
  };

  const handleDelete = async () => {
    if (!editId) return;
    await fetch(`/api/pages/${editId}`, { method: "DELETE" });
    router.push("/dashboard");
  };

  const openLoginPrompt = () => {
    const returnPath = window.location.pathname + window.location.search;
    setLoginReturnPath(returnPath);
    setLoginPromptOpen(true);
  };

  const handleLoginRedirect = () => {
    if (!editId) {
      sessionStorage.setItem(EDITOR_DRAFT_KEY, JSON.stringify(data));
    }
    setLoginPromptOpen(false);
    router.push(`/login?next=${encodeURIComponent(loginReturnPath)}`);
  };

  const handleDeploy = async () => {
    setDeployError(null);

    if (authRequired && !user) {
      openLoginPrompt();
      return;
    }

    setDeploying(true);

    try {
      const url = editId ? `/api/pages/${editId}` : "/api/pages";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.status === 401) {
        openLoginPrompt();
        return;
      }
      if (!res.ok) throw new Error(json.error || "배포에 실패했습니다.");

      const pageId = json.page?.id ?? editId;
      router.push(`/p/${pageId}`);
    } catch (err) {
      setDeployError(err instanceof Error ? err.message : "배포에 실패했습니다.");
    } finally {
      setDeploying(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-400">페이지 불러오는 중...</div>;
  }

  return (
    <>
      <Header />
      {setupWarning && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
          ⚠️ {setupWarning}
        </div>
      )}
      <div
        className={`flex min-h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4rem)] lg:overflow-hidden lg:flex-row ${
          panelSide === "right" ? "flex-col-reverse lg:flex-row-reverse" : ""
        }`}
      >
        <aside
          className={`w-full shrink-0 border-gray-100 bg-gray-50 p-4 lg:h-full lg:w-[440px] lg:overflow-y-auto lg:p-5 ${
            panelSide === "right"
              ? "border-t lg:border-t-0 lg:border-l"
              : "border-t lg:border-t-0 lg:border-r"
          }`}
        >
          <div className="mb-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href="/templates" className="text-sm text-gray-400 hover:text-[#ff4d6d]">
                  ← 템플릿 선택으로
                </Link>
                <h1 className="mt-2 text-xl font-bold text-gray-900">페이지 만들기</h1>
                {template && (
                  <span className="mt-1 inline-block rounded-full bg-[#fff0f3] px-3 py-1 text-xs font-medium text-[#ff4d6d]">
                    {template.name}
                  </span>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-[10px] font-medium text-gray-400">설정 패널</span>
                <div className="flex rounded-full bg-gray-200 p-0.5 text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setPanelSide("left")}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      panelSide === "left" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                    aria-label="설정 패널 왼쪽"
                  >
                    좌
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanelSide("right")}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      panelSide === "right" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                    aria-label="설정 패널 오른쪽"
                  >
                    우
                  </button>
                </div>
              </div>
            </div>
          </div>

          <LayoutPicker
            currentLayoutId={data.layoutId ?? "classic"}
            onSelect={(layoutId: LayoutId) => {
              setData((prev) => applyLayout(prev, layoutId));
            }}
          />

          <div className="mt-4 space-y-3">
            <EditorSection title="기본 정보" icon="📝" defaultOpen>
              <Field label="제목" value={data.title} onChange={(v) => update("title", v)} />
              <Field label="부제목" value={data.subtitle} onChange={(v) => update("subtitle", v)} />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">설명</label>
                <textarea
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
                />
              </div>
            </EditorSection>

            <EditorSection title="배너 이미지" icon="🖼️" defaultOpen>
              <BannerImageUploader
                value={data.bannerUrl}
                onChange={(url) => update("bannerUrl", url)}
                height={data.bannerHeight}
                focusY={data.bannerFocusY}
                fit={data.bannerFit}
              />
              {data.bannerUrl && (
                <BannerDisplaySettings
                  height={data.bannerHeight}
                  focusY={data.bannerFocusY}
                  fit={data.bannerFit}
                  onHeightChange={(v) => update("bannerHeight", v)}
                  onFocusYChange={(v) => update("bannerFocusY", v)}
                  onFitChange={(v) => update("bannerFit", v)}
                />
              )}
            </EditorSection>

            <EditorSection title="일정 · 장소" icon="📅">
              <ToggleField
                label="일시 표시"
                checked={data.sections.showEventDate}
                onChange={(v) => updateSection("showEventDate", v)}
              />
              {data.sections.showEventDate && (
                <Field label="일시" value={data.eventDate} onChange={(v) => update("eventDate", v)} />
              )}
              <ToggleField
                label="장소 표시"
                checked={data.sections.showEventLocation}
                onChange={(v) => updateSection("showEventLocation", v)}
              />
              {data.sections.showEventLocation && (
                <Field label="장소" value={data.eventLocation} onChange={(v) => update("eventLocation", v)} />
              )}
            </EditorSection>

            <EditorSection title="혜택 목록" icon="✨">
              <ToggleField
                label="혜택 섹션 표시"
                checked={data.sections.showFeatures}
                onChange={(v) => updateSection("showFeatures", v)}
              />
              {data.sections.showFeatures && (
                <FeaturesEditor
                  title={data.featuresTitle}
                  features={data.features}
                  onTitleChange={(v) => update("featuresTitle", v)}
                  onFeatureChange={updateFeature}
                  onAdd={() => update("features", [...data.features, ""])}
                  onRemove={removeFeature}
                />
              )}
            </EditorSection>

            <EditorSection title="신청 버튼 (CTA)" icon="👆">
              <ToggleField
                label="CTA 버튼 표시"
                checked={data.sections.showCta}
                onChange={(v) => updateSection("showCta", v)}
              />
              {data.sections.showCta && (
                <>
                  <Field label="버튼 텍스트" value={data.ctaText} onChange={(v) => update("ctaText", v)} />
                  <Field label="링크 URL" value={data.ctaUrl} onChange={(v) => update("ctaUrl", v)} />
                </>
              )}
            </EditorSection>

            <EditorSection title="디자인" icon="🎨">
              <StylePanel data={data} onChange={update} />
            </EditorSection>

            <EditorSection title="섹션 표시" icon="👁️">
              <div className="space-y-3">
                <ToggleField
                  label="설명 문단"
                  checked={data.sections.showDescription}
                  onChange={(v) => updateSection("showDescription", v)}
                />
                <ToggleField
                  label="일시"
                  checked={data.sections.showEventDate}
                  onChange={(v) => updateSection("showEventDate", v)}
                />
                <ToggleField
                  label="장소"
                  checked={data.sections.showEventLocation}
                  onChange={(v) => updateSection("showEventLocation", v)}
                />
                <ToggleField
                  label="혜택 목록"
                  checked={data.sections.showFeatures}
                  onChange={(v) => updateSection("showFeatures", v)}
                />
                <ToggleField
                  label="신청 버튼"
                  checked={data.sections.showCta}
                  onChange={(v) => updateSection("showCta", v)}
                />
              </div>
            </EditorSection>

            <EditorSection title="고급 (CSS)" icon="⚙️">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">커스텀 CSS</label>
                <textarea
                  value={data.customCss}
                  onChange={(e) => update("customCss", e.target.value)}
                  rows={5}
                  placeholder={`.quickpage-render h1 {\n  letter-spacing: -0.02em;\n}`}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-xs focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  `.quickpage-render` 안의 요소에 스타일을 적용할 수 있습니다.
                </p>
              </div>
            </EditorSection>
          </div>

          {deployError && (
            <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{deployError}</p>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setPreviewMode(previewMode === "split" ? "full" : "split")}
              className="flex-1 rounded-full border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:border-[#ff4d6d]"
            >
              {previewMode === "split" ? "전체 미리보기" : "분할 보기"}
            </button>
            <button
              type="button"
              onClick={handleDeploy}
              disabled={deploying || authLoading}
              className="flex-1 rounded-full bg-[#ff4d6d] py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e63956] disabled:opacity-50"
            >
              {deploying ? "배포 중..." : editId ? "수정 배포" : "배포하기"}
            </button>
          </div>
        </aside>

        <div
          className={`flex min-h-0 flex-1 flex-col bg-gray-200 lg:overflow-hidden ${
            previewMode === "full" ? "fixed inset-0 top-16 z-40 lg:static" : ""
          }`}
        >
          <div className="z-10 flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
            <span className="text-xs text-gray-400">실시간 미리보기</span>
            <div className="flex items-center gap-2">
              <div className="flex rounded-full bg-gray-100 p-0.5 text-[10px] font-medium">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`rounded-full px-2.5 py-1 transition-colors ${
                    previewDevice === "mobile" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  MO
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`rounded-full px-2.5 py-1 transition-colors ${
                    previewDevice === "desktop" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  PC
                </button>
              </div>
              <span className="hidden rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400 sm:inline">
                {data.textAlign} · {data.titleSize} · {data.ctaStyle}
              </span>
              <PageActionsMenu
                data={data}
                pageId={editId ?? undefined}
                onDelete={editId ? handleDelete : undefined}
                showEdit={false}
                variant="header"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div
              className={`mx-auto bg-white shadow-lg transition-all duration-300 lg:my-8 lg:rounded-2xl lg:overflow-hidden ${
                previewDevice === "mobile" ? "w-full max-w-[390px]" : "w-full max-w-5xl"
              }`}
            >
              <EventPageRenderer data={data} showWatermark={false} />
            </div>
          </div>
        </div>
      </div>

      <LoginPromptModal
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        onLogin={handleLoginRedirect}
        signupHref={`/signup?next=${encodeURIComponent(loginReturnPath)}`}
      />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
      />
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">로딩 중...</div>}>
      <CreateEditor />
    </Suspense>
  );
}
