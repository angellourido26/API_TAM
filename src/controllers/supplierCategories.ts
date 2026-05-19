import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { SupplierCategory } from '../models/supplierCategory.model';

async function getAllSupplierCategories(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM proveedores_categorias', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo relaciones proveedor-categoría:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getSupplierCategoryById(req: Request, res: Response): Promise<Response | void> {
    const proveedor_id = parseInt(req.params.proveedor_id as string);
    const categoria_id = parseInt(req.params.categoria_id as string);

    try {
        const result = await db.query(
            'SELECT * FROM proveedores_categorias WHERE proveedor_id = ? AND categoria_id = ?',
            [proveedor_id, categoria_id]
        );

        const supplierCategory = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!supplierCategory) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        return res.json(supplierCategory);
    } catch (error) {
        console.error('Error obteniendo relación:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createSupplierCategory(req: Request, res: Response) {
    const data = req.body as SupplierCategory;

    if (!data.proveedor_id || !data.categoria_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            'INSERT INTO proveedores_categorias (proveedor_id, categoria_id) VALUES (?, ?)',
            [data.proveedor_id, data.categoria_id]
        );

        return res.status(201).json({ ...data });
    } catch (error) {
        console.error('Error creando relación:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateSupplierCategory(req: Request, res: Response): Promise<Response> {
    const proveedor_id = parseInt(req.params.proveedor_id as string);
    const categoria_id = parseInt(req.params.categoria_id as string);

    const data = req.body as SupplierCategory;

    try {
        const result = await db.query(
            `UPDATE proveedores_categorias 
            SET proveedor_id = ?, categoria_id = ?
            WHERE proveedor_id = ? AND categoria_id = ?`,
            [
                data.proveedor_id,
                data.categoria_id,
                proveedor_id,
                categoria_id
            ]
        );

        if (!result) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        return res.json({ ...data });
    } catch (error) {
        console.error('Error actualizando relación:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteSupplierCategory(req: Request, res: Response): Promise<Response> {
    const proveedor_id = parseInt(req.params.proveedor_id as string);
    const categoria_id = parseInt(req.params.categoria_id as string);

    try {
        const result = await db.query(
            'DELETE FROM proveedores_categorias WHERE proveedor_id = ? AND categoria_id = ?',
            [proveedor_id, categoria_id]
        );

        if (!result) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        return res.json({ message: 'Relación eliminada correctamente' });
    } catch (error) {
        console.error('Error eliminando relación:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllSupplierCategories,
    getSupplierCategoryById,
    createSupplierCategory,
    updateSupplierCategory,
    deleteSupplierCategory,
};