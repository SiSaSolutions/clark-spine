import {
  Activity,
  AlertTriangle,
  Bandage,
  Bone,
  Brain,
  Car,
  CircleDot,
  ClipboardList,
  Clock,
  FileImage,
  FileText,
  Hand,
  HeartPulse,
  PersonStanding,
  Scan,
  Stethoscope,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Maps locale-neutral icon keys (used in the dictionaries) to Lucide icons.
 * Icons are decorative and always accompany a visible text label, so they are
 * hidden from assistive technology.
 */
const registry: Record<string, LucideIcon> = {
  spine: Bone,
  car: Car,
  diagnostic: Stethoscope,
  neck: PersonStanding,
  sciatica: Activity,
  headache: Brain,
  nerve: Zap,
  adjustment: Hand,
  shockwave: Waves,
  xray: Scan,
  exam: ClipboardList,
  mri: FileImage,
  clock: Clock,
  document: FileText,
  recovery: HeartPulse,
  whiplash: AlertTriangle,
  disc: CircleDot,
  softtissue: Bandage,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = registry[name] ?? CircleDot;
  return <Component aria-hidden="true" className={cn("size-6", className)} />;
}
