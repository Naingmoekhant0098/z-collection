

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
import CategoryCard from "./card";

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
const handleEdit=async(status,selectedCategory)=>{
  setType(status);
  setSelectedCategory(selectedCategory);
  setIsOpen(true);

}
  return (
    <div className="w-full">
    
      <div className="flex flex-row md:items-center justify-between gap-4 mb-4">
        <div>
         
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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {categories.length > 0 ? (
          categories.map((category) => <CategoryCard handleEdit={handleEdit} category={category} handleDelete={handleDelete} />)
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
