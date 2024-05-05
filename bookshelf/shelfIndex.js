const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Usuario, Sucursal, Producto } = require('./shelfModels');
const bookshelf = require('./bookshelf')

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// var corsOptions = {
//     origin: 'http://127.0.0.1:3001',
//     optionsSuccessStatus: 200 // For legacy browser support
// }

// app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send("Hola desde el back2");
})


// REGISTRAR USUARIO
app.post('/registro', async (req, res) => {
    try {
        // extraer los datos del cuerpo de la solicitud
        const { nombre, apellido, correo, fecha_nacimiento, sucursal_preferencia, rol_id, contrasena } = req.body;

        // crear un nuevo usuario utilizando el model Usuario
        const nuevoUsuario = await Usuario.forge({
            nombre,
            apellido,
            correo,
            fecha_nacimiento,
            sucursal_preferencia,
            rol_id,
            contrasena
        });

        // guardar el nuevo usuario en la bd
        await nuevoUsuario.save();

        // devolver una respuesta de éxito
        res.status(201).json({ mensaje: 'usuario creado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
        // respuesta si hay error
        console.error('error al registrar usuario:', error);
        res.status(500).json({ error: 'no se pudo registrar el usuario' });
    }
});




//AGREGAR SUCURSAL
// acceso solo rol admin
app.post('/agregarSucursal', async (req, res) => {
    try {
        // extraer los datos del cuerpo de la solicitud
        const { nombre, direccion, telefono } = req.body;

        const nuevaSucursal = await Sucursal.forge({
            nombre,
            direccion,
            telefono
        })
        // guardar la sucursal en la bd
        await nuevaSucursal.save();

        // devolver una respuesta de éxito
        res.status(201).json({ mensaje: 'Sucursal creada exitosamente', sucursal: nuevaSucursal });
    } catch (error) {
        // respuesta si hay error
        console.error('error al registrar la sucursal:', error);
        res.status(500).json({ error: 'no se pudo registrar la sucursal' });
    }
});



//OBTENER SUCURSALES
app.get('/sucursales', async (req, res) => {
    try {
        const sucursales = await Sucursal.fetchAll();
        res.json({ sucursales });
    } catch (error) {
        console.error('error al obtener las sucursales:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener las sucursales' });
    }
});


//OBTENER USUARIOS
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.fetchAll();
        res.json({ usuarios });
    } catch (error) {
        console.error('error al obtener los usuarios:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener las sucursales' });
    }
});


//OBTENER PRODUCTOS
// acceso solo rol admin
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.fetchAll();
        res.json({ productos });
    } catch (error) {
        console.error('error al obtener los productos:', error);
        res.status(500).json({ error: 'ocurrio un error al obtener los productos' });
    }
});





//INICIO DE SESION, USUARIO CLIENTE
app.post('/iniciarSesion', async (req, res) => {
    const login = { correo, contrasena } = req.body;
    try{
        const usuario = await Usuario.where({ correo }).fetch();

        if(!usuario){
            res.status(404);
            res.send( {error: 'usuario no encontrado'} );
        }

        //si existe el usuario
        const contrasenaValida = await usuario.validarContrasena(contrasena);
        if(!contrasenaValida){
            return res.status(401).json({ error: 'credenciales invalidas' });
        }


        //si las credenciales son validas:
        res.status(200).json({ mensaje: 'inicio de sesion exitoso', usuario }); //devuelvo el usuario y que el frontend maneje la redireccion
    } catch(error){
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})


// inicio el servidor
app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});
