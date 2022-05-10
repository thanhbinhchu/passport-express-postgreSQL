require('dotenv').config();

const { Pool } = require('pg');


const isProduction = process.env.NODE_ENV === "production";

const connection = `prostgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool ({
    connection : isProduction ? process.env.DATABASE_URL : connection,
    ssl : isProduction

});

module.exports = { pool };
