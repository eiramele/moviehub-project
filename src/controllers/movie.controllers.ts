import { Request, Response } from "express";
import MovieModel from "../models/movie.model";
import UserModel from "../models/user.model";

export const createMovie = async (req: Request, res: Response) => {
  const { film_name, image, genre, release_year } = req.body;
  const { userId } = req.params;

  try {
    const movie = await MovieModel.create({
      film_name,
      image,
      genre,
      release_year,
    });
    await UserModel.findByIdAndUpdate(
      { _id: userId },
      { $push: { movies: movie._id } }
    );
    res.status(201).send(movie);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await MovieModel.find();
    res.status(201).send(allMovies);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  const { film_name, image, genre, release_year } = req.body;
  const { movieId } = req.params;

  const updateData: {
    film_name?: string;
    image?: string;
    genre?: string;
    release_year?: number;
  } = {};
  if (film_name) updateData.film_name = film_name;
  if (image) updateData.image = image;
  if (genre) updateData.genre = genre;
  if (release_year) updateData.release_year = release_year;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).send({ message: "No update fields provided." });
  }

  try {
    const movieUpdated = await MovieModel.findByIdAndUpdate(
      { _id: movieId },
      { film_name, image, genre, release_year },
      { new: true }
    );
    res.status(201).send(movieUpdated);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  try {
    const movieDeleted = await MovieModel.findOneAndDelete({ _id: movieId });
    res.status(201).send(movieDeleted);
  } catch (error) {
    res.status(400).send(error);
  }
};


