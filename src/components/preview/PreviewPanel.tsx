"use client";

import dynamic from "next/dynamic";
import { useResumeStore } from "@/store/useResumeStore";

const ClassicTemplate = dynamic(
  () => import("@/components/templates/ClassicTemplate").then((m) => ({ default: m.ClassicTemplate })),
  { ssr: false }
);
const ModernTemplate = dynamic(
  () => import("@/components/templates/ModernTemplate").then((m) => ({ default: m.ModernTemplate })),
  { ssr: false }
);
const MinimalTemplate = dynamic(
  () => import("@/components/templates/MinimalTemplate").then((m) => ({ default: m.MinimalTemplate })),
  { ssr: false }
);
const CompactTemplate = dynamic(
  () => import("@/components/templates/CompactTemplate").then((m) => ({ default: m.CompactTemplate })),
  { ssr: false }
);

export function PreviewPanel() {
  const { data, template, sectionOrder, emphasis, activeLanguage } = useResumeStore();

  const props = { data, sectionOrder, emphasis, language: activeLanguage };

  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-lg" style={{ width: "794px", minHeight: "1123px" }}>
        {template === "modern" && <ModernTemplate {...props} />}
        {template === "minimal" && <MinimalTemplate {...props} />}
        {template === "compact" && <CompactTemplate {...props} />}
        {(template === "classic" || !["modern", "minimal", "compact"].includes(template)) && <ClassicTemplate {...props} />}
      </div>
    </div>
  );
}