import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req:Request,res:Response) => {
    try{
        const user = req.user;
        req.body.authorId = user?.id
        const result = await CommentService.createComment(req.body);
        res.status(201).json(result)
    }catch(e){
        res.status(400).json({
            error:"Comment creation failed",
            details:e
        })
    }
};

const getCommentById = async (req:Request,res:Response) => {
    try{
        const {commentId} = req.params;
        const result = await CommentService.getCommentById(commentId as string)
        res.status(200).json(result)
    }catch(e){
        res.status(404).json({
            error:"Comment id failed",
            details:e
        })
    }
}

const getCommentByAuthor = async (req:Request,res:Response) => {
    try{
        const {authorId} = req.params
        const result = await CommentService.getCommentByAuthor(authorId as string)
        res.status(200).json(result)
    }catch(e){
        res.status(400).json({
            success:false,
            error:"Comment authorId failed",
            details:e
        })
    }
}

const deleteComment = async (req:Request,res:Response) => {
    try{
        const user = req.user
        const {commentId} = req.params
        const result = await CommentService.deleteComment(commentId as string,user?.id as string);
        res.status(200).json(result)
    }catch(e){
        res.status(400).json({
            success:false,
            error : "Comment delete failed",
            details:e
        })
    }
}

const updateComment = async (req:Request,res:Response) => {
    try{
        const user = req.user;
        const {commentId} = req.params;
        const result = await CommentService.updateComment(commentId as string,req.body,user?.id as string)
        res.status(200).json(result)
    }catch(e) {
        console.log(e)
        res.status(400).json({
            success:false,
            error:"Comment update failed",
            details:e
        })
    }
}

export const CommentController = {
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment,
    updateComment
}