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
  sales = this.cartService.getSales();
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
  totalVendas = computed(() => this.sales().length);
  receitaTotal = computed(() => this.sales().reduce((total, sale) => total + sale.total, 0));
  ticketMedio = computed(() =>
    this.totalVendas() > 0 ? this.receitaTotal() / this.totalVendas() : 0,
  );
  totalProdutosVendidos = computed(() =>
    this.sales().reduce(
      (total, sale) => total + sale.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    ),
  );
  vendasPorProduto = computed(() => {
    const totals = new Map<string, { titulo: string; quantidade: number; receita: number }>();

    for (const sale of this.sales()) {
      for (const item of sale.items) {
        const productId = String(item.product.id);
        const current = totals.get(productId) ?? {
          titulo: item.product.titulo,
          quantidade: 0,
          receita: 0,
        };

        current.quantidade += item.quantity;
        current.receita += item.product.preco * item.quantity;
        totals.set(productId, current);
      }
    }

    return [...totals.values()].sort((a, b) => b.quantidade - a.quantidade);
  });
  maxQuantidadeVendida = computed(() =>
    Math.max(1, ...this.vendasPorProduto().map((product) => product.quantidade)),
  );
  isAuthenticated = signal(false);
  password = signal('');
  imagePreview = signal('');
  editingProductId = signal<number | string | null>(null);
  editingProduct: Product = {
    id: '',
    imagem: '',
    titulo: '',
    autor: '',
    dataQuadro: '',
    descricao: '',
    quantidade: 0,
    preco: 0,
  };
  newProduct: ProductCreate = {
    imagem: '',
    titulo: '',
    autor: '',
    dataQuadro: '',
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

  isEditing(productId: number | string): boolean {
    return this.editingProductId() === productId;
  }

  startEdit(product: Product) {
    this.editingProductId.set(product.id);
    this.editingProduct = { ...product };
  }

  cancelEdit() {
    this.editingProductId.set(null);
  }

  saveEdit() {
    if (
      !this.editingProduct.titulo ||
      !this.editingProduct.autor ||
      !this.editingProduct.dataQuadro ||
      !this.editingProduct.imagem ||
      !this.editingProduct.descricao ||
      this.editingProduct.quantidade < 0 ||
      this.editingProduct.preco <= 0
    ) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    this.productService.updateProduct(this.editingProduct);
    this.cancelEdit();
  }

  removeProduct(product: Product) {
    const canRemove = confirm(`Remover o produto "${product.titulo}"?`);

    if (canRemove) {
      this.productService.removeProduct(product.id);
    }
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

  larguraBarra(quantidade: number): string {
    return `${(quantidade / this.maxQuantidadeVendida()) * 100}%`;
  }

  produtosDaVenda(sale: Sale): string {
    return sale.items.map((item) => `${item.product.titulo} (${item.quantity})`).join(', ');
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.newProduct.imagem = `/images/${file.name}`;
    this.imagePreview.set(URL.createObjectURL(file));
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
      this.newProduct.autor &&
      this.newProduct.dataQuadro &&
      this.newProduct.imagem &&
      this.newProduct.descricao &&
      this.newProduct.quantidade >= 0 &&
      this.newProduct.preco > 0
    ) {
      this.productService.addProduct(this.newProduct);
      this.newProduct = {
        imagem: '',
        titulo: '',
        autor: '',
        dataQuadro: '',
        descricao: '',
        quantidade: 0,
        preco: 0,
      };
      this.imagePreview.set('');
      alert('Produto adicionado com sucesso!');
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  }
}
