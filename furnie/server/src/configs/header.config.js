const headerConfig = (app) => {
  app.use(function (req, res, next) {
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
  });
};
export default headerConfig;
