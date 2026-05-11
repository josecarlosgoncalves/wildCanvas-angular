import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';
import { CustomerData, Sale, SaleCreate } from '../models/sale';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private salesUrl = 'http://localhost:3000/vendas';
  private cartItems = signal<CartItem[]>([]);
  private soldItems = signal<Record<string, number>>({});
  private sales = signal<Sale[]>([]);

  constructor() {
    this.loadSales();
  }

  getCartItems() {
    return this.cartItems.asReadonly();
  }

  loadSales() {
    this.http.get<Sale[]>(this.salesUrl).subscribe({
      next: (sales) => {
        this.sales.set(sales);
        this.rebuildSoldItems(sales);
      },
      error: () => {
        this.sales.set([]);
        this.soldItems.set({});
      },
    });
  }

  addToCart(product: Product) {
    this.cartItems.update((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      } else {
        return [...items, { product, quantity: 1 }];
      }
    });
  }

  removeFromCart(productId: number | string) {
    this.cartItems.update((items) => items.filter((item) => item.product.id !== productId));
  }

  finalizeSale(
    orderNumber: string,
    customer: CustomerData,
    paymentMethod: string,
    onSuccess: () => void,
  ) {
    const saleItems = this.cartItems();
    const total = saleItems.reduce((sum, item) => sum + item.product.preco * item.quantity, 0);

    const sale: SaleCreate = {
      orderNumber,
      customer: { ...customer },
      paymentMethod,
      date: new Date().toISOString(),
      items: saleItems.map((item) => ({ product: item.product, quantity: item.quantity })),
      total,
    };

    this.http.post<Sale>(this.salesUrl, sale).subscribe({
      next: (createdSale) => {
        this.sales.update((sales) => [...sales, createdSale]);
        this.addSoldItems(createdSale.items);
        this.clearCart();
        onSuccess();
      },
      error: () => {
        alert('Não foi possível guardar a compra na base de dados. Verifique se o json-server está ligado.');
      },
    });
  }

  clearCart() {
    this.cartItems.set([]);
  }

  getSoldQuantity(productId: number | string) {
    return this.soldItems()[String(productId)] ?? 0;
  }

  getSales() {
    return this.sales.asReadonly();
  }

  getProductSales(productId: number | string) {
    return this
      .sales()
      .filter((sale) => sale.items.some((item) => item.product.id === productId));
  }

  private addSoldItems(items: CartItem[]) {
    this.soldItems.update((soldItems) => {
      const updatedSoldItems = { ...soldItems };

      for (const item of items) {
        const productId = String(item.product.id);
        updatedSoldItems[productId] = (updatedSoldItems[productId] ?? 0) + item.quantity;
      }

      return updatedSoldItems;
    });
  }

  private rebuildSoldItems(sales: Sale[]) {
    const soldItems: Record<string, number> = {};

    for (const sale of sales) {
      for (const item of sale.items) {
        const productId = String(item.product.id);
        soldItems[productId] = (soldItems[productId] ?? 0) + item.quantity;
      }
    }

    this.soldItems.set(soldItems);
  }

  getTotalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0),
  );

  getTotalPrice = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.preco * item.quantity, 0),
  );
}
