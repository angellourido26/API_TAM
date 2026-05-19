import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { Supplier } from '../models/supplier.model';

async function getAllSuppliers(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM proveedores', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo proveedores:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getSupplierById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM proveedores WHERE id = ?', [id]);
        const supplier = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!supplier) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        return res.json(supplier);
    } catch (error) {
        console.error('Error obteniendo proveedor:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createSupplier(req: Request, res: Response) {
    const data = req.body as Supplier;

    if (!data.nombre) {
        return res.status(400).json({ error: 'Falta nombre' });
    }

    try {
        const result = await db.query(
            'INSERT INTO proveedores (nombre, correo) VALUES (?, ?)',
            [data.nombre, data.correo]
        );

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando proveedor:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateSupplier(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as Supplier;

    try {
        const result = await db.query(
            'UPDATE proveedores SET nombre = ?, correo = ? WHERE id = ?',
            [data.nombre, data.correo, id]
        );

        if (!result) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando proveedor:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteSupplier(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM proveedores WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        return res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando proveedor:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};