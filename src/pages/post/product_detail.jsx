import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import { ArrowLeft } from "lucide-react";
import { ProductService } from "../../services/PostService";

function ProductDetail() {
  const { id } = useParams();
  const [product, setData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id]);
  const fetchProductById = async (id) => {
    try {
      const res = await ProductService().getById(id);
      if (res.data?.success) {
        console.log(res.data?.data);
        setData(res.data?.data);
      }
      console.log(res);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  //   const product = {
  //     _id: "69eb2a04fca47bcbb64e1187",
  //     name: "Soft Granite Hat Lady Dress",
  //     category_id: {
  //       _id: "69eb2a00fca47bcbb64e109f",
  //       name: "Wedding",
  //     },
  //     description:
  //       "The Customer-focused bifurcated access Keyboard offers reliable performance and faint design",
  //     variants: [
  //       {
  //         size: "S",
  //         color: "Red",
  //         price: 40,
  //         stock: 20,
  //         _id: "69eb2a04fca47bcbb64e1188",
  //       },
  //       {
  //         size: "M",
  //         color: "Red",
  //         price: 45,
  //         stock: 15,
  //         _id: "69eb2a04fca47bcbb64e1189",
  //       },
  //       {
  //         size: "L",
  //         color: "Red",
  //         price: 50,
  //         stock: 10,
  //         _id: "69eb2a04fca47bcbb64e118a",
  //       },
  //       {
  //         size: "S",
  //         color: "Blue",
  //         price: 40,
  //         stock: 20,
  //         _id: "69eb2a04fca47bcbb64e118b",
  //       },
  //     ],
  //     images: [],
  //     is_active: true,
  //     created_at: "2026-04-24T08:29:56.339Z",
  //   };
  const prices = product && product.variants.map((v) => v.price);
  const minPrice = product && Math.min(...prices);
  const maxPrice = product && Math.max(...prices);
  const totalRevenue =
    product &&
    product.variants.reduce((acc, variant) => {
      const profitPerUnit = (variant.price || 0) - (variant?.buy_price || 0);
      return acc + variant.stock * profitPerUnit;
    }, 0);
  return (
    <main className="flex-1 overflow-y-auto ">
      <div className="max-w-5xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product?.name?.slice(0, 20)}...</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className=" flex items-center justify-between">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center  px-2  py-1 rounded-xl border border-gray-400 gap-1.5 -mt-2 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8">
          <div className="aspect-square -mt-2 w-full h-54 bg-gray-100  overflow-hidden flex items-center justify-center  rounded-lg border-gray-300">
            <img
              src={
                product?.image ||
                "https://cdn.shopify.com/s/files/1/0070/7032/articles/Clothing-Photography_1ce4a4bc-0651-43df-8260-f6d8f01628f4.jpg?v=1747247930"
              }
              alt={product?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col space-y-3">
            <div className="">
              <h1 className="text-xl font-semibold tracking-tight">
                {product?.name}
              </h1>
              <p className="text-sm font-semibold text-primary mt-2">
                {minPrice}MMK — {maxPrice}MMK
              </p>
            </div>
            <div className="">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {product?.description}
              </p>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <DetailRow
                  label="Category"
                  value={product?.category_id?.name}
                />
                <DetailRow
                  label="Status"
                  value={product?.is_active ? "Active" : "Archived"}
                />
                <DetailRow
                  label="Created"
                  value={new Date(product?.created_at).toLocaleDateString()}
                />
                <DetailRow
                  label="Updated"
                  value={new Date(product?.updated_at).toLocaleDateString()}
                />
              </div>
            </div>
            <div className="border rounded-md  mt-2 overflow-auto">
              <table className="w-full text-sm text-left overflow-auto">
                <thead className="bg-pink-200 text-white-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">Size</th>
                    <th className="px-4 py-2">Color</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2 text-center">Buy Price</th>
                    <th className="px-4 py-2  text-center">Unit Price</th>
                    <th className="px-4 py-2 text-center">Potential Revenue</th>
                    <th className="px-4 py-2 text-center">Est. Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {product?.variants?.map((variant) => (
                    <tr
                      key={variant._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{variant.size}</td>
                      <td className="px-4 py-3">{variant.color}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            variant.stock < 15
                              ? "text-orange-600 font-bold"
                              : ""
                          }
                        >
                          {variant.stock} items
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {variant?.buy_price}000 MMK
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {variant.price}000 MMK
                      </td>

                      <td className="px-4 py-3 text-right font-semibold">
                        {variant?.price - variant?.buy_price} MMK
                      </td>

                      <td className="px-4 py-3 text-center  font-semibold">
                        {variant?.stock * (variant?.price - variant?.buy_price)}{" "}
                        MMK
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-3 text-right font-semibold"
                    >
                      Total Potential Profit
                    </td>
                    <td>
                      <td className="px-4 py-3 font-semibold">
                        {totalRevenue}000 MMK
                      </td>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-bold uppercase text-slate-400 tracking-tighter">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-700">{value}</span>
    </div>
  );
}

export default ProductDetail;
