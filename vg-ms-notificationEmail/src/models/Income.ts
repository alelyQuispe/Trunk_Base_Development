import { Category } from "./Category";

export interface Income {
  correlative: string;
  emailUser: string;
  userName: string; 
  adminName: string; 
  categories: Category[]
  comment: string;
  statusPayment: string; 
}
