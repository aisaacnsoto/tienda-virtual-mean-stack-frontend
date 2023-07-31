export interface Producto {
    _id: string;
    nombre: string;
    precio: number;
    descripcion: string;
    categoria: string;
    cantidad?: number;
    foto?: string;
}
