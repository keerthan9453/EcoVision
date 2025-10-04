import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
const port = process.env.PORT;
app.listen(port, () => {

  console.log(`Server is running on http://localhost:${port}`);
});