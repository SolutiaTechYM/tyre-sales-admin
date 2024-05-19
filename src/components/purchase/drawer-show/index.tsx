import {
  BaseKey,
  HttpError,
  useGetToPath,
  useGo,
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
  Table,
  Typography,
  theme,
} from "antd";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { ICategory, IProduct, IPurchase, IPurchaseProductshow } from "../../../interfaces";
import { DeleteButton, NumberField } from "@refinedev/antd";
import { PurchaseStatus } from "../status";
import { EditOutlined } from "@ant-design/icons";
import { PurchaseDetailsTable } from "../details-table";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const PurchaseDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IPurchase, HttpError>({
    resource: "purchases",
    id: props?.id, // when undefined, id will be read from the URL.
  });
  const purchase = queryResult.data?.data;

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
      title: 'Product Name',
      dataIndex: 'productID',
      key: 'productID',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (value: number) => <NumberField value={value} options={{ style: 'currency', currency: 'USD' }} />,
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
      render: (value: number) => <NumberField value={value} options={{ style: 'currency', currency: 'USD' }} />,
    },
  ];

  return (
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
            Purchase ID : {purchase?.id}
        </Typography.Title>
        <Typography.Text type="secondary">
            {purchase?.description}
        </Typography.Text>
        <Typography.Text>
            Due Amount:{" "}
            <NumberField
                value={purchase?.due_amount || 0}
                options={{ style: "currency", currency: "USD" }}
            />
        </Typography.Text>
        <Typography.Text>
            Total Price:{" "}
            <NumberField
                value={purchase?.price || 0}
                options={{ style: "currency", currency: "USD" }}
            />
        </Typography.Text>
    </Flex>
    <Button>Print</Button>
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
          <Table dataSource={purchase?.purchaseDetails} columns={columns} />
        </Flex>
      </Flex>


    </Drawer>
  );
};