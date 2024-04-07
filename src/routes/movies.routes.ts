import { Router } from "express";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
} from "../controllers/movie.controllers";

const movieRoutes = Router();

movieRoutes.post("/:userId", createMovie);
movieRoutes.get("/", getAllMovies);
movieRoutes.patch("/:movieId", updateMovie);
movieRoutes.delete("/:movieId", deleteMovie);

export default movieRoutes;
