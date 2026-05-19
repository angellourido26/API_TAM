export interface Calification {
    id?: number;
    estado?: 'aprobado' | 'no_aprobado';
    puntuacion?: number;
    comentario?: string;
    imagen?: string;
    producto_id: number;
    usuario_id?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
}