import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { UserAddress } from '../models/userAddress.model';

async function getAllUserAddresses(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM direccion_usuarios', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo direcciones:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getUserAddressById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM direccion_usuarios WHERE id = ?', [id]);
        const address = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!address) {
            return res.status(404).json({ error: 'Dirección no encontrada' });
        }

        return res.json(address);
    } catch (error) {
        console.error('Error obteniendo dirección:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createUserAddress(req: Request, res: Response) {
    const data = req.body as UserAddress;

    if (!data.usuario_id || !data.direccion || !data.ciudad || !data.departamento || !data.pais) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            `INSERT INTO direccion_usuarios
            (usuario_id, direccion, barrio, ciudad, departamento, pais)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.usuario_id,
                data.direccion,
                data.barrio,
                data.ciudad,
                data.departamento,
                data.pais
            ]
        );

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando dirección:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateUserAddress(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as UserAddress;

    try {
        let fields: string[] = [];
        let values: any[] = [];

        if (data.usuario_id !== undefined) {
            fields.push('usuario_id = ?');
            values.push(data.usuario_id);
        }

        if (data.direccion !== undefined) {
            fields.push('direccion = ?');
            values.push(data.direccion);
        }

        if (data.barrio !== undefined) {
            fields.push('barrio = ?');
            values.push(data.barrio);
        }

        if (data.ciudad !== undefined) {
            fields.push('ciudad = ?');
            values.push(data.ciudad);
        }

        if (data.departamento !== undefined) {
            fields.push('departamento = ?');
            values.push(data.departamento);
        }

        if (data.pais !== undefined) {
            fields.push('pais = ?');
            values.push(data.pais);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        const query = `UPDATE direccion_usuarios SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        const result = await db.query(query, values);

        if (!result) {
            return res.status(404).json({ error: 'Dirección no encontrada' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando dirección:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteUserAddress(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM direccion_usuarios WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Dirección no encontrada' });
        }

        return res.json({ message: 'Dirección eliminada correctamente' });
    } catch (error) {
        console.error('Error eliminando dirección:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllUserAddresses,
    getUserAddressById,
    createUserAddress,
    updateUserAddress,
    deleteUserAddress,
};