import { Router } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { isAuthWeb } from "../middlewares/auth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = Router();

router.get("/", isAuthWeb, (req, res) => {
  const { messages } = req.session;
  let message;
  if (messages) {
    req.session.messages = [];
    message = messages[messages.length - 1];
  }
  res.render("./pages/home", {
    title: "Carga de productos y Chat",
    username: req.user?.username,
    successRegister: message
  });
});

router.get("/productos-mock", isAuthWeb, (req, res) => {
  res.sendFile("productos-mock.html", {
    root: path.join(__dirname, "..", "views")
  });
});

export default router;
