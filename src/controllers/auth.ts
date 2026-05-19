import db from '../database/db';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';

const JWT_SECRET = 'secret_key';

async function login(req: Request, res: Response): Promise<Response> {
    const data = req.body as Auth;

    if (!data.email || !data.password) {
        return res.status(400).json({
            error: 'Email y contraseña son obligatorios'
        });
    }

    try {
        const result = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [data.email]
        );

        const user: User | undefined =
            Array.isArray(result) && result.length > 0
                ? result[0] as User
                : undefined;

        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        if (user.estado === 0) {
            return res.status(403).json({
                error: 'Usuario inactivo'
            });
        }

        const validPassword = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                error: 'Contraseña incorrecta'
            });
        }

        const token = jwt.sign(
            {
                id: (user as any).id,
                email: user.email,
                rol_id: user.rol_id
            },
            JWT_SECRET,
            {
                expiresIn: '8h'
            }
        );

        return res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: (user as any).id,
                nombre_completo: user.nombre_completo,
                email: user.email,
                user_name: user.user_name,
                rol_id: user.rol_id
            }
        });

    } catch (error) {
        console.error('Error en login:', error);

        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

async function register(req: Request, res: Response): Promise<Response> {
    const data = req.body as User;

    if (
        !data.nombre_completo ||
        !data.email ||
        !data.password ||
        !data.user_name
    ) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios'
        });
    }

    try {

        const existingUser = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [data.email]
        );

        if (Array.isArray(existingUser) && existingUser.length > 0) {
            return res.status(409).json({
                error: 'El correo ya está registrado'
            });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const result = await db.query(
            `INSERT INTO usuarios
            (
                nombre_completo,
                tipo_documento,
                identificacion,
                fecha_nacimiento,
                email,
                password,
                verificado,
                token_verificacion,
                user_name,
                foto_perfil,
                rol_id,
                estado,
                fecha_ultimo_intento
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.nombre_completo,
                data.tipo_documento,
                data.identificacion,
                data.fecha_nacimiento,
                data.email,
                hashedPassword,
                data.verificado ?? 1,
                data.token_verificacion ?? null,
                data.user_name,
                data.foto_perfil ?? null,
                data.rol_id,
                data.estado ?? 1,
                null
            ]
        );

        return res.status(201).json({
            message: 'Usuario registrado correctamente',
            id: result
        });

    } catch (error) {
        console.error('Error en register:', error);

        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

export default {
    login,
    register
};