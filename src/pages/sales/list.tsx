import { useExport, useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, ExportButton, List } from "@refinedev/antd";
// import { PurchaseListTable, SalesListTable } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { IProduct, IPurchase } from "../../interfaces";
import { SalesListTable } from "../../components/purchase";

export const SalesList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const t = useTranslate();

  const { isLoading, triggerExport } = useExport<IPurchase>({
    // sorters,
    // filters,
    // pageSize: 50,
    // maxItemCount: 50,
    mapData: (item) => {
      return {
        id: item.id,
        date:item.date,
        createdAt: item.createdAt,
        description: item.description,
        price: item.price,
        supplier:item.supplier
      };
    },
  });

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <ExportButton onClick={triggerExport} loading={isLoading} />,
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("purchases")}`,
              query: {
                to: pathname,
              },
              options: {
                keepQuery: true,
              },
              type: "replace",
            });
          }}
        >
          {t("purchases.actions.add")}
        </CreateButton>,
      ]}
    >
      <SalesListTable />
      {children}
    </List>
  );
};
