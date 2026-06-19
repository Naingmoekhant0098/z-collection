import { useBaseService } from "./BaseService";

export const DashboardService = () => {
  let base = useBaseService("dashboard");
  return {
    ...base,
  };
};
