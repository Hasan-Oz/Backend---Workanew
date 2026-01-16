import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

// ==============================================
// 1. SETUP GOOGLE STRATEGY
// ==============================================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:3000/api/auth/google/callback", 
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔹 Google Login Attempt:", profile.emails?.[0]?.value);

        // 1. Check if user exists (Returns an Array)
        const existingUsers = await db.select().from(users).where(eq(users.googleId, profile.id));
        
        // Take the first one
        if (existingUsers.length > 0) {
          console.log("✅ User found in DB");
          return done(null, existingUsers[0] as any);
        }

        // 2. Create new user if not found
        console.log("🆕 Creating new user...");
        const email = profile.emails?.[0]?.value || `google-${profile.id}@no-email.com`;
        
        const newUsers = await db.insert(users).values({
          username: profile.displayName,
          email: email,
          role: 'student',
          googleId: profile.id,
        }).returning();

        // Drizzle insert returns an array, take the first item
        console.log("✅ User Created:", newUsers[0]);
        done(null, newUsers[0] as any);

      } catch (error) {
        console.error("❌ Google Auth Error:", error); // <--- IMPORTANT LOGGING
        done(error, undefined);
      }
    }
  )
);

// ==============================================
// 2. SETUP FACEBOOK STRATEGY
// ==============================================
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
      callbackURL: "http://localhost:3000/api/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos', 'email'] 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔹 Facebook Login Attempt:", profile.id);

        const existingUsers = await db.select().from(users).where(eq(users.facebookId, profile.id));

        if (existingUsers.length > 0) {
           console.log("✅ User found in DB");
          return done(null, existingUsers[0]);
        }

        console.log("🆕 Creating new user...");
        const email = profile.emails?.[0]?.value || `fb-${profile.id}@no-email.com`;
        
        const newUsers = await db.insert(users).values({
          username: profile.displayName,
          email: email,
          role: 'student',
          facebookId: profile.id,
        }).returning();

        console.log("✅ User Created:", newUsers[0]);
        return done(null, newUsers[0]);
      } catch (error) {
        console.error("❌ Facebook Auth Error:", error);
        return done(error, undefined);
      }
    }
  )
);

export default passport;