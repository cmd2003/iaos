import type { ModuleConfig } from "../registry";
import { lazy } from "react";

// Lazily load the main page component
const QualityControlRejectionsPage = lazy(() => import("./QualityControlRejectionsPage"));

const config: ModuleConfig = {
  slug: "quality_control_rejections",
  title: "Quality Control & Rejections",
  description: "Assurance over quality processes: inward/in-process/final inspection coverage, rejection trends, CoA compliance and customer-complaint linkage.",
  icon: "truck",
  group: "Supply Chain & Operations",
  component: QualityControlRejectionsPage,
};

export default config;
