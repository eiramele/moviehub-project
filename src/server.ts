import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import userRouter from "./routes/user.routes";
import movieRoutes from "./routes/movies.routes";

const app = express();

app.use(helmet());
app.use(morgan("tiny"));

app.use(express.json());
app.use("/user", userRouter);
app.use("/movie", movieRoutes);

export default app;
