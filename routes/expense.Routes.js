import express from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createExp,
  deleteExp,
  fetchAllExp,
  fetchSingleExp,
  updateExp,
} from "../controllers/expenseController.js";

const expenseRoute = express.Router();

expenseRoute.route("/").post(isLoggedIn, createExp);
expenseRoute.route("/all").get(isLoggedIn, fetchAllExp);
expenseRoute
  .route("/:id")
  .get(isLoggedIn, fetchSingleExp)
  .put(isLoggedIn, updateExp)
  .delete(deleteExp);

export default expenseRoute;
