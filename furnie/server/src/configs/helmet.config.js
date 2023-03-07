import helmet from "helmet";
const helmetConfig = (app) => {
  app.use(
    helmet({
      crossOriginResourcePolicy: true,
    })
  );
};
export default helmetConfig;
