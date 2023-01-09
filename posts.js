// ----conexión a la BD----
const pool = require("./helpers/connectionBd").getInstance()


// ----Agregando posts----
const addPosts = async (payload) => {
  const SQLquery = {
    text: "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
    values: [payload.titulo, payload.url, payload.descripcion, payload.likes],
  };
  try {
    const result = await pool.query(SQLquery);
    return result.rows;
  } catch (e) {
    throw new Error(e);
  }
};

//   ----Trayendo todos los posts-----
const getPosts = async () => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts");
    console.log(rows);
    return rows;
  } catch (e) {
    console.log(e);
    console.log(
      "error al cargar los datos de la tabla posts: ",
      e.code,
      e.message
    );
    throw new Error(e);
  }
};

// --- Mostrando posts repetidos----
const duplicatePost = async (payload) => {
  const SQLquery = {
    text: "SELECT COUNT(*) as NUM FROM posts WHERE titulo=$1 AND img=$2 AND descripcion=$3",
    values: [payload.titulo, payload.url, payload.descripcion],
  };
  const { rows } = await pool.query(SQLquery);
  return rows;
};

const deletePosts = async (id) => {
  const query = "DELETE FROM posts WHERE id = $1 ";
  const values = [id];
  const result = await pool.query(query, values);
};

const modifyPosts = async (id) => {
  const query =
    "UPDATE posts SET likes = CASE WHEN likes IS NULL THEN 1 ELSE likes +1 END WHERE id=$1 RETURNING *";
  const values = [id];
  const result = await pool.query(query, values);
};

module.exports = {
  addPosts,
  getPosts,
  duplicatePost,
  deletePosts,
  modifyPosts,
};
