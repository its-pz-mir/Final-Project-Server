const expres = require('express');
const { addTeacher, loginUser, getAllUser, delTeacher, updateTeacherByAdmin, updateSelf, checkMyAuth, logoutController } = require("../controllers/AuthController");
const { checkAuth, isAdmin } = require('../config/checkAuth');
const authRouter = expres.Router();

authRouter.post("/addteacher", checkAuth, isAdmin, addTeacher);
authRouter.post("/login", loginUser)
authRouter.get("/teachers", checkAuth, getAllUser);
authRouter.delete("/del/:id", checkAuth, isAdmin, delTeacher);
authRouter.put("/adminupdate/:id", checkAuth, isAdmin, updateTeacherByAdmin)
authRouter.put("/selfupdate", checkAuth, updateSelf)
authRouter.get("/checkauth", checkMyAuth);
authRouter.get("/logout", checkAuth, logoutController)

module.exports = authRouter;