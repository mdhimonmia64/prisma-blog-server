import express, { Router } from 'express';
import { postController } from './post.controller';
import auth, { UserRole } from '../../middleware/auth';


const router = express.Router();

router.get("/",postController.getAllPost)

router.get("/:id",postController.getSinglePost)

router.post("/",auth(UserRole.USER),postController.createPost)

router.patch("/:id",postController.updatePost)

router.delete("/:id",postController.deletePost)

export const postRouter:Router = router;