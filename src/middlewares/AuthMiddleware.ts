// import { NextFunction, Request, Response } from 'express'
// import { ErrorCode, UnauthorizedException } from '../exceptions'
// import jwt from 'jsonwebtoken'
// import { SECRET_KEY } from '../config'
// import { AuthPayload } from '../dto/Auth.dto'
// import { VandorService } from '../services'
// import { VandorRepository } from '../repository'
// import { ValidateSignature } from '../utility'

// export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = await ValidateSignature(req)
//         if (validate) {
//             next()
//         }
//         return
//     } catch (error: any) {
//         if (error.name === 'JsonWebTokenError') {
//             next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
//         } else if (error.name === 'TokenExpiredError') {
//             next(new UnauthorizedException('Token expired', ErrorCode.UNAUTHORIZED))
//         } else {
//             next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
//         }
//     }
// }
