import { useBaseService } from "./BaseService";
 
export const PostService = () => {
  let base = useBaseService("posts");
 
  return {
    ...base,  

  };
};