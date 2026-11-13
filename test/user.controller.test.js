import "../setenv.js"
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
import prisma from "../db/prisma.js";
import jwtMiddleware from "../middleware/jwtMiddleware.js"
import httpMocks from "node-mocks-http";
import  { EventEmitter } from "events";
import { register, logon, logoff } from "../controllers/userController.js";
import waitForRouteHandlerCompletion from "./waitForRouteHandlerCompletion.js";
import jwt from "jsonwebtoken";
import { it, describe, expect, beforeAll, afterAll } from "vitest";
let saveReq;

// a few useful globals
let saveRes = null;
let saveData = null;

function MockResponseWithCookies() {
  const res = httpMocks.createResponse({
    eventEmitter: EventEmitter,
  });
  res.setCookieList = [];
  res.cookie = (name, value, options = {}) => {
    const cookieObject = { name, value, options };
    res.setCookieList.push(cookieObject);
  };
  return res;
}

beforeAll(async () => {
  // clear database
  await prisma.task.deleteMany(); // delete all tasks
  await prisma.user.deleteMany(); // delete all users
});

afterAll(() => {
  prisma.$disconnect();
});

let jwtCookie;

describe("testing logon, register, and logoff", () => {
  it("33. The user can be registered.", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "bob@sample.com", password: "Pa$$word20", name: "Bob" },
    });
    saveRes = MockResponseWithCookies();
    await waitForRouteHandlerCompletion(register,req,saveRes);
    expect(saveRes.statusCode).toBe(201); // success!
  });
  it("34. The user can be logged on", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "bob@sample.com", password: "Pa$$word20" },
    });
    saveRes = MockResponseWithCookies();
    await waitForRouteHandlerCompletion(logon,req,saveRes);
    expect(saveRes.statusCode).toBe(200); // success!
  });
  it("35. A string in the Set-Cookie array starts with jwt=.", () => {
    jwtCookie = saveRes.setCookieList.find(cookie => cookie.name === "jwt");
    expect(jwtCookie).toBeDefined();
  });
  it("36. That string contains HttpOnly;.", () => {
    expect(jwtCookie.options.httpOnly).toBeDefined();
  });
  it("37. returns the expected name.", () => {
    saveData = saveRes._getJSONData();
    expect(saveData.name).toBe("Bob");
  });
  it("38. returns a csrfToken", () => {
    expect(saveData.csrfToken).toBeDefined();
  });
  it("39. You can now logoff.", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
    });
    saveRes = MockResponseWithCookies();
    await waitForRouteHandlerCompletion(logoff, req, saveRes);
    expect(saveRes.statusCode).toBe(200);
  });
  it("40. The logoff clears the cookie.", () => {
    jwtCookie = saveRes.setCookieList.find(cookie => cookie.name === "jwt");
    expect(jwtCookie.options.expires).toBeDefined();
    const oneYearAgo = new Date().getFullYear()-1;
    expect(new Date(jwtCookie.options.expires).getFullYear()).toBeLessThan(oneYearAgo); // already expired!
  });
  it("41. A logon attempt with a bad password returns a 401", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "bob@sample.com", password: "bad password" },
    });
    saveRes = MockResponseWithCookies();
    await waitForRouteHandlerCompletion(logon,req,saveRes);
    expect(saveRes.statusCode).toBe(401);
  });
  it("42. You can't register with an email address that is already registered.", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        email: "bob@sample.com",
        name: "another Bob",
        password: "Pa$$word20",
      },
    });
    saveRes = MockResponseWithCookies();
    await waitForRouteHandlerCompletion(register, req, saveRes);
    expect(saveRes.statusCode).toBe(400);
  });
});

describe("Testing JWT middleware", () =>{
  it("61. Returns a 401 if the JWT is not present", async() =>{
    const req = httpMocks.createRequest({
      method: "POST"
    })
    saveRes = MockResponseWithCookies();
    await waitForRouteHandlerCompletion(jwtMiddleware,req,saveRes);
    expect(saveRes.statusCode).toBe(401);
  })
  it("62. Returns a 401 if the JWT is invalid", async ()=>{
    const req = httpMocks.createRequest({
      method: "POST"
    })
    saveRes = MockResponseWithCookies();
    const jwtCookie = jwt.sign({id: 5, csrfToken: "badToken"}, "badSecret", { expiresIn: "1h" });
    req.cookies = {jwt: jwtCookie }
    await waitForRouteHandlerCompletion(jwtMiddleware,req,saveRes);
    expect(saveRes.statusCode).toBe(401);
  })
  it("63. Returns a 401 if the JWT is valid but the token isn't", async ()=>{
    const req = httpMocks.createRequest({
      method: "POST"
    })
    saveRes = MockResponseWithCookies();
    const jwtCookie = jwt.sign({id: 5, csrfToken: "badtoken"}, process.env.JWT_SECRET, { expiresIn: "1h" });
    req.cookies = {jwt: jwtCookie }
    if (!req.headers) {
      req.headers={};
    }
    req.headers["X-CSRF-TOKEN"]= "goodtoken"
    await waitForRouteHandlerCompletion(jwtMiddleware,req,saveRes);
    expect(saveRes.statusCode).toBe(401);
  })
  it("64. Calls next() if both the token and the jwt are good.", async ()=>{
    const req = httpMocks.createRequest({
      method: "POST"
    })
    saveRes = MockResponseWithCookies();
    const jwtCookie = jwt.sign({id: 5, csrfToken: "goodtoken"}, process.env.JWT_SECRET, { expiresIn: "1h" });
    req.cookies = {jwt: jwtCookie }
    if (!req.headers) {
      req.headers={};
    }
    req.headers["X-CSRF-TOKEN"]= "goodtoken"
    const next = await waitForRouteHandlerCompletion(jwtMiddleware,req,saveRes);
    saveReq=req;
    expect(next).toHaveBeenCalled();
  })
  it("65. Sets the req.user before calling next()", () =>{
    expect(saveReq.user.id).toBe(5);
  })
})
