export interface UserPaymentMethod {
    usuario_id: number;
    tipo: string;
    numero_parcial: string;
    titular: string;
    fecha_expiracion: Date;
    created_at: Date;
    updated_at: Date;
}