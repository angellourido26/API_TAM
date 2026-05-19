export interface Product {
    nombre: string;
    precio: number;
    marca?: string;
    descripcion: string;
    caracteristicas_tecnicas: object;
    imagen?: string;
    stock: number;
    costo: number;
    subcategoria_id: number;
    created_at: Date;
    updated_at: Date;
}