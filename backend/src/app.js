import { express, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(cors(
    {
        origin: process.env.Cors_Origin ,
        credentials: true, // Allow cookies to be sent
    }
))

app.use(express.json({ // this is for json data limit and handle json data
    limit: '50mb'
}));

app.use (express.static('public')) // this is for static file like image css js

app.use(urlencoded( // this is for form data limit and handle data comming from url
    {extended:true, limit:'50mb'}
))

app.use(cookieParser()); // ye cookie ko handle karne ke liye use hota hai

export { app };
