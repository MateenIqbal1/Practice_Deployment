const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/user.model")
//
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("GET /api/users", () => {

    test("should return all users", async () => {

        const response = await request(app)
            .get("/api/users");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

});

describe("GET /api/users/:id", () => {

    test("should return 404 if user does not exist", async () => {

        const id = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/users/${id}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("User not found");

    });

});

describe("POST /api/users", () => {

    test("should create a new user", async () => {

        await User.deleteOne({
            email: "test@example.com"
        });

        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "test@example.com",
                age: 25
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe("Test User");
        expect(response.body.email).toBe("test@example.com");

    });

});


describe("PUT /api/users/:id", () => {

    test("should update a user", async () => {

        const user = await User.create({
            name: "Old Name",
            email: "old@example.com",
            age: 25
        });

        const response = await request(app)
            .patch(`/api/users/${user._id}`)
            .send({
                name: "Updated Name",
                age: 30
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe("Updated Name");
        expect(response.body.age).toBe(30);
        await User.deleteOne({
            email: "old@example.com"
        });
    });

});


describe("DELETE /api/users/:id", () => {

    test("should delete a user", async () => {

        const user = await User.create({
            name: "Delete User",
            email: "delete@example.com",
            age: 25
        });

        const response = await request(app)
            .delete(`/api/users/${user._id}`);

        expect(response.statusCode).toBe(200);

        const deletedUser = await User.findById(user._id);

        expect(deletedUser).toBeNull();

    });

    test("should return 404 if user does not exist", async () => {

        const id = new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/api/users/${id}`);

        expect(response.statusCode).toBe(404);

    })
})




