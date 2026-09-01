import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(err:any, req:Request, res:Response, next:NextFunction) {
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  let errorDetails = err;

  // PrismaClientValidationError
  if(err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = 'You provide incorrect field type or missing required field';
  }

  // PrismaClientKnownRequestError
  else if(err instanceof Prisma.PrismaClientKnownRequestError) {
    if(err.code === 'P2025'){
      statusCode = 404;
      errorMessage = 'An operation failed because it depends on one or more records that were required but not found.';
    }
    else if(err.code === 'P2002'){
      statusCode = 409;
      errorMessage = 'Unique constraint failed on the fields: ' + err.meta?.target;
    }
    else if(err.code === 'P2003'){
      statusCode = 400;
      errorMessage = 'Foreign key constraint failed on the field: ' + err.meta?.field_name;
    }
    else if(err.code === 'P2004'){
      statusCode = 400;
      errorMessage = 'A constraint failed on the database: ' + err.meta?.constraint_name;
    }
    else if(err.code === 'P2009'){
      statusCode = 400;
      errorMessage = 'Failed to validate the query: ' + err.meta?.validation_error;
    }
  }
  else if(err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = 'An unknown error occurred while processing the request.';
  }
  else if(err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage = 'A panic occurred in the Prisma Client.';
  }
  else if(err instanceof Prisma.PrismaClientInitializationError) {
    if(err.errorCode === 'P1000'){
      statusCode = 401;
      errorMessage = 'Authentication failed.Please check your credentials!.';
    }
    else if(err.errorCode === 'P1001'){
      statusCode = 400;
      errorMessage = "Can't reach database server"
    }

  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails
  });
}

export default errorHandler;