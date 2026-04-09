import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { Order } from '../models/order.model';

async function getAllOrders(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM pedidos', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo pedidos:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getOrderById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM pedidos WHERE id = ?', [id]);
        const order = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        return res.json(order);
    } catch (error) {
        console.error('Error obteniendo pedido:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createOrder(req: Request, res: Response) {
    const data = req.body as Order;

    if (!data.cod_factura || !data.fecha || !data.valor || !data.usuario_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            `INSERT INTO pedidos 
            (cod_factura, fecha, canal_venta, valor, usuario_id) 
            VALUES (?, ?, ?, ?, ?)`,
            [
                data.cod_factura,
                data.fecha,
                data.canal_venta,
                data.valor,
                data.usuario_id
            ]
        );

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando pedido:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateOrder(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as Order;

    try {
        const result = await db.query(
            `UPDATE pedidos SET 
            cod_factura = ?, 
            fecha = ?, 
            canal_venta = ?, 
            valor = ?, 
            usuario_id = ? 
            WHERE id = ?`,
            [
                data.cod_factura,
                data.fecha,
                data.canal_venta,
                data.valor,
                data.usuario_id,
                id
            ]
        );

        if (!result) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando pedido:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteOrder(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM pedidos WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        return res.json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando pedido:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};