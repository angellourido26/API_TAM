export interface Order {
    cod_factura: number;
    fecha: Date;
    canal_venta: string;
    valor: number;
    usuario_id: number;
    created_at: Date;
    updated_at: Date;
}