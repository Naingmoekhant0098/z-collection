import { Calendar, Edit, ShirtIcon, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button";

function CategoryCard({ category, handleDelete,handleEdit }) {
  return (
    <div
      key={category._id}
      className="group bg-white p-5 py-3 rounded-3xl border border-slate-200 hover:border-slate-200 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-center mb-3">
          <div className="p-2.5    border-main rounded-full bg-main/10 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors text-pink-400">
            <ShirtIcon className="w-5 h-5 text-pink-500 " />
          </div>
          {/* <div
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      category.is_active
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </div> */}
        </div>

        <h3 className="font-medium text-center text-slate-800 text-[13px] mb-1">
          {category.name}
        </h3>

        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(category.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex gap-3 justify-center  items-center ">
        <Button
          variant="outline"
          size="icon"
          className=" border-slate-300 shadow-none "
          onClick={() =>handleEdit('edit',category)}
        >
          <Edit className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className=" border-red-400 text-red-400 shadow-none "
          onClick={() => handleDelete(category._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default CategoryCard;
