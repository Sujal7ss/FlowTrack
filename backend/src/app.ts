import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(helmet());

const allowedOrigins = process.env.CLIENT_URLS?.split(",") || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200
}));

app.use('/api', routes);
app.use(errorHandler);

export default app;
