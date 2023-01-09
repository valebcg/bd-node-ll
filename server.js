const {
  addPosts,
  getPosts,
  duplicatePost,
  deletePosts,
  modifyPosts,
} = require("./posts");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ----levantando el servidor----
app.listen(process.env.PORT, console.log("SERVIDOR ENCENDIDO"));

// ----Traer html para la vista del navegador---
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ----consigue los posts----
app.get("/posts", async (req, res) => {
  const posts = await getPosts();
  res.json(posts);
});

// ----agregando un posts----
app.post("/posts", async (req, res) => {
  try {
    const payload = req.body;
    const resultDuplicate = await duplicatePost(payload);
    if (
      payload.id === "" ||
      payload.titulo === "" ||
      payload.url === "" ||
      payload.descripcion === ""
    ) {
      res.send("Faltan datos por ingresar");
    } else if (resultDuplicate[0].num > 0) {
      res.send("Registro existente");
    } else {
      await addPosts(payload);
      res.send("Registro agregado con éxito");
    }
  } catch (err) {
    res.json({ message: "Faltan campos por ingresar" });
  }
});

// -----Eliminando posts------
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deletePosts(id);
    res.send("Post eliminado con éxito");
  } catch {
    res.send({ status: "error", data: "error interno del servidor" });
  }
});
// -----Modificando likes-----
app.put("/posts/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await modifyPosts(id);
    res.send("Post modificado con éxito");
  } catch {
    res.send({ status: "error", data: "error interno del servidor" });
  }
});
