import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await prisma.movies.findMany({
      include: { genre: true },
    });
    res.status(201).send({
      msg: "All movies shown",
      data: allMovies,
      typeof: typeof allMovies,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getOneMovie = async (req: Request, res: Response) => {
  const movieId = parseInt(req.params.movieId);
  try {
    const movie = await prisma.movies.findFirst({
      where: {
        id: movieId,
      },
      select: {
        film_name: true,
        genre: {
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
        release_year: true,
        image: true,
      },
    });

    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    }

    const movieWithGenre = {
      ...movie,
      genre: movie.genre[0]?.genre.name,
    };
    res.status(201).send({
      msg: "Movie shown",
      data: movieWithGenre,
      typeof: typeof movie,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createMovie = async (req: Request, res: Response) => {
  const { film_name, image, genre, release_year } = req.body;
  const userId = parseInt(req.params.userId);

  if (!film_name || !image || !release_year) {
    return res
      .status(400)
      .send({ message: "Film name, image and release year are required" });
  } else {
    try {
      const movie = await prisma.$transaction(async (prisma) => {
        const newMovie = await prisma.movies.create({
          data: {
            film_name,
            image,
            userId,
            release_year,
          },
        });

        const genreLowerCase = genre.toLowerCase();

        const foundGenre = await prisma.genre.findUnique({
          where: {
            name: genreLowerCase,
          },
        });
        if (foundGenre) {
          await prisma.movieGenre.create({
            data: {
              movieId: newMovie.id,
              genreId: foundGenre.id,
            },
          });
        } else {
          throw new Error(`Genre ${genre} not found`);
        }

        return prisma.movies.findUnique({
          where: {
            id: newMovie.id,
          },
          include: {
            genre: true,
          },
        });
      });

      res.status(201).send({
        msg: "Movie created successfully",
        data: movie,
        typeof: typeof movie,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  const { film_name, image, genre: genreName, release_year } = req.body; // Utilitza genreName aquí
  const movieId = parseInt(req.params.movieId);

  const updateData = {
    film_name,
    image,
    release_year,
  };

  if (Object.keys(updateData).length === 0 && !genreName) {
    return res.status(400).send({ message: "No update fields provided." });
  }

  try {
    const movieUpdated = await prisma.$transaction(async (prisma) => {
      if (Object.keys(updateData).length > 0) {
        await prisma.movies.update({
          where: { id: movieId },
          data: updateData,
        });
      }

      if (genreName && genreName.trim() !== "") {
        const foundGenre = await prisma.genre.findFirst({
          where: {
            name: {
              equals: genreName,
              mode: "insensitive",
            },
          },
        });

        if (!foundGenre) {
          return res.status(404).send({ message: "Genre not found." });
        }

        const existingGenres = await prisma.movieGenre.findMany({
          where: { movieId: movieId },
        });

        const existingGenreIds = existingGenres.map((g) => g.genreId);

        if (!existingGenreIds.includes(foundGenre.id)) {
          await prisma.movieGenre.deleteMany({
            where: {
              movieId: movieId,
            },
          });

          await prisma.movieGenre.create({
            data: {
              movieId: movieId,
              genreId: foundGenre.id,
            },
          });
        }
      }

      return prisma.movies.findUnique({
        where: { id: movieId },
        include: {
          genre: true,
        },
      });
    });

    res.status(201).send({
      msg: "Movie updated successfully",
      data: movieUpdated,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  const movieId = parseInt(req.params.movieId);

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.movieGenre.deleteMany({
        where: {
          movieId: movieId,
        },
      });

      await prisma.movies.delete({
        where: { id: movieId },
      });
    });

    res.status(200).send({
      msg: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).send({
      error,
    });
  }
};
