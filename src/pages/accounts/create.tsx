import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";
import { AccountDrawerForm } from "../../components/accounts/drawer-form";

export const AccountCreate = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  return (
    <AccountDrawerForm
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
