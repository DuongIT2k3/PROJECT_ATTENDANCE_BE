import Router from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import attendaceRoutes from "./modules/attendance/attendance.routes.js";
import classRoutes from "./modules/class/class.routes.js";
import majorRoutes from "./modules/major/major.routes.js";
import sessionRoutes from "./modules/session/session.routes.js";
import subjectRoutes from "./modules/subject/subject.routes.js";
import userRoutes from "./modules/user/user.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/attendances", attendaceRoutes);
routes.use("/classes", classRoutes);
routes.use("/majors", majorRoutes);
routes.use("/sessions", sessionRoutes);
routes.use("/subjects", subjectRoutes);
routes.use("/users", userRoutes);

export default routes;