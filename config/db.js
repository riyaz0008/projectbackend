import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const uri=process.env.USE_PROXY === "true"
        ? process.env.USE_PROXY
        : process.env.PROXY
        const conn = await mongoose.connect(process.env.MONGODB_URI_PROXY)
        console.log(`connected success fully:${conn.connection.host}`)

    } catch(error){
        console.log(`connection error:${error.message}`)
    }
}

export default connectDb