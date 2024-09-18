import { NumberField, TextField, useSimpleList } from "@refinedev/antd";
import { Typography, Avatar, List as AntdList, Flex } from "antd";
import { ITrendingProducts } from "../../../interfaces";
import {
  Rank1Icon,
  Rank2Icon,
  Rank3Icon,
  Rank4Icon,
  Rank5Icon,
} from "../../icons";
import { ReactNode } from "react";
import { useList } from "@refinedev/core";


type DateFilter = "lastWeek" | "lastMonth";
export const TrendingMenu: React.FC<{ dateFilter: DateFilter }> = ({ dateFilter }) => {
  const pageSize = dateFilter === "lastWeek" ? 7 : 30;

  const { data, isLoading } = useList<ITrendingProducts>({
    resource: "misc/trendingProducts",
    pagination: { pageSize, current: 1 },
    
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AntdList
      dataSource={data?.data}
      pagination={false}
      size="large"
      bordered={false}
      renderItem={(item, index) => {
        return (
          <AntdList.Item
            key={index}
            style={{
              borderBlockEnd: "none",
            }}
          >
            <Flex
              gap={24}
              style={{
                width: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <Avatar
                  shape="square"
                  style={{
                    borderRadius: 24,
                  }}
                  size={{
                    xs: 64,
                    sm: 64,
                    md: 64,
                    lg: 108,
                    xl: 120,
                    xxl: 120,
                  }}
                  src={item.product?.images?.[0]?.url}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: -8,
                  }}
                >
                  {RankIcons[index + 1]}
                </div>
              </div>
              <Flex
                vertical
                gap="10px"
                justify="center"
                style={{
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <Flex vertical justify="center">
                  <div>
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 1,
                        tooltip: {
                          placement: "top",
                          title: item.product?.name,
                        },
                      }}
                      style={{
                        margin: 0,
                        fontSize: 24,
                      }}
                      strong={index <= 2 ? true : false}
                    >
                      {item.product?.name}
                    </Typography.Paragraph>
                  </div>
                  <TextField
                    type="secondary"
                    options={{
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      notation: "standard",
                    }}
                    value={item.product.code}
                  />
                </Flex>
                <Typography.Text
                  style={{
                    fontSize: 16,
                  }}
                  type="secondary"
                >
                  Ordered{" "}
                  <Typography.Text strong>{item.orderCount} </Typography.Text>
                  times
                </Typography.Text>
              </Flex>
            </Flex>
          </AntdList.Item>
        );
      }}
    />
  );
};

const RankIcons: Record<number, ReactNode> = {
  1: <Rank1Icon />,
  2: <Rank2Icon />,
  3: <Rank3Icon />,
  4: <Rank4Icon />,
  5: <Rank5Icon />,
  // For ranks 6-30, we'll use the same icon as rank 5
  ...Object.fromEntries(Array.from({ length: 25 }, (_, i) => [i + 6, <Rank5Icon />])),
};