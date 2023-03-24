const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const User = require("../src/models/user");
const dotenv = require("dotenv/config");
const app = require("../src/app");
chai.expect();
chai.use(chaiHttp);
jest.setTimeout(40000);
chai.should();
describe("Testing Authentication routes", () => {
  it("should create a user.", async () => {
    const res = await chai.request(app).post("/signup").send({
      fullname: "charles",
      email: "try5@gmail.com",
      username: "user2",
      password: "11111",
    });
    expect(res.status).to.be.equal(201);
    expect(res.body).to.be.a("object");
  });
  it("should login user.", async () => {
    const res = await chai.request(app).post("/login").send({
      email: "example@gmail.com",
      password: "11111",
    });
    expect(res.status).to.be.equal(200);
  });
  it("should get all users.", async () => {
    const res = await chai.request(app).get("/users");
    expect(res.status).to.be.equal(200);
  });
  it("should get user by id.", async () => {
    const res = await chai.request(app).get("/users/6411ac3700af4d0f8e169a2a");
    expect(res.status).to.be.equal(200);
  });
  it("should not get user by id.", async () => {
    const res = await chai.request(app).get("/users/640c35b38452ecb4a9ce84bc");
    expect(res.status).to.be.equal(404);
  });
});
it("should get all blogs.", async () => {
  const res = await chai.request(app).get("/blogs");
  expect(res.status).to.be.equal(200);
});
it("should get blog by id.", async () => {
  const res = await chai.request(app).get("/blogs/641af2a6155e89a980c49db1");
  expect(res.status).to.be.equal(200);
});
it("should not get blog by id.", async () => {
  const res = await chai.request(app).get("/blogs/640c35b38459ecb4adce84bc");
  expect(res.status).to.be.equal(404);
});
it("should create a querry.", async () => {
  const res = await chai.request(app).post("/querry").send({
    fullname: "charles",
    email: "try61256@gmail.com",
    message: "nice work",
  });
});
it("should get all querries.", async () => {
  const res = await chai.request(app).get("/querries");
  expect(res.status).to.be.equal(200);
});
it("should get querry by id.", async () => {
  const res = await chai.request(app).get("/querries/6416d177ffdbc3c829813530");
  expect(res.status).to.be.equal(200);
});
it("should not get querry by id.", async () => {
  const res = await chai.request(app).get("/querries/6416d177ffdbc3c829823536");
  expect(res.status).to.be.equal(404);
});
