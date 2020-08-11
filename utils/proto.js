/**
 * @module Router
 * @summary The proto router, designed for request type serverless routing.
 */

/**
 * Return 405 status for unallowed method.
 * @param req
 * @param res
 */
export function unallowedMethod(req, res) {
  return res.status(405).send(`Not found - ${req.method} ${req.url}`);
}

export default function () {
  /**
   * Handler should be an object with the fields -
   * method: string
   * fn: Function
   * @type {*[]}
   */
  let handlers = [];

  function callFunc() {
    return function (req, res) {
      const handler = handlers.find((handler) => handler.method === req.method);
      if (handler) {
        return handler.fn.apply(router, [req, res]);
      } else {
        unallowedMethod(req, res);
      }
    };
  }

  function add(method, fn) {
    return handlers.push({ method, fn });
  }

  router.get = (f) => add("GET", f);
  router.post = (f) => add("POST", f);
  router.unallowed = (f) => add("UNALLOWED", f);

  function router(req, res) {
    return callFunc().apply(router, [req, res]);
  }

  return router;
}
