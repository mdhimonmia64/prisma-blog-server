import { prisma } from "../../lib/prisma";

const getPost = async() => {
    const result = await prisma.post.findMany();
    return result;
};

export const getService = {
    getPost
}