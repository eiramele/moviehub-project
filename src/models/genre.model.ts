import { Schema, model } from "mongoose";

interface iGenreSchema {
  name: String;
}

const genreSchema = new Schema<iGenreSchema>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const GenreModel = model<iGenreSchema>("Genre", genreSchema);

export default GenreModel;
