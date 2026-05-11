import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProductListElement } from './product-list-element';
import { Product } from '../../models/product';

describe('ProductListElement', () => {
  let component: ProductListElement;
  let fixture: ComponentFixture<ProductListElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListElement],
      providers: [provideHttpClient()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListElement);
    const product: Product = {
      id: 1,
      imagem: '/images/Produto_01.jpg',
      titulo: 'Produto Teste',
      descricao: 'Descrição de teste',
      quantidade: 2,
      preco: 10,
    };
    fixture.componentRef.setInput('product', product);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
