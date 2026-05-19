import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { phoneUser } from '../models/phoneUsers.model';


async function getAllphoneUsers(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM telefono_usuarios', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo usuarios de teléfono:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getphoneUserById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);
    try {
        const result = await db.query('SELECT * FROM telefono_usuarios WHERE id = ?', [id]);
        const phoneUser = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!phoneUser) {
            return res.status(404).json({ error: 'Usuario de teléfono no encontrado' });
        }

        return res.json(phoneUser);
    } catch (error) {
        console.error('Error obteniendo usuario de teléfono:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createphoneUser(req: Request, res: Response): Promise<Response | void> {
    const data = req.body as phoneUser;

    if (!data.usuario_id || !data.telefono) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            'INSERT INTO telefono_usuarios (usuario_id, telefono) VALUES (?, ?)',
            [
                data.usuario_id,
                data.telefono
            ]
        );
        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando usuario de teléfono:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updatephoneUser(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as phoneUser;

    try {
        const result = await db.query(
            'UPDATE telefono_usuarios SET usuario_id = ?, telefono = ? WHERE id = ?',
            [data.usuario_id, data.telefono, id]
        );

        if (!result) {
            return res.status(404).json({ error: 'Usuario de teléfono no encontrado' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando usuario de teléfono:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deletephoneUser(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM telefono_usuarios WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Usuario de teléfono no encontrado' });
        }

        return res.json({ message: 'Usuario de teléfono eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando usuario de teléfono:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllphoneUsers,
    getphoneUserById,
    createphoneUser,
    updatephoneUser,
    deletephoneUser,
};