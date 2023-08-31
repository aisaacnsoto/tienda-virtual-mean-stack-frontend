import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../services/carrito.service';
import { Producto } from '../models/producto.model';
import { ProductoService } from '../services/producto.service';


@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private _productService: ProductoService, private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this._productService.getProducts()
      .subscribe(productos => this.productos = productos);
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto);
  }
}
