import {Request,Response} from 'express';
import { postService } from './post.service';
import { PostStatus } from '../../../generated/prisma/enums';
import paginationSortingHelper from '../../helpers/paginationSortingHelper';
import { UserRole } from '../../middleware/auth';


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

        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
        
        const isFeatured = req.query.isFeatured 
        ? req.query.isFeatured === 'true'
            ? true 
            : req.query.isFeatured === 'false' 
                ? false 
                : undefined 
        : undefined


        const status = req.query.status as PostStatus | undefined

        const authorId = req.query.authorId as string | undefined

        // const page = Number(req.query.page ?? 1)
        // const limit = Number(req.query.limit ?? 10)

        // const skip = (page - 1) * limit

        // const sortBy = req.query.sortBy as string | undefined
        // const sortOrder = req.query.orderBy as string | undefined

        const {page,limit,skip,sortBy,sortOrder} = paginationSortingHelper(req.query);
        

        const result = await postService.getAllPost({search:searchString,tags,isFeatured,status,authorId,page,limit,skip,sortBy,sortOrder});
        res.status(200).json({
            success:true,
            data:result
        })
    }catch(error){
        const errorMessage = (error instanceof Error) ? error.message : 'get failed'
        res.status(400).json({
            success:false,
            error: errorMessage,
            details:error
        })
    }
}

const getSinglePost = async (req:Request,res:Response) => {
    try{
        const {id }= req.params
        if(!id){
            throw new Error("Post Id is required")
        }
        const result = await postService.getSinglePost(id as string);
        res.status(200).json({
            success:true,
            data:result
        })
    }catch(error){
        const errorMessage = (error instanceof Error) ? error.message : 'single data not found'
        res.status(400).json({
            success:false,
            error: errorMessage,
            details:error
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
        const errorMessage = (error instanceof Error) ? error.message : "not updated data"
        res.status(400).json({
            success:false,
            error: errorMessage,
            details:error
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
        const errorMessage = (error instanceof Error) ? error.message : 'data not deleted'
        res.status(400).json({
            success:false,
            error:errorMessage,
            details:error
        })
    }
}

const getMyPosts = async (req:Request,res:Response) => {
    try{
        const user = req.user;
        if(!user){
            throw new Error('You are unauthorized!')
        }
        console.log(user)
        const result = await postService.getMyPosts(user.id)
        res.status(200).json(result)
    }catch(e){
        const errorMessage = (e instanceof Error) ? e.message : "data not found"
        res.status(400).json({
            success:false,
            error:errorMessage,
            details:e
        })
    }
}

const updatePosts = async (req:Request,res:Response) => {
    try{
        const user = req.user
        if(!user){
            throw new Error("You are unauthorized!")
        }
        const {postId} = req.params
        const isAdmin = user.role === UserRole.ADMIN
        console.log(user)
        const result = await postService.updatePosts(postId as string,req.body,user?.id,isAdmin)
        res.status(200).json(result)
    }catch(e){
        const errorMessage = (e instanceof Error) ? e.message : "data not updated"
        res.status(400).json({
            success:false,
            message:errorMessage,
            details:e
        })
    }
}

const deletePosts = async (req:Request,res:Response) => {
    try{
        const user = req.user
        if(!user){
            throw new Error('You are unauthorized!')
        }
        const {postId} = req.params
        const isAdmin = user.role === UserRole.ADMIN
        const result = await postService.deletePosts(postId as string,user?.id,isAdmin)
        res.status(200).json(result)
    }catch(e){
        const errorMessage = (e instanceof Error) ? e.message : 'data deleted failed!'
        res.status(400).json({
            success:false,
            message:errorMessage,
            details:e
        })

    }
}

export const postController = {
    createPost,
    getAllPost,
    getSinglePost,
    updatePost,
    deletePost,
    getMyPosts,
    updatePosts,
    deletePosts
}