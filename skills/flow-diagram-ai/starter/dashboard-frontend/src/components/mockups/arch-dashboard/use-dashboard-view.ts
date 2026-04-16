import { useState } from "react";

import type { HttpMethod } from "./dashboard-types";

export function useDashboardView() {
  const [methodFilter, setMethodFilter] = useState<HttpMethod | "ALL">("ALL");

  return {
    methodFilter,
    setMethodFilter,
  };
}
