
import { AdsTable } from "./components/table/table";
 


export default function Ads() {
  return (
    
    <main className="flex-1 overflow-y-auto ">
        <div className=" space-y-3 md:space-y-6">
          <AdsTable />
        </div>
      </main>
    
  );
}
