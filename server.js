import express from 'express';
import carritosRouter from './routes/carts.router.js';
import productosRouter from './routes/products.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para productos
app.use('/api/products', productosRouter);

// Ruta para carritos
app.use('/api/carts', carritosRouter);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
