import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { Subcategory } from '../models/subcategory.model';

async function getAllSubcategories(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM subcategorias', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo subcategorias:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getSubcategoryById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM subcategorias WHERE id = ?', [id]);
        const subcategory = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategoría no encontrada' });
        }

        return res.json(subcategory);
    } catch (error) {
        console.error('Error obteniendo subcategoría:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createSubcategory(req: Request, res: Response) {
    const data = req.body as Subcategory;

    if (!data.descripcion || !data.categoria_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            'INSERT INTO subcategorias (descripcion, categoria_id) VALUES (?, ?)',
            [data.descripcion, data.categoria_id]
        );

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando subcategoría:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateSubcategory(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as Subcategory;

    try {
        const result = await db.query(
            'UPDATE subcategorias SET descripcion = ?, categoria_id = ? WHERE id = ?',
            [data.descripcion, data.categoria_id, id]
        );

        if (!result) {
            return res.status(404).json({ error: 'Subcategoría no encontrada' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando subcategoría:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteSubcategory(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM subcategorias WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Subcategoría no encontrada' });
        }

        return res.json({ message: 'Subcategoría eliminada correctamente' });
    } catch (error) {
        console.error('Error eliminando subcategoría:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllSubcategories,
    getSubcategoryById,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
};