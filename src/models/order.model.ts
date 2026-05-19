export interface Order {
    cod_factura: number;
    canal_venta: string;
    valor: number;
    estado: string;
    usuario_id: number;
    created_at: Date;
    updated_at: Date;
}