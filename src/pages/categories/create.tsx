import { useGetToPath, useGo } from "@refinedev/core";
import { ProductDrawerForm } from "../../components/product/drawer-form";
import { useSearchParams } from "react-router-dom";
import { CategoryDrawerForm } from "../../components/categories/drawer-form";

const CategoryCreate: React.FC = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  return (
    <CategoryDrawerForm
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

export default CategoryCreate;
