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
import { ICategory, IProduct, IPurchaseProduct } from "../../../interfaces";
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

export const PurchaseDetailsEditableTable = ({
  data,
  setData,
}: {
  data: IPurchaseProduct[];
  setData: (data: IPurchaseProduct[]) => void;
}) => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  
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
        pagination={{
          hideOnSinglePage: true,
        }}
      >
        {/* <Table.Column
           title={t("Supplier Name")}

          dataIndex="suppliername"
          key="suppliername"
          // width={80}
          align="center"

          render={(value) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>
              {value}
            </Typography.Text>
          )}
        /> */}

        {/* <Table.Column
          title={t("ID")}
          dataIndex="productID"
          key="product"
          // align="center"
          sorter
          render={(value) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>
              {value}
            </Typography.Text>
          )}
        /> */}
        
        <Table.Column
          title={t("Product Name")}
          dataIndex="name"
          key="name"
          // align="center"

          sorter
          render={(value) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>
              {value}
            </Typography.Text>
          )}
        />
        <Table.Column
          title={t("Category")}
          dataIndex="category"
          key="category"
          // align="center"

          // // sorter
          // render={(value) => (
          //   <Typography.Text style={{ whiteSpace: "nowrap" }}>
          //     {value}
          //   </Typography.Text>
          // )}
        />
        <Table.Column
          title={t("purchases.fields.details.qty")}
          dataIndex="quantity"
          key="quantity"
          align="right"

          
          sorter
          render={(qty) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>
              {qty}
            </Typography.Text>
          )}
        />
        <Table.Column
          title={t("Unit Price")}
          dataIndex="unitPrice"
          key="unitPrice"
          align="right"

          
          sorter
          render={(value) => (
            <Typography.Text style={{ whiteSpace: "nowrap" }}>
             {parseFloat(value).toFixed(2)}
            </Typography.Text>
          )}
        />
        <Table.Column
        title={t("Total Price")}
        dataIndex="totalPrice"
        key="totalPrice"
        align="right"

        
        sorter
        render={(value) => (
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {parseFloat(value).toFixed(2)}
          </Typography.Text>
        )}
      />
       {/* <Table.Column
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
      /> */}
        <Table.Column
          title="Action"
          key="action"
          align="center"
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



