/**
 * Frontend module auto-discovery — the counterpart to the backend loader.
 *
 * Every module folder exports a default `ModuleConfig` from `module.config.tsx`.
 * Vite's `import.meta.glob` finds them all at build time, so NO shared file
 * lists modules. An intern adds a folder → their module appears. 80 branches,
 * zero merge conflicts on any registry.
 *
 * Folders whose name starts with "_" (e.g. _template) are ignored.
 */
import type { ComponentType } from "react";
import type { Role } from "../lib/types";

export interface ModuleConfig {
  /** URL-safe id; MUST match the backend module folder name. */
  slug: string;
  title: string;
  description: string;
  icon: string;
  /** Lazy-loaded page component rendered at /app/m/<slug>. */
  component: ComponentType;
  /** Optional: restrict which roles see this module. */
  roles?: Role[];
}

const modules = import.meta.glob("./*/module.config.tsx", { eager: true });

export const MODULES: ModuleConfig[] = Object.entries(modules)
  .filter(([path]) => !path.includes("/_")) // skip _template
  .map(([, mod]) => (mod as { default: ModuleConfig }).default)
  .sort((a, b) => a.title.localeCompare(b.title));

export function modulesForRole(role: Role): ModuleConfig[] {
  return MODULES.filter((m) => !m.roles || m.roles.includes(role));
}

export function findModule(slug: string): ModuleConfig | undefined {
  return MODULES.find((m) => m.slug === slug);
}
