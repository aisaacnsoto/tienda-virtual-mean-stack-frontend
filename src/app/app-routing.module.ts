import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaComponent } from './tienda/tienda.component';
import { GestionProductosComponent } from './gestion-productos/gestion-productos.component';
import { CarritoComponent } from './carrito/carrito.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';

const routes: Routes = [
  { path: '', component: TiendaComponent },
  { path: 'productos', component: GestionProductosComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'checkout', component: CheckoutPageComponent },
  { path: 'confirmation', component: ConfirmationPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
