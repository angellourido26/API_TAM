export interface User {
    nombre_completo: string;
    tipo_documento: string;
    identificacion: string;
    fecha_nacimiento: Date;
    email: string;
    password: string;
    verificado: number;
    token_verificacion?: string;
    user_name: string;
    foto_perfil?: string;
    rol_id: number;
    estado: number;
    fecha_ultimo_intento?: Date;
    created_at: Date;
    updated_at: Date;
}