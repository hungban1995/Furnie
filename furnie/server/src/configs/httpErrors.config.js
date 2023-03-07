import createError from "http-errors";
import logEvent from "../api/v1/helper/log.event.js";
import { v4 as uuidv4 } from "uuid";
const httpErrorConfig = (app) => {
  //Internal server error && error catch
  app.use((err, req, res, next) => {
    console.log("http error: ", err);
    logEvent(
      `id: ${uuidv4()}\n Message: ${err.message}\n URL: ${req.url}\n method: ${
        req.method
      }`
    );
    const serverErr = createError.InternalServerError();
    res.status(err.status || 500).json({
      error: err.error ? err.error : serverErr.message,
    });
  });

  //404 error catch
  app.use((req, res, next) => {
    const err = createError(404, "Not found");
    logEvent(
      `id: ${uuidv4()}\n Message: ${err.message}\n URL: ${req.url}\n method: ${
        req.method
      }`
    );
    res.status(404).json({
      error: err.message,
    });
  });
};
export default httpErrorConfig;
