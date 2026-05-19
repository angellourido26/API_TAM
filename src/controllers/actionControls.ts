import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { ActionControl } from '../models/actionControl.model';

async function getAllActionControls(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM control_acciones', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo acciones:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getActionControlById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM control_acciones WHERE id = ?', [id]);
        const actionControl = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!actionControl) {
            return res.status(404).json({ error: 'Acción no encontrada' });
        }

        return res.json(actionControl);
    } catch (error) {
        console.error('Error obteniendo acción:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createActionControl(req: Request, res: Response) {
    const data = req.body as ActionControl;

    if (!data.usuario_id || !data.accion) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            'INSERT INTO control_acciones (usuario_id, accion, observaciones) VALUES (?, ?, ?)',
            [data.usuario_id, data.accion, data.observaciones]
        );

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando acción:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateActionControl(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as ActionControl;

    try {
        const result = await db.query(
            'UPDATE control_acciones SET usuario_id = ?, accion = ?, observaciones = ? WHERE id = ?',
            [data.usuario_id, data.accion, data.observaciones, id]
        );

        if (!result) {
            return res.status(404).json({ error: 'Acción no encontrada' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando acción:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteActionControl(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM control_acciones WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Acción no encontrada' });
        }

        return res.json({ message: 'Acción eliminada correctamente' });
    } catch (error) {
        console.error('Error eliminando acción:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllActionControls,
    getActionControlById,
    createActionControl,
    updateActionControl,
    deleteActionControl,
};