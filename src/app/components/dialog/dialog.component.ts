import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  title = 'Nuevo';
  buttonTitle = 'Guardar'
  editMode = false;

  productoForm: FormGroup;

  selectedFile: File | null = null;
  imagenURL: string | ArrayBuffer | null = null;

  constructor(
    private _dialogReference: MatDialogRef<DialogComponent>,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _crudService: ProductoService,
    @Inject(MAT_DIALOG_DATA) private _data: Producto
  ) { }

  ngOnInit(): void {
    this.productoForm = this._fb.group({
      nombre: ['', Validators.required ],
      precio: [0, Validators.required ],
      descripcion: ['', Validators.required ],
      categoria: ['', Validators.required ],
    });

    if (this._data) {
      this.productoForm.patchValue(this._data);
      this.title = 'Edición';
      this.buttonTitle = 'Editar'
      this.editMode = true;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
    });
  }

  onActionClick() {
    if (this.productoForm.valid) {
      this.editMode ? this.updateProduct() : this.saveProduct();
    }
  }

  saveProduct() {
    this._crudService.createProduct(this.productoForm.value, this.selectedFile)
      .subscribe({
        next: (data) => this.handleResponse('Registrado correctamente!', 'OK', 'creado'),
        error: (err) => this.handleError(err)
      });
  }

  updateProduct() {
    this._crudService.updateProduct(this._data._id, this.productoForm.value).subscribe({
      next: (data) => this.handleResponse('¡Editado correctamente!', 'OK', 'editado'),
      error: (err) => this.handleError(err)
    });
  }

  handleResponse(message: string, buttonTitle: string, tag: string) {
    this.productoForm.reset();
    this.selectedFile = null;
    this.imagenURL = null;
    this.openSnackBar(message, buttonTitle);
    this._dialogReference.close(tag);
  }

  handleError(err) {
    console.log(err);
    this.openSnackBar(`No se pudo ${this.buttonTitle.toLowerCase()}`, 'OK');
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

}
