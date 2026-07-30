import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Bandage,
  Bone,
  Brain,
  Briefcase,
  Car,
  CircleDot,
  ClipboardList,
  Clock,
  Download,
  ExternalLink,
  FileImage,
  FileText,
  GraduationCap,
  Hand,
  HeartHandshake,
  HeartPulse,
  Hospital,
  Mail,
  Network,
  PersonStanding,
  Printer,
  Scale,
  Scan,
  Send,
  ShieldCheck,
  Stethoscope,
  Wallet,
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
  graduation: GraduationCap,
  license: BadgeCheck,
  experience: Briefcase,
  affiliations: ShieldCheck,
  shield: ShieldCheck,
  hospital: Hospital,
  health: HeartPulse,
  network: Network,
  scale: Scale,
  support: HeartHandshake,
  wallet: Wallet,
  download: Download,
  external: ExternalLink,
  mail: Mail,
  fax: Send,
  printer: Printer,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = registry[name] ?? CircleDot;
  return <Component aria-hidden="true" className={cn("size-6", className)} />;
}
