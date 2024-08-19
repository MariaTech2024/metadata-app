import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import metadataRoutes from './routes/metadataRoutes.js'; 
import { config } from 'dotenv';

config(); 

const app = express();
const PORT = process.env.PORT || 5000;
const rateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // Limit each IP to 5 requests per windowMs
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'https://metadata-app-plum.vercel.app', 
  methods: 'GET,POST', 
  credentials: true 
}));

app.use(rateLimiter);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use('/', metadataRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});