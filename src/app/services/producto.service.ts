import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.BACKEND_URL;


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  
  constructor(private _http: HttpClient) { }

  getProducts(): Observable<Producto[]> {
    return this._http.get<Producto[]>(`${BACKEND_URL}/api/productos`);
  }

  getProduct(id: string): Observable<Producto> {
    return this._http.get<Producto>(`${BACKEND_URL}/api/productos/${id}`);
  }

  createProduct(data: Producto, file: File): Observable<Producto> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('precio', data.precio.toString());
    formData.append('descripcion', data.descripcion);
    formData.append('categoria', data.categoria);

    if (file) {
      formData.append('foto', file, file.name);
    }

    return this._http.post<Producto>(`${BACKEND_URL}/api/productos`, formData);
  }

  updateProduct(id: string, data: Producto) {
    return this._http.put(`${BACKEND_URL}/api/productos/${id}`, data);
  }

  deleteProduct(id: string) {
    return this._http.delete(`${BACKEND_URL}/api/productos/${id}`);
  }

}
