import dotenv from "dotenv";
import path from "path";
import { authConfig } from "./config/auth.js";
import { connectDb } from "./config/db.js";
import session from "express-session";
import passport from "passport";
import userRouter from "./routes/user.Routes.js";
import express from "express";
import { errorHandler, notFound } from "./middlewares/error.js";
import incomeRoute from "./routes/income.Routes.js";
import expenseRoute from "./routes/expense.Routes.js";
import cors from "cors";

const app = express();

dotenv.config({ path: path.join(path.resolve(), "./config/.env") });

connectDb();

authConfig(passport);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 3600 * 1000 * 5,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/income", incomeRoute);
app.use("/api/v1/expense", expenseRoute);

// error middleware
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server working on http://localhost:${process.env.PORT} on ${process.env.NODE_ENV} mode`);
});
