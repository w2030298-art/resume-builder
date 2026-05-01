"use client";

import { useResumeStore } from "@/store/useResumeStore";
import t from "@/lib/i18n";
import { TagInput } from "@/components/ui/TagInput";

export function SkillForm() {
  const { data, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {t("sections.skills")}
        </h3>
        <button onClick={() => addSkillCategory()} className="btn-primary text-xs">
          + {t("editor.addSection")}
        </button>
      </div>

      {(data.skills?.length ?? 0) === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          暂无技能分类，点击上方按钮添加
        </p>
      )}

      {data.skills.map((cat, index) => (
        <div key={cat.id} className="section-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--color-text-muted)]">#{index + 1}</span>
            <button onClick={() => removeSkillCategory(cat.id)} className="btn-danger text-xs">
              {t("editor.deleteSection")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("skills.categoryZh")}</label>
              <input
                type="text"
                value={cat.category.zh}
                onChange={(e) => updateSkillCategory(cat.id, { category: { ...cat.category, zh: e.target.value } })}
                className="field-input"
                placeholder="前端开发"
              />
            </div>
            <div>
              <label className="field-label">{t("skills.categoryEn")}</label>
              <input
                type="text"
                value={cat.category.en}
                onChange={(e) => updateSkillCategory(cat.id, { category: { ...cat.category, en: e.target.value } })}
                className="field-input"
                placeholder="Frontend Development"
              />
            </div>
          </div>

          <TagInput
            label={t("skills.items") === "skills.items" ? "技能项" : t("skills.items")}
            value={cat.items}
            onChange={(items) => updateSkillCategory(cat.id, { items })}
            placeholder="例如：TypeScript / Next.js / PostgreSQL"
            emptyText="暂无技能项，点击添加一项"
          />
        </div>
      ))}
    </div>
  );
}
