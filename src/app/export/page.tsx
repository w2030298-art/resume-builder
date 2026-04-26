"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { PreviewPanel } from "@/components/preview/PreviewPanel";

export default function ExportPage() {
  const [ready, setReady] = useState(false);
  const { loadResumeData, setTemplate, setSectionOrder, setEmphasis, setActiveLanguage } = useResumeStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    const template = params.get("template");
    const sectionOrder = params.get("sectionOrder");
    const emphasis = params.get("emphasis");
    const language = params.get("language");

    if (data) {
      try {
        loadResumeData(JSON.parse(decodeURIComponent(data)));
      } catch (e) {
        console.error("Failed to parse resume data:", e);
      }
    }
    if (template) setTemplate(template as "classic" | "modern" | "minimal" | "compact");
    if (sectionOrder) {
      try { setSectionOrder(JSON.parse(decodeURIComponent(sectionOrder))); } catch {}
    }
    if (emphasis) {
      try { setEmphasis(JSON.parse(decodeURIComponent(emphasis))); } catch {}
    }
    if (language) setActiveLanguage(language as "zh" | "en");

    requestAnimationFrame(() => {
      setReady(true);
      setTimeout(() => {
        window.dispatchEvent(new Event("resume-export-ready"));
      }, 500);
    });
  }, [loadResumeData, setTemplate, setSectionOrder, setEmphasis, setActiveLanguage]);

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