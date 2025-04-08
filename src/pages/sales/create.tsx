import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";
import { SaleDrawerForm } from "../../components/sales/drawer-form";

const SaleCreate = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  return (
    <SaleDrawerForm
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

export default SaleCreate;