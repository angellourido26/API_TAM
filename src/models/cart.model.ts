export interface Cart {
    id?: number;
    usuario_id: number;
    /** 1 = abierto, 0 = cerrado */
    activo: number; 
    created_at?: Date | string;
    updated_at?: Date | string;
}