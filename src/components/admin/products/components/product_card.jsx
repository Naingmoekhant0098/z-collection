// import React from 'react'
// import { Card,CardContent } from '../../../ui/card'
// import { Button } from '../../../ui/button'
// import { useNavigate } from 'react-router-dom'

// function ProductCard({product}) {
//  const navigate = useNavigate()
//   return (
//     <Card
//     key={product._id}
//     className="p-3 shadow-none  bg-transparent space-y-0 transition-shadow"
//   >
//     <div className=" relative ">
//       <img
//         src={
//           product.image ||
//           "https://cdn.shopify.com/s/files/1/0070/7032/articles/Clothing-Photography_1ce4a4bc-0651-43df-8260-f6d8f01628f4.jpg?v=1747247930"
//         }
//         className="h-40 w-full object-cover rounded-md"
//       />
//       <p className="text-xs  font-normal bg-pink-200 border-pink-400 absolute top-3 right-2 px-2 py-1 rounded-xl text-gray-500">
//         {product.category_id?.name}
//       </p>
//     </div>

//     <CardContent className="p-2 -mt-2 pb-1  space-y-1">
//       <h2 className="font-semibold">{product.name}</h2>

//       <p className="text-xs line-clamp-2 text-gray-600 tracking-wide">
//         {product.description}
//       </p>

//       <div className=" h-[1px] my-3 w-full bg-white" />

//       <div className="flex justify-between text-sm">
//         <div className="">
//           <span className=" text-gray-500">Price :</span>{" "}
//           <span className=" font-medium">
//             {product.variants?.[0]?.price}000 MMK
//           </span>
//         </div>
//         <div>
//           <span className=" text-gray-500">Stock :</span>{" "}
//           <span className=" font-medium">
//             {product.variants?.[0]?.stock} items
//           </span>
//         </div>
//       </div>

//       <Button
//         onClick={() => navigate(`/admin/products/${product?._id}`)}
//         className="w-full mt-3 bg-main"
//       >
//         View
//       </Button>
//     </CardContent>
//   </Card>
//   )
// }

// export default ProductCard

import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, Tag, ArrowUpRight, Layers, Box, DollarSign } from "lucide-react";

function ProductCard({ product }) {
  const navigate = useNavigate();

  // Extracting first variant data safely
  const firstVariant = product.variants?.[0] || {};
  const price = firstVariant.price
    ? `${firstVariant.price.toLocaleString()} MMK`
    : "0 MMK";
  const stock = firstVariant.available_stock ?? 0;

  return (
    <div
      onClick={() => navigate(`/admin/products/${product?._id}`)}
      className="bg-white p-5 py-4 border-b rounded-xl border-gray-100 last:border-0 hover:bg-gray-50 active:bg-gray-100/70 transition-all flex items-start gap-4 cursor-pointer group"
    >
      {/* 1. Circular Icon Section (Replacing large image) */}
      <div>
        <div className=" flex  items-center gap-2.5 mb-2">
          <div className="relative mt-1 flex-shrink-0 w-11 h-11  rounded-md overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div className="flex flex-col gap-1 ">
            <div className="flex items-center gap-2.5 ">
              <h3 className="font-semibold text-slate-900 text-[14px] truncate leading-tight">
                {product.name}
              </h3>
            </div>

            <span
              className={`text-[10px] uppercase font-bold rounded-full `}
            >
              <span className=" text-slate-400"> Category :</span>{" "}
              {product.category_id?.name || "General"}
            </span>
          </div>
        </div>

       
          <div className="flex w-full  items-center justify-between gap-6 border-t pt-2 border-slate-100 text-gray-500 text-[11px]">
           
            <div className="flex items-center gap-1.5">
              <Box
                className={`h-3.5 w-3.5 ${
                  stock < 5 ? "text-red-500" : "text-gray-400"
                }`}
              />
              <span
                className={`font-medium ${
                  stock < 5 ? "text-red-500" : "text-slate-700"
                }`}
              >
                {stock} stocks
              </span>
            </div>

            {/* Variants Info */}
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-gray-400" />
              <span>{product.variants?.length || 0} Variants</span>
            </div>

            {/* Price Info */}
            <div className="flex items-center gap-1.5 ml-auto">
              <DollarSign className="h-3.5 w-3.5 text-slate-900" />
              <span className="text-slate-900 font-bold text-[13px]">
                {price}
              </span>
            </div>
          </div>
       
      </div>

    

      
       
    </div>
  );
}

export default ProductCard;
