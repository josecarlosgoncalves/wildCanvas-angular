import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { ProductList } from './components/product-list/product-list';
import { CartComponent } from './components/cart/cart';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'gallery', component: ProductList },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminComponent },
];
