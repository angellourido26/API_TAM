import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';

import { Product } from '../models/product.model';

async function getAllProducts(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM productos', []);
        return res.json(emptyOrRows(result));

    } catch (error) {
        console.error('Error obteniendo los productos:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getProductById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
        const product = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.json(product);

    } catch (error) {
        console.error('Error obteniendo el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createProduct(req: Request, res: Response) {
    const data = req.body as Product;

    if (
        !data.nombre ||
        data.precio === undefined ||
        !data.descripcion ||
        !data.caracteristicas_tecnicas ||
        data.stock === undefined ||
        data.costo === undefined ||
        !data.subcategoria_id
    ) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios'
        });
    }

    try {
        const result = await db.query(
            `INSERT INTO productos
            (nombre, precio, marca, descripcion, caracteristicas_tecnicas, imagen, stock, costo, subcategoria_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.nombre,
                data.precio,
                data.marca,
                data.descripcion,
                JSON.stringify(data.caracteristicas_tecnicas),
                data.imagen,
                data.stock,
                data.costo,
                data.subcategoria_id
            ]
        );

        return res.status(201).json({ id: result, ...data });

    } catch (error) {
        console.error('Error creando el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateProduct(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as Product;

    try {
        let fields: string[] = [];
        let values: any[] = [];

        if (data.nombre !== undefined) {
            fields.push('nombre = ?');
            values.push(data.nombre);
        }

        if (data.precio !== undefined) {
            fields.push('precio = ?');
            values.push(data.precio);
        }

        if (data.marca !== undefined) {
            fields.push('marca = ?');
            values.push(data.marca);
        }

        if (data.descripcion !== undefined) {
            fields.push('descripcion = ?');
            values.push(data.descripcion);
        }

        if (data.caracteristicas_tecnicas !== undefined) {
            fields.push('caracteristicas_tecnicas = ?');
            values.push(JSON.stringify(data.caracteristicas_tecnicas));
        }

        if (data.imagen !== undefined) {
            fields.push('imagen = ?');
            values.push(data.imagen);
        }

        if (data.stock !== undefined) {
            fields.push('stock = ?');
            values.push(data.stock);
        }

        if (data.costo !== undefined) {
            fields.push('costo = ?');
            values.push(data.costo);
        }

        if (data.subcategoria_id !== undefined) {
            fields.push('subcategoria_id = ?');
            values.push(data.subcategoria_id);
        }

        if (fields.length === 0) {
            return res.status(400).json({
                error: 'No hay campos para actualizar'
            });
        }

        const query = `UPDATE productos SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        const result = await db.query(query, values);

        if (!result) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.json({ id, ...data });

    } catch (error) {
        console.error('Error actualizando el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteProduct(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM productos WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.json({ message: 'Producto eliminado correctamente' });

    } catch (error) {
        console.error('Error eliminando el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};