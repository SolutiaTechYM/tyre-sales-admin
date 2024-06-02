import { Tag, Typography, theme } from "antd";
import { CheckCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { useConfigProvider } from "../../../context";
import { ICustomer } from "../../../interfaces";

type Props = {
  value: ICustomer;
};

export const UserStatus = ({ value }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { mode } = useConfigProvider();
  const isDark = mode === "dark";

  return (
    <Tag
      color={value ? "green" : "default"}
      style={{
        color: value ? token.colorSuccess : token.colorTextTertiary,
      }}
      icon={value ? <CheckCircleOutlined /> : <PauseCircleOutlined />}
    >
      <Typography.Text
        style={{
          color: value
            ? isDark
              ? token.green7
              : "#3C8618"
            : isDark
              ? token.colorTextTertiary
              : token.colorTextTertiary,
        }}
      >
        {t(`users.fields.isActive.${value}`)}
      </Typography.Text>
    </Tag>
  );
};
