import { useExport, useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, ExportButton, List } from "@refinedev/antd";
import { PurchaseListTable } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { IProduct, IPurchase } from "../../interfaces";
import { UploadOutlined } from "@ant-design/icons";

const PurchaseList: React.FC<PropsWithChildren> = ({ children }) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const t = useTranslate();

  const { isLoading, triggerExport } = useExport<IPurchase>({
    sorters: [
      {
        field: "code",
        order: "desc",
      },
    ],
    mapData: (item) => {
      return {
        'Code': item.code,
        'Date': item.createdAt,
        'Supplier': item.supplier,
        'Note': item.note,
        'Total Amount': item.totalAmount.toFixed(2),
        'Due Amount': item.due_amount.toFixed(2),
      };
    },
  });

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <ExportButton key='export' onClick={triggerExport} loading={isLoading} icon={<UploadOutlined/>}/>,
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
      <PurchaseListTable />
      {children}
    </List>
  );
};

export default PurchaseList;
