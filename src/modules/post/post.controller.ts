import {Request,Response} from 'express';
import { postService } from './post.service';
import { success } from 'better-auth';


const createPost = async(req:Request,res:Response) => {
    try{
        const user = req.user;
        if(!user){
            return res.status(400).json({
                error:"Unauthorized"
            })
        }
        const result = await postService.createPost(req.body,user.id as string);
        res.status(201).json(result)
    }catch(err){
        res.status(400).json({
            error:'Post creation failed',
            details:err
        })
    }
};

const getAllPost = async(req:Request,res:Response) => {
    try{
        const result = await postService.getAllPost();
        res.status(200).json({
            success:true,
            data:result
        })
    }catch(error){
        res.status(400).json({
            success:false,
            error:'get failed'
        })
    }
}

export const postController = {
    createPost,
    getAllPost
}