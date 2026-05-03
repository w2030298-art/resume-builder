"use client";

import { useState } from "react";
import t from "@/lib/i18n";
import { requestRuntimeShutdown } from "@/lib/runtime/shutdown";

export function ShutdownButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleClick = async () => {
    if (!confirm(t("runtime.shutdownConfirm"))) return;
    setStatus("loading");
    try {
      const result = await requestRuntimeShutdown();
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <span className="text-xs text-[var(--color-primary)]">{t("runtime.shutdownStarting")}</span>;
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="btn-danger text-xs px-3 py-1.5"
    >
      {status === "loading" ? t("runtime.shutdownTitle") : t("runtime.shutdown")}
    </button>
  );
}
