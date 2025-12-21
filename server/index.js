import express from 'express'
import cors from 'cors'
import route  from './routes/route.js';
import { conntectTodb } from './database/db.js';

import { authentication } from './middleware/AuthenicteAdmin.js';

const app = express();
const Port = process.env.port;

app.use(cors({
    origin:['https://nitsxrblogs.netlify.app','https://blogsadmin.netlify.app']
}))
app.disable("x-powered-by");

//database connected
conntectTodb();

app.use(express.json());

//admin login,videos images all here get
app.use('/',route);

//can upload images videos
app.use('/upload/file', authentication, route);


app.listen(Port,(e)=>{
    console.log(`running at port no :${Port}`)
})