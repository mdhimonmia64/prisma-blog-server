import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req:Request,res:Response) => {
    try{
        const user = req.user;
        req.body.authorId = user?.id
        const result = await CommentService.createComment(req.body);
        res.status(201).json(result)
    }catch(e){
        const errorMessage = (e instanceof Error) ? e.message : "Comment creation failed" 
        res.status(400).json({
            error:errorMessage,
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
        const errorMessage = (e instanceof Error) ? e.message : "Comment id failed"
        res.status(404).json({
            error:errorMessage,
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
        const errorMessage = (e instanceof Error) ? e.message : "Comment authorId failed"
        res.status(400).json({
            success:false,
            error:errorMessage,
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
        const errorMessage = (e instanceof Error) ? e.message : "Comment delete failed"
        res.status(400).json({
            success:false,
            error : errorMessage,
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
        const errorMessage = (e instanceof Error) ? e.message : "Comment update failed"
        res.status(400).json({
            success:false,
            error:errorMessage,
            details:e
        })
    }
}

const moderateComment = async (req:Request,res:Response) => {
    try{
        const {commentId} = req.params
        const result = await CommentService.moderateComment(commentId as string,req.body);
        res.status(200).json(result)
    }catch(e){
        const errorMessage = (e instanceof Error) ? e.message : "Comment update failed"
        res.status(400).json({
            success:false,
            error:errorMessage,
            details:e
        })
    }
}

export const CommentController = {
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}