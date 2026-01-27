import { useBaseService } from "./BaseService";
 
export const BannerService = () => {
  let base = useBaseService("ads");
 
  return {
    ...base,  

  };
};