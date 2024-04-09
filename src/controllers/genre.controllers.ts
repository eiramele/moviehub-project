import { Request, Response } from "express";

import prisma from "../db/client";

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const allGenres = await prisma.genre.findMany();
    res.status(200).send(allGenres);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createGenre = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).send({ message: "Name is required" });
  }
  try {
    const genre = await prisma.genre.create({
      data: { name },
    });
    res.status(201).send(genre);
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
    const genreUpdated = await prisma.genre.update({
      where: { id: genreId },
      data: { name },
    });
    res.status(201).send(genreUpdated);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  const { genreId } = req.params;
  try {
    const genreDeleted = await prisma.genre.delete({ where: { id: genreId } });
    res.status(201).send(genreDeleted);
  } catch (error) {
    res.status(400).send(error);
  }
};
