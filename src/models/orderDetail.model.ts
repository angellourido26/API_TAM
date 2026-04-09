export interface OrderDetail {
    cantidad: number;
    valor_producto: number;
    iva_porcentaje: number;
    subtotal: number;
    iva: number;
    total: number;
    pedido_id: number;
    producto_id: number;
    created_at: Date;
    updated_at: Date;
}