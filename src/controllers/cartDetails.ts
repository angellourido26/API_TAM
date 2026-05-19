import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { CartDetail } from '../models/cartDetail.model';

async function getAllCartDetails(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM detalle_carrito', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo detalles del carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getCartDetailById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);
    try {
        const result = await db.query('SELECT * FROM detalle_carrito WHERE id = ?', [id]);
        const detail = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!detail) {
            return res.status(404).json({ error: 'Detalle del carrito no encontrado' });
        }

        return res.json(detail);
    } catch (error) {
        console.error('Error obteniendo detalle del carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createCartDetail(req: Request, res: Response) {
    const { carrito_id, producto_id, cantidad, subtotal } = req.body as CartDetail;

    if (!carrito_id || !producto_id || cantidad === undefined) {
        return res.status(400).json({ error: 'Los campos carrito_id, producto_id y cantidad son obligatorios' });
    }

    try {
        const result = await db.query(
            `INSERT INTO detalle_carrito 
            (carrito_id, producto_id, cantidad, subtotal) 
            VALUES (?, ?, ?, ?)`,
            [carrito_id, producto_id, cantidad, subtotal || null]
        );
        
        return res.status(201).json({ 
            id: result, 
            carrito_id, 
            producto_id, 
            cantidad, 
            subtotal 
        });
    } catch (error) {
        console.error('Error creando detalle del carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateCartDetail(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const { carrito_id, producto_id, cantidad, subtotal } = req.body as CartDetail;

    try {
        const result = await db.query(
            `UPDATE detalle_carrito 
             SET carrito_id = ?, producto_id = ?, cantidad = ?, subtotal = ? 
             WHERE id = ?`,
            [carrito_id, producto_id, cantidad, subtotal, id]
        );

        if (!result) {
            return res.status(404).json({ error: 'Detalle del carrito no encontrado' });
        }

        return res.json({ id, carrito_id, producto_id, cantidad, subtotal });
    } catch (error) {
        console.error('Error actualizando detalle del carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteCartDetail(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM detalle_carrito WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Detalle del carrito no encontrado' });
        }

        return res.json({ message: 'Detalle del carrito eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando detalle del carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllCartDetails,
    getCartDetailById,
    createCartDetail,
    updateCartDetail,
    deleteCartDetail,
};