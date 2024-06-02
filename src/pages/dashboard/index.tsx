import {
  Row, Col, theme, Dropdown, MenuProps, Button, Flex, Table, Space,
  Grid,
  Card,
  Typography,
} from "antd";

import { Divider } from "antd";

import { useTranslation } from "react-i18next";

import {
  CardWithPlot,
  DailyRevenue,
  DailyOrders,
  NewCustomers,
  // OrderTimeline,
  RecentOrders,
  TrendingMenu,
  CardWithContent,
  TrendUpIcon,
  TrendDownIcon,
} from "../../components";
import {
  ClockCircleOutlined,
  DollarCircleOutlined,
  DownOutlined,
  RiseOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { List, NumberField } from "@refinedev/antd";
import { useApiUrl, useCustom } from "@refinedev/core";
import dayjs from "dayjs";
import { ISalesChart, ISummary } from "../../interfaces";

type DateFilter = "lastWeek" | "lastMonth";

const { Text } = Typography;

const { useBreakpoint } = Grid;


const DATE_FILTERS: Record<
  DateFilter,
  {
    text: string;
    value: DateFilter;
  }
> = {
  lastWeek: {
    text: "lastWeek",
    value: "lastWeek",
  },
  lastMonth: {
    text: "lastMonth",
    value: "lastMonth",
  },
};

export const DashboardPage: React.FC = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const API_URL = useApiUrl();
  const screens = useBreakpoint();


  const [selecetedDateFilter, setSelectedDateFilter] = useState<DateFilter>(
    DATE_FILTERS.lastWeek.value,
  );

  const dateFilters: MenuProps["items"] = useMemo(() => {
    const filters = Object.keys(DATE_FILTERS) as DateFilter[];

    return filters.map((filter) => {
      return {
        key: DATE_FILTERS[filter].value,
        label: t(`dashboard.filter.date.${DATE_FILTERS[filter].text}`),
        onClick: () => {
          setSelectedDateFilter(DATE_FILTERS[filter].value);
        },
      };
    });
  }, []);

  const dateFilterQuery = useMemo(() => {
    const now = dayjs();
    switch (selecetedDateFilter) {
      case "lastWeek":
        return {
          start: now.subtract(6, "days").startOf("day").format(),
          end: now.endOf("day").format(),
        };
      case "lastMonth":
        return {
          start: now.subtract(1, "month").startOf("day").format(),
          end: now.endOf("day").format(),
        };
      default:
        return {
          start: now.subtract(7, "days").startOf("day").format(),
          end: now.endOf("day").format(),
        };
    }
  }, [selecetedDateFilter]);

  const { data: dailyRevenueData } = useCustom<{
    data: ISalesChart[];
    total: number;
    trend: number;
  }>({
    url: `${API_URL}/misc/dailyRevenue`,
    method: "get",
    config: {
      query: dateFilterQuery,
    },
  });

  const { data: dailyOrdersData } = useCustom<{
    data: ISalesChart[];
    total: number;
    trend: number;
  }>({
    url: `${API_URL}/misc/dailyOrders`,
    method: "get",
    config: {
      query: dateFilterQuery,
    },
  });

  const { data: newCustomersData } = useCustom<{
    data: ISalesChart[];
    total: number;
    trend: number;
  }>({
    url: `${API_URL}/misc/newCustomers`,
    method: "get",
    config: {
      query: dateFilterQuery,
    },
  });

  const revenue = useMemo(() => {
    const data = dailyRevenueData?.data?.data;
    if (!data)
      return {
        data: [],
        trend: 0,
      };

    const plotData = data.map((revenue) => {
      const date = dayjs(revenue.date);
      return {
        timeUnix: date.unix(),
        timeText: date.format("DD MMM YYYY"),
        value: revenue.value,
        state: "Daily Revenue",
      };
    });

    return {
      data: plotData,
      trend: dailyRevenueData?.data?.trend || 0,
    };
  }, [dailyRevenueData]);

  const orders = useMemo(() => {
    const data = dailyOrdersData?.data?.data;
    if (!data) return { data: [], trend: 0 };

    const plotData = data.map((order) => {
      const date = dayjs(order.date);
      return {
        timeUnix: date.unix(),
        timeText: date.format("DD MMM YYYY"),
        value: order.value,
        state: "Daily Orders",
      };
    });

    return {
      data: plotData,
      trend: dailyOrdersData?.data?.trend || 0,
    };
  }, [dailyOrdersData]);

  const newCustomers = useMemo(() => {
    const data = newCustomersData?.data?.data;
    if (!data) return { data: [], trend: 0 };

    const plotData = data.map((customer) => {
      const date = dayjs(customer.date);
      return {
        timeUnix: date.unix(),
        timeText: date.format("DD MMM YYYY"),
        value: customer.value,
        state: "New Customers",
      };
    });

    return {
      data: plotData,
      trend: newCustomersData?.data?.trend || 0,
    };
  }, [newCustomersData]);


  const { data: iepdData } = useCustom<ISummary>({
    url: `${API_URL}/misc/headerdata`,
    method: "get",
    
  });

  const headerdata=iepdData?.data;

  return (
    <List
      title={t("dashboard.overview.title")}
      headerButtons={() => (
        <Dropdown menu={{ items: dateFilters }}>
          <Button>
            {t(
              `dashboard.filter.date.${DATE_FILTERS[selecetedDateFilter].text}`,
            )}
            <DownOutlined />
          </Button>
        </Dropdown>
      )}
    >
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 10 }} lg={24} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  <DollarCircleOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                  />
                }
                title={t("dashboard.dailyRevenue.title")}
                rightSlot={
                  <Flex align="center" gap={8}>
                    <NumberField
                      value={revenue.trend}
                      options={{
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }}
                    />
                    {revenue.trend > 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                  </Flex>
                }
              >
                <DailyRevenue height={170} data={revenue.data} />
              </CardWithPlot>
            </Col>
            <Col xl={{ span: 7 }} lg={12} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  <ShoppingOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                  />
                }
                rightSlot={
                  <Flex align="center" gap={8}>
                    <NumberField value={orders.trend} />
                    {orders.trend > 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                  </Flex>
                }
                title={t("dashboard.dailyOrders.title")}
              >
                <DailyOrders height={170} data={orders.data} />
              </CardWithPlot>
            </Col>
            <Col xl={{ span: 7 }} lg={12} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  <UserOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                  />
                }
                title={t("dashboard.newCustomers.title")}
                rightSlot={
                  <Flex align="center" gap={8}>
                    <NumberField
                      value={newCustomers.trend / 100}
                      options={{
                        style: "percent",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }}
                    />
                    {newCustomers.trend > 0 ? (
                      <TrendUpIcon />
                    ) : (
                      <TrendDownIcon />
                    )}
                  </Flex>
                }
              >
                <NewCustomers height={170} data={newCustomers.data} />
              </CardWithPlot>
            </Col>
          </Row>
        </Col>



        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              padding: "1px 0px 0px 0px",
            }}
            icon={
              <DollarCircleOutlined
                style={{
                  fontSize: 14,
                  color: token.colorPrimary,
                }}
              />
            }
            title={t("Today Overview")}
          >
            {/* <RecentOrders /> */}

            <Row justify={screens.md ? "space-between" : "center"} >
              <Col xs={24} sm={8} md={5} style={{ margin: 10 }}>
                <Card hoverable>
                  <Row align="middle">
                    <div>
                      <Text>Income</Text>
                      <Divider type="vertical" />
                    </div>
                    <Text type="success" style={{ fontSize: screens.sm ? "14px" : "14px" }}>
                      {headerdata?.income}
                    </Text>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} sm={8} md={5} style={{ margin: 10 }}>
                <Card hoverable>
                  <Row align="middle">
                    <div>
                      <Text >Expense</Text>
                      <Divider type="vertical" />
                    </div>
                    <Text type="danger" style={{ fontSize: screens.sm ? "14px" : "14px" }}>
                      {headerdata?.expense}
                    </Text>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} sm={8} md={5} style={{ margin: 10 }}>
                <Card hoverable>
                  <Row align="middle">
                    <div>
                      <Text >Profit</Text>
                      <Divider type="vertical" />
                    </div>
                    <Text style={{ fontSize: screens.sm ? "14px" : "14px", color: "#3c89e8" }}>
                      {headerdata?.profit}
                    </Text>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} sm={8} md={5} style={{ margin: 10 }}>
                <Card hoverable>
                  <Row align="middle">
                    <div>
                      <Text >Due Amount</Text>
                      <Divider type="vertical" />
                    </div>
                    <Text type="warning" style={{ fontSize: screens.sm ? "14px" : "14px" }}>
                      {headerdata?.dueamount}
                    </Text>
                  </Row>
                </Card>
              </Col>
            </Row>



          </CardWithContent>
        </Col>



        <Col xl={15} lg={15} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              padding: "1px 0px 0px 0px",
            }}
            icon={
              <ShoppingOutlined
                style={{
                  fontSize: 14,
                  color: token.colorPrimary,
                }}
              />
            }
            title={t("dashboard.recentOrders.title")}
          >
            <RecentOrders />
          </CardWithContent>
        </Col>
        <Col xl={9} lg={9} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              padding: 0,
            }}
            icon={
              <RiseOutlined
                style={{
                  fontSize: 14,
                  color: token.colorPrimary,
                }}
              />
            }
            title={t("dashboard.trendingProducts.title")}
          >
            <TrendingMenu />
          </CardWithContent>
        </Col>
      </Row>
    </List>
  );
};
