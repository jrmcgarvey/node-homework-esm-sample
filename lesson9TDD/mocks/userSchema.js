import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.any(),
  name: Joi.any(),
  password: Joi.any(),
});

export default userSchema;
