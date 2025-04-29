import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync("carritoCompras.db");  // nombre de base de datos

if (db) {
  console.log('Base de datos abierta correctamente');
} else {
  console.log('Error al abrir la base de datos');
}

// Verifica si la base de datos se abrió correctamente
const crearTablas = async () => {
  try {
    await db.execAsync(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, name TEXT, age INTEGER);`);
    await db.runAsync('INSERT INTO users (name, age) values (?, ?)', ['John', 25]);
    const rows = await db.getAllAsync('SELECT * FROM users');
    console.log(rows);
  } catch (error) {
    console.error("Error al ejecutar las operaciones iniciales:", error);
  }
};

crearTablas();

// Crear las tablas y poblar con datos iniciales si es necesario
export const initDB = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        imageKey TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT NOT NULL
      );
    `);

    // Insertar productos solo si la tabla está vacía
    const productosCount = await db.getAsync('SELECT COUNT(*) as count FROM productos');
    if (productosCount.rows._array[0].count === 0) {
      insertarProductosIniciales();
    }

    // Insertar usuarios solo si la tabla está vacía
    const usuariosCount = await db.getAsync('SELECT COUNT(*) as count FROM usuarios');
    if (usuariosCount.rows._array[0].count === 0) {
      insertarUsuariosIniciales();
    }
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
};

// Insertar productos iniciales
const insertarProductosIniciales = async () => {
  const productos = [
    { name: 'Matemáticas', price: 25, image: 'matematicas' },
    { name: 'Historia', price: 20, image: 'historia' },
    { name: 'Ciencias Naturales', price: 30, image: 'cienciasNaturales' },
    { name: 'Lengua y Literatura', price: 22, image: 'lenguaLiteratura' },
    { name: 'Geografía', price: 28, image: 'geografia' },
  ];

  for (const producto of productos) {
    await db.runAsync(
      `INSERT INTO productos (name, price, imageKey) VALUES (?, ?, ?);`,
      [producto.name, producto.price, producto.image]
    );
    console.log(`Producto ${producto.name} insertado`);
  }
};

// Insertar usuarios iniciales
const insertarUsuariosIniciales = async () => {
  const usuarios = [
    { email: 'virginia@example.com', password: '1234Virginia', rol: 'admin' },
    { email: 'ratonperez@example.com', password: '1234Raton', rol: 'usuario' },
  ];

  for (const user of usuarios) {
    await db.runAsync(
      `INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?);`,
      [user.email, user.password, user.rol]
    );
    console.log(`Usuario ${user.email} insertado`);
  }
};

// Obtener productos
export const obtenerProductos = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM productos');
    return result.rows._array;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

// Buscar producto por ID
export const buscarProductoPorId = async (id) => {
  try {
    const result = await db.getAsync('SELECT * FROM productos WHERE id = ?', [id]);
    return result.rows._array[0];
  } catch (error) {
    console.error("Error al buscar producto:", error);
    throw error;
  }
};

// Insertar nuevo producto
export const insertarProducto = async (name, price, imageKey) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO productos (name, price, imageKey) VALUES (?, ?, ?);`,
      [name, price, imageKey]
    );
    return result;
  } catch (error) {
    console.error("Error al insertar producto:", error);
    throw error;
  }
};

// Eliminar producto
export const eliminarProducto = async (id) => {
  try {
    const result = await db.runAsync('DELETE FROM productos WHERE id = ?', [id]);
    return result;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};

// Actualizar producto
export const actualizarProducto = async (id, name, price, imageKey) => {
  try {
    const result = await db.runAsync(
      `UPDATE productos SET name = ?, price = ?, imageKey = ? WHERE id = ?;`,
      [name, price, imageKey, id]
    );
    return result;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

// Obtener usuario por email
export const obtenerUsuarioPorEmail = async (email) => {
  try {
    const result = await db.getAsync('SELECT * FROM usuarios WHERE email = ?', [email]);
    return result.rows._array[0];
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

export default db;
