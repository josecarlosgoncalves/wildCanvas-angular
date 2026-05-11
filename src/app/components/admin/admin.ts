import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { Product, ProductCreate } from '../../models/product';
import { CartService } from '../../services/cart';
import { Sale } from '../../models/sale';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  products = this.productService.getProducts();
  cartItems = this.cartService.getCartItems();
  totalStock = computed(() =>
    this.products().reduce((total, product) => total + product.quantidade, 0),
  );
  totalNoCarrinho = this.cartService.getTotalItems;
  produtosDisponiveis = computed(() =>
    this.products().filter((product) => product.quantidade > 0).length,
  );
  produtosIndisponiveis = computed(() =>
    this.products().filter((product) => product.quantidade === 0).length,
  );
  isAuthenticated = signal(false);
  password = signal('');
  newProduct: ProductCreate = {
    imagem: '',
    titulo: '',
    descricao: '',
    quantidade: 0,
    preco: 0,
  };

  ngOnInit(): void {
    this.productService.loadProducts();
    this.cartService.loadSales();
  }

  disponibilidade(product: Product): string {
    return product.quantidade > 0 ? 'Disponível' : 'Não disponível';
  }

  quantidadeNoCarrinho(productId: number | string): number {
    return this.cartItems().find((item) => item.product.id === productId)?.quantity ?? 0;
  }

  produtosVendidos(productId: number | string): number {
    return this.cartService.getSoldQuantity(productId);
  }

  detalhesVendas(productId: number | string): Sale[] {
    return this.cartService.getProductSales(productId);
  }

  quantidadeVendidaNaCompra(sale: Sale, productId: number | string): number {
    return sale.items.find((item) => item.product.id === productId)?.quantity ?? 0;
  }

  valorVendidoNaCompra(sale: Sale, productId: number | string): number {
    const item = sale.items.find((saleItem) => saleItem.product.id === productId);
    return item ? item.product.preco * item.quantity : 0;
  }

  checkPassword() {
    if (this.password() === 'admin123') {
      this.isAuthenticated.set(true);
    } else {
      alert('Palavra-passe incorreta.');
    }
  }

  addProduct() {
    if (
      this.newProduct.titulo &&
      this.newProduct.imagem &&
      this.newProduct.descricao &&
      this.newProduct.quantidade >= 0 &&
      this.newProduct.preco > 0
    ) {
      this.productService.addProduct(this.newProduct);
      this.newProduct = {
        imagem: '',
        titulo: '',
        descricao: '',
        quantidade: 0,
        preco: 0,
      };
      alert('Produto adicionado com sucesso!');
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  }
}
