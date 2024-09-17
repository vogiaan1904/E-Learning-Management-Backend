import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../exceptions/root'

export const ErrorMiddleware = async (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode).json({
        messsage: error.message,
        errorCode: error.errorCode,
        errors: error.errors,
    })
}
