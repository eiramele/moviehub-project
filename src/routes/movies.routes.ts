import { Router } from "express";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getOneMovie,
  updateMovie,
} from "../controllers/movies.controllers";

const movieRoutes = Router();

movieRoutes.post("/:userId", createMovie);
movieRoutes.get("/", getAllMovies);
movieRoutes.get("/:movieId", getOneMovie);
movieRoutes.patch("/:movieId", updateMovie);
movieRoutes.delete("/:movieId", deleteMovie);

export default movieRoutes;
