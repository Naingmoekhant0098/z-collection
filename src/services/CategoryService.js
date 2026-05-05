import { useBaseService } from "./BaseService";

export const CategoryService = () => {
  let base = useBaseService("category");

  return {
    ...base,
  };
};
