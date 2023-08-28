import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Producto } from 'src/app/models/producto.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../components/dialog/dialog.component';
import { ProductoService } from '../services/producto.service';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent implements OnInit {
  productos: Producto[] = [];
  displayedColumns: string[] = ['foto', 'nombre', 'precio', 'descripcion', 'categoria', 'acciones'];

  constructor(
    private _productService: ProductoService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }
  
  onCreateClick() {
    this.openDialog();
  }

  onEditClick(producto: Producto) {
    this.openDialog(producto);
  }

  onDeleteClick(id: string) {
    this.eliminarProducto(id);
  }

  openDialog(producto?: Producto) {
    this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '300px',
      data: producto
    }).afterClosed().subscribe(result => {
      if (result === 'editado' || result === 'creado') {
        this.obtenerProductos();
      }
    });
  }

  obtenerProductos(): void {
    this._productService.getProducts().subscribe(productos => this.productos = productos);
  }

  eliminarProducto(id: string): void {
    this._productService.deleteProduct(id)
      .subscribe(() => {
        this.productos = this.productos.filter(producto => producto._id !== id);
      });
  }

}
