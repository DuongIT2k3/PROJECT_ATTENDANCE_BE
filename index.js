import express from "express";
import cors from 'cors'
import connectDB from './src/common/configs/db.js'
import setupSwagger from "./src/common/configs/swagger-config.js";
import { HOST, PORT } from "./src/common/configs/environments.js";
import routes from "./src/routes.js";
import jsonValidator from './src/common/middlewares/json-valid.middlewares.js'
import notFoundHandler from './src/common/middlewares/not-found.middlewares.js'
import errorHandler from "./src/common/middlewares/error.middlewares.js";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

setupSwagger(app);

connectDB();

app.use("/api", routes);

app.use(jsonValidator);
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server is running on: http://${HOST}:${PORT}/api`);
    console.log(`Swagger Docs available at http://${HOST}:${PORT}/api-docs`);
})

process.on("unhandledRejection", (error, promise) => {
	console.error(`Error: ${error.message}`);
	server.close(() => process.exit(1));
});
export default app;