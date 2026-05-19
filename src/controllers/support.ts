import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { Support } from '../models/support.models';

async function getAllSupport(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM soporte', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo soporte:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getSupportById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);
    try {
        const result = await db.query('SELECT * FROM soporte WHERE id = ?', [id]);
        const support = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!support) {
            return res.status(404).json({ error: 'Soporte no encontrado' });
        }

        return res.json(support);
    } catch (error) {
        console.error('Error obteniendo soporte:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createSupport(req: Request, res: Response): Promise<Response | void> {
    const data = req.body as Support;

    if (!data.usuario_id || !data.tipo|| !data.descripcion|| !data.estado) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            'INSERT INTO soporte (usuario_id, tipo, descripcion, estado) VALUES (?, ?, ?, ?)',
            [
                data.usuario_id, 
                data.tipo, 
                data.descripcion, 
                data.estado
            ]
        );
        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando soporte:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateSupport(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as Support;

    try {
        const result = await db.query(
            'UPDATE soporte SET usuario_id = ?, tipo = ?, descripcion = ?, estado = ? WHERE id = ?',
            [data.usuario_id, data.tipo, data.descripcion, data.estado, id]
        );

        if (!result) {
            return res.status(404).json({ error: 'Soporte no encontrado' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando soporte:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteSupport(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM soporte WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Soporte no encontrado' });
        }

        return res.json({ message: 'Soporte eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando movimiento de inventario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllSupport,
    getSupportById,
    createSupport,
    updateSupport,
    deleteSupport,
};