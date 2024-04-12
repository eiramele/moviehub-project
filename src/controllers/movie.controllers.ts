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

export const createMovie = async (req: Request, res: Response) => {
  const { film_name, image, genres, release_year } = req.body;
  const userId = parseInt(req.params.userId);

  if (!film_name) {
    return res.status(400).send({ message: "Film name is required" });
  }
  if (!image) {
    return res.status(400).send({ message: "Image is required" });
  }

  if (!release_year) {
    return res.status(400).send({ message: "Release year is required" });
  }

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

      if (genres && genres.length) {
        const createGenres = genres.map((genreId: number) => ({
          movieId: newMovie.id,
          genreId: genreId,
        }));

        await prisma.movieGenre.createMany({
          data: createGenres,
        });
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
};

export const updateMovie = async (req: Request, res: Response) => {
  const { film_name, image, genres, release_year } = req.body;
  const movieId = parseInt(req.params.movieId);

  const updateData = {
    film_name,
    image,
    release_year,
  };

  if (
    Object.keys(updateData).length === 0 &&
    (!genres || genres.length === 0)
  ) {
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

      const currentGenresConnections = await prisma.movieGenre.findMany({
        where: { movieId: movieId },
      });

      const currentGenreIds = currentGenresConnections.map(
        (connection) => connection.genreId
      );

      const genresToDisconnect = currentGenreIds.filter(
        (id) => !genres.includes(id)
      );
      if (genresToDisconnect.length > 0) {
        await prisma.movieGenre.deleteMany({
          where: {
            movieId: movieId,
            genreId: { in: genresToDisconnect },
          },
        });
      }

      const newGenresToConnect = genres.filter(
        (id: number) => !currentGenreIds.includes(id)
      );
      const genreConnections = newGenresToConnect.map((genreId: number) => ({
        movieId: movieId,
        genreId: genreId,
      }));

      if (genreConnections.length > 0) {
        await prisma.movieGenre.createMany({
          data: genreConnections,
          skipDuplicates: true,
        });
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
      typeof: typeof movieUpdated,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  const movieId = parseInt(req.params.movieId);
  try {
    const movieDeleted = await prisma.movies.delete({ where: { id: movieId } });
    res.status(201).send({
      msg: "Movie delated successfully",
      data: movieDeleted,
      typeof: typeof movieDeleted,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
