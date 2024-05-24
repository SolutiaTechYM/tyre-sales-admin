import {
  BaseKey,
  HttpError,
  useGetToPath,
  useGo,
  useModal,
  useNavigation,
  useOne,
  useShow,
  useTranslate,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  Modal,
  Table,
  Typography,
  theme,
} from "antd";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { ICategory, IProduct, IPurchase, ISalesShow } from "../../../interfaces";
import { DeleteButton, NumberField } from "@refinedev/antd";
import { PurchaseStatus } from "../status";
import { EditOutlined, FilePdfOutlined } from "@ant-design/icons";
import { PurchaseDetailsTable } from "../details-table";
import { PdfLayout } from "../../../pages/sales/PdfLayout";
import { useState } from "react";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const SalesDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();
  const [record, setRecord] = useState<ISalesShow>();

  const { show, visible, close } = useModal();

  const { queryResult } = useShow<ISalesShow, HttpError>({
    resource: "sales",
    id: props?.id, // when undefined, id will be read from the URL.
  });
  const sales = queryResult.data?.data;

  const handleDrawerClose = () => {
    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to:
        searchParams.get("to") ??
        getToPath({
          action: "list",
        }) ??
        "",
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const columns = [

    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Unit Buy Price',
      dataIndex: 'unitBuyPrice',
      key: 'unitBuyPrice',
      render: (value: number) => <NumberField value={value} options={{                 minimumFractionDigits: 2,
        maximumFractionDigits: 2, }} />,
    },
    {
      title: 'Unit Sell Price',
      dataIndex: 'unitSellPrice',
      key: 'unitSellPrice',
      render: (value: number) => <NumberField value={value} options={{                 minimumFractionDigits: 2,
        maximumFractionDigits: 2, }} />,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (value: number) => <NumberField value={value} options={{                 minimumFractionDigits: 2,
        maximumFractionDigits: 2, }} />,
    },
  ];

  return (
    <>
    <Drawer
      open={true}
      width={breakpoint.sm ? "1134px" : "100%"}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
        }}
      >
<Flex style={{ padding: "16px", justifyContent: "space-between" }}>
    <Flex vertical>
        <Typography.Title level={5}>
            Sale ID : {sales?.id}
        </Typography.Title>
        <Typography.Text type="secondary">
            {sales?.description}
        </Typography.Text>
        <Typography.Text>
  Due Amount:{" "}
  {sales?.due_amount !== undefined ? (
  sales.due_amount < 0 ? (
    <span
      style={{
        color: "red",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      C{" "}
      {Math.abs(sales.due_amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  ) : sales.due_amount > 0 ? (
    <span
      style={{
        color: "lightgreen",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      D{" "}
      {sales.due_amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  ) : (
    "-"
  )
) : (
  <NumberField value={0} options={{ style: "currency", currency: "USD" }} />
)}
</Typography.Text>
        <Typography.Text>
            Total Price:{" "}
            <NumberField
                value={sales?.price || 0}
                options={{ minimumFractionDigits: 2,
                  maximumFractionDigits: 2,}}
                style={{
                fontWeight:"bold"

                }}
            />
        </Typography.Text>
    </Flex >
    <Flex vertical>
        <Typography.Title level={5} style={{color:"red"}}>
            Print Invoice 
        </Typography.Title>

    <Button
            style={{ alignSelf: "center",borderColor:"red" }}
            size="large"
            icon={<FilePdfOutlined style={{ color: "red"}} />}
            onClick={() => {
              setRecord(sales);
              show();
            }}
          />
          </Flex>
</Flex>
        <Divider
          style={{
            margin: 0,
            padding: 0,
          }}
        />
        <Flex
          vertical
          gap={32}
          style={{
            padding: "32px",
          }}
        >
          <Table dataSource={sales?.saleDetails} columns={columns} />
        </Flex>
      </Flex>


    </Drawer>
    <Modal visible={visible} onCancel={close} width="80%" footer={null} zIndex={99999999}>
          <PdfLayout  record={record}/>
        </Modal>
    </>
  );
};