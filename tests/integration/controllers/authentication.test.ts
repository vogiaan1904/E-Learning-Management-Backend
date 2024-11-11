// tests/integration/controllers/authentication.test.ts

import request from "supertest";
import { app } from "../../../src/index";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../src/database/connect.db";
import { redis } from "../../../src/database/redis.db";

describe("Authentication Tests", () => {
  let token: string;
  const userData = {
    username: "testuser",
    email: "testuser@example.com",
    password: "Password123", // Plain password for login
    firstName: "Test",
    lastName: "User",
    role: "student", // Replace with a valid role from your Role enum
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: userData.email,
      },
    });
  });

  afterAll(async () => {
    // Clean up the test user
    await prisma.user.deleteMany({
      where: { email: userData.email },
    });
  });

  describe("Sign Up", () => {
    it("should sign up a new user", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .send(userData)
        .expect(StatusCodes.CREATED);

      expect(response.body).toHaveProperty(
        "message",
        "Sign up success. Please check your email to verify the account",
      );
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("userVerification");
      expect(response.body.userVerification).toHaveProperty("id");
      expect(response.body.userVerification).toHaveProperty("userId");

      // Verify user exists in the database
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      console.log(user);

      expect(user).not.toBeNull();
      expect(user?.username).toBe(userData.username);
      expect(user?.email).toBe(userData.email);
      expect(user?.isVerified).toBe(false);
    });

    it("should not allow duplicate sign-up with the same email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .send(userData)
        .expect(StatusCodes.CONFLICT);

      // Verify user exists in the database
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      console.log(user);

      expect(response.body).toHaveProperty(
        "message",
        "User is already existed. Please sign in",
      );
      expect(response.body).toHaveProperty("status", "failed");
    });
  });

  describe("Sign In", () => {
    it("should deny sign-in for unverified user", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signin")
        .send({
          account: userData.email,
          password: userData.password,
        })
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body).toHaveProperty(
        "message",
        "User is not verified. Please check your email.",
      );
      expect(response.body).toHaveProperty("status", "failed");
    });

    it("should verify the user and sign in successfully", async () => {
      // Simulate email verification
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(user).not.toBeNull();

      await prisma.user.update({
        where: { email: userData.email },
        data: { isVerified: true },
      });

      const response = await request(app)
        .post("/api/v1/auth/signin")
        .send({
          account: userData.email, // Changed from username to email
          password: userData.password,
        })
        .expect(StatusCodes.OK);

      expect(response.body).toHaveProperty("message", "Sign in success");
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.email).toBe(userData.email); // Changed to verify email
      expect(response.body.user.username).toBe(userData.username);

      expect(response.body.tokens).toHaveProperty("accessToken");
      expect(typeof response.body.tokens.accessToken).toBe("string");
      expect(response.body.tokens.accessToken.split(".")).toHaveLength(3); // Basic JWT structure

      token = response.body.tokens.accessToken; // Store token for authenticated routes
      console.log(`Token: ${token}`);
    });

    it("should deny access to protected route without token", async () => {
      await request(app)
        .get("/api/v1/auth/me")
        .expect(StatusCodes.UNAUTHORIZED);
    });

    it("should access protected route with valid token", async () => {
      // Replace with an actual protected route from your application
      const response = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(StatusCodes.OK);

      expect(response.body).toHaveProperty("username", userData.username);
      expect(response.body).toHaveProperty("email", userData.email);
      expect(response.body).not.toHaveProperty("password");
    });

    it("should return 401 for invalid credentials", async () => {
      await request(app)
        .post("/api/v1/auth/signin")
        .send({
          account: userData.email, // Changed from username to email
          password: "wrongpassword",
        })
        .expect(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("Redis Functionality", () => {
    it("should set and get a value in Redis", async () => {
      await redis.set("test_key", "test_value");
      const value = await redis.get("test_key");
      expect(value).toBe("test_value");
    });
  });
});
