const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),

  secretOrKey: process.env.HASH_KEY,
};

passport.use(
  new JWTStrategy(opts, async function (jwtPayLoad, done) {
    try {
      console.log("passport hit", jwtPayLoad.id);
      let user = await prisma.user.findUnique({
        where: { id: jwtPayLoad.id },
      });
      if (user) {
        // console.log("passport user ", user);
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      console.log(`there is an error in jwt ${error}`);
    }
  })
);

module.exports = passport;