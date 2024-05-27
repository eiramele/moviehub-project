import { Request, Response } from "express";
import prisma from "../db/client";

export const getSearch = async (req: Request, res: Response) => {
  const { query } = req.query;
  console.log(req.query);
  try {
    const movies = await prisma.movies.findMany({
      where: {
        OR: [{ film_name: { contains: query as string, mode: "insensitive" } }],
      },
    });

    const moviesToSend = movies.map(({ id, film_name, image }) => ({
      id,
      film_name,
      image,
    }));

    res.status(201).send({
      msg: "Here is your information",
      data: {
        moviesToSend,
      },
      typeofMovies: typeof movies,

      isArrayMovies: Array.isArray(movies),
    });
  } catch (error) {
    res.status(400).send({ msg: "Error", error });
  }
};
