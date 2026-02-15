const passport = require("passport");
const { User, Footsal } = require("../../models");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

// Google User Strategy
passport.use(
  "google-user",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL_USER,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ where: { email } });
        const device = profile._json?.device || req.headers["user-agent"] || "unknown";
        const location = profile._json?.location || req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";

        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email,
            googleId: profile.id,
            profileImage: profile.photos[0]?.value,
            role: "user",
            device,
            location,
            isVerified: true,
            isActive: true,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.isVerified = true;
          user.isActive = true;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Google Futsal Strategy => login only
passport.use(
  "google-futsal",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL_FUTSAL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let futsal = await Footsal.findOne({ where: { email } });

        if (!futsal) {
          return done(null, false, { message: "Futsal should be register manually and login with the help of gmail" });
        }

        if (!futsal.googleId) {
          futsal.googleId = profile.id;
          futsal.isVerified = true;
          await futsal.save();
        }

        return done(null, futsal);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Facebook User Strategy
passport.use(
  "facebook-user",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL_USER,
      profileFields: ["id", "email", "name", "picture"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ where: { email } });

        const device = profile._json?.device || req.headers["user-agent"] || "unknown";
        // longitude and latitude can be extracted from profile._json.location if available, otherwise fallback to IP-based location
        const location = profile._json?.location || req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
        if (!user) {
          user = await User.create({
            username: `${profile.name.givenName} ${profile.name.familyName}`,
            email,
            profileImage: profile.photos[0]?.value,
            role: "user",
            device,
            location,
            isVerified: true,
            isActive: true,
          });
        } else {
          user.isVerified = true;
          user.isActive = true;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((entity, done) => {
  done(null, { id: entity.id, type: entity.role });
});

passport.deserializeUser(async (data, done) => {
  try {
    const Model = data.type === "user" ? User : Footsal;
    const entity = await Model.findByPk(data.id);
    done(null, entity);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;