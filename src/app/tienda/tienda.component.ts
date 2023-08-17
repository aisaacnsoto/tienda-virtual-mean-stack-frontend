import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../services/carrito.service';
import { Producto } from '../models/producto.model';


@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private http: HttpClient, private carritoService: CarritoService) { }

  apiUrl = 'https://tienda-virtual-mean-stack-backend.onrender.com';

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.http.get<Producto[]>(this.apiUrl+'/api/productos')
      .subscribe(productos => this.productos = productos);
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto);
  }
}
