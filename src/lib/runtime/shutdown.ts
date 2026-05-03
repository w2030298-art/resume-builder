export async function requestRuntimeShutdown(): Promise<{ ok: boolean; reason?: string }> {
  const response = await fetch("/api/runtime/shutdown", {
    method: "POST",
    headers: { "x-resume-builder-runtime-action": "shutdown" },
  });
  return response.json();
}
