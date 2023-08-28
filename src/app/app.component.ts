import { Component, OnInit } from '@angular/core';
import { CarritoService } from './services/carrito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  cart: CarritoService;

  constructor(private _carritoService: CarritoService) { }

  ngOnInit(): void {
    this._carritoService.cargarDeLocalStorage();
    this.cart = this._carritoService;
  }
}
