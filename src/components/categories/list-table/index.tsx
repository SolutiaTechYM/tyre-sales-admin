import {
  useTranslate,
  IResourceComponentsProps,
  HttpError,
  useGo,
  useNavigation,
  getDefaultFilter,

} from "@refinedev/core";


import { FilterDropdown, List, useTable } from "@refinedev/antd";
import { Button, Input, Table, theme, Typography } from "antd";
// import { ICategory } from "../../interfaces";

import { ICategory } from "../../../interfaces";
import { PaginationTotal } from "../../paginationTotal";
import { CategoryStatus } from "../status";
import { TableCategoryProductColumn } from "../tableColumnProducts";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

export const CategoryTable: React.FC<IResourceComponentsProps> = () => {
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();

  const {tableProps, sorters, filters} = useTable<ICategory, HttpError>({
    filters: {
        initial: [
            {
                field: "title",
                operator: "contains",
                value: "",
            },
        ],
    },
});


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
          key="name"
          dataIndex="name"
          width={224}
          sorter

          title={t("categories.fields.title")}
          filterIcon={(filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? token.colorPrimary : undefined,
                }}
            />
        )}
        defaultFilteredValue={getDefaultFilter(
            "name",
            filters,
            "contains"
        )}
        filterDropdown={(props) => (
            <FilterDropdown {...props}>
                <Input placeholder={t("purchases.filter.note.placeholder")}/>
            </FilterDropdown>
        )}
        render={(description: string) => {
            return (
                <Typography.Paragraph
                    ellipsis={{rows: 1, tooltip: true}}
                    style={{
                        maxWidth: "380px",
                        marginBottom: 0,
                    }}
                >
                    {description}
                </Typography.Paragraph>
            );
        }}
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
        width="100px"

          key="quantity"
          dataIndex="quantity"
          title={t("Quantity")}
          align="right"
        render={(description: string) => {
            return (
                <Typography.Paragraph
                    ellipsis={{rows: 1, tooltip: true}}
                    style={{
                        maxWidth: "380px",
                        marginBottom: 0,
                    }}
                >
                    {description}
                </Typography.Paragraph>
            );
        }}
          
        />
          <Table.Column<ICategory>
          fixed="right"
        width="100px"
        align="center"

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
