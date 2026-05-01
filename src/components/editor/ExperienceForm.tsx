"use client";

import { useResumeStore } from "@/store/useResumeStore";
import t from "@/lib/i18n";
import { BilingualListInput } from "@/components/ui/BilingualListInput";

export function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {t("sections.experience")}
        </h3>
        <button onClick={() => addExperience()} className="btn-primary text-xs">
          + {t("editor.addSection")}
        </button>
      </div>

      {(data.experience?.length ?? 0) === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          暂无工作经历，点击上方按钮添加
        </p>
      )}

      {data.experience.map((exp, index) => (
        <div key={exp.id} className="section-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--color-text-muted)]">#{index + 1}</span>
            <button onClick={() => removeExperience(exp.id)} className="btn-danger text-xs">
              {t("editor.deleteSection")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("experience.companyZh")}</label>
              <input
                type="text"
                value={exp.company.zh}
                onChange={(e) => updateExperience(exp.id, { company: { ...exp.company, zh: e.target.value } })}
                className="field-input"
                placeholder="字节跳动"
              />
            </div>
            <div>
              <label className="field-label">{t("experience.companyEn")}</label>
              <input
                type="text"
                value={exp.company.en}
                onChange={(e) => updateExperience(exp.id, { company: { ...exp.company, en: e.target.value } })}
                className="field-input"
                placeholder="ByteDance"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("experience.roleZh")}</label>
              <input
                type="text"
                value={exp.role.zh}
                onChange={(e) => updateExperience(exp.id, { role: { ...exp.role, zh: e.target.value } })}
                className="field-input"
                placeholder="前端开发实习生"
              />
            </div>
            <div>
              <label className="field-label">{t("experience.roleEn")}</label>
              <input
                type="text"
                value={exp.role.en}
                onChange={(e) => updateExperience(exp.id, { role: { ...exp.role, en: e.target.value } })}
                className="field-input"
                placeholder="Frontend Intern"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="field-label">{t("experience.period")}</label>
            <input
              type="text"
              value={exp.period}
              onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
              className="field-input"
              placeholder="2023.06 - 2023.09"
            />
          </div>

          <div className="mb-3">
            <label className="field-label">{t("experience.descriptionZh")}</label>
            <textarea
              value={exp.description.zh}
              onChange={(e) => updateExperience(exp.id, { description: { ...exp.description, zh: e.target.value } })}
              className="field-input min-h-[60px] resize-y"
              rows={2}
              placeholder="工作职责概述..."
            />
          </div>

          <div className="mb-3">
            <label className="field-label">{t("experience.descriptionEn")}</label>
            <textarea
              value={exp.description.en}
              onChange={(e) => updateExperience(exp.id, { description: { ...exp.description, en: e.target.value } })}
              className="field-input min-h-[60px] resize-y"
              rows={2}
              placeholder="Job responsibilities..."
            />
          </div>

          <BilingualListInput
            label="工作亮点"
            value={exp.highlights}
            onChange={(highlights) => updateExperience(exp.id, { highlights })}
            zhPlaceholder="例如：负责核心页面开发，提升转化率 15%"
            enPlaceholder="e.g. Built core pages and improved conversion by 15%"
            addButtonLabel={`+ ${t("experience.addHighlight")}`}
          />
        </div>
      ))}
    </div>
  );
}
