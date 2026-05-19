export interface CartDetail {
    id?: number;
    carrito_id: number;
    producto_id: number;
    cantidad: number;
    subtotal?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
}