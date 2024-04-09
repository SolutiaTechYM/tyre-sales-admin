import { useGetToPath, useGo } from "@refinedev/core";
import { CustomerDrawerForm } from "../../components/customer/drawer-form";
import { useSearchParams } from "react-router-dom";

export const CustomerCreate = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  return (
    <CustomerDrawerForm
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
