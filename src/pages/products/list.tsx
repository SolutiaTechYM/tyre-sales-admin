import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, ExportButton, List } from "@refinedev/antd";
import { ProductListCard, ProductListTable } from "../../components";
import { PropsWithChildren, useState } from "react";
import { AppstoreOutlined, UnorderedListOutlined, UploadOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { useLocation } from "react-router-dom";
import { IProduct } from "../../interfaces";
import { useExport } from "@refinedev/core";

type View = "table" | "card";

const ProductList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const { isLoading, triggerExport } = useExport<IProduct>({
    sorters: [
      {
        field: "name",
        order: "asc",
      }
    ],
      mapData: (item) => {
        return {
          'Code': item.code,
          'Name': item.name,
          'Category': item.category.title,
          'Remaining Quantity': item.quantityRemaining,
          'Added Date': item.createdAt,
        };
      },
    });

  const [view, setView] = useState<View>(
    (localStorage.getItem("product-view") as View) || "table",
  );

  const handleViewChange = (value: View) => {
    // remove query params (pagination, filters, etc.) when changing view
    replace("");

    setView(value);
    localStorage.setItem("product-view", value);
  };

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        // <Segmented<View>
        //   key="view"
        //   size="large"
        //   value={view}
        //   style={{ marginRight: 8 }}
        //   options={[
        //     {
        //       label: "",
        //       value: "table",
        //       icon: <UnorderedListOutlined />,
        //     },
        //     {
        //       label: "",
        //       value: "card",
        //       icon: <AppstoreOutlined />,
        //     },
        //   ]}
        //   onChange={handleViewChange}
        // />,
        <ExportButton key='export' onClick={triggerExport} loading={isLoading} icon={<UploadOutlined/>}/>,
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("products")}`,
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
          {t("products.actions.add")}
        </CreateButton>,
      ]}
    >
      {/* {view === "table" && <ProductListTable />} */}
      {/* {view === "card" && <ProductListCard />} */}
      <ProductListTable />
      {children}
    </List>
  );
};

export default ProductList;