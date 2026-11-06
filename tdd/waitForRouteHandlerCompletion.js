import { vi } from "vitest";

const waitForRouteHandlerCompletion = async (func, req, res) => {
  let next;
  const promise = new Promise((resolve, reject) => {
    next = vi.fn((err) => {
      if (err) return reject(err);
      resolve();
    });
    res.on("finish", () => {
      resolve();
    });
  });
  await func(req, res, next);
  await promise;
  return next;
};
export default waitForRouteHandlerCompletion;
