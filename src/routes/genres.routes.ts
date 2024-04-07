import { Router } from "express";
import {
  createGenre,
  deleteGenre,
  getAllGenres,
  updateGenre,
} from "../controllers/genre.controllers";

const genreRoutes = Router();

genreRoutes.post("/", createGenre);
genreRoutes.get("/", getAllGenres);
genreRoutes.patch("/:genreId", updateGenre);
genreRoutes.delete("/:genreId", deleteGenre);

export default genreRoutes;
