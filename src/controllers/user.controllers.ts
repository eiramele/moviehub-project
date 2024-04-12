import { Request, Response } from "express";

import prisma from "../db/client";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: { movies: true },
    });
    res.status(200).send({
      type: typeof allUsers,
      msg: "All users shown",
      data: allUsers,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(400).send({ message: "Name is required" });
  }
  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).send({ message: "Password is required" });
  }

  try {
    const newUser = await prisma.user.create({
      data: { name, email, password },
    });
    res.status(201).send({
      type: typeof newUser,
      msg: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userId = parseInt(req.params.userId);

  const updateData: { name?: string; email?: string; password?: string } = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = password;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).send({ message: "No update fields provided." });
  }

  try {
    const userUpdated = await prisma.user.update({
      where: { id: userId },
      data: { name, email, password },
    });
    res.status(201).send({
      type: typeof userUpdated,
      msg: "User updated successfully",
      data: userUpdated,
    });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  try {
    const userDeleted = await prisma.user.delete({ where: { id: userId } });
    res.status(200).send({
      type: typeof userDeleted,
      msg: "User delated successfully",
      data: userDeleted,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
