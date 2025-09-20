import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const mongo_uri = process.env.mongo_uri;

export const conntectTodb = ()=>{
    try{
        mongoose.connect(mongo_uri);
        console.log(`connected to dbs`);
    }
    catch(error){
        console.log(`getting error`);
    }
}
