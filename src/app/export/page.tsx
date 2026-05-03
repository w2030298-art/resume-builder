"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import type { ResumeData, TemplateName, SectionKey, SectionEmphasis } from "@/types";

interface PrintPayload {
  data: ResumeData;
  template: TemplateName;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
  createdAt: number;
}

function readPrintPayload(): PrintPayload | null {
  try {
    const raw = sessionStorage.getItem("resume-export-payload");
    if (!raw) return null;
    return JSON.parse(raw) as PrintPayload;
  } catch {
    return null;
  }
}

export default function ExportPage() {
  const [ready, setReady] = useState(false);
  const [noPayload, setNoPayload] = useState(false);
  const { loadResumeData, setTemplate, setSectionOrder, setEmphasis, setActiveLanguage } = useResumeStore();

  useEffect(() => {
    document.title = "Resume Print Export";

    const payload = readPrintPayload();
    if (!payload) {
      requestAnimationFrame(() => setNoPayload(true));
      return;
    }

    loadResumeData(payload.data);
    setTemplate(payload.template);
    setSectionOrder(payload.sectionOrder);
    setEmphasis(payload.emphasis);
    setActiveLanguage(payload.language);

    requestAnimationFrame(() => {
      setReady(true);
      setTimeout(() => {
        window.print();
      }, 500);
    });

    const onAfterPrint = () => {
      sessionStorage.removeItem("resume-export-payload");
    };
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, [loadResumeData, setTemplate, setSectionOrder, setEmphasis, setActiveLanguage]);

  if (noPayload) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#1f2937" }}>
        未找到导出数据，请返回主页面重新导出。
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "system-ui, sans-serif", color: "#666" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="print-container" style={{ display: "flex", justifyContent: "center", padding: "0" }}>
      <PreviewPanel />
    </div>
  );
}
