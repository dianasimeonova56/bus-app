import express from 'express';
import cors from 'cors';
import { initDatabase } from './config/dbConfig.js';
import { initTripCron } from './tripGenerator.js'
import routes from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(routes);

initDatabase();
initTripCron();

app.get('/', (req, res) => {
  res.send('Server is running...');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
