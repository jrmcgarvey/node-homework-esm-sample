import { vi } from "vitest";

const waitForRouteHandlerCompletion = async (func, req, res) => {
  let next;
  const done = new Promise((resolve, reject) => {
    next = vi.fn((err) => {
      if (err) return reject(err);
      resolve();
    });
    res.on("finish", () => {
      resolve();
    });
  });
  done.catch(() => {});
  await func(req, res, next);
  await done;
  return next;
};
export default waitForRouteHandlerCompletion;
