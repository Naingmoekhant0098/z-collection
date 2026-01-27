import { useBaseService } from "./BaseService";
 
export const SettingService = () => {
  let base = useBaseService("settings");
 
  return {
    ...base,  

  };
};