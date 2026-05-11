import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { CustomerData, PaymentData } from '../../models/sale';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {
  cartService = inject(CartService);
  cartItems = this.cartService.getCartItems();
  totalItems = this.cartService.getTotalItems;
  totalPrice = this.cartService.getTotalPrice;
  checkoutStep = signal(1);
  orderFinished = signal(false);
  orderNumber = signal('');
  customer: CustomerData = {
    nome: '',
    email: '',
    telefone: '',
    morada: '',
    cidade: '',
    codigoPostal: '',
  };
  payment: PaymentData = {
    metodo: 'cartao',
    nomeCartao: '',
    numeroCartao: '',
    validade: '',
  };

  removeFromCart(productId: number | string) {
    this.cartService.removeFromCart(productId);
  }

  goToStep(step: number) {
    this.checkoutStep.set(step);
  }

  canContinueToCustomer(): boolean {
    return this.cartItems().length > 0;
  }

  canContinueToPayment(): boolean {
    return Boolean(
      this.customer.nome &&
        this.customer.email &&
        this.customer.telefone &&
        this.customer.morada &&
        this.customer.cidade &&
        this.customer.codigoPostal,
    );
  }

  canFinishOrder(): boolean {
    if (this.payment.metodo !== 'cartao') {
      return true;
    }

    return Boolean(this.payment.nomeCartao && this.payment.numeroCartao && this.payment.validade);
  }

  finishOrder() {
    if (!this.canFinishOrder()) {
      return;
    }

    const orderNumber = `WC-${Date.now().toString().slice(-6)}`;
    this.orderNumber.set(orderNumber);
    this.cartService.finalizeSale(orderNumber, this.customer, this.payment.metodo, () => {
      this.orderFinished.set(true);
      this.checkoutStep.set(4);
    });
  }
}
