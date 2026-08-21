import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
        
    }),
    trustedOrigins:[process.env.APP_URL!],
    user:{
      additionalFields:{
        role:{
          type:"string",
          defaultValue:"USER",
          required:false
        },
        phone:{
          type:"string",
          required:false
        },
        status:{
          type:"string",
          defaultValue:"ACTIVE",
          required:false
        }
      }
    },
    emailAndPassword: { 
    enabled: true,
    autoSignIn:false,
    requireEmailVerification:true 
  },
  emailVerification:{
    sendOnSignUp:true,
     autoSignInAfterVerification: true,
    sendVerificationEmail:async({user,url,token},request) => {
     try{
         const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
       const info = await transporter.sendMail({
    from: '"Prisma Blog" <prismablog@gmail.com>', // sender address
    to: user.email, // list of recipients
    subject: "Please Verify your email", // subject line
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f7fb;
        font-family: Arial, Helvetica, sans-serif;
      ">

        <div style="
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        ">

          <!-- Header -->
          <div style="
            background-color: #4f46e5;
            padding: 30px;
            text-align: center;
          ">
            <h1 style="
              margin: 0;
              color: #ffffff;
              font-size: 28px;
            ">
              Prisma Blog
            </h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 35px;">

            <h2 style="
              margin-top: 0;
              color: #222222;
            ">
              Verify Your Email
            </h2>

            <p style="
              color: #555555;
              font-size: 16px;
              line-height: 1.6;
            ">
              Welcome to <strong>${user.name}</strong>!
            </p>

            <p style="
              color: #555555;
              font-size: 16px;
              line-height: 1.6;
            ">
              Thanks for creating an account. Please verify your email
              address by clicking the button below.
            </p>

            <!-- Button -->
            <div style="
              text-align: center;
              margin: 35px 0;
            ">
              <a
                href="${verificationUrl}"
                style="
                  display: inline-block;
                  padding: 14px 28px;
                  background-color: #4f46e5;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 8px;
                  font-size: 16px;
                  font-weight: bold;
                "
              >
                Verify My Email
              </a>
            </div>

            <p style="
              color: #777777;
              font-size: 14px;
              line-height: 1.6;
            ">
              If the button doesn't work, copy and paste the following
              URL into your browser:
            </p>

            <p style="
              word-break: break-all;
              background-color: #f5f5f5;
              padding: 12px;
              border-radius: 6px;
              font-size: 13px;
            ">
              ${url}
            </p>

            <p style="
              color: #777777;
              font-size: 14px;
              line-height: 1.6;
            ">
              If you didn't create an account on Prisma Blog, you can
              safely ignore this email.
            </p>

          </div>

          <!-- Footer -->
          <div style="
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
          ">
            <p style="
              margin: 0;
              color: #888888;
              font-size: 13px;
            ">
              © 2026 Prisma Blog. All rights reserved.
            </p>
          </div>

        </div>

      </body>
    </html>
  `,
  });
     }catch(error){
      console.error(error)
      throw error
     }
    }
  },
  socialProviders: {
        google: { 
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});