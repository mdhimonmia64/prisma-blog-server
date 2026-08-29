import express, { Router } from 'express';
import { postController } from './post.controller';
import auth, { UserRole } from '../../middleware/auth';


const router = express.Router();

router.get("/",postController.getAllPost)

router.get("/my-posts",auth(UserRole.USER,UserRole.ADMIN),postController.getMyPosts)

router.get("/:id",postController.getSinglePost)

router.post("/",auth(UserRole.USER,UserRole.ADMIN),postController.createPost)

router.patch("/:id",postController.updatePost)

router.delete("/:id",postController.deletePost)

export const postRouter:Router = router;