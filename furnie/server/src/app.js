import express from "express";
import * as dotenv from "dotenv";
import corsConfig from "./configs/cors.config.js";
import helmetConfig from "./configs/helmet.config.js";
import httpErrorConfig from "./configs/httpErrors.config.js";
import morgan from "morgan";
import * as routesV1 from "./api/v1/routes/index.js";
import connectDB from "./configs/db.connect.js";
import parseConfig from "./configs/parse.config.js";
import headerConfig from "./configs/header.config.js";
import redis from "./configs/redis.connect.js";
import staticConfig from "./configs/static.config.js";
import testProductRoutes from "./api/v1/test/test.product.routes.js";
import testAttributeRoutes from "./api/v1/test/test.attribute.routes.js";
import testAttributeTypeRoutes from "./api/v1/test/test.attributeType.routes.js";

//----------dotenv config----------//
dotenv.config();

//----------Connect db----------//
connectDB();

//----------Defined app----------//
const app = express();

//----------Helmet configs----------//
helmetConfig(app);

//----------CORS configs----------//
corsConfig(app);

//----------Parse config----------//
parseConfig(app, express);

//----------Configs to client read file----------//
headerConfig(app);

//----------Morgan configs----------//
app.use(morgan("common"));

//----------API routes----------//
routesV1.userRoutes(app);
routesV1.productRoutes(app);
routesV1.productCategoryRoutes(app);
routesV1.orderRoutes(app);
routesV1.postCategoryRoutes(app);
routesV1.postRoutes(app);
routesV1.imageRoutes(app);
routesV1.productAttributeRoutes(app);
routesV1.productReviewRoutes(app);
routesV1.postCommentRoutes(app);
routesV1.homePageData(app);
testProductRoutes(app);
testAttributeRoutes(app);
testAttributeTypeRoutes(app);

app.get("/", (req, res, next) => {
  res.render("index.ejs");
});
//----------Static configs----------//
staticConfig(app);

//----------Catch server error----------//
httpErrorConfig(app);

export default app;
