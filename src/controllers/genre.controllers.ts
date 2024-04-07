import { Request, Response } from "express";
import GenreModel from "../models/genre.model";

export const createGenre = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).send({ message: "Name is required" });
  }
  try {
    const genre = await GenreModel.create({
      name,
    });
    res.status(201).send(genre);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const allGenres = await GenreModel.find();
    res.status(200).send(allGenres);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateGenre = async (req: Request, res: Response) => {};

export const deleteGenre = async (req: Request, res: Response) => {};
