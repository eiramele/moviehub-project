import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import userRouter from "./routes/user.routes";
import movieRoutes from "./routes/movies.routes";
import genreRoutes from "./routes/genres.routes";

const cors = require('cors')
const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors())
app.use(
    cors({
      origin: process.env.APP_ORIGIN,
    })
  );
app.use("/api/user", userRouter);
app.use("/api/movie", movieRoutes);
app.use("/api/genre", genreRoutes);

export default app;
