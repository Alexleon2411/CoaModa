//la siguiente es la sintaxys se ESM
import express  from 'express'
import router from './routes/products.js'

const app = express()
// se podria usar la misma peteciones http pero en este caso usamos .use para avarcar todas las peticiones disponibles o la que tenga esa ruta en especifico disponible
app.use('/products', router)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log('se esta ejecuntando en el puerto:', PORT)
})
