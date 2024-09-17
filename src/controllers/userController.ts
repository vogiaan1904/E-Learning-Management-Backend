import express, { Request, Response, NextFunction } from 'express'

export const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.json({ message: 'welcome' })
}
