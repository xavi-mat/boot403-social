const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

describe("testing/users", () => {
    const user = {
        username: "testusername",
        email: "test@email.com",
        role: "user",
        "followers": [],
        "followersCount": 0,
        "following": [],
        "likedComments": [],
        "likedPosts": [],
        "posts": [],
        "__v": 0,
        "active": true,
        "avatar": "http://localhost:8080/avatars/avatar.png",
        "comments": [],
    };

    test("Create a user", async () => {
        const res = await request(app)
            .post("/users")
            .send({...user, password: "123456"})
            .expect(201);
        const sendUser = {
            ...user,
            _id: res.body.user._id,
            createdAt: res.body.user.createdAt,
            updatedAt: res.body.user.updatedAt,
        };
        const newUser = res.body.user;
        expect(newUser).toEqual(sendUser);
    });

    // test("Confirm a user", async () => {
    //     const emailToken = jwt.sign
    // });
});