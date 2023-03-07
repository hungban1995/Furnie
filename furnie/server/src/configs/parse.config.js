const parseConfig = (app, express) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
};
export default parseConfig;
