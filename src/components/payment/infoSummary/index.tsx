import { Flex, Avatar, Typography } from "antd";
import { ICustomer } from "../../../interfaces";

type Props = {
  customer?: ICustomer;
};

export const CustomerInfoSummary = ({ customer }: Props) => {
  return (
    <Flex align="center" gap={32}>
      <Avatar size={96} src={customer?.avatar?.[0]?.thumbnailUrl} />
      <Flex vertical>
        <Typography.Text type="secondary">#{customer?.id}</Typography.Text>
        <Typography.Title
          level={3}
          style={{
            margin: 0,
          }}
        >
          {customer?.name}
        </Typography.Title>
      </Flex>
    </Flex>
  );
};
