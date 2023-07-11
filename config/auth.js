import { User } from "../models/user.js";
import { Strategy as LocalStrategy } from "passport-local";
import { compareSync } from "bcrypt";

export const authConfig = (passport) => {
  passport.use(new LocalStrategy(
    async (username,password,done)=>{
      const user=await User.findOne({username})
      if(!user) return done(null,false)

      if(!compareSync(password,user.password)) return done(null,false)

      return done(null,user)
    }
  ));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
