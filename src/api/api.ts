import express, { Router } from 'express';
import { Server } from 'http';
import * as http from 'http';

import { API } from './interfaces';
import { healthCheck } from './routes/healthCheck';
import product from './routes/product';
import role from './routes/role';
import user from './routes/user';
import order from './routes/order';
import orderDetail from './routes/orderDetail';
import category from './routes/category';
import subcategory from './routes/subcategory';
import comparisonHistory from './routes/comparisonHistory';
import userAddress from './routes/userAddress';
import userPaymentMethod from './routes/userPaymentMethod';
import phoneUser from './routes/phoneUser';
import support from './routes/support';
import calification from './routes/calification';
import cart from './routes/cart';
import cartDetail from './routes/cartDetail';
import supplier from './routes/supplier';
import supplierCategory from './routes/supplierCategory';
import supplierPhone from './routes/supplierPhone';
import actionControl from './routes/actionControl';
import auth from './routes/auth';

export class ExpressApi implements API {
  private router: Router;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.router = Router();

    this.router.use("/products", product);
    this.router.use("/roles", role);
    this.router.use("/users", user);
    this.router.use("/orders", order);
    this.router.use("/orderDetails", orderDetail);
    this.router.use("/categories", category);
    this.router.use("/subcategories", subcategory);
    this.router.use("/comparisonHistories", comparisonHistory);
    this.router.use("/userAddresses", userAddress);
    this.router.use("/userPaymentMethods", userPaymentMethod);
    this.router.use("/phoneUsers", phoneUser);
    this.router.use("/support", support);
    this.router.use("/califications", calification);
    this.router.use("/cart", cart);
    this.router.use("/cartDetails", cartDetail);
    this.router.use("/suppliers", supplier);
    this.router.use("/supplierCategories", supplierCategory);
    this.router.use("/supplierPhones", supplierPhone);
    this.router.use("/actionControls", actionControl);
    this.router.use("/auth", auth);
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