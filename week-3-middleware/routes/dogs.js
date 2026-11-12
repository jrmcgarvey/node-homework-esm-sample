import express from "express";
import dogs from "../dogData.js";
import { ValidationError, NotFoundError } from "../errors.js";

const router = express.Router();

router.get("/dogs", (req, res) => {
  res.status(200).json(dogs);
});

router.post("/adopt", (req, res) => {
  const { name, address, email, dogName } = req.body;
  if (!name || !email || !dogName) {
    throw new ValidationError("Missing required fields" + req.body.toString());
  }

  const dog = dogs.find((thisDog) => {
    return thisDog.name === dogName;
  });
  if (!dog || dog.status != "available") {
    throw new NotFoundError("not found or not available");
  }

  res.status(201).json({
    message: `Adoption request received. We will contact you at ${email} for further details.`,
    application: {
      name,
      address,
      email,
      dogName,
      applicationId: Date.now(),
    },
  });
});

router.get("/error", (req, res, next) => {
  next(new Error("Test error"));
});

export default router;
