import { useGetToPath, useGo } from "@refinedev/core";
import { ProductDrawerForm } from "../../components/product/drawer-form";
import { useSearchParams } from "react-router-dom";
import { SupplierDrawerForm } from "../../components/supplier/drawer-form";

const SupplierCreate = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  return (
    <SupplierDrawerForm
      action="create"
      onMutationSuccess={() => {
        go({
          to:
            searchParams.get("to") ??
            getToPath({
              action: "list",
            }) ??
            "",
          query: {
            to: undefined,
          },
          options: {
            keepQuery: true,
          },
          type: "replace",
        });
      }}
    />
  );
};

export default SupplierCreate;