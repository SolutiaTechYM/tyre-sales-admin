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
      quantity: 1000,
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
          {/* <View style={styles.headrContainer}> */}
            <View><Image src={tyreImage} style={styles.logo} /></View>
            <View><Text style={styles.title}>A.S.Enterprise</Text>
            {/* <Text style={styles.subtitle}>All kind of Tyre Repair and Factory Accessories</Text> */}
        
            <View style={styles.addressphone}>
            <View><Text style={styles.subtitleaddress}>No.135 ,Ihalagedara Watte,</Text>
            <Text style={styles.subtitleaddress}>Gonigoda, Medawala.</Text></View>
            <View style={styles.numbers}><View ><Text style={styles.subtitlenumtel}>Tel :</Text></View>
          <View><Text style={styles.subtitlenum}>077-4115018</Text>
            <Text style={styles.subtitlenum}>071-1067406</Text>
            <Text style={styles.subtitlenum}>081-2490568</Text></View>
            </View>
            </View>
            </View>
            {/* </View> */}

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
              <Text style={[styles.tableHeaderItem, { width: "5%" }]}>ID</Text>
              <Text style={[styles.tableHeaderItem, { width: "32%" }]}>
                Product Name
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "25%" }]}>
                Category
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "15%" }]}>
                Unit Price (LKR)
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "8%" }]}>
                Qty
              </Text>
              <Text style={[styles.tableHeaderItem, { width: "15%" }]}>
                Tot.price
              </Text>
            </View>
            {syntheticData.products.map((product) => (
              <View key={product.id} style={styles.tableRow}>
                <Text style={[styles.tableCol, { width: "5%" }]}>
                  {product.id}
                </Text>
                <Text style={[styles.tableCol, { width: "32%" }]}>
                  {product.name}
                </Text>
                <Text style={[styles.tableCol, { width: "25%" }]}>
                  {product.category}
                </Text>
                <Text style={[styles.tableCol, { width: "15%" }]}>
                  {product.unitPrice.toFixed(2)}
                </Text>
                <Text style={[styles.tableCol, { width: "8%" }]}>
                  {product.quantity}
                </Text>
                <Text style={[styles.tableCol, { width: "15%" }]}>
                  {(product.unitPrice * product.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

            </View>
            
            
          <View style={styles.footer}>
            {/* <Text style={styles.footerText}>All kind of Tyre Repair and Factory Accessories</Text>
             */}
                       <View style={styles.signatureContainer}>
              <Text style={styles.signatureText}>
                Signature: ________________
              </Text>
              <Text style={styles.signatureText}>
                Date: {todatdate}
              </Text>
            </View>
            <Text style={styles.footerText}>All kind of Tyre Repair and Factory Accessories</Text>
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
    justifyContent: "space-between",
    backgroundColor: "#FFA07A", // Coral orange shade
    padding: "16 80 16 80",
  },headrContainer:{
    justifyContent:"space-between"
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 16,
    
  },
  title: {
    fontSize: 33,
    fontWeight: "bold",
  },subtitle:{
    fontSize: 11,

  },subtitleaddress:{
    fontSize: 10,
    fontWeight: "bold",

  },subtitlenum:{
    fontSize: 10,

  },subtitlenumtel:{
    fontSize: 10,
    fontWeight: 900,

  },
  bodycontainer : {
    padding: "0.4in 0.4in 0.4in 0.4in",

  },addressphone:{
    display: "flex",
    flexDirection: "row",
    justifyContent:"space-between"

  },numbers:{  
     display: "flex",
  flexDirection: "row",
  justifyContent:"space-between"
}
  ,
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
    backgroundColor:"#D3D3D3",
    
  },
  tableHeaderItem: {
    paddingVertical: 8,
    border: "1px solid #000",
    borderBottom: "none",
    
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
  },
  tableCol: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    border: "1px solid #000",
    fontSize: 10,

  },
  footer: {
    marginTop: "auto",

    
  },
  footerText: {
    // color: "#787878",
    paddingTop: 8,

    borderTop: "1px solid #e5e5e5",

    lineHeight: 2,
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    
  },
  signatureContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"space-between",
    padding: "0.4in 0.4in 0.4in 0.4in",

  },
  totalContainer: {},
  signatureText: {
    marginTop: 32,
  },
});