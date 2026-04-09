import express, { Router } from 'express';
import { Server } from 'http';
import * as http from 'http';

import { API } from './interfaces';
import { healthCheck } from './routes/healthCheck';
import products from './routes/product';
import roles from './routes/role';
import users from './routes/user';
import orders from './routes/order';
import orderDetails from './routes/orderDetail';
import categories from './routes/category';
import subcategories from './routes/subcategory';


export class ExpressApi implements API {
  private router: Router;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.router = Router();

    this.router.use("/products", products);
    this.router.use("/roles", roles);
    this.router.use("/users", users);
    this.router.use("/orders", orders);
    this.router.use("/orderDetails", orderDetails);
    this.router.use("/categories", categories);
    this.router.use("/subcategories", subcategories);
    // this.router.get("/health", healthCheck);
    // aqui puedes agregar más rutas
  }

  public createServer = (): Server => {
    const expressApp: express.Application = express();

    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    expressApp.use('/', this.router);

    return http.createServer(expressApp);
  }
}