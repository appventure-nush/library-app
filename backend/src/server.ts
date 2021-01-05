import * as bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import { startCronJobs } from 'crons';
import express, { Application, Router } from 'express';
import Booking from 'models/Booking';
import Room from 'models/Room';
import User from 'models/User';
import UserStats from 'models/UserStats';

import routes from './config/routes';

const corsOptions: CorsOptions = {
  origin: process.env.NODE_ENV === 'production' ? /.*library\.nush\.app.*/ : '*',
};

class ApiServer {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.app.use('/', routes);
    this.setupAssociation();
    startCronJobs();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors(corsOptions));
  }

  // Associations need to be setup later to enforce sequence
  private setupAssociation(): void {
    Booking.associate();
    Room.associate();
    User.associate();
    UserStats.associate();
  }
}

export default new ApiServer().app;
