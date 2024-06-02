// import { Dayjs } from "dayjs";

// export interface IOrderChart {
//   count: number;
//   status:
//     | "waiting"
//     | "ready"
//     | "on the way"
//     | "delivered"
//     | "could not be delivered";
// }

// export interface IOrderTotalCount {
//   total: number;
//   totalDelivered: number;
// }
export enum TradeType {
  PURCHASE,
  SALE,
  CAPITAL,
}

export interface ISalesChart {
  date: string;
  title?: "Order Count" | "Order Amount";
  value: number;
}

// export interface IOrderStatus {
//   id: number;
//   text: "Pending" | "Ready" | "On The Way" | "Delivered" | "Cancelled";
// }

// export interface IUser {
//   id: number;
//   name: string;
//   company: string;
//   contact: string;
//   address: string;
//   dueAmount: number;
//   lastOrderDate: string;
//   createdAt: string;
 
// }



export interface ICustomer {
  id: number;
  name: string;
  company: string;
  contact: string;
  address: string;
  dueAmount: number;
  lastOrderDate: string;
  createdAt: string;
  avatar: IFile & { thumbnailUrl?: string }[];
  trades:ITrades[];
}

export interface ITrades {
  id: number;
  date: string;
  value: number;
  dueAmount: number;
  description?: string;
}

// export interface IUser {
//   id: number;
//   firstName: string;
//   lastName: string;
//   fullName: string;
//   company: string;
//   contact: string;
//   address: string;
//   isActive: boolean;
 
// }


// export interface IPurchase {
//   id: number;
//   createdAt: string;
//   name: string;
//   price: number;
//   credit: number;
//   description:description;
// }
// export interface IPurchase {
//   id: number;
//   createdAt: string;
//   description: string;
//   due_amount:number;
//   price:number;
//   rowdata:IPurchaseProduct[];
// }
// interface RowData {
//   // suppliername: string | number;
//   productID: string | number;
//   quantity: number;
//   unitprice: number;
//   totalprice: number;
//   // payment: number;
// }


export interface IPurchaseCreate{
  totalPrice: number;
  payment: number;
  supplierId: number;
  description?: string;
  purchaseDetails: IPurchaseProduct[];
}
export interface IPurchaseProduct{
  productID: string | number;
  categoryID?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ISales {
  totalPrice: number;
  payment: number;
  customerId: number;
  description?: string;

  rowdata:RowDatasale[];
}
export interface RowDatasale {
  name: string;
  productID:  number;
  stockID:  number; // Change the type to string | number
  quantity:  number;
  unitBuyPrice: string | number;
  unitSellPrice: number;
  totalPrice: number;
}



export interface ISalesShow {
  // id: number;
  // createdAt: string;
  id: number;
  date: string;
  description: string;
  due_amount:number;
  price:number;
  customer:string;

  saleDetails:RowDatasaleshow[];
}
export interface RowDatasaleshow {
  name: string;
  productID: string | number;
  stockID: string | number; // Change the type to string | number
  productCode:string;
productName:string;
  quantity:  number;
  unitBuyPrice: string | number;
  unitSellPrice: number;
  totalPrice: number;
}

export interface IPaymentTable {
  // id: number;
  // createdAt: string;
  id: number;
  date: string;
  description: string;
  dueAmount:number;
  value:number;
  

}


// export interface IProduct {
//   id: number;
//   code: string;
//   name: string;
//   images: IFile & { thumbnailUrl?: string }[];
//   curr_price: number;
//   category: {
//     id: number;
//     title: string;
//   };
// }

export interface IProduct {
  id: number;
  name: string;
  code: string;
  description: string;
  images?: (IFile & { thumbnailUrl?: string })[];
  createdAt: string;
  category: {
      id: number;
      title?: string;
  };
  current_price: number;
  stocks: IStock[];
}


export interface IInvoice {
  contact: number;
  company: string;
  name: string;

 id: number | string;
  images: IFile & { thumbnailUrl?: string };
  curr_price: number;
  category: {
    id: number;
  };
}


export interface IStock {
  id: number | any;
  quantity: number;
  unitBuyPrice: number;
  date:string;
  supplier:string;
  
}





export interface ISummary {
  income:number;
  expense:number;
  profit:number;
  dueamount:number
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

// export interface IAddress {
//   text: string;
//   coordinate: [number, number];
// }

// export interface IFile {
//   name: string;
//   percent: number;
//   size: number;
//   status: "error" | "success" | "done" | "uploading" | "removed";
//   type: string;
//   uid: string;
//   url: string;
// }



export interface IFile {
  uid?: string;
  name?: string;
  percent?: number;
  size?: number;
  status?: "error" | "success" | "done" | "uploading" | "removed";
  type?: string;
  url: string;
  response?: {
      url?: string;
  };
}


// export interface IEvent {
//   date: string;
//   status: string;
// }

// export interface ITransaction {
//   type: any;
//   id: number;
//   date: string;
  
//   value: number;
  
//   dueamount: number;
// }


// Customer and Supplier interfaces
interface ICustomerOrSupplier {
  id: string;
  name: string;
}

// Transaction interface
export interface ITransaction {
  id: string;
  type: TradeType;
  amount?: number; // Required for "capital" type
  customerId?: string; // Required for "sell" type
  supplierId?: string; // Required for "purchase" type
  transactions?: ITransactionDetail[];
}

// Transaction detail interface
interface ITransactionDetail {
  id: string;
  dueAmount: number;
  payment: number;
}
// export interface ITransaction {
//   type: "purchase" | "sale";
//   id: number;
//   date: string;
//   value: number;
//   dueamount: number;
// }

export interface ITransactionlist {
  id: number;
  date: string;
  value: number;
  type: TradeType;
  description?: string;
  connection: {
      id?: number,
      name: string
  };
  tradeID: number
}

export interface ITransactionCreate {
  type: TradeType;
  transactions: ITransactionCreateDetail[];
}

export interface ITransactionCreateDetail {
  tradeID?: number;
  amount: number;
}


// export interface IStore {
//   id: number;
//   title: string;
//   isActive: boolean;
//   createdAt: string;
//   gsm: string;
//   email: string;
//   address: IAddress;
//   products: IProduct[];
// }

// export interface ICourierStatus {
//   id: number;
//   text: "Available" | "Offline" | "On delivery";
// }

// export interface ICourier {
//   id: number;
//   name: string;
//   surname: string;
//   email: string;
//   gender: string;
//   gsm: string;
//   createdAt: string;
//   accountNumber: string;
//   licensePlate: string;
//   address: string;
//   avatar: IFile[];
//   store: IStore;
//   status: ICourierStatus;
//   vehicle: IVehicle;
// }

export interface IOrder {
  id: number;
  customer: ICustomer;
  createdAt: string;
  products: IProduct[];
  // status: IOrderStatus;
  // adress: IAddress;
  // store: IStore;
  // courier: ICourier;
  // events: IEvent[];
  orderNumber: number;
  amount: number;
}
// export interface ICustomer {
//   id: number;
//   name: string;
//   code: string;

//   isActive: boolean;
//   description: string;
//   images: (IFile & { thumbnailUrl?: string })[];
//   createdAt: string;
//   price: number;
//   category: {
//     id: number;
//   };
//   stock: number;
// }

export interface ISupplier{
  id: number;
  avatar: IFile & { thumbnailUrl?: string }[];
  name: string;
  phone: string;
  contact_person: string;
  address: string;
  dueAmount: number;
  lastOrderDate: string;
  createdAt: string;
  trades:ITrades[];

}


export interface IPurchase{
  id: number;
  date: string;
  supplier: string;
  description: string;
  price: number;
  due_amount:number
  // createdAt: string;
purchaseDetails: IPurchaseProductshow[];

}


interface IPurchaseProductshow{
  productID: string | number;
  productCode:string;
  productName:string;
  categoryID?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}


// export interface ICategory {
//   id: number;
//   title: string;
//   description: string;
//   quantity: number;
//   createdAt: string;
//   updatedAt: string;
// }



export interface ICategory {
  id: number;
  title: string;
  products?: {
      id: number;
      name: string;
      images?: (IFile & { thumbnailUrl?: string })[];
  }[];
  description?: string;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

// export interface IOrderFilterVariables {
//   q?: string;
//   store?: string;
//   user?: string;
//   createdAt?: [Dayjs, Dayjs];
//   status?: string;
// }

// export interface IUserFilterVariables {
//   q: string;
//   status: boolean;
//   createdAt: [Dayjs, Dayjs];
//   gender: string;
//   isActive: boolean;
// }

// export interface IReview {
//   id: number;
//   order: IOrder;
//   user: IUser;
//   star: number;
//   createDate: string;
//   status: "pending" | "approved" | "rejected";
//   comment: string[];
// }

// export type IVehicle = {
//   model: string;
//   vehicleType: string;
//   engineSize: number;
//   color: string;
//   year: number;
//   id: number;
// };

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}


