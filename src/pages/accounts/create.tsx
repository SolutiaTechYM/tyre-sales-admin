import { useGetToPath, useGo } from "@refinedev/core";
import { AccountsDrawerForm } from "../../components/customer/drawer-form";
import { useSearchParams } from "react-router-dom";

export const AccountsCreate = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  return (
    <AccountsDrawerForm
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
