import {
  useTranslate,
  IResourceComponentsProps,
  HttpError,
} from "@refinedev/core";
import { List, useTable } from "@refinedev/antd";
import { Table } from "antd";
// import { ICategory } from "../../interfaces";

import { ICategory } from "../../../interfaces";
import { PaginationTotal } from "../../paginationTotal";
import { CategoryStatus } from "../status";
import { TableCategoryProductColumn } from "../tableColumnProducts";

export const CategoryTable: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable<ICategory, HttpError>();

  const t = useTranslate();

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
      </Table>
  
  );
};
