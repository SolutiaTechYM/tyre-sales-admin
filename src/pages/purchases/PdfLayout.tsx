import {
  Document,
  Image,
  Page,
  StyleSheet,
  View,
  Text,
  PDFViewer,
} from "@react-pdf/renderer";
import tyreImage from "../../../src/images/icons8-tyre-64.png";
import { useEffect, useState } from "react";
import dayjs from "dayjs";



const syntheticData = {
  purchaseId: "PO-0123",
  supplierName: "Acme Tyre Suppliers",
  createdDate: "2023-05-11",
  note: "Please deliver the order within 7 business days.",
  totalPrice: 1250.75,
  dueBalance: 875.52,
  products: [
    {
      id: 1,
      name: "All-Season Radial Tyre",
      unitPrice: 75.99,
      quantity: 4,
      category: "Passenger Car Tyres",
    },
    {
      id: 2,
      name: "Off-Road Mud Tyre",
      unitPrice: 125.25,
      quantity: 2,
      category: "Truck & SUV Tyres",
    },
    {
      id: 3,
      name: "High-Performance Summer Tyre",
      unitPrice: 89.99,
      quantity: 8,
      category: "Passenger Car Tyres",
    },
  ],
};

export const PdfLayout: React.FC = () => {
  const [todatdate,settodaydate]=useState("");

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    settodaydate(today)
    // console.log("Today's date:", today);
  }, []);

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page style={styles.page} size="A4">
          <View style={styles.header}>
            <Image src={tyreImage} style={styles.logo} />
            <Text style={styles.title}>A.S.Enterprise</Text>
          </View>
          <View style={styles.bodycontainer}>


          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Purchase ID:</Text>
              <Text style={styles.infoValue}>{syntheticData.purchaseId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Supplier Name:</Text>
              <Text style={styles.infoValue}>{syntheticData.supplierName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created Date:</Text>
              <Text style={styles.infoValue}>{syntheticData.createdDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Note:</Text>
              <Text style={styles.infoValue}>{syntheticData.note}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Price:</Text>
              <Text style={styles.infoValue}>${syntheticData.totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Due Balance:</Text>
              <Text style={styles.infoValue}>${syntheticData.dueBalance.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderItem, { width: "10%" }]}>ID</Text>
              <Text style={[styles.tableHeaderItem, { width: "40%" }]}>
                Product Name
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "20%" }]}>
                Unit Price
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "15%" }]}>
                Quantity
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "15%" }]}>
                Category
              </Text>
            </View>
            {syntheticData.products.map((product) => (
              <View key={product.id} style={styles.tableRow}>
                <Text style={[styles.tableCol, { width: "10%" }]}>
                  {product.id}
                </Text>
                <Text style={[styles.tableCol, { width: "40%" }]}>
                  {product.name}
                </Text>
                <Text style={[styles.tableCol, { width: "20%" }]}>
                  ${product.unitPrice.toFixed(2)}
                </Text>
                <Text style={[styles.tableCol, { width: "15%" }]}>
                  {product.quantity}
                </Text>
                <Text style={[styles.tableCol, { width: "15%" }]}>
                  {product.category}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.signatureContainer}>
              <Text style={styles.signatureText}>
                Signature: ________________
              </Text>
              <Text style={styles.signatureText}>
                Date: {todatdate}
              </Text>
            </View>
            </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>"Footer one"</Text>
            <Text style={styles.footerText}>
            "Footer one2", "Footer one3"
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

const styles = StyleSheet.create({
  viewer: {
    paddingTop: 32,
    width: "100%",
    height: "80vh",
    border: "none",
  },
  page: {
    display: "flex",
    fontSize: 12,
    color: "#333",
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA07A", // Coral orange shade
    padding: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },bodycontainer : {
    padding: "0.4in 0.4in 0.4in 0.4in",

  },
  infoContainer: {
    marginBottom: 16,

  },
  infoRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  infoValue: {
    flexGrow: 1,
  },
  table: {
    marginTop: 32,
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
  },
  tableHeaderItem: {
    paddingVertical: 8,
    border: "1px solid #000",
    borderBottom: "none",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableCol: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    border: "1px solid #000",
  },
  footer: {
    borderTop: "1px solid #e5e5e5",
    paddingTop: 8,
    marginTop: "auto",
  },
  footerText: {
    color: "#787878",
    lineHeight: 1.5,
  },
  signatureContainer: {},
  totalContainer: {},
  signatureText: {
    marginTop: 32,
  },
});