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
  Form,
  Grid,
  List,
  Typography,
  theme,
} from "antd";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { ICategory, IProduct } from "../../../interfaces";
import { DeleteButton, NumberField } from "@refinedev/antd";
// import { ProductStatus } from "../status";
import { EditOutlined } from "@ant-design/icons";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const CategoryDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<ICategory, HttpError>({
    resource: "categories",
    id: props?.id, // when undefined, id will be read from the URL.
  });
  const category = queryResult.data?.data;

 


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
                <Form.Item
            name="images"
            valuePropName="fileList"
            // getValueFromEvent={getValueFromEvent}
            style={{
              margin: 0,
            }}

          >
  
          </Form.Item>

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
          <Typography.Title level={5}>{category?.title}</Typography.Title>
          <Typography.Text type="secondary">
            {/* {category?.description} */}
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
                  {t("Quantity")}
                </Typography.Text>
              ),
              value: <Typography.Text>{category?.quantity}</Typography.Text>,
            },
            {
              label: (
                <Typography.Paragraph type="secondary">
                  {t("Description")}
                </Typography.Paragraph>
              ),
              value: <Typography.Text>{category?.description}</Typography.Text>,
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
          recordItemId={category?.id}
          resource="categories"
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
              to: `${editUrl("categories", category?.id || "")}`,
              query: {
                to: "/categories",
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
