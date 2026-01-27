import { useBaseService } from "./BaseService";
 
export const NotiService = () => {
  let base = useBaseService("notification");
 
  return {
    ...base,  

  };
};