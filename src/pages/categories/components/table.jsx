// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import { Badge } from "../../../components/ui/badge";
// import { Button } from "../../../components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../../components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../../../components/ui/dropdown-menu";
// import {
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   Plus,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Input } from "../../../components/ui/input";
// import customToast from "../../../components/customToast";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../components/ui/select";

// // Import your CategoryDialog
// import { CategoryDialog } from "./popup";
// import { CategoryService } from "../../../services/CategoryService";

// export function CategoryTable() {
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [order, setOrder] = useState("desc");

//   // Logic States
//   const [isOpen, setIsOpen] = useState(false);
//   const [type, setType] = useState("create"); // 'create' or 'edit'
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const getStatusBadge = (isActive) => {
//     return isActive ? (
//       <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none shadow-none">
//         <CheckCircle2 className="w-3 h-3 mr-1" /> Active
//       </Badge>
//     ) : (
//       <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none shadow-none">
//         <XCircle className="w-3 h-3 mr-1" /> Inactive
//       </Badge>
//     );
//   };
//   const fetchCategories = async () => {
//     try {
//       setIsLoading(true);
//       const response = await CategoryService().fetchAll({
//         order,
//         search: searchText,
//       });
//       if (response.data?.success) {
//         setCategories(response.data?.data || []);
//       }
//     } catch (error) {
//       customToast.error("Error Fetching Categories");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, [searchText, order]);
//   const handleCloseDialog = () => {
//     setIsOpen(false);
//     setSelectedCategory(null);
//     setType("create");
//   };
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this category?")) {
//       try {
//         await CategoryService().deleteById(id);
//         customToast.success("Success", "Category deleted successfully");
//         fetchCategories();
//       } catch (error) {
//         customToast.error("Failed to delete");
//       }
//     }
//   };

//   return (
//     <div className="w-full p-0 ">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0">
//         <div className="text-xl font-bold text-gray-800"></div>
//         <Button
//           onClick={() => {
//             setType("create");
//             setSelectedCategory(null);
//             setIsOpen(true);
//           }}
//           className="bg-main text-white font-normal rounded-4xl py-2! text-xs"
//         >
//           <Plus className="w-4 h-4 mr-1" /> Add Category
//         </Button>
//       </CardHeader>

//       <CardContent className="px-0">
//         <div className="flex gap-3 items-center justify-between mb-4">
//           <div className="flex gap-2 items-center flex-1">
//             <Input
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               placeholder="Search category name..."
//               className="max-w-[300px]"
//             />
//             <Select value={order} onValueChange={setOrder}>
//               <SelectTrigger className="w-[140px]">
//                 <SelectValue placeholder="Sort" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="asc">Oldest</SelectItem>
//                 <SelectItem value="desc">Newest</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="rounded-lg border overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-pink-400">
//                 <TableHead className="text-white! text-center">Name</TableHead>
//                 <TableHead className="text-white! text-center">
//                   Status
//                 </TableHead>
//                 <TableHead className="text-white! text-center">Date</TableHead>
//                 <TableHead className="text-white! text-center">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {categories.length > 0 ? (
//                 categories.map((category) => (
//                   <TableRow key={category._id} className="hover:bg-gray-50/50">
//                     <TableCell className="text-center font-medium">
//                       {category.name}
//                     </TableCell>
//                     <TableCell className="text-center">
//                       {getStatusBadge(category.is_active)}
//                     </TableCell>
//                     <TableCell className="text-center text-gray-600 text-sm">
//                       {new Date(category.created_at).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-8 w-8 p-0"
//                           >
//                             <MoreHorizontal className="h-4 w-4 text-emerald-600" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-40">
//                           <DropdownMenuItem
//                             className="cursor-pointer text-emerald-600"
//                             onClick={() => {
//                               setSelectedCategory(category);
//                               setType("edit");
//                               setIsOpen(true);
//                             }}
//                           >
//                             <Edit className="h-4 w-4 mr-2" /> Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => handleDelete(category._id)}
//                             className="cursor-pointer text-red-600 focus:text-red-600"
//                           >
//                             <Trash2 className="h-4 w-4 mr-2" /> Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={4}
//                     className="text-center py-10 text-gray-500"
//                   >
//                     No categories found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>

//       {/* Logic Integration: The Dialog */}
//       <CategoryDialog
//         isOpen={isOpen}
//         handleClose={handleCloseDialog}
//         type={type}
//         selectedCategory={selectedCategory}
//         onRefresh={fetchCategories}
//       />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  LayoutGrid,
  Search,
  Shirt,
  ShirtIcon,
} from "lucide-react";
import { CardContent, CardHeader } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import customToast from "../../../components/customToast";
import { CategoryService } from "../../../services/CategoryService";
import { CategoryDialog } from "./popup";

export function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [order, setOrder] = useState("desc");

  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await CategoryService().fetchAll({
        order,
        search: searchText,
      });
      if (response.data?.success) {
        setCategories(response.data?.data || []);
      }
    } catch (error) {
      customToast.error("Error Fetching Categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchText, order]);

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedCategory(null);
    setType("create");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await CategoryService().deleteById(id);
        customToast.success("Success", "Category removed");
        fetchCategories();
      } catch (error) {
        customToast.error("Failed to delete");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-row md:items-center justify-between gap-4 mb-6">
        <div>
        <Select value={order} onValueChange={setOrder}>
          <SelectTrigger className="w-[140px] bg-white border-slate-100 rounded-xl">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Oldest</SelectItem>
            <SelectItem value="desc">Newest</SelectItem>
          </SelectContent>
        </Select>
        </div>
    
        <Button
          onClick={() => {
            setType("create");
            setSelectedCategory(null);
            setIsOpen(true);
          }}
          className="bg-main text-white font-normal rounded-4xl py-2! text-xs"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Category
        </Button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search categories..."
            className="pl-10 text-base bg-white border-slate-100 rounded-xl focus:ring-slate-200"
          />
        </div>
       
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              className="group bg-white p-5 py-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-pink-50   border-main rounded-xl group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors text-pink-400">
                    <ShirtIcon className="w-5 h-5 text-pink-500 " />
                  </div>
                  <div
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      category.is_active
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-[15px] mb-1">
                  {category.name}
                </h3>

                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(category.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex   pt-2 items-center border-t  border-slate-100">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedCategory(category);
                    setType("edit");
                    setIsOpen(true);
                  }}
                  className=" h-9 rounded-lg mx-0 text-slate-600 hover:bg-slate-50  text-xs font-semibold"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => handleDelete(category._id)}
                  className="h-9 rounded-lg text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Del
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm">
            No categories found.
          </div>
        )}
      </div>

      <CategoryDialog
        isOpen={isOpen}
        handleClose={handleCloseDialog}
        type={type}
        selectedCategory={selectedCategory}
        onRefresh={fetchCategories}
      />
    </div>
  );
}
