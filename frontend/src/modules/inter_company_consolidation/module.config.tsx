import type { ModuleConfig } from "../registry";
import InterCompanyConsolidationPage from "./InterCompanyConsolidationPage";

const config: ModuleConfig = {
  slug: "inter_company_consolidation",
  title: "Module 29 – Inter-Company & Consolidation",
  description: "Automated assurance and risk tracking for group consolidation, FX translation, transfer pricing, and inter-company eliminations.",
  icon: "wallet",
  group: "Finance & Close",
  component: InterCompanyConsolidationPage,
};

export default config;
