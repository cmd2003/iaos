import type { ModuleConfig } from "../registry";
import MasterDataGovernancePage from "./MasterDataGovernancePage";

const config: ModuleConfig = {
  slug: "master_data_governance",
  title: "Master Data Change Governance",
  description:
    "Cross-cutting oversight of critical master data with change control and integrity analytics.",
  icon: "🔐",
  component: MasterDataGovernancePage,
};

export default config;
