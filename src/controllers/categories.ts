import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { Category } from '../models/category.model';

async function getAllCategories(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM categorias', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo categorias:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getCategoryById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);
    try {
        const result = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);
        const category = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!category) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        return res.json(category);
    } catch (error) {
        console.error('Error obteniendo categoría:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createCategory(req: Request, res: Response) {
    const data = req.body as Category;

    if (!data.descripcion) {
        return res.status(400).json({ error: 'Falta descripción' });
    }

    try {
        const result = await db.query(
            'INSERT INTO categorias (descripcion) VALUES (?)',
            [data.descripcion]
        );
        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando categoría:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateCategory(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as Category;

    try {
        const result = await db.query(
            'UPDATE categorias SET descripcion = ? WHERE id = ?',
            [data.descripcion, id]
        );

        if (!result) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando categoría:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteCategory(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM categorias WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        return res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error('Error eliminando categoría:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};