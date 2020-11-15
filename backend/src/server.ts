import express, { Application, Router } from 'express';
import * as bodyParser from 'body-parser';
import routes from './config/routes';
import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: process.env.NODE_ENV === 'production' ? /.*library\.nush\.app.*/ : '*',
};

class ApiServer {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.app.use('/', routes);
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors(corsOptions));
  }
}

export default new ApiServer().app;
