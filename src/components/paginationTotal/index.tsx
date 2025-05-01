import { FC } from "react";
import { useTranslate } from "@refinedev/core";
import { Typography, theme } from "antd";

type PaginationTotalProps = {
  total: number;
  entityName: string;
  customText?: string; // Added the optional customText prop
};

export const PaginationTotal: FC<PaginationTotalProps> = ({
  total,
  entityName,
  customText, // Added customText to the destructured props
}) => {
  const t = useTranslate();
  const { token } = theme.useToken();

  // Construct the entityNameTranslation based on customText
  const entityNameTranslation = customText
    ? customText
    : `${entityName}.${entityName}`;

  return (
    <div
      style={{
        marginLeft: "16px",
        marginRight: "auto",
      }}
    >
      <Typography.Text
        style={{
          color: token.colorTextSecondary,
        }}
      >
        {total}
      </Typography.Text>{" "}
      <Typography.Text
        style={{
          color: token.colorTextTertiary,
        }}
      >
        {t(entityNameTranslation)} {t("table.inTotal")}
      </Typography.Text>
    </div>
  );
};