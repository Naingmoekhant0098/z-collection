import { OrderTable } from "./components/table";
export default function Orders() {
  return (
    <div className="overflow-y-auto w-full mt-4 md:mt-0 ">
      <div className=" w-full space-y-3 md:space-y-6">
        <OrderTable />
      </div>
    </div>
  );
}
