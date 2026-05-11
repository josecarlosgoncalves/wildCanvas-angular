import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { CartService } from './cart';

describe('Cart', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
