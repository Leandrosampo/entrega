import express from 'express';
import fs from 'fs/promises';

const carritosRouter = express.Router();

const carritoFilePath = 'carrito.json';

const getNextCarritoID = (carritos) => {
    const count = carritos.length;
    const nextID = count > 0 ? carritos[count - 1].id + 1 : 1;
    return nextID;
};

carritosRouter.post('/', async (req, res) => {
    try {
        let carritos = [];
        try {
            const data = await fs.readFile(carritoFilePath, 'utf8');
            carritos = JSON.parse(data);
        } catch (error) {
            return []
        }

        const id = getNextCarritoID(carritos);

        const nuevoCarrito = {
            id,
            products: [],
        };

        carritos.push(nuevoCarrito);

        await fs.writeFile(carritoFilePath, JSON.stringify(carritos, null, 2));

        res.status(201).json(nuevoCarrito);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

carritosRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const data = await fs.readFile(carritoFilePath, 'utf8');
        const carritos = JSON.parse(data);

        // Convertir cid a número
        const carritoId = parseInt(cid, 10);

        const carrito = carritos.find((c) => c.id === carritoId);

        if (carrito) {
            res.json(carrito);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

carritosRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const data = await fs.readFile(carritoFilePath, 'utf8');
        const carritos = JSON.parse(data);

        const carrito = carritos.find((c) => c.id === cid);

        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontra2' });
        }

        const existingProduct = carrito.products.find((p) => p.id === pid);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            carrito.products.push({ id: pid, quantity });
        }

        await fs.writeFile(carritoFilePath, JSON.stringify(carritos, null, 2));

        res.json(carrito);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

export default carritosRouter;
