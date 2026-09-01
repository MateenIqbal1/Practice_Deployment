
const { createUser, deleteUser, getUsers, getUser, updateUser } = require("../controllers/user.controller");
const User = require("../models/user.model");


describe("getUsers", () => {

    test("should return all users", async () => {

        const users = [
            {
                _id: "1",
                name: "User 1",
                email: "user1@gmail.com",
                age: 20
            },
            {
                _id: "2",
                name: "User 2",
                email: "user2@gmail.com",
                age: 25
            }
        ];

        User.find = jest.fn().mockResolvedValue(users);

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getUsers(req, res);

        expect(User.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(users);

    });

    test("should return 500 if database fails", async () => {

        User.find = jest.fn().mockRejectedValue(
            new Error("Database error")
        );

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server error"
        });

    });

});


describe("getUser", () => {

    test("should return a user", async () => {

        const user = {
            _id: "123",
            name: "User 1",
            email: "user1@gmail.com",
            age: 20
        };

        User.findById = jest.fn().mockResolvedValue(user);

        const req = {
            params: {
                id: "123"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getUser(req, res);

        expect(User.findById).toHaveBeenCalledWith("123");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(user);

    });


    test("should return 404 if user does not exist", async () => {

        User.findById = jest.fn().mockResolvedValue(null);

        const req = {
            params: {
                id: "123"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "User not found"
        });

    });

});


describe("createUser", () => {

    test("should create a user", async () => {

        const user = {
            _id: "123",
            name: "Test User",
            email: "test@example.com",
            age: 25
        };

        User.findOne = jest.fn().mockResolvedValue(null);
        User.create = jest.fn().mockResolvedValue(user);

        const req = {
            body: {
                name: "Test User",
                email: "test@example.com",
                age: 25
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createUser(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: "test@example.com"
        });

        expect(User.create).toHaveBeenCalledWith({
            name: "Test User",
            email: "test@example.com",
            age: 25
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(user);

    });


    test("should return 409 if email already exists", async () => {

        User.findOne = jest.fn().mockResolvedValue({
            _id: "123",
            email: "test@example.com"
        });

        const req = {
            body: {
                name: "Test User",
                email: "test@example.com",
                age: 25
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            message: "Email already exists"
        });

    });


    test("should return 400 if required data is missing", async () => {

        const req = {
            body: {
                name: "Test User"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Name, email and age are required"
        });

    });


    test("should return 500 if database fails", async () => {

        User.findOne = jest.fn().mockRejectedValue(
            new Error("Database error")
        );

        const req = {
            body: {
                name: "Test User",
                email: "test@example.com",
                age: 25
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server error"
        });

    });

});


describe("updateUser", () => {

    test("should update a user", async () => {

        const user = {
            _id: "123",
            name: "Updated User",
            email: "user@example.com",
            age: 30
        };

        User.findByIdAndUpdate = jest.fn().mockResolvedValue(user);

        const req = {
            params: {
                id: "123"
            },
            body: {
                name: "Updated User",
                age: 30
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await updateUser(req, res);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            {
                name: "Updated User",
                age: 30
            },
            {
                new: true,
                runValidators: true
            }
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(user);

    });


    test("should return 404 if user does not exist", async () => {

        User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

        const req = {
            params: {
                id: "123"
            },
            body: {
                name: "Updated User",
                age: 30
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "User not found"
        });

    });


    test("should return 500 if database fails", async () => {

        User.findByIdAndUpdate = jest.fn().mockRejectedValue(
            new Error("Database error")
        );

        const req = {
            params: {
                id: "123"
            },
            body: {
                name: "Updated User",
                age: 30
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server error"
        });

    });

});


describe("deleteUser", () => {

    test("should delete a user", async () => {

        const user = {
            _id: "123",
            name: "User 1",
            email: "user1@gmail.com",
            age: 20
        };

        User.findByIdAndDelete = jest.fn().mockResolvedValue(user);

        const req = {
            params: {
                id: "123"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deleteUser(req, res);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "User deleted successfully"
        });

    });


    test("should return 404 if user does not exist", async () => {

        User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

        const req = {
            params: {
                id: "123"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "User not found"
        });

    });


    test("should return 500 if database fails", async () => {

        User.findByIdAndDelete = jest.fn().mockRejectedValue(
            new Error("Database error")
        );

        const req = {
            params: {
                id: "123"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server error"
        });

    });

});



