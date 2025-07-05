import { swaggerSpec } from "./lib/swagger";
import healthRouter from "./routes/health";
import "dotenv/config";
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('tiny'));

// ----- V1 -----
app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/v1/health', healthRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});