import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { SupplierPhone } from '../models/supplierPhone.model';

async function getAllSupplierPhones(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM telefono_proveedores', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo teléfonos:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getSupplierPhoneById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM telefono_proveedores WHERE id = ?', [id]);
        const supplierPhone = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!supplierPhone) {
            return res.status(404).json({ error: 'Teléfono no encontrado' });
        }

        return res.json(supplierPhone);
    } catch (error) {
        console.error('Error obteniendo teléfono:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createSupplierPhone(req: Request, res: Response) {
    const data = req.body as SupplierPhone;

    if (!data.proveedor_id || !data.telefono) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            'INSERT INTO telefono_proveedores (proveedor_id, telefono) VALUES (?, ?)',
            [data.proveedor_id, data.telefono]
        );

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando teléfono:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateSupplierPhone(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as SupplierPhone;

    try {
        const result = await db.query(
            'UPDATE telefono_proveedores SET proveedor_id = ?, telefono = ? WHERE id = ?',
            [data.proveedor_id, data.telefono, id]
        );

        if (!result) {
            return res.status(404).json({ error: 'Teléfono no encontrado' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando teléfono:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteSupplierPhone(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM telefono_proveedores WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Teléfono no encontrado' });
        }

        return res.json({ message: 'Teléfono eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando teléfono:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllSupplierPhones,
    getSupplierPhoneById,
    createSupplierPhone,
    updateSupplierPhone,
    deleteSupplierPhone,
};