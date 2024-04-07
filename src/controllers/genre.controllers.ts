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

export const updateGenre = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { genreId } = req.params;
  const updateData: { name?: string } = {};

  if (name) updateData.name = name;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).send({ message: "No update fields provided." });
  }

  try {
    const genreUpdated = await GenreModel.findByIdAndUpdate(
      { _id: genreId },
      { name },
      { new: true }
    ).populate("genre");
    res.status(201).send(genreUpdated);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  const { genreId } = req.params;
  try {
    const genreDeleted = await GenreModel.findOneAndDelete({ _id: genreId });
    res.status(201).send(genreDeleted);
  } catch (error) {
    res.status(400).send(error);
  }
};
