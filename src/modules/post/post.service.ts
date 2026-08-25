import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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


const getAllPost = async({search,tags,isFeatured,status,authorId,page,limit}:{search:string | undefined,tags:string[] | [],isFeatured:boolean | undefined,status:PostStatus | undefined,authorId:string | undefined,page:number,limit:number}) => {

    const andConditions:PostWhereInput[] = []

    if(search){
        andConditions.push({   
            OR:[
                {
                    title:{
                        contains:search as string,
                        mode:"insensitive"
                    }
                },
                {
                    content:{
                        contains:search as string,
                        mode:"insensitive"
                    }
                },
                {
                    tags:{
                        has:search as string,
                    }
                }
            ]
        })
    }

    if(tags.length > 0){
        andConditions.push({
                tags:{
                hasEvery:tags as string[]
            }
        })
    }

    if(typeof isFeatured === 'boolean'){
        andConditions.push({
            isFeatured
        })
    }

    if(status){
        andConditions.push({
            status
        })
    }

    if(authorId){
        andConditions.push({
            authorId
        })
    }

    const result = await prisma.post.findMany({
        where:{
            AND:andConditions
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