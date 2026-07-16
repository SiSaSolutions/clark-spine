import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Emergency / safety notice — icon + text so the warning is not conveyed by
 * color alone. Shared by the contact page, the inquiry form, and the
 * thank-you page.
 */
export function EmergencyNotice({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      role="note"
      className={cn(
        "border-warning/30 bg-warning/5 flex items-start gap-3 rounded-md border p-4",
        className,
      )}
    >
      <AlertTriangle aria-hidden="true" className="text-warning mt-0.5 size-5 shrink-0" />
      <p className="text-ink text-sm">{message}</p>
    </div>
  );
}
