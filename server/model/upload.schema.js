import { Schema, model } from "mongoose";

const uploadSchema = new Schema({
   name: String,
   mimeType: String,
   path: String,
}, { timestamps: true })

export default model("Uploads", uploadSchema)