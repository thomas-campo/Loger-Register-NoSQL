import dotenv from 'dotenv';

dotenv.config();

export default {
    app:{
        PORT:process.env.PORT||8080
    },
    mongo:{
        URL:process.env.MONGO_URL||'localhost:27017'
    },
    github:{
        ID:process.env.GITHUB_ID,
        SECRET:process.env.GITHUB_SECRET,
        URL:process.env.GITHUB_URL
    },
    admin:{
        EMAIL:process.env.ADMIN_EMAIL,
        PASSWORD:process.env.ADMIN_PASSWORD
    },
    mailer:{
        USER: process.env.MAILER_USER,
        PASSWORD: process.env.MAILER_PASSWORD
    },
    jwt: {
        COOKIE: process.env.JWT_COOKIE,
        SECRET: process.env.JWT_SECRET
    }
}