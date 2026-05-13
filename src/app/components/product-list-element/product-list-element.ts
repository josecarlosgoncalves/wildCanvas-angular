import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list-element',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './product-list-element.html',
  styleUrl: './product-list-element.css',
})
export class ProductListElement {
  product = input.required<Product>();
  cartService = inject(CartService);
  productService = inject(ProductService);
  showModal = signal(false);

  titulo(): string {
    return this.product().titulo;
  }

  imagem(): string {
    return this.product().imagem;
  }

  autor(): string {
    return this.product().autor;
  }

  dataQuadro(): string {
    return this.product().dataQuadro;
  }

  descricao(): string {
    return this.product().descricao;
  }

  preco(): number {
    return this.product().preco;
  }

  quantidade(): number {
    return this.product().quantidade;
  }

  existeStock(): boolean {
    return this.quantidade() > 0;
  }

  disponibilidade(): string {
    return this.existeStock() ? 'Disponível' : 'Indisponível';
  }

  adicionarAoCarrinho(): void {
    if (this.existeStock()) {
      this.cartService.addToCart(this.product());
      this.productService.updateQuantidade(this.product().id, -1);
    } else {
      alert('Produto indisponível!');
    }
  }

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }
}
