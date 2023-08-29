import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { Producto } from 'src/app/models/producto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  productosEnCarrito: Producto[] = [];
  displayedColumns: string[] = ['product_details', 'price', 'quantity', 'total', 'actions'];
  totalCompra: number = 0;

  customerForm: FormGroup;

  constructor(private carritoService: CarritoService, private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.obtenerProductosEnCarrito();
    this.calcularTotalCompra();
    this.inicializarCustomerForm();
  }

  inicializarCustomerForm(): void {
    this.customerForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
    })
  }

  obtenerProductosEnCarrito(): void {
    this.productosEnCarrito = this.carritoService.obtenerProductosEnCarrito();
  }

  eliminarDelCarrito(id: string): void {
    this.carritoService.eliminarDelCarrito(id);
    this.obtenerProductosEnCarrito();
    this.calcularTotalCompra();
  }

  ajustarCantidadProducto(id: string, cantidad: number): void {
    this.carritoService.ajustarCantidadProducto(id, cantidad);
    this.obtenerProductosEnCarrito();
    this.calcularTotalCompra();
  }

  calcularTotalCompra(): void {
    this.totalCompra = this.productosEnCarrito.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  }
}
