import { useExport, useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, ExportButton, List } from "@refinedev/antd";
import { PurchaseListTable } from "../../components";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { IProduct, IPurchase, ISalesShow } from "../../interfaces";
import { SaleListTable } from "../../components/sales";
import { UploadOutlined } from "@ant-design/icons";

const SaleList: React.FC<PropsWithChildren> = ({ children }) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const t = useTranslate();

  const { isLoading, triggerExport } = useExport<ISalesShow>({
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
        'Customer': item.customer,
        'Note': item.note,
        'Total Amount': item.totalAmount.toFixed(2),
        'Due Amount': item.due_amount.toFixed(2),
        'Total Profit': item.profit.toFixed(2)
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

export default SaleList;
