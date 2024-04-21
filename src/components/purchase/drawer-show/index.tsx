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
  Typography,
  theme,
} from "antd";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { ICategory, IProduct } from "../../../interfaces";
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

  const { queryResult } = useShow<IProduct, HttpError>({
    resource: "products",
    id: props?.id, // when undefined, id will be read from the URL.
  });
  const product = queryResult.data?.data;

  const { data: categoryData } = useOne<ICategory, HttpError>({
    resource: "categories",
    id: product?.category?.id,
    queryOptions: {
      enabled: !!product?.category?.id,
    },
  });
  const category = categoryData?.data;

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
        <Flex
          vertical
          style={{
            padding: "16px",
          }}
        >
          <Typography.Title level={5}>
            Purchase ID : {product?.id}
          </Typography.Title>
          <Typography.Text type="secondary">
            {product?.description}
          </Typography.Text>
        </Flex>
        <Divider
          style={{
            margin: 0,
            padding: 0,
          }}
        />
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">
                  {t("purchases.fields.supplier")}
                </Typography.Text>
              ),
              value: <Typography.Text>{product?.name}</Typography.Text>,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t("purchases.fields.price")}
                </Typography.Text>
              ),
              value: (
                <NumberField
                  value={product?.price || 0}
                  options={{
                    style: "currency",
                    currency: "USD",
                  }}
                />
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t("purchases.fields.credit")}
                </Typography.Text>
              ),
              value: (
                <NumberField
                  value={product?.price || 0}
                  options={{
                    style: "currency",
                    currency: "USD",
                  }}
                />
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t("purchases.fields.createdAt")}
                </Typography.Text>
              ),
              value: (
                <Typography.Text>
                  {product?.createdAt.split("T")[0]}
                </Typography.Text>
              ),
            },
          ]}
          renderItem={(item) => {
            return (
              <List.Item>
                <List.Item.Meta
                  style={{
                    padding: "0 16px",
                  }}
                  avatar={item.label}
                  title={item.value}
                />
              </List.Item>
            );
          }}
        />
        <Divider
          style={{
            margin: 0,
            padding: 10,
          }}
        />
      </Flex>
      <Flex
        vertical
        gap={32}
        style={{
          padding: "32px",
        }}
      >
        <PurchaseDetailsTable />
      </Flex>

      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "16px 16px 16px 0",
        }}
      >
        <DeleteButton
          type="text"
          recordItemId={product?.id}
          resource="products"
          onSuccess={() => {
            handleDrawerClose();
          }}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }

            return go({
              to: `${editUrl("products", product?.id || "")}`,
              query: {
                to: "/products",
              },
              options: {
                keepQuery: true,
              },
              type: "replace",
            });
          }}
        >
          {t("actions.edit")}
        </Button>
      </Flex>
    </Drawer>
  );
};
