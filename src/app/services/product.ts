import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Product, ProductCreate, ProductQuantidadeUpdate } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/produtos';
  private fallbackProducts: Product[] = [
    {
      id: 1,
      imagem: '/images/Produto_01.jpg',
      titulo: 'Cão',
      descricao: 'Pintura expressiva com tons vibrantes, ideal para dar vida a qualquer espaço.',
      quantidade: 4,
      preco: 100,
    },
    {
      id: 2,
      imagem: '/images/Produto_02.jpg',
      titulo: 'Dragão',
      descricao: 'Obra de fantasia com detalhes intensos e uma presença visual marcante.',
      quantidade: 2,
      preco: 75,
    },
    {
      id: 3,
      imagem: '/images/Produto_03.jpg',
      titulo: 'Dragão',
      descricao: 'Peça artística com composição dinâmica, perfeita para ambientes criativos.',
      quantidade: 4,
      preco: 80,
    },
  ];
  private products = signal<Product[]>(this.fallbackProducts);

  getProducts() {
    return this.products.asReadonly();
  }

  loadProducts() {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: () => {
        this.products.set(this.fallbackProducts);
      },
    });
  }

  addProduct(product: ProductCreate) {
    const productData: ProductCreate = {
      imagem: product.imagem,
      titulo: product.titulo,
      descricao: product.descricao,
      quantidade: product.quantidade,
      preco: product.preco,
    };

    this.http.post<Product>(this.apiUrl, productData).subscribe({
      next: (createdProduct) => {
        this.products.update((products) => [...products, createdProduct]);
      },
      error: () => {
        alert('Não foi possível adicionar o produto. Verifique se o json-server está ligado.');
      },
    });
  }

  updateQuantidade(id: number | string, quantidadeChange: number) {
    const product = this.products().find((p) => p.id === id);

    if (!product) {
      return;
    }

    const quantidade = product.quantidade + quantidadeChange;

    const quantidadeUpdate: ProductQuantidadeUpdate = { quantidade };

    this.http.patch<Product>(`${this.apiUrl}/${id}`, quantidadeUpdate).subscribe({
      next: (updatedProduct) => {
        this.products.update((products) =>
          products.map((p) => (p.id === id ? updatedProduct : p)),
        );
      },
      error: () => {
        alert('Não foi possível atualizar a quantidade. Verifique se o json-server está ligado.');
      },
    });
  }
}
