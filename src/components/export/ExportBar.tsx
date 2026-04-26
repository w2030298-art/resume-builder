"use client";

import { useState, useRef } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { downloadJSON, importFromJSON } from "@/lib/export/json";
import { downloadSVG } from "@/lib/export/svg";
import { pdf } from "@react-pdf/renderer";
import { createResumePDF } from "@/lib/export/pdf";
import t from "@/lib/i18n";

export function ExportBar() {
  const store = useResumeStore();
  const [exporting, setExporting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      const doc = createResumePDF({
        data: store.data,
        sectionOrder: store.sectionOrder,
        emphasis: store.emphasis,
        language: store.activeLanguage,
        template: store.template,
      });
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
      showFeedback("PDF 导出失败");
    } finally {
      setExporting(null);
    }
  };

  const handleExportSVG = () => {
    try {
      downloadSVG({
        data: store.data,
        sectionOrder: store.sectionOrder,
        emphasis: store.emphasis,
        language: store.activeLanguage,
        template: store.template,
      });
    } catch (err) {
      console.error("SVG export failed:", err);
      showFeedback("SVG 导出失败");
    }
  };

  const handleBrowserPrint = () => {
    const printUrl = `/export?data=${encodeURIComponent(JSON.stringify(store.data))}&template=${store.template}&sectionOrder=${encodeURIComponent(JSON.stringify(store.sectionOrder))}&emphasis=${encodeURIComponent(JSON.stringify(store.emphasis))}&language=${store.activeLanguage}`;
    const printWindow = window.open(printUrl, "_blank");
    if (!printWindow) {
      showFeedback("请允许弹出窗口以打印简历");
    }
  };

  const handleExportJSON = () => {
    try {
      downloadJSON(store.data);
    } catch (err) {
      console.error("JSON export failed:", err);
    }
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importFromJSON(content);
      if (imported) {
        store.loadResumeData(imported);
        showFeedback("导入成功");
      } else {
        showFeedback("无法解析该 JSON 文件");
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="no-print flex items-center gap-2 px-5 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleExportPDF}
          disabled={exporting === "pdf"}
          className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting === "pdf" ? "生成中..." : "PDF"}
        </button>
        <button onClick={handleBrowserPrint} className="btn-secondary text-xs px-3 py-1.5" title="通过浏览器打印生成 PDF（所见即所得）">
          打印PDF
        </button>
        <button onClick={handleExportSVG} className="btn-secondary text-xs px-3 py-1.5">
          SVG
        </button>
        <button onClick={handleExportJSON} className="btn-secondary text-xs px-3 py-1.5">
          JSON
        </button>
        <button onClick={handleImportJSON} className="btn-secondary text-xs px-3 py-1.5">
          {t("export.importJson")}
        </button>
      </div>

      {feedback && (
        <span className="text-xs text-[var(--color-primary)] font-medium ml-1">{feedback}</span>
      )}

      <div className="flex-1" />

      <button
        onClick={() => store.loadDemoData()}
        className="btn-secondary text-xs px-3 py-1.5 text-[var(--color-primary)] border-[var(--color-primary-light)] hover:bg-blue-50"
      >
        示例数据
      </button>
      <button
        onClick={() => {
          if (confirm("确定要清空所有内容吗？")) {
            store.resetResumeData();
          }
        }}
        className="btn-danger text-xs px-3 py-1.5"
      >
        {t("editor.reset")}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}