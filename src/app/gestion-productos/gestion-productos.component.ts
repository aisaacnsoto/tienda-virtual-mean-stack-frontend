import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/producto.model';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent implements OnInit {
  productos: Producto[] = [];

  apiUrl = 'http://localhost:3000';

  productoForm: FormGroup;

  nuevoProducto: Producto = {
    _id: '',
    nombre: '',
    precio: 0,
    descripcion: '',
    categoria: ''
  };

  productoSeleccionado: Producto | null = null;

  selectedFile: File | null = null;

  imagenURL: string | ArrayBuffer | null = null;

  constructor(
    private http: HttpClient, private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.productoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      descripcion: [''],
      categoria: ['']
    });

    this.obtenerProductos();
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];

      // Mostrar la vista previa de la imagen seleccionada
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenURL = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  obtenerProductos(): void {
    this.http.get<Producto[]>(this.apiUrl + '/api/productos')
      .subscribe(productos => this.productos = productos);
  }

  agregarProducto(): void {
    if (this.productoForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.productoForm.value.nombre);
    formData.append('precio', this.productoForm.value.precio);
    formData.append('descripcion', this.productoForm.value.descripcion);
    formData.append('categoria', this.productoForm.value.categoria);

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile, this.selectedFile.name);
    }

    this.http.post<Producto>(this.apiUrl + '/api/productos', formData)
      .subscribe(productoAgregado => {
        this.productos.push(productoAgregado);
        this.productoForm.reset();
        this.selectedFile = null;
        this.imagenURL = null;
      });
  }

  eliminarProducto(id: string): void {
    this.http.delete(this.apiUrl + `/api/productos/${id}`)
      .subscribe(() => {
        this.productos = this.productos.filter(producto => producto._id !== id);
        if (this.productoSeleccionado?._id === id) {
          this.cancelarEdicion();
        }
      });
  }

  actualizarProducto(id: string): void {
    if (this.productoForm.invalid) {
      return;
    }

    const productoActualizado: Producto = {
      _id: id,
      nombre: this.productoForm.value.nombre,
      precio: this.productoForm.value.precio,
      descripcion: this.productoForm.value.descripcion,
      categoria: this.productoForm.value.categoria
    };

    this.http.put<Producto>(`${this.apiUrl}/api/productos/${id}`, productoActualizado)
      .subscribe(producto => {
        const index = this.productos.findIndex(p => p._id === id);
        if (index !== -1) {
          this.productos[index] = producto;
        }
        this.productoForm.reset();
      });
  }

  mostrarDetalleProducto(producto: Producto): void {
    this.productoForm.setValue({
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      categoria: producto.categoria
    });
    this.productoSeleccionado = producto;
  }

  cancelarEdicion(): void {
    this.productoForm.reset();
    this.productoSeleccionado = null;
  }


}
