"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import t from "@/lib/i18n";

export interface TagInputProps {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addButtonLabel?: string;
  emptyText?: string;
}

export function TagInput({
  label,
  value,
  onChange,
  placeholder,
  addButtonLabel = `+ ${t("common.addItem")}`,
  emptyText = t("common.empty"),
}: TagInputProps) {
  const normalized = useMemo(() => (Array.isArray(value) ? value : []), [value]);
  const latestValueRef = useRef(normalized);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    latestValueRef.current = normalized;
  }, [normalized]);

  useEffect(() => {
    if (focusIndex === null) return;
    inputRefs.current[focusIndex]?.focus();
  }, [focusIndex, normalized.length]);

  const updateItem = (index: number, nextValue: string) => {
    onChange(normalized.map((item, i) => (i === index ? nextValue : item)));
  };

  const cleanup = () => {
    onChange(latestValueRef.current.map((item) => item.trim()).filter(Boolean));
  };

  const addItem = () => {
    onChange([...normalized, ""]);
    setFocusIndex(normalized.length);
  };

  const removeItem = (index: number) => {
    onChange(normalized.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="space-y-2">
        {normalized.length === 0 && (
          <div className="text-xs text-[var(--color-text-muted)] py-1">{emptyText}</div>
        )}
        {normalized.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              ref={(node) => {
                inputRefs.current[index] = node;
              }}
              type="text"
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              onBlur={cleanup}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                if (item.trim()) addItem();
              }}
              className="field-input flex-1"
              placeholder={placeholder}
            />
            <button
              type="button"
              className="btn-danger shrink-0"
              onClick={() => removeItem(index)}
            >
              {t("common.delete")}
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary text-xs"
          onMouseDown={(event) => event.preventDefault()}
          onClick={addItem}
        >
          {addButtonLabel}
        </button>
      </div>
    </div>
  );
}
