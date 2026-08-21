import { getService } from "./get.service";
import { Request, Response } from "express";

const getPost = async(req:Request,res:Response) => {
    try{
        const result = await getService.getPost();
        res.status(200).json({
            success:true,
            data:result
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Failed to get posts'
        })
    }
};

export const getController = {
    getPost
}