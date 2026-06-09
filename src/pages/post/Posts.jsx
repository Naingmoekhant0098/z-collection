 
 
import { ProductTable } from "../../components/admin/products/index";
 
export default function Posts() {
  return (
    <div className="overflow-y-auto w-full ">
        <div className=" w-full space-y-3 md:space-y-6 mt-10 md:mt-0">
          <ProductTable />
        </div>
      </div>
    
  );
}
