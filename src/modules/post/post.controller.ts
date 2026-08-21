import {Request,Response} from 'express';
import { postService } from './post.service';
import { date, string, success } from 'better-auth';


const createPost = async (req:Request,res:Response) => {
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

const getAllPost = async (req:Request,res:Response) => {
    try{
        const {search} = req.query;
        const searchString = typeof search === 'string' ? search : undefined;
        const result = await postService.getAllPost({search:searchString});
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

const getSinglePost = async (req:Request,res:Response) => {
    try{
        const id = req.params.id
        const result = await postService.getSinglePost(id as string);
        res.status(200).json({
            success:true,
            data:result
        })
    }catch(error){
        res.status(400).json({
            success:false,
            error:'single data not found'
        })
    }
}

const updatePost = async (req:Request,res:Response) => {
    try{
        const id = req.params.id
        const result = await postService.updatePost(id as string,req.body);
         res.status(200).json({
            success:true,
            data:result
        })
    }catch(error){
        res.status(400).json({
            success:false,
            error:"not updated data"
        })
    }
}

const deletePost = async (req:Request,res:Response) => {
    try{
        const id = req.params.id;
        const result = await postService.deletePost(id as string);
        res.status(201).json({
            success:true,
            data:result
        })
    }catch(error){
        res.status(400).json({
            success:false,
            error:'data not deleted'
        })
    }
}

export const postController = {
    createPost,
    getAllPost,
    getSinglePost,
    updatePost,
    deletePost
}