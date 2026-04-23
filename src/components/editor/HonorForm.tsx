"use client";

import { useResumeStore } from "@/store/useResumeStore";
import t from "@/lib/i18n";

export function HonorForm() {
  const { data, addHonor, updateHonor, removeHonor } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {t("sections.honors")}
        </h3>
        <button onClick={() => addHonor()} className="btn-primary text-xs">
          + {t("editor.addSection")}
        </button>
      </div>

      {(data.honors?.length ?? 0) === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          暂无荣誉奖项，点击上方按钮添加
        </p>
      )}

      {data.honors.map((honor, index) => (
        <div key={honor.id} className="section-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--color-text-muted)]">#{index + 1}</span>
            <button onClick={() => removeHonor(honor.id)} className="btn-danger text-xs">
              {t("editor.deleteSection")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("honors.titleZh")}</label>
              <input
                type="text"
                value={honor.title.zh}
                onChange={(e) => updateHonor(honor.id, { title: { ...honor.title, zh: e.target.value } })}
                className="field-input"
                placeholder="国家奖学金"
              />
            </div>
            <div>
              <label className="field-label">{t("honors.titleEn")}</label>
              <input
                type="text"
                value={honor.title.en}
                onChange={(e) => updateHonor(honor.id, { title: { ...honor.title, en: e.target.value } })}
                className="field-input"
                placeholder="National Scholarship"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("honors.level")}</label>
              <input
                type="text"
                value={honor.level}
                onChange={(e) => updateHonor(honor.id, { level: e.target.value })}
                className="field-input"
                placeholder={t("honors.levelPlaceholder")}
              />
            </div>
            <div>
              <label className="field-label">{t("honors.period")}</label>
              <input
                type="text"
                value={honor.period}
                onChange={(e) => updateHonor(honor.id, { period: e.target.value })}
                className="field-input"
                placeholder="2024.10"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="field-label">{t("honors.descriptionZh")}</label>
            <textarea
              value={honor.description.zh}
              onChange={(e) => updateHonor(honor.id, { description: { ...honor.description, zh: e.target.value } })}
              className="field-input min-h-[60px] resize-y"
              rows={2}
              placeholder="获奖原因或简要说明..."
            />
          </div>

          <div>
            <label className="field-label">{t("honors.descriptionEn")}</label>
            <textarea
              value={honor.description.en}
              onChange={(e) => updateHonor(honor.id, { description: { ...honor.description, en: e.target.value } })}
              className="field-input min-h-[60px] resize-y"
              rows={2}
              placeholder="Brief description..."
            />
          </div>
        </div>
      ))}
    </div>
  );
}