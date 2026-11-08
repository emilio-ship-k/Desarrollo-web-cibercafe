import mongoose from 'mongoose';
import Sala from '../models/Sala.js';

// Busca otra sala con el mismo nombre, sin distinguir mayúsculas
function buscarPorNombre(nombre, excluirId = null) {
    const filtro = { nombre };
    if (excluirId) filtro._id = { $ne: excluirId };
    return Sala.findOne(filtro).collation({ locale: 'es', strength: 2 });
}

// lista de salas
export async function listarSalas(req, res) {
    try {
        const salas = await Sala.find().sort({ nombre: 1 });
        res.json({ salas });
    } catch (error) {
        console.error('Error al listar salas:', error.message);
        res.status(500).json({ mensaje: 'No se pudieron obtener las salas' });
    }
}

// crear sala (solo administrador)
export async function crearSala(req, res) {
    try {
        const nombre = req.body.nombre?.trim();
        const descripcion = req.body.descripcion?.trim() || '';

        if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre de la sala es obligatorio' });
        }
        if (await buscarPorNombre(nombre)) {
        return res.status(409).json({ mensaje: 'Ya existe una sala con ese nombre' });
        }

        const sala = await Sala.create({ nombre, descripcion });
        res.status(201).json({ sala });
    } catch (error) {
        console.error('Error al crear sala:', error.message);
        res.status(500).json({ mensaje: 'No se pudo crear la sala' });
    }
}

// editar sala (solo administrador)
export async function editarSala(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ mensaje: 'El identificador de la sala no es válido' });
        }

        const sala = await Sala.findById(id);
        if (!sala) {
        return res.status(404).json({ mensaje: 'Sala no encontrada' });
    }

    // Solo se cambian los campos que vengan en la petición
        if (req.body.nombre !== undefined) {
        const nombre = req.body.nombre.trim();
        if (!nombre) {
            return res.status(400).json({ mensaje: 'El nombre de la sala no puede quedar vacío' });
        }
        if (await buscarPorNombre(nombre, sala._id)) {
            return res.status(409).json({ mensaje: 'Ya existe otra sala con ese nombre' });
        }
        sala.nombre = nombre;
        }
        if (req.body.descripcion !== undefined) {
        sala.descripcion = req.body.descripcion.trim();
    }

        await sala.save();
        res.json({ sala });
    } catch (error) {
        console.error('Error al editar sala:', error.message);
        res.status(500).json({ mensaje: 'No se pudo editar la sala' });
    }
}