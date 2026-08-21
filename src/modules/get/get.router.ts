import express, { Router } from 'express';
import { getController } from './get.controller';

const router = express.Router();

router.get('/',getController.getPost)

export const getRouter:Router = router;