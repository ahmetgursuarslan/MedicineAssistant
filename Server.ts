import * as dotenv from 'dotenv';
dotenv.config();
import express = require('express');
import { Application } from 'express';

import Index from './src/index';

const app: Application = express();
const server: Index = new Index(app);
const envPort = process.env.PORT ? process.env.PORT : "";
const port: number = parseInt(envPort, 10) || 3000;

app.listen(port, 'localhost',() => function(err: any) {
  if (err) return err;
  console.info(`Server running on : http://localhost:${port}`);
});
