import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
    try{

        const adminData = {
            name:process.env.NAME,
            email:process.env.EMAIL!,
            role:UserRole.ADMIN,
            password:process.env.PASSWORD
        }
        console.log("**** Checking Admin Exist or not")
        const existingUser = await prisma.user.findUnique({
            where:{
                email:adminData.email as string
            }
        })

        if(existingUser){
            throw new Error("User already exists")
        }
        
        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Origin":"http://localhost:4000",
            },
            body:JSON.stringify(adminData)
        })

        
        if(signUpAdmin.ok){
            console.log("**** Admin created")
            await prisma.user.update({
                where:{
                    email:adminData.email
                },
                data:{
                    emailVerified:true
                }
            })
            console.log("**** Email verification status updated!")
        }

        console.log("****success")
        console.log(signUpAdmin)

        

    }catch(error){
        console.error(error);
    }
}

seedAdmin();