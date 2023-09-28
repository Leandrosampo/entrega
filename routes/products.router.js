import express from 'express';
import productManager from '../ProductManager.js'


const router = express.Router();
const app = express();

const productosRouter = express.Router();

app.use('/api/products', productosRouter);

productosRouter.get('/', async (req, res) => {
    try {
        const productos = productManager.getProducts();

        const { limit } = req.query;
        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

productosRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const producto = productManager.getProductById(pid);

        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto', pid });
    }
});


productosRouter.post('/', async (req, res) => {
    const productData = req.body;

    try {
        productManager.addProduct(productData.title, productData.description, productData.price, productData.thumbnail, productData.code, productData.stock);
        res.status(201).json({ message: 'Producto agregado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

productosRouter.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedProductData = req.body;

    try {
        const success = productManager.updateProduct(pid, updatedProductData);

        if (success) {
            res.json({ message: 'Producto actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

productosRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const success = productManager.deleteProduct(+pid);

        if (success) {
            res.json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});


export default productosRouter;
