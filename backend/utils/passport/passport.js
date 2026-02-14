const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { User, Footsal } = require("../models/index");

// Google User Strategy
passport.use(
  "google-user",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL_USER,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email,
            googleId: profile.id,
            profileImage: profile.photos[0]?.value,
            role: "user",
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

// Google Futsal Strategy
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
          return done(
            new Error("Futsal registration via Google must be done manually"),
            null
          );
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
      profileFields: ["id", "emails", "name", "picture"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create({
            username: `${profile.name.givenName} ${profile.name.familyName}`,
            email,
            profileImage: profile.photos[0]?.value,
            role: "user",
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