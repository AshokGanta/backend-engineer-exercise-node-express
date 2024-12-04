import express from 'express'
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import routes from '../src/routes/routes';


var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
const bodyParser = require('body-parser');

// Use body-parser middleware
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cors(corsOptions))

app.use(routes);

// API documentation (swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = app.listen(5001, () =>
  console.log(`
🚀 Server ready at: http://localhost:5001
⭐️ See the API documentation at: http://localhost:5001/api-docs`),
)