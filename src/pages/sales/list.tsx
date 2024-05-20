import { useExport, useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, ExportButton, List } from "@refinedev/antd";
import { PurchaseListTable } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { IProduct, IPurchase } from "../../interfaces";
import { SaleListTable } from "../../components/sales";

export const SaleList = ({ children }: PropsWithChildren) => {
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
              to: `${createUrl("sales")}`,
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
          {t("Add new Sale")}
        </CreateButton>,
      ]}
    >
      <SaleListTable />
      {children}
    </List>
  );
};
