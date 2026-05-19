import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { Cart } from '../models/cart.model';

async function getAllCarts(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM carritos', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo carritos:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getCartById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);
    try {
        const result = await db.query('SELECT * FROM carritos WHERE id = ?', [id]);
        const cart = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        return res.json(cart);
    } catch (error) {
        console.error('Error obteniendo el carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createCart(req: Request, res: Response) {
    const { usuario_id, activo } = req.body as Cart;

    if (!usuario_id) {
        return res.status(400).json({ error: 'El campo usuario_id es obligatorio' });
    }

    try {
        const status = activo !== undefined ? activo : 1;
        
        const result = await db.query(
            'INSERT INTO carritos (usuario_id, activo) VALUES (?, ?)',
            [usuario_id, status]
        );
        
        return res.status(201).json({ 
            id: result, 
            usuario_id, 
            activo: status 
        });
    } catch (error) {
        console.error('Error creando carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateCart(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const { usuario_id, activo } = req.body as Cart;

    try {
        const result = await db.query(
            'UPDATE carritos SET usuario_id = ?, activo = ? WHERE id = ?',
            [usuario_id, activo, id]
        );

        if (!result) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        return res.json({ id, usuario_id, activo });
    } catch (error) {
        console.error('Error actualizando carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteCart(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM carritos WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        return res.json({ message: 'Carrito eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllCarts,
    getCartById,
    createCart,
    updateCart,
    deleteCart,
};