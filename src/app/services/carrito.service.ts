import { Injectable } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  productos: Producto[] = [];

  agregarAlCarrito(producto: Producto): void {
    const index = this.productos.findIndex(p => p._id === producto._id);
    if (index !== -1) {
      this.productos[index].cantidad += 1;
    } else {
      producto.cantidad = 1;
      this.productos.push(producto);
    }
    this.guardarEnLocalStorage();
  }

  eliminarDelCarrito(id: string): void {
    this.productos = this.productos.filter(producto => producto._id !== id);
    this.guardarEnLocalStorage();
  }

  obtenerProductosEnCarrito(): Producto[] {
    return this.productos;
  }

  ajustarCantidadProducto(id: string, cantidad: number): void {
    const index = this.productos.findIndex(p => p._id === id);
    if (index !== -1) {
      if (cantidad > 0) {
        this.productos[index].cantidad = cantidad;
      } else {
        this.eliminarDelCarrito(id);
      }
    }
    this.guardarEnLocalStorage();
  }

  vaciarCarrito(): void {
    this.productos = [];
    this.guardarEnLocalStorage();
  }

  guardarEnLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.productos));
  }

  cargarDeLocalStorage(): void {
    if (!localStorage.getItem('cart')) localStorage.setItem('cart', '[]');
    this.productos = JSON.parse(localStorage.getItem('cart'));
  }
}
