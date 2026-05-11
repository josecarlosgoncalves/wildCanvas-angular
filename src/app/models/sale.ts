import { CartItem } from './cart-item';

export interface CustomerData {
  nome: string;
  email: string;
  telefone: string;
  morada: string;
  cidade: string;
  codigoPostal: string;
}

export interface PaymentData {
  metodo: string;
  nomeCartao: string;
  numeroCartao: string;
  validade: string;
}

export interface Sale {
  id?: number | string;
  orderNumber: string;
  customer: CustomerData;
  paymentMethod: string;
  date: string;
  items: CartItem[];
  total: number;
}

export interface SaleCreate {
  orderNumber: string;
  customer: CustomerData;
  paymentMethod: string;
  date: string;
  items: CartItem[];
  total: number;
}
