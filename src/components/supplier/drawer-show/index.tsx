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
import { ISupplier } from "../../../interfaces";
import { DeleteButton, NumberField } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const SupplierDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<ISupplier, HttpError>({
    resource: "suppliers",
    id: props?.id, // when undefined, id will be read from the URL.
  });
  const supplier = queryResult.data?.data;

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
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      <Flex vertical align="center" justify="center">
        <Avatar
          shape="square"
          style={{
            aspectRatio: 1,
            objectFit: "contain",
            width: "240px",
            height: "240px",
            margin: "16px auto",
            borderRadius: "8px",
          }}
          src={supplier?.avatar?.url}
          alt={supplier?.avatar?.name}
        />
      </Flex>
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
          <Typography.Title level={5}>{supplier?.name}</Typography.Title>
          <Typography.Text type="secondary">
            {supplier?.phone}
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
                  {t("suppliers.fields.address")}
                </Typography.Text>
              ),
              value: <Typography.Text>{supplier?.address}</Typography.Text>,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t("suppliers.fields.dueAmount")}
                </Typography.Text>
              ),
              value: (
                <NumberField
                  value={supplier?.dueAmount || 0}
                  options={{
                    style: "currency",
                    currency: "LKR",
                  }}
                />
              ),
            }
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
          recordItemId={supplier?.id}
          resource="suppliers"
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
              to: `${editUrl("suppliers", supplier?.id || "")}`,
              query: {
                to: "/suppliers",
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
