import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { Producto } from 'src/app/models/producto.model';
import { loadScript } from '@paypal/paypal-js';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const PAYPAL_CLIENT_ID = environment.PAYPAL_CLIENT_ID;
const BACKEND_URL = environment.BACKEND_URL;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  productosEnCarrito: Producto[] = [];
  displayedColumns: string[] = ['product_details', 'price', 'quantity', 'total', 'actions'];
  totalCompra: number = 0;

  constructor(private carritoService: CarritoService, private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerProductosEnCarrito();
    this.calcularTotalCompra();
    this.cargatBotonPaypal();
  }

  cargatBotonPaypal() {
    if (this.carritoService.productos.length == 0) return;
    loadScript({ clientId: PAYPAL_CLIENT_ID })
      .then((paypal) => {
        paypal
          .Buttons({
            createOrder: (data, actions) => {
              return fetch(`${BACKEND_URL}/api/payments/create`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  total: this.totalCompra
                }),
              })
                .then((response) => response.json())
                .then((order) => order.id);
            },
            onApprove: (data, actions) => {
              return fetch(`${BACKEND_URL}/api/payments/execute`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderID: data.orderID
                })
              })
                .then((response) => response.json())
                .then((orderData) => {
                  const transaction = orderData.purchase_units[0].payments.captures[0];
                  console.log(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
                });
            },
          })
          .render("#paypal-buttons")
          .catch((error) => {
            console.error("failed to render the PayPal Buttons", error);
          });
      })
      .catch((error) => {
        console.error("failed to load the PayPal JS SDK script", error);
      });
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
