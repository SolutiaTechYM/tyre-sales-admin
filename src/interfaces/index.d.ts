import { Dayjs } from "dayjs";

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

export interface ISalesChart {
  date: string;
  title?: "Order Count" | "Order Amount";
  value: number;
}

// export interface IOrderStatus {
//   id: number;
//   text: "Pending" | "Ready" | "On The Way" | "Delivered" | "Cancelled";
// }

export interface IUser {
  id: number;
  name: string;
  company: string;
  contact: string;
  address: string;
  dueAmount: number;
  lastOrderDate: string;
  createdAt: string;
 
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
export interface IPurchase {
  id: number;
  createdAt: string;
  rowdata:RowData[];
}
interface RowData {
  // suppliername: string | number;
  product: string | number;
  description: string;
  quantity: number;
  unitprice: number;
  // totalprice: number;
  // payment: number;
}


export interface IProduct {
  id: number;
  code: string;
  name: string;
  images: IFile & { thumbnailUrl?: string };
  curr_price: number;
  category: {
    id: number;
  };
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





export interface Iiepd {
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

export interface IFile {
  name: string;
  percent: number;
  size: number;
  status: "error" | "success" | "done" | "uploading" | "removed";
  type: string;
  uid: string;
  url: string;
}

// export interface IEvent {
//   date: string;
//   status: string;
// }

export interface ITransaction {
  type: any;
  id: number;
  date: string;
  
  value: number;
  
  dueamount: number;
}

export interface IStore {
  id: number;
  title: string;
  isActive: boolean;
  createdAt: string;
  gsm: string;
  email: string;
  address: IAddress;
  products: IProduct[];
}

// export interface ICourierStatus {
//   id: number;
//   text: "Available" | "Offline" | "On delivery";
// }

export interface ICourier {
  id: number;
  name: string;
  surname: string;
  email: string;
  gender: string;
  gsm: string;
  createdAt: string;
  accountNumber: string;
  licensePlate: string;
  address: string;
  avatar: IFile[];
  store: IStore;
  status: ICourierStatus;
  vehicle: IVehicle;
}

export interface IOrder {
  id: number;
  user: IUser;
  createdAt: string;
  products: IProduct[];
  status: IOrderStatus;
  adress: IAddress;
  store: IStore;
  courier: ICourier;
  events: IEvent[];
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
  avatar: IFile & { thumbnailUrl?: string };
  name: string;
  phone: string;
  contact_person: string;
  address: string;
  dueAmount: number;
  lastOrderDate: string;
  createdAt: string;
}


export interface IPurchase{
  id: number;
  date: string;
  supplier: string;
  description: string;
  price: string;
  due_amount:string
  createdAt: string;
}

export interface ICategory {
  id: number;
  title: string;
  description: string;
}

// export interface IOrderFilterVariables {
//   q?: string;
//   store?: string;
//   user?: string;
//   createdAt?: [Dayjs, Dayjs];
//   status?: string;
// }

export interface IUserFilterVariables {
  q: string;
  status: boolean;
  createdAt: [Dayjs, Dayjs];
  gender: string;
  isActive: boolean;
}

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
