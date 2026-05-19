import db from '../database/db';
import { emptyOrRows } from '../config/helper';
import { Request, Response } from 'express';
import { UserPaymentMethod } from '../models/userPaymentMethod.model';

async function getAllUserPaymentMethods(_req: Request, res: Response): Promise<Response | void> {
    try {
        const result = await db.query('SELECT * FROM metodo_pago_usuarios', []);
        return res.json(emptyOrRows(result));
    } catch (error) {
        console.error('Error obteniendo métodos de pago:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function getUserPaymentMethodById(req: Request, res: Response): Promise<Response | void> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('SELECT * FROM metodo_pago_usuarios WHERE id = ?', [id]);
        const paymentMethod = Array.isArray(result) && result.length > 0 ? result[0] : undefined;

        if (!paymentMethod) {
            return res.status(404).json({ error: 'Método de pago no encontrado' });
        }

        return res.json(paymentMethod);
    } catch (error) {
        console.error('Error obteniendo método de pago:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function createUserPaymentMethod(req: Request, res: Response) {
    const data = req.body as UserPaymentMethod;

    if (!data.usuario_id || !data.tipo || !data.numero_parcial || !data.titular || !data.fecha_expiracion) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const result = await db.query(
            `INSERT INTO metodo_pago_usuarios
            (usuario_id, tipo, numero_parcial, titular, fecha_expiracion)
            VALUES (?, ?, ?, ?, ?)`,
            [
                data.usuario_id,
                data.tipo,
                data.numero_parcial,
                data.titular,
                data.fecha_expiracion
            ]
        );

        return res.status(201).json({ id: result, ...data });
    } catch (error) {
        console.error('Error creando método de pago:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateUserPaymentMethod(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);
    const data = req.body as UserPaymentMethod;

    try {
        let fields: string[] = [];
        let values: any[] = [];

        if (data.usuario_id !== undefined) {
            fields.push('usuario_id = ?');
            values.push(data.usuario_id);
        }

        if (data.tipo !== undefined) {
            fields.push('tipo = ?');
            values.push(data.tipo);
        }

        if (data.numero_parcial !== undefined) {
            fields.push('numero_parcial = ?');
            values.push(data.numero_parcial);
        }

        if (data.titular !== undefined) {
            fields.push('titular = ?');
            values.push(data.titular);
        }

        if (data.fecha_expiracion !== undefined) {
            fields.push('fecha_expiracion = ?');
            values.push(data.fecha_expiracion);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        const query = `UPDATE metodo_pago_usuarios SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        const result = await db.query(query, values);

        if (!result) {
            return res.status(404).json({ error: 'Método de pago no encontrado' });
        }

        return res.json({ id, ...data });
    } catch (error) {
        console.error('Error actualizando método de pago:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deleteUserPaymentMethod(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string);

    try {
        const result = await db.query('DELETE FROM metodo_pago_usuarios WHERE id = ?', [id]);

        if (!result) {
            return res.status(404).json({ error: 'Método de pago no encontrado' });
        }

        return res.json({ message: 'Método de pago eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando método de pago:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export default {
    getAllUserPaymentMethods,
    getUserPaymentMethodById,
    createUserPaymentMethod,
    updateUserPaymentMethod,
    deleteUserPaymentMethod,
};