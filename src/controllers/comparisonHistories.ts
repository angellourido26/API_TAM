import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { ComparisonHistory } from '../models/comparisonHistory.model';

async function getAllComparisonHistories(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM historial_comparaciones', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getComparisonHistoryById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM historial_comparaciones WHERE id = ?', [id]);
        const history = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!history) {
            return res.status(404).json({ error: 'Historial no encontrado' });
        }

        return res.json(history);
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createComparisonHistory(req: Request, res: Response) {
    const data = req.body as ComparisonHistory;

    if (!data.detalle_comparacion || !data.producto_id_1 || !data.producto_id_2 || !data.usuario_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            `INSERT INTO historial_comparaciones
            (fecha, detalle_comparacion, producto_id_1, producto_id_2, producto_id_3, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.detalle_comparacion,
                data.producto_id_1,
                data.producto_id_2,
                data.producto_id_3,
                data.usuario_id
            ]
        );

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando historial:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateComparisonHistory(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as ComparisonHistory;

    try {
        let fields: string[] = [];
        let values: any[] = [];

        if (data.detalle_comparacion !== undefined) {
            fields.push('detalle_comparacion = ?');
            values.push(data.detalle_comparacion);
        }

        if (data.producto_id_1 !== undefined) {
            fields.push('producto_id_1 = ?');
            values.push(data.producto_id_1);
        }

        if (data.producto_id_2 !== undefined) {
            fields.push('producto_id_2 = ?');
            values.push(data.producto_id_2);
        }

        if (data.producto_id_3 !== undefined) {
            fields.push('producto_id_3 = ?');
            values.push(data.producto_id_3);
        }

        if (data.usuario_id !== undefined) {
            fields.push('usuario_id = ?');
            values.push(data.usuario_id);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        const query = `UPDATE historial_comparaciones SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        const result = await db.query(query, values);

        if (!result) {
            return res.status(404).json({ error: 'Historial no encontrado' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando historial:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteComparisonHistory(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM historial_comparaciones WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Historial no encontrado' });
        }

        return res.json({ message: 'Historial eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando historial:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllComparisonHistories,
    getComparisonHistoryById,
    createComparisonHistory,
    updateComparisonHistory,
    deleteComparisonHistory,
};