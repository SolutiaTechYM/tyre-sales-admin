import {
  HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  DeleteButton,
  FilterDropdown,
  NumberField,
  getDefaultSortOrder,
  useSelect,
  useTable,
} from "@refinedev/antd";
import { ICategory, IProduct, RowData } from "../../../interfaces";
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Select,
  Table,
  Typography,
  theme,
} from "antd";
import { PaginationTotal } from "../../paginationTotal";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

export const PurchaseDetailsEditableTable = ({
  data,
  setData,
  setTableRef,
}: {
  data: RowData[];
  setData: (data: RowData[]) => void;
  setTableRef: (ref: { getTableData: () => RowData[] }) => void;
}) => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const tableRef = useRef<{ getTableData: () => RowData[] }>({
    getTableData: () => data,
  });

  setTableRef(tableRef.current);

  const handleDeleteRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  
  

    return (
      <Table
        dataSource={data}
        rowKey="id"
        scroll={{ x: true }}
      >
        <Table.Column
           title={t("Supplier Name")}

          dataIndex="name"
          key="name"
          // width={80}
          align="center"

          render={(value) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>
              {value}
            </Typography.Text>
          )}
        />

        <Table.Column
          title={t("Product ID")}
          dataIndex="product"
          key="product"
          align="center"
          sorter
          render={(value) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>
              {value}
            </Typography.Text>
          )}
        />
        <Table.Column
          title={t("Description")}
          dataIndex="description"
          key="description"
          align="center"

          sorter
          render={(value) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>
              {value}
            </Typography.Text>
          )}
        />
        <Table.Column
          title={t("purchases.fields.details.qty")}
          dataIndex="quantity"
          key="quantity"
          align="center"

          
          sorter
          render={(qty) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>
              {qty}
            </Typography.Text>
          )}
        />
        <Table.Column
          title={t("Unit Price")}
          dataIndex="unitprice"
          key="unitprice"
          align="center"

          
          sorter
          render={(value) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>
              {value}
            </Typography.Text>
          )}
        />
        <Table.Column
        title={t("Total Price")}
        dataIndex="totalprice"
        key="totalprice"
        align="center"

        
        sorter
        render={(value) => (
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {value}
          </Typography.Text>
        )}
      />
       <Table.Column
        title={t("Credit")}
        dataIndex="credit"
        key="credit"
        align="center"

        
        sorter
        render={(value) => (
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {value}
          </Typography.Text>
        )}
      />
        <Table.Column
          title="Action"
          key="action"
          fixed="right"
          render={(_, record, index) => (
            <Button type="primary" onClick={() => handleDeleteRow(index)}>
              Delete
            </Button>
          )}
        />
      </Table>
    );
  
};



