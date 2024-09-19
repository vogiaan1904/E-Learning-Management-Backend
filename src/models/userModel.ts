import mongoose, { Schema, Document } from 'mongoose'

interface UserDoc extends Document {
    email: string
    password: string
    firstName: string
    lastName: string
    salt: string
    verified: boolean
    otp: number
    otp_expiry: number
}

const UserSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        salt: { type: String, required: true },
        firstName: { type: String },
        lastName: { type: String },
        address: { type: String },
        verified: { type: Boolean, required: true },
        otp: { type: Number, required: true },
        otp_expiry: { type: Date, required: true },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password
                delete ret.salt
                delete ret.__v
                delete ret.updatedAt
                delete ret.createdAt
            },
        },
        timestamps: true,
    }
)
