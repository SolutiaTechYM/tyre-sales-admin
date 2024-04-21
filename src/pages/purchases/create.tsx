import { useGetToPath, useGo } from "@refinedev/core";
import { PurchaseDrawerForm } from "../../components/purchase/drawer-form";
import { useSearchParams } from "react-router-dom";

export const PurchaseCreate = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  return (
    <PurchaseDrawerForm
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
