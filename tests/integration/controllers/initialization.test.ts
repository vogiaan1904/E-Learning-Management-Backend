// tests/integration/controllers/initialization.test.ts

import request from "supertest";
import { app } from "../../../src/index";
import { StatusCodes } from "http-status-codes";

describe("Initialization Tests", () => {
  it("should ensure the server is running", async () => {
    const response = await request(app)
      .get("/api/v1/auth/api-status")
      .expect(StatusCodes.OK);
    expect(response.body).toHaveProperty("status", "success");
  });

  it("should verify database connection by fetching courses", async () => {
    const response = await request(app)
      .get("/api/v1/courses/many")
      .expect(StatusCodes.OK);
    expect(Array.isArray(response.body.courses)).toBe(true);
  });
});
