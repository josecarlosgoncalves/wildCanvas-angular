import { Component, OnInit, inject, computed } from '@angular/core';
import { ProductListElement } from '../product-list-element/product-list-element';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list',
  imports: [ProductListElement],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  productService = inject(ProductService);
  products = this.productService.getProducts();

  stockTotal = computed(() => this.products().reduce((total, p) => total + p.quantidade, 0));

  ngOnInit(): void {
    this.productService.loadProducts();
  }
}
