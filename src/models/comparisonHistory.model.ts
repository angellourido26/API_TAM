export interface ComparisonHistory {
    detalle_comparacion: string;
    producto_id_1: number;
    producto_id_2: number;
    producto_id_3?: number;
    usuario_id: number;
    created_at: Date;
    updated_at: Date;
}