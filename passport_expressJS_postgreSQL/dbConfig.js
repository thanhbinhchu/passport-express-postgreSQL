require('dotenv').config();

const { Pool } = require('pg');


const isProduction = process.env.NODE_ENV === "production";

// const connection = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// const pool = new Pool ({
//     connection : isProduction ? process.env.DATABASE_URL : connection,
//     ssl : isProduction

// });

const pool = new Pool ({
    user: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_DATABASE}`,
    password: `${process.env.DB_PASSWORD}`,
    port: `${process.env.DB_PORT}`,
    ssl: isProduction
});

module.exports = { pool };
