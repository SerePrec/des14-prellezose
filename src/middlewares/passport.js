import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "../models/index.js";
import { createHash, isValidPassword } from "../utils/crypt.js";

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const user = await userModel.getByUsername(username);
        if (user) {
          return done(null, false, {
            message: "El nombre de usuario ya existe"
          });
        }
        const newUser = {
          username,
          password: createHash(password)
        };
        const newUserAdded = await userModel.save(newUser);
        console.log(`Usuario registrado con éxito con id ${newUserAdded.id}`);
        return done(null, newUserAdded);
      } catch (error) {
        console.log("Error al registrar usuario: ", error);
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userModel.getByUsername(username);
      if (!user) {
        return done(null, false, {
          message: "Nombre de usuario y/o contraseña incorrectos"
        });
      }
      if (!isValidPassword(user, password)) {
        return done(null, false, {
          message: "Nombre de usuario y/o contraseña incorrectos"
        });
      }
      return done(null, user);
    } catch (error) {
      console.log("Error al loguear usuario: ", error);
      done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.getById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export { passport };
