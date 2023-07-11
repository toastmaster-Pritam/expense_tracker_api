import express from "express";
import {
  createInc,
  deleteIncome,
  fetchAllInc,
  fetchSingleInc,
  updateIncome,
} from "../controllers/incomeController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const incomeRoute = express.Router();

incomeRoute.route("/").post(isLoggedIn, createInc);
incomeRoute.route("/all").get(isLoggedIn, fetchAllInc);
incomeRoute
  .route("/:id")
  .get(isLoggedIn, fetchSingleInc)
  .put(isLoggedIn, updateIncome)
  .delete(deleteIncome);

export default incomeRoute;
