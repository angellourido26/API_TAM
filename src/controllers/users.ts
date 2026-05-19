import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';

import { User } from '../models/user.model';

async function getAllUsers(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM usuarios', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo los usuarios:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getUserById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        const user: User | undefined = Array.isArray(result) && result.length > 0 ? result[0] as User : undefined;

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json(user);
    } catch (error) {
        console.error('Error obteniendo el usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createUser(req: Request, res: Response) {
    const data = req.body as User;

    if (!data.email || !data.password) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: email y password' });
    }

    try {
        const result = await db.query(
            `INSERT INTO usuarios 
            (nombre_completo, tipo_documento, identificacion, fecha_nacimiento, email, password, verificado, token_verificacion, user_name, foto_perfil, rol_id, estado, fecha_ultimo_intento) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.nombre_completo,
                data.tipo_documento,
                data.identificacion,
                data.fecha_nacimiento,
                data.email,
                data.password,
                data.verificado,
                data.token_verificacion,
                data.user_name,
                data.foto_perfil,
                data.rol_id,
                data.estado,
                data.fecha_ultimo_intento
            ]
        );

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando el usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateUser(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as User;

    try {
        let campos: string[] = [];
        let valores: any[] = [];

        if (data.nombre_completo !== undefined) {
            campos.push("nombre_completo = ?");
            valores.push(data.nombre_completo);
        }

        if (data.email !== undefined) {
            campos.push("email = ?");
            valores.push(data.email);
        }

        if (data.password !== undefined) {
            campos.push("password = ?");
            valores.push(data.password);
        }

        if (data.user_name !== undefined) {
            campos.push("user_name = ?");
            valores.push(data.user_name);
        }

        if (data.estado !== undefined) {
            campos.push("estado = ?");
            valores.push(data.estado);
        }

        if (data.fecha_ultimo_intento !== undefined) {
            campos.push("fecha_ultimo_intento = ?");
            valores.push(data.fecha_ultimo_intento);
        }

        if (campos.length === 0) {
            return res.status(400).json({ error: "No hay campos para actualizar" });
        }

        valores.push(id);

        const query = `
            UPDATE usuarios 
            SET ${campos.join(", ")} 
            WHERE id = ?
        `;

        const result = await db.query(query, valores);

        return res.json({ message: "Usuario actualizado correctamente" });

    } catch (error) {
        console.error('Error actualizando el usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteUser(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando el usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};