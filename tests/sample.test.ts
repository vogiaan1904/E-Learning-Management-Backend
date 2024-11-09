import { redis } from "../src/database/redis.db";
import { prisma } from "../src/database/connect.db";
import { Role } from "@prisma/client";
import userRepo from "../src/repositories/user.repo";
import { hashData } from "../src/utils/bcrypt";
import { generateCustomAvatarUrl } from "../src/utils/avatar";
describe("Sample Test Suite", () => {
  it("should connect to PostgreSQL and Redis", async () => {
    // Test PostgreSQL connection
    const user = await prisma.user.findFirst();
    expect(user).toBeNull(); // Assuming the table is empty after truncation

    // Test Redis connection
    const pong = await redis.ping();
    expect(pong).toBe("PONG");
  });

  it("should create and retrieve a user", async () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    // Define user data
    const username = "Test User";
    const email = uniqueEmail;
    const password = "testpassword";
    const firstName = "Test";
    const lastName = "User";
    const role = "user"; // Adjust based on your Role enum
    const createRole = {}; // Add any additional role-specific data if necessary

    // Create a user using the repository method
    const newUser = await userRepo.create({
      username: username,
      email: email,
      password: hashData(password),
      userProfile: {
        create: {
          firstName: firstName,
          lastName: lastName,
          avatar: generateCustomAvatarUrl(firstName, lastName),
        },
      },
      role: Role[role],
      ...createRole,
    });

    expect(newUser).toHaveProperty("id");
    expect(newUser.username).toBe("Test User");

    // Retrieve the user
    const retrievedUser = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: { userProfile: true }, // Include related profiles if necessary
    });

    expect(retrievedUser).not.toBeNull();
    expect(retrievedUser?.email).toBe(email);
    expect(retrievedUser?.userProfile).toBeDefined();
    expect(retrievedUser?.userProfile?.firstName).toBe("Test");
  });

  it("should set and get a value in Redis", async () => {
    await redis.set("test_key", "test_value");
    const value = await redis.get("test_key");
    expect(value).toBe("test_value");
  });
});
