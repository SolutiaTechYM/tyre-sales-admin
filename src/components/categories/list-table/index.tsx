import {
  useTranslate,
  IResourceComponentsProps,
  HttpError,
  useGo,
  useNavigation
} from "@refinedev/core";
import { List, useTable } from "@refinedev/antd";
import { Button, Table, theme } from "antd";
// import { ICategory } from "../../interfaces";

import { ICategory } from "../../../interfaces";
import { PaginationTotal } from "../../paginationTotal";
import { CategoryStatus } from "../status";
import { TableCategoryProductColumn } from "../tableColumnProducts";
import { EyeOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

export const CategoryTable: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable<ICategory, HttpError>();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();


  return (

      <Table
        {...tableProps}
        rowKey="id"
        scroll={{
          x: true,
        }}
        pagination={{
          ...tableProps.pagination,
          hideOnSinglePage: true,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="categories" />
          ),
        }}
      >
        <Table.Column
          key="title"
          dataIndex="title"
          width={224}
          title={t("categories.fields.title")}
        />
        <Table.Column<ICategory>
          key="id"
          dataIndex="id"
          width={576}
          title={t("categories.fields.products")}
          render={(_, record) => {
            return <TableCategoryProductColumn category={record} />;
          }}
        />
        <Table.Column<ICategory>
          key="Quantity"
          dataIndex="quantity"
          title={t("quantity")}
          
        />
          <Table.Column<ICategory>
          fixed="right"
          title={t("table.actions")}
          render={(_, record) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl("categories", record.id)}`,
                  query: {
                    to: pathname,
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: "replace",
                });
              }}
            />
          )}
        />
      </Table>

  
  );
};
