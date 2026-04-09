import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { OrderDetail } from '../models/orderDetail.model';

async function getAllOrderDetails(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM detalle_pedido', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo detalles:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getOrderDetailById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM detalle_pedido WHERE id = ?', [id]);
        const detail = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!detail) {
            return res.status(404).json({ error: 'Detalle no encontrado' });
        }

        return res.json(detail);
    } catch (error) {
        console.error('Error obteniendo detalle:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createOrderDetail(req: Request, res: Response) {
    const data = req.body as OrderDetail;

    if (!data.cantidad || !data.valor_producto || !data.pedido_id || !data.producto_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            `INSERT INTO detalle_pedido 
            (cantidad, valor_producto, iva_porcentaje, subtotal, iva, total, pedido_id, producto_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.cantidad,
                data.valor_producto,
                data.iva_porcentaje,
                data.subtotal,
                data.iva,
                data.total,
                data.pedido_id,
                data.producto_id
            ]
        );

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando detalle:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateOrderDetail(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as OrderDetail;

    try {
        const result = await db.query(
            `UPDATE detalle_pedido SET 
            cantidad = ?, 
            valor_producto = ?, 
            iva_porcentaje = ?, 
            subtotal = ?, 
            iva = ?, 
            total = ?, 
            pedido_id = ?, 
            producto_id = ? 
            WHERE id = ?`,
            [
                data.cantidad,
                data.valor_producto,
                data.iva_porcentaje,
                data.subtotal,
                data.iva,
                data.total,
                data.pedido_id,
                data.producto_id,
                id
            ]
        );

        if (!result) {
            return res.status(404).json({ error: 'Detalle no encontrado' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando detalle:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteOrderDetail(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM detalle_pedido WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Detalle no encontrado' });
        }

        return res.json({ message: 'Detalle eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando detalle:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllOrderDetails,
    getOrderDetailById,
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
};