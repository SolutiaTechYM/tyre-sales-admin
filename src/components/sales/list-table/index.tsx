import {
    HttpError,
    getDefaultFilter,
    useGo,
    useNavigation,
    useTranslate,
} from "@refinedev/core";
import {
    FilterDropdown,
    NumberField,
    getDefaultSortOrder,
    useSelect,
    useTable,
} from "@refinedev/antd";
import {IProduct, ISalesShow} from "../../../interfaces";
import {
    Avatar,
    Button,
    Input,
    InputNumber,
    Select,
    Table,
    Typography,
    theme,
} from "antd";
import {PaginationTotal} from "../../paginationTotal";
import {EyeOutlined, SearchOutlined} from "@ant-design/icons";
import {useLocation} from "react-router-dom";
import {log} from "console";

export const SaleListTable = () => {
    const {token} = theme.useToken();
    const t = useTranslate();
    const go = useGo();
    const {pathname} = useLocation();
    const {showUrl} = useNavigation();

    const {tableProps, sorters, filters} = useTable<ISalesShow, HttpError>({
        filters: {
            initial: [
                {
                    field: "description",
                    operator: "contains",
                    value: "",
                },
                {
                    field: "date",
                    operator: "contains",
                    value: "",
                },
                {
                    field: "id",
                    operator: "in",
                    value: [],
                },

            ],
        },
    });

    console.log(tableProps);

    return (
        <Table
            {...tableProps}


            rowKey="id"
            scroll={{x: true}}
            pagination={{
                ...tableProps.pagination,
                showTotal: (total) => (
                    <PaginationTotal total={total} entityName="sales" customText="Sales"/>
                ),
            }}
        >
            {/*<Table.Column*/}
            {/*  title={*/}
            {/*    <Typography.Text*/}
            {/*      style={{*/}
            {/*        whiteSpace: "nowrap",*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      ID */}
            {/*    </Typography.Text>*/}
            {/*  }*/}
            {/*  dataIndex="id"*/}
            {/*  key="id"*/}
            {/*  width={80}*/}
            {/*  render={(value) => (*/}
            {/*    <Typography.Text*/}
            {/*      style={{*/}
            {/*        whiteSpace: "nowrap",*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      {value}*/}
            {/*    </Typography.Text>*/}
            {/*  )}*/}
            {/*  filterIcon={(filtered) => (*/}
            {/*    <SearchOutlined*/}
            {/*      style={{*/}
            {/*        color: filtered ? token.colorPrimary : undefined,*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  )}*/}
            {/*  defaultFilteredValue={getDefaultFilter("id", filters, "eq")}*/}
            {/*  filterDropdown={(props) => (*/}
            {/*    <FilterDropdown {...props}>*/}
            {/*      <InputNumber*/}
            {/*        // addonBefore="#"*/}
            {/*        style={{ width: "100%" }}*/}
            {/*        placeholder={t("products.filter.id.placeholder")}*/}
            {/*      />*/}
            {/*    </FilterDropdown>*/}
            {/*  )}*/}
            {/*/>*/}
            <Table.Column
                title={
                    <Typography.Text
                        style={{
                            whiteSpace: "nowrap",
                        }}
                    >
                        Code
                    </Typography.Text>
                }
                dataIndex="code"
                key="code"
                render={(value) => (
                    <Typography.Text
                        style={{
                            whiteSpace: "nowrap",
                        }}
                    >
                        {value}
                    </Typography.Text>
                )}
                filterIcon={(filtered) => (
                    <SearchOutlined
                        style={{
                            color: filtered ? token.colorPrimary : undefined,
                        }}
                    />
                )}
                defaultFilteredValue={getDefaultFilter("code", filters, "contains")}
                filterDropdown={(props) => (
                    <FilterDropdown {...props}>
                        <Input
                            // addonBefore="#"
                            style={{width: "100%"}}
                            placeholder="Enter Sale Code"
                        />
                    </FilterDropdown>
                )}
            />
            <Table.Column
                title={t("purchases.fields.createdAt")}
                dataIndex="date"
                key="date"
                align="right"
                sorter
                // defaultSortOrder={getDefaultSortOrder("price", sorters)}
                render={(value: string) => {
                    return (
                        <Typography.Text
                            style={{
                                whiteSpace: "nowrap",
                            }}
                        >
                            {value.split("T")[0]}
                        </Typography.Text>
                    );
                }}
            />
            <Table.Column
                title={t("Customer")}
                dataIndex="customer"
                key="customer"
                filterIcon={(filtered) => (
                    <SearchOutlined
                        style={{
                            color: filtered ? token.colorPrimary : undefined,
                        }}
                    />
                )}
                defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
                filterDropdown={(props) => (
                    <FilterDropdown {...props}>
                        <Input placeholder={t("purchases.filter.supplier.placeholder")}/>
                    </FilterDropdown>
                )}
                render={(value: string) => {
                    return (
                        <Typography.Text
                            style={{
                                whiteSpace: "nowrap",
                            }}
                        >
                            {value}
                        </Typography.Text>
                    );
                }}
            />

            <Table.Column
                title={t("purchases.fields.note")}
                dataIndex="description"
                key="description"
                width={200}
                filterIcon={(filtered) => (
                    <SearchOutlined
                        style={{
                            color: filtered ? token.colorPrimary : undefined,
                        }}
                    />
                )}
                defaultFilteredValue={getDefaultFilter(
                    "description",
                    filters,
                    "contains"
                )}
                filterDropdown={(props) => (
                    <FilterDropdown {...props}>
                        <Input placeholder={t("purchases.filter.note.placeholder")}/>
                    </FilterDropdown>
                )}
                render={(description: string) => {
                    return (
                        <Typography.Paragraph
                            ellipsis={{rows: 1, tooltip: true}}
                            style={{
                                maxWidth: "380px",
                                marginBottom: 0,
                            }}
                        >
                            {description}
                        </Typography.Paragraph>
                    );
                }}
            />
            <Table.Column
                title={t("products.fields.price")}
                dataIndex="price"
                key="price"
                align="right"
                sorter
                defaultSortOrder={getDefaultSortOrder("price", sorters)}
                render={(price: number) => {
                    return (
                        <NumberField
                            value={price}
                            style={{
                                width: "80px",
                                fontVariantNumeric: "tabular-nums",
                                whiteSpace: "nowrap",
                                fontWeight: "bold",
                            }}
                            options={{
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }}
                        />
                    );
                }}
            />
            <Table.Column
                title={t("Due Amount")}
                dataIndex="due_amount"
                key="due_amount"
                align="right"
                sorter
                //defaultSortOrder={getDefaultSortOrder("price", sorters)}

                render={(credit: number) => {
                    const formatOptions = {

                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    };

                    if (credit > 0) {
                        const formattedValue = `${credit.toLocaleString('en-LK', formatOptions)}`;
                        return (
                            <span
                                style={{
                                    width: "80px",
                                    fontVariantNumeric: "tabular-nums",
                                    whiteSpace: "nowrap",
                                    color: "lightgreen"
                                    , fontWeight: "bold",
                                }}
                            >
                <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>C</div>
                <div>
                {formattedValue}

                </div>

                </div>
              </span>
                        );
                    } else if (credit < 0) {
                        const formattedValue = `${Math.abs(credit).toLocaleString('en-LK', formatOptions)}`;
                        return (
                            <span
                                style={{
                                    width: "80px",
                                    fontVariantNumeric: "tabular-nums",
                                    whiteSpace: "nowrap",
                                    color: "red",
                                    fontWeight: "bold",
                                }}
                            >
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>D</div>
                <div>
                {formattedValue}

                </div>

                </div>


              </span>
                        );
                    } else {
                        return (
                            <span
                                style={{
                                    width: "80px",
                                    fontVariantNumeric: "tabular-nums",
                                    whiteSpace: "nowrap",
                                    color: "white"
                                }}
                            >
              -
              </span>)
                    }
                }}
            />
            <Table.Column
                title={t("Total Profit")}
                dataIndex="profit"
                key="profit"
                align="right"
                sorter
                //defaultSortOrder={getDefaultSortOrder("price", sorters)}

                render={(credit: number) => {
                    const formatOptions = {

                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    };

                    if (credit > 0) {
                        const formattedValue = `${credit.toLocaleString('en-LK', formatOptions)}`;
                        return (
                            <span
                                style={{
                                    width: "80px",
                                    fontVariantNumeric: "tabular-nums",
                                    whiteSpace: "nowrap",
                                    color: "cyan"
                                    , fontWeight: "bold",
                                }}
                            >
                <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>P</div>
                <div>
                {formattedValue}

                </div>

                </div>
              </span>
                        );
                    } else if (credit < 0) {
                        const formattedValue = `${Math.abs(credit).toLocaleString('en-LK', formatOptions)}`;
                        return (
                            <span
                                style={{
                                    width: "80px",
                                    fontVariantNumeric: "tabular-nums",
                                    whiteSpace: "nowrap",
                                    color: "orange",
                                    fontWeight: "bold",
                                }}
                            >
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>N</div>
                <div>
                {formattedValue}

                </div>

                </div>


              </span>
                        );
                    } else {
                        return (
                            <span
                                style={{
                                    width: "80px",
                                    fontVariantNumeric: "tabular-nums",
                                    whiteSpace: "nowrap",
                                    color: "white"
                                }}
                            >
              -
              </span>)
                    }
                }}
            />
            <Table.Column
                title={t("table.actions")}
                key="actions"
                fixed="right"
                align="center"
                render={(_, record: ISalesShow) => {
                    return (
                        <Button
                            icon={<EyeOutlined/>}
                            onClick={() => {
                                return go({
                                    to: `${showUrl("sales", record.id)}`,
                                    query: {
                                        to: pathname,
                                    },
                                    options: {
                                        keepQuery: true,
                                    },
                                    type: "replace",
                                });
                            }}
                        />
                    );
                }}
            />
        </Table>
    );
};
