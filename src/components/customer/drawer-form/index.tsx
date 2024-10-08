import { SaveButton, useDrawerForm } from "@refinedev/antd";
import {
  BaseKey,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
import InputMask from "react-input-mask";

import { getValueFromEvent, useSelect } from "@refinedev/antd";
import { useForm } from "antd/lib/form/Form";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Grid,
  Button,
  Flex,
  Avatar,
  Segmented,
  Spin,
  DatePicker,
} from "antd";
import { IProduct, ICategory, ICustomer } from "../../../interfaces";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const CustomerDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const [form] = useForm();
  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<ICustomer>({
      resource: "customers",
      id: props?.id, // when undefined, id will be read from the URL.
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        console.log("Form data:", form.getFieldsValue());
        props.onMutationSuccess?.();
        // onDrawerCLose();

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

      },
      // form,
    });

  // const { selectProps: categorySelectProps } = useSelect<ICustomer>({
  //   resource: "users",
  // });

  const onDrawerCLose = () => {
    close();

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

  const images = Form.useWatch("avatar", formProps.form);
  console.log(formProps.form);
  console.log(images);
  
  const image = images?.[0] || null;
  const previewImageURL = image?.url || image?.response?.url;
  console.log(images);

  
  const title = props.action === "edit" ? null : t("products.actions.add");

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={onDrawerCLose}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            name="avatar"
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            style={{
              margin: 0,
            }}
            // rules={[
            //   {
            //     required: true,
            //   },
            // ]}
          >
            <Upload.Dragger
              name="file"
              action={`${apiUrl}/media/upload`}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              className={styles.uploadDragger}
              showUploadList={false}
            >
              <Flex
                vertical
                align="center"
                justify="center"
                style={{
                  position: "relative",
                  height: "100%",
                }}
              >
                <Avatar
                  shape="square"
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: previewImageURL ? "100%" : "48px",
                    height: previewImageURL ? "100%" : "48px",
                    marginTop: previewImageURL ? undefined : "auto",
                    transform: previewImageURL ? undefined : "translateY(50%)",
                  }}
                  src={previewImageURL || "/images/product-default-img.png"}
                  alt="Product Image"
                />
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    marginTop: "auto",
                    marginBottom: "16px",
                    backgroundColor: theme.colorBgContainer,
                    ...(!!previewImageURL && {
                      position: "absolute",
                      bottom: 0,
                    }),
                  }}
                >
                  {t("products.fields.images.description")}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Flex vertical>
            <Form.Item
              label={t("products.fields.name")}
              name="name"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="please enter name "/>
            </Form.Item>

            <Form.Item
  label={t("Contact")}
  name="phone"
  className={styles.formItem}
  rules={[
    {
      required: true,
    },
    {
      pattern: /^[0-9]{10}$/,
      message: "Please enter a valid 10-digit phone number",
    },
  ]}
>
  <Input placeholder="please enter Phone number" maxLength={10} />
</Form.Item>


            <Form.Item
              label={t("Address")}
              name="address"
              className={styles.formItem}
             
            >
            <Input.TextArea
              rows={2}
              placeholder="please enter address"
            />
            </Form.Item>

            <Form.Item
              label={t("Company")}
              name="company"
              className={styles.formItem}
             
            >
            <Input
   
              placeholder="optional"
            />
            </Form.Item>


            {/* <Form.Item
              label={t("createdAt")}
              name="createdAt"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
             <DatePicker style={{ width: "100%" }} />
            </Form.Item> */}

            {/* <Form.Item
              label={t("products.fields.category")}
              name={["category", "id"]}
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select {...categorySelectProps} />
            </Form.Item> */}
         
            <Flex
              align="center"
              justify="space-between"
              style={{
                padding: "16px 16px 0px 16px",
              }}
            >
              <Button onClick={onDrawerCLose}>Cancel</Button>
              <SaveButton
                {...saveButtonProps}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                Save
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
