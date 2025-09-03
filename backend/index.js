import express from "express";
import cors from "cors";





const app = express();

const port = process.env.PORT || 4000;


const allowedOrigins = ['http://localhost:5173']

app.use(express.json());

app.use(cors({ origin: allowedOrigins, credentials: true }));

// app.get('/', (req, res) => res.send("APi working"));




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


