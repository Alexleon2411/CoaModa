import express from "express";
import { services } from "../data/beutyServices.js";

const router = express.Router()

router.get('/', (req, res) => {
  //rest te envia los valores en forma json para que se puedan leer en pantalla tambien se puede usar res.json() para enviar un arreglo de objetos


  res.send(services)
})

export default router
