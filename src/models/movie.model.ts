import { Schema, model } from "mongoose";

interface IMovieSchema {
  film_name: string;
  image: string;
  genre: number;
  release_year: number;
  createAt?: Date;
  updateDate?: Date;
}

const movieSchema = new Schema<IMovieSchema>(
  {
    film_name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    genre: {
      type: Number,
      required: true,
    },
    release_year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const MovieModel = model<IMovieSchema>("Movie", movieSchema);

export default MovieModel;
