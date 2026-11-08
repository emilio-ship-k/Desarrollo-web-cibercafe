import Cliente from '../models/Cliente.js';
import { registrarHistorial } from '../utils/historial.js';

// Escapa los caracteres especiales para que el texto buscado se use tal cual en la búsqueda
function escaparTexto(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Lista los clientes; con "buscar" filtra por nombre sin distinguir mayúsculas.
export async function listarClientes(req, res) {
try {
    const filtro = {};
    const buscar = typeof req.query.buscar === 'string' ? req.query.buscar.trim() : '';

    if (buscar) {
        filtro.nombre = { $regex: escaparTexto(buscar), $options: 'i' };
    }

    const clientes = await Cliente.find(filtro).populate('usuario', 'email').sort({ nombre: 1 }).limit(200);

    // Se indica si el cliente tiene cuenta web, sin enviar más datos de la cuenta
    res.json({
    clientes: clientes.map((c) => ({
        _id: c._id,
        nombre: c.nombre,
        tieneCuenta: c.usuario !== null,
        email: c.usuario?.email ?? null,
        })),
    });
    } catch (error) {
        console.error('Error al listar clientes:', error.message);
        res.status(500).json({ mensaje: 'No se pudieron obtener los clientes' });
    }
}

// Registra a una persona que usa el local pero no tiene cuenta web.
export async function crearCliente(req, res) {
try {
    const nombre = req.body.nombre?.trim();

    if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre del cliente es obligatorio' });
    }

    // No se rechazan nombres repetidos: dos personas distintas pueden llamarse igual
    const cliente = await Cliente.create({ nombre });

    await registrarHistorial({
        entidad: 'Cliente',
        entidadId: cliente._id,
        accion: 'crear',
        usuario: req.usuario.id,
        detalle: nombre,
    });

    res.status(201).json({ cliente: { _id: cliente._id, nombre: cliente.nombre, tieneCuenta: false, email: null } });
    } catch (error) {
        console.error('Error al crear cliente:', error.message);
        res.status(500).json({ mensaje: 'No se pudo registrar el cliente' });
    }
}