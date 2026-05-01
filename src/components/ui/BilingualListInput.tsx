"use client";

import type { BilingualText } from "@/types";
import t from "@/lib/i18n";

export interface BilingualListInputProps {
  label: string;
  value: BilingualText[];
  onChange: (next: BilingualText[]) => void;
  zhPlaceholder?: string;
  enPlaceholder?: string;
  addButtonLabel?: string;
  emptyText?: string;
}

export function BilingualListInput({
  label,
  value,
  onChange,
  zhPlaceholder,
  enPlaceholder,
  addButtonLabel = `+ ${t("common.addItem")}`,
  emptyText = t("common.empty"),
}: BilingualListInputProps) {
  const normalized = Array.isArray(value) ? value : [];

  const updateItem = (index: number, nextValue: Partial<BilingualText>) => {
    onChange(normalized.map((item, i) => (i === index ? { ...item, ...nextValue } : item)));
  };

  const cleanup = () => {
    onChange(
      normalized
        .map((item) => ({ zh: item.zh.trim(), en: item.en.trim() }))
        .filter((item) => item.zh || item.en),
    );
  };

  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="space-y-2">
        {normalized.length === 0 && (
          <div className="text-xs text-[var(--color-text-muted)] py-1">{emptyText}</div>
        )}
        {normalized.map((item, index) => (
          <div key={index} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3">
            <div className="mb-2">
              <textarea
                value={item.zh}
                onChange={(event) => updateItem(index, { zh: event.target.value })}
                onBlur={cleanup}
                className="field-input min-h-[58px] resize-y"
                rows={2}
                placeholder={zhPlaceholder}
              />
            </div>
            <div className="mb-2">
              <textarea
                value={item.en}
                onChange={(event) => updateItem(index, { en: event.target.value })}
                onBlur={cleanup}
                className="field-input min-h-[58px] resize-y"
                rows={2}
                placeholder={enPlaceholder}
              />
            </div>
            <button
              type="button"
              className="btn-danger text-xs"
              onClick={() => onChange(normalized.filter((_, i) => i !== index))}
            >
              {t("common.delete")}
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary text-xs"
          onClick={() => onChange([...normalized, { zh: "", en: "" }])}
        >
          {addButtonLabel}
        </button>
      </div>
    </div>
  );
}
