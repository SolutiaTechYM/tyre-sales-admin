import { Flex, Avatar, Typography } from "antd";
import { ICustomer, ISupplier } from "../../../interfaces";

type Props = {
  supplier?: ISupplier;
};

export const SupplierInfoSummary = ({ supplier }: Props) => {
  console.log(supplier);

  return (
    <Flex align="center" gap={32}>
      <Avatar size={96} src={supplier?.avatar[0]?.thumbnailUrl} />
      <Flex vertical>
        {/* <Typography.Text type="secondary">{supplier?.id}</Typography.Text> */}
        <Typography.Title
          level={3}
          style={{
            margin: 0,
          }}
        >
          {supplier?.name}
        </Typography.Title>
      </Flex>
    </Flex>
  );
};
