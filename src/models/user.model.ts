import { Schema, model } from "mongoose";

interface iUserSchema {
  name: String;
  email: String;
  password: String;
  movies: String[];
  createAt?: Date;
  updateAt?: Date;
}

const userSchema = new Schema<iUserSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    movies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = model<iUserSchema>("User", userSchema);

export default UserModel;
