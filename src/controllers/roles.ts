import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';

import { Role } from '../models/role.model';

async function getAllRoles(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM roles', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo los roles:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getRoleById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);
    try {
        const result = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
        const role: Role | undefined = Array.isArray(result) && result.length > 0 ? result[0] as Role : undefined;

        if (!role) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        return res.json(role);
    } catch (error) {
        console.error('Error obteniendo el rol:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createRole(req: Request, res: Response) {
    const data = req.body as Role;

    if (!data.nombre) {
        return res.status(400).json({ error: 'Falta el campo nombre' });
    }

    try {
        const result = await db.query(
            'INSERT INTO roles (nombre) VALUES (?)',
            [
                data.nombre
            ]);

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando el rol:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateRole(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as Role;

    try {
        const result = await db.query(
            'UPDATE roles SET nombre = ? WHERE id = ?',
            [
                data.nombre,
                id
                ]);

        if (!result) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando el rol:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteRole(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM roles WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        return res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando el rol:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
};