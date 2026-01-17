import mongoose from "mongoose";

//DB CONNECT
export const dbConnect = async () => {
    try {


        mongoose.connection.on("connected", () => {
            console.log(`db is connected successfully name: ${mongoose.Connection.name}, port: ${mongoose.connection.port}`);
        });

        let connect = await mongoose.connect(`${process.env.MONGODB_URI}/ChatApp`);


    } catch (error) {
        console.log(`db is not connect something went wrong`);
    }
}
