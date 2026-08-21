import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async(data:Omit<Post,"id" | "createdAt" | "updatedAt" | "authorId">,userId:string) => {
    const result = await prisma.post.create({
        data:{
            ...data,
            authorId:userId
        }
    })
    return result;
};

const getAllPost = async(payload:{search:string | undefined}) => {
    const result = await prisma.post.findMany({
        where:{
            OR:[
                {
                    title:{
                    contains:payload.search as string,
                    mode:"insensitive"
                    }
                },
                {
                    content:{
                        contains:payload.search as string,
                        mode:"insensitive"
                    }
                },
                {
                    tags:{
                        has:payload.search as string,
                    }
                }
            ]
        }
    });
    return result;
};

const getSinglePost = async(id:string) => {
    const result = await prisma.post.findUnique({
        where:{
            id:id
        }
    });
    return result;
};

const updatePost = async (id:string,data:any) => {
    const result = await prisma.post.update({
        where:{
            id:id
        },
        data,
    });
    return result;
}

const deletePost = async (id:string) => {
    const result = await prisma.post.delete({
        where:{
            id:id
        },
    })
    return result
}

export const postService = {
    createPost,
    getAllPost,
    getSinglePost,
    updatePost,
    deletePost
}