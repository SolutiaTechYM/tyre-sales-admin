import React, { useMemo, useState } from 'react';
import {
  Row, Col, theme, Dropdown, MenuProps, Button, Flex, Typography, Grid, Card, Divider,
  DatePicker,
  Space
} from "antd";
import { useTranslation } from "react-i18next";
import {
  CardWithPlot,
  DailyRevenue,
  DailyOrders,
  NewCustomers,
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

  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilter>(
    DATE_FILTERS.lastWeek.value,
  );

  const dateFilters: MenuProps["items"] = useMemo(() => {
    const filters = Object.keys(DATE_FILTERS) as DateFilter[];

    return filters.map((filter) => ({
      key: DATE_FILTERS[filter].value,
      label: t(`dashboard.filter.date.${DATE_FILTERS[filter].text}`),
      onClick: () => {
        setSelectedDateFilter(DATE_FILTERS[filter].value);
      },
    }));
  }, [t]);

  const dateFilterQuery = useMemo(() => { 
    const now = dayjs();
    switch (selectedDateFilter) {
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
  }, [selectedDateFilter]);

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

  // const { data: summaryData } = useCustom<{
  //   today: {
  //     income: number;
  //     expense: number;
  //     dueamountPurchase: number;
  //     dueamountSale: number;
  //     profit: number;
  //     billPorfit:number;
  //   };
  //   thisMonth: {
  //     income: number;
  //     expense: number;
  //     dueamountPurchase: number;
  //     dueamountSale: number;
  //     profit: number;
  //     billPorfit:number;
  //   };
  // }>({
  //   url: `${API_URL}/misc/summary`,
  //   method: "get",
  // });


  interface IDailySummary {
    income: number;
    expense: number;
    dueamountPurchase: number;
    dueamountSale: number;
    profit: number;
    billPorfit: number;
  }

  
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  // Separate API call for today's data
  // const { data: todayOverviewData } = useCustom<{
  //   data: IDailySummary;
  // }>({
  //   url: `${API_URL}/misc/daily-summary`,
  //   method: "get",
  //   config: {
  //     query: {
  //       date: selectedDate.format('YYYY-MM-DD')
  //     },
  //   },
  // });


  //   // Separate API call for monthly data
  //   const { data: monthOverviewData } = useCustom<{
  //     data: IDailySummary;
  //   }>({
  //     url: `${API_URL}/misc/monthly-summary`,
  //     method: "get",
  //     // config: {
  //     //   query: {
  //     //     month: dayjs().format('YYYY-MM')
  //     //   },
  //     // },
  //   });



    const { data: todayOverviewData } = useCustom<{
      today: {
        income: number;
        expense: number;
        dueamountPurchase: number;
        dueamountSale: number;
        profit: number;
        billProfit: number;
      };
      thisMonth: {
        income: number;
        expense: number;
        dueamountPurchase: number;
        dueamountSale: number;
        profit: number;
        billProfit: number;
      };
    }>({
      url: `${API_URL}/misc/summary`,
      method: "get",
      config: {
        query: {
          date: selectedDate.format('YYYY-MM-DD')
        },
      },
    });

    const todayData = todayOverviewData?.data?.today;
    const thisMonthData = todayOverviewData?.data?.thisMonth;

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


    // // Custom header component for Today Overview
    // const TodayOverviewHeader: React.FC = () => (
    //   <Space size="middle">
    //     <DollarCircleOutlined
    //       style={{
    //         fontSize: 14,
    //         color: token.colorPrimary,
    //       }}
    //     />
    //     {t("Today Overview")}
        
    //   </Space>
    // );

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

  const formatValue = (value: number): number => {
    return parseFloat((value || 0).toFixed(2));
  };


  const renderCard = (title: string, value: number, type: "success" | "danger" | "warning" | "") => (
    <Col xs={24} sm={12} md={6} style={{ margin: 10 }}>
      <Card hoverable>
        <Row align="middle">
          <div>
            <Text>{title}</Text>
            <Divider type="vertical" />
          </div>
          <NumberField
            // value={value}
       value={formatValue(value)}
            options={{
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }}
            style={{ fontSize: screens.sm ? "14px" : "12px", color: type === "success" ? "#52c41a" : type === "danger" ? "#f5222d" : type === "warning" ? "#faad14" : "#1890ff" }}
          />
        </Row>
      </Card>
    </Col>
  );

  return (
    <List
      title={t("dashboard.overview.title")}
      headerButtons={() => (
        <Dropdown menu={{ items: dateFilters }}>
          <Button>
            {t(
              `dashboard.filter.date.${DATE_FILTERS[selectedDateFilter].text}`,
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
        <Col style={{width:"100%"}}>
  <Row justify="space-between" align="middle" style={{width:"100%"}}>
    <Text style={{ 
      fontSize: 22,
      fontWeight: 500,
   
    }}>
      Summary
    </Text>
    <DatePicker
      disabledDate={(current) => current && current > dayjs().endOf('day')}
      value={selectedDate}
      onChange={(date) => date && setSelectedDate(date)}
      allowClear={false}
    />
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
            title={t("Day Overview")}
          >
       
            <Row justify={screens.md ? "center" : "center"}>
              {renderCard("Income", todayData?.income || 0.00, "success")}
              {renderCard("Expense", todayData?.expense || 0.00, "danger")}
              {renderCard("Profit", todayData?.profit || 0.00, "")}
              {renderCard("Due Amount (Purchase)", todayData?.dueamountPurchase || 0.00, "warning")}
              {renderCard("Due Amount (Sale)", todayData?.dueamountSale || 0.00, "warning")}
              {renderCard("Bill Profit", todayData?.billProfit || 0.00, "warning")}
            </Row>
          </CardWithContent>
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
            title={t("Month Overview")}
          >
             <Row justify={screens.md ? "center" : "center"}>
              {renderCard("Income", thisMonthData?.income || 0.00, "success")}
              {renderCard("Expense", thisMonthData?.expense || 0.00, "danger")}
              {renderCard("Profit", thisMonthData?.profit || 0.00, "")}
              {renderCard("Due Amount (Purchase)", thisMonthData?.dueamountPurchase || 0.00, "warning")}
              {renderCard("Due Amount (Sale)", thisMonthData?.dueamountSale || 0.00, "warning")}
              {renderCard("Bill Profit", thisMonthData?.billProfit || 0.00, "warning")}
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
            title={t("Recent Sales")}
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
         <TrendingMenu dateFilter={selectedDateFilter} />
          </CardWithContent>
        </Col>
      </Row>
    </List>
  );
};