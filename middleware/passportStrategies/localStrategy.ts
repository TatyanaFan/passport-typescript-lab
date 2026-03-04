import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById } from "../../controllers/userController";
import type { User } from "../../models/userModel";
import { PassportStrategy } from '../../interfaces/index';

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const { user, errorMessage } = getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: errorMessage ?? "Login failed",
        });
  }
);

/*
FIX ME (types) 😭
*/
passport.serializeUser(function (
  user: Express.User,
  done: (err: unknown, id?: string | number) => void
) {
  done(null, (user as User).id);
});

/*
FIX ME (types) 😭
*/
passport.deserializeUser(function (
  id: string | number,
  done: (err: unknown, user?: Express.User | false | null) => void
) {
  const user = getUserById(id);

  if (user) return done(null, user);

  return done(null, false);
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
