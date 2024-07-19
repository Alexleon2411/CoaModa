import  express from 'express'
import  bodyParser from 'body-parser'
import  emailRoutes from './routes/emailRoutes.js'
import cors from 'cors'

const app = express();
const port = 8080;

app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend
  methods: ['GET', 'POST'], // Métodos permitidos
  allowedHeaders: ['Content-Type'] // Encabezados permitidos
}));

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

app.use('/', emailRoutes);
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
