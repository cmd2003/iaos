import type { ModuleConfig } from "../registry";
import RptAuditPage from "./RptAuditPage";

const config: ModuleConfig = {
  slug: "rpt_audit",
  title: "RPT Audit",
  description: "Related Party Transaction Audit Module",
  icon: "clipboard",
  group: "Other",
  component: RptAuditPage,
};

export default config;