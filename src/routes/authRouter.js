import { Router } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { validateRegisterPost } from "../middlewares/validateWebData.js";
import { passport } from "../middlewares/passport.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = Router();

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/");
  res.sendFile("login.html", {
    root: path.join(__dirname, "..", "views")
  });
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/login-error",
    // connect-flash presenta más problemas de carrera al guardar sesiones en MongoDB y no en la memoria. Por eso se hace proceso manual de pasaje de mensajes
    failureMessage: true,
    successRedirect: "/"
  })
);

router.get("/login-error", (req, res) => {
  const { messages } = req.session;
  let message;
  if (messages) {
    req.session.messages = [];
    message = messages[messages.length - 1];
  }
  res.render("pages/loginError", {
    title: "Error de login",
    error: message
  });
});

router.get("/register", (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/");
  res.sendFile("register.html", {
    root: path.join(__dirname, "..", "views")
  });
});

router.post(
  "/register",
  validateRegisterPost,
  passport.authenticate("register", {
    failureRedirect: "/register-error",
    // connect-flash presenta más problemas de carrera al guardar sesiones en MongoDB y no en la memoria. Por eso se hace proceso manual de pasaje de mensajes
    failureMessage: true,
    successRedirect: "/",
    successMessage: "¡Gracias por registrarte en nuestro sitio!"
  })
);

router.get("/register-error", (req, res) => {
  const { messages } = req.session;
  let message;
  if (messages) {
    req.session.messages = [];
    message = messages[messages.length - 1];
  }
  res.render("pages/registerError", {
    title: "Error de registro",
    error: message
  });
});

router.get("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    const { username } = req.user;
    req.logout();
    req.session.destroy(err => {
      if (!err) {
        res.clearCookie("connect.sid");
        return res.render("./pages/logout", { title: "Logout", username });
      }
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

export default router;
