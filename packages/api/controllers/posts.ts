import { Request, Response } from "express";
import { createPost, findAllPosts, findPostById } from "../models/Post";
import { requiredFieldsCheck } from ".";

export const handleNewPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const missingFields = requiredFieldsCheck({...req.body, user_id:
     req.user?.userId}, ["channel_id", "text", "user_id"]);
  if (missingFields.length === 0) {
    try {
      const post = await createPost({ ...req.body, user_id: parseInt(req.user?.userId) });
      res.status(201).json(post);

    } catch (err) {
      if (err instanceof Error) {
        res.status(409).json({ error: err.message });
      }
    }
  } else {
    res.status(400).json({
      error: "Missing required fields",
      missingFields,
    });
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const posts = await findAllPosts();
  res.json(posts);
};

export const getPostById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const post = await findPostById(parseInt(req.params.id));
  res.json(post);
};

export const editPost = async (req: Request, res: Response): Promise<void> => {
  res.json({ post: { message: "Post updated" } });
};

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.json({ message: "Post deleted" });
};