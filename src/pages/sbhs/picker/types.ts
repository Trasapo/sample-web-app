export interface Package {
  id: string;
  trackingNumber: string;
  deliveryDate: string;
  recipient: string;
  address: string;
  productName: string;
  quantity: number;
  assignedTo: string;
  picked: boolean;
}

export interface User {
  id: string;
  name: string;
  authority: number;
}
