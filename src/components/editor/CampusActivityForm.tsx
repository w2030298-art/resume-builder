"use client";

import { useResumeStore } from "@/store/useResumeStore";
import t from "@/lib/i18n";

export function CampusActivityForm() {
  const { data, addCampusActivity, updateCampusActivity, removeCampusActivity } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {t("sections.campusActivities")}
        </h3>
        <button onClick={() => addCampusActivity()} className="btn-primary text-xs">
          + {t("editor.addSection")}
        </button>
      </div>

      {(data.campusActivities?.length ?? 0) === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          暂无校园经历，点击上方按钮添加
        </p>
      )}

      {data.campusActivities.map((act, index) => (
        <div key={act.id} className="section-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--color-text-muted)]">#{index + 1}</span>
            <button onClick={() => removeCampusActivity(act.id)} className="btn-danger text-xs">
              {t("editor.deleteSection")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("campusActivities.organizationZh")}</label>
              <input
                type="text"
                value={act.organization.zh}
                onChange={(e) => updateCampusActivity(act.id, { organization: { ...act.organization, zh: e.target.value } })}
                className="field-input"
                placeholder="学生会"
              />
            </div>
            <div>
              <label className="field-label">{t("campusActivities.organizationEn")}</label>
              <input
                type="text"
                value={act.organization.en}
                onChange={(e) => updateCampusActivity(act.id, { organization: { ...act.organization, en: e.target.value } })}
                className="field-input"
                placeholder="Student Union"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("campusActivities.roleZh")}</label>
              <input
                type="text"
                value={act.role.zh}
                onChange={(e) => updateCampusActivity(act.id, { role: { ...act.role, zh: e.target.value } })}
                className="field-input"
                placeholder="副主席"
              />
            </div>
            <div>
              <label className="field-label">{t("campusActivities.roleEn")}</label>
              <input
                type="text"
                value={act.role.en}
                onChange={(e) => updateCampusActivity(act.id, { role: { ...act.role, en: e.target.value } })}
                className="field-input"
                placeholder="Vice President"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="field-label">{t("campusActivities.period")}</label>
            <input
              type="text"
              value={act.period}
              onChange={(e) => updateCampusActivity(act.id, { period: e.target.value })}
              className="field-input"
              placeholder="2022.09 - 2023.06"
            />
          </div>

          <div className="mb-3">
            <label className="field-label">{t("campusActivities.descriptionZh")}</label>
            <textarea
              value={act.description.zh}
              onChange={(e) => updateCampusActivity(act.id, { description: { ...act.description, zh: e.target.value } })}
              className="field-input min-h-[60px] resize-y"
              rows={2}
            />
          </div>

          <div className="mb-3">
            <label className="field-label">{t("campusActivities.descriptionEn")}</label>
            <textarea
              value={act.description.en}
              onChange={(e) => updateCampusActivity(act.id, { description: { ...act.description, en: e.target.value } })}
              className="field-input min-h-[60px] resize-y"
              rows={2}
            />
          </div>

          <div>
            <label className="field-label">{t("campusActivities.highlights")}</label>
            {act.highlights.map((h, hi) => (
              <div key={hi} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={h.zh}
                  onChange={(e) => {
                    const newHighlights = [...act.highlights];
                    newHighlights[hi] = { ...newHighlights[hi], zh: e.target.value };
                    updateCampusActivity(act.id, { highlights: newHighlights });
                  }}
                  className="field-input flex-1"
                  placeholder="成果（中文）"
                />
                <input
                  type="text"
                  value={h.en}
                  onChange={(e) => {
                    const newHighlights = [...act.highlights];
                    newHighlights[hi] = { ...newHighlights[hi], en: e.target.value };
                    updateCampusActivity(act.id, { highlights: newHighlights });
                  }}
                  className="field-input flex-1"
                  placeholder="Achievement (English)"
                />
                <button
                  onClick={() => {
                    const newHighlights = act.highlights.filter((_, i) => i !== hi);
                    updateCampusActivity(act.id, { highlights: newHighlights });
                  }}
                  className="btn-danger text-xs px-2 shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newHighlights = [...act.highlights, { zh: "", en: "" }];
                updateCampusActivity(act.id, { highlights: newHighlights });
              }}
              className="btn-secondary text-xs"
            >
              + {t("campusActivities.addHighlight")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}