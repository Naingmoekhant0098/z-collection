 
 
import { PostTable } from "../../components/admin/posts";
 
export default function Posts() {
  return (
    
    <main className="flex-1 overflow-y-auto ">
        <div className=" space-y-3 md:space-y-6">
          <PostTable />
        </div>
      </main>
    
  );
}
