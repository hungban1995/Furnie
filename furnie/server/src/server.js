import app from "./app.js";

//----------Defined port----------//
const port = process.env.PORT || 9000;

//----------App listen----------//
app.listen(port, () => {
  console.log(`App run at port: ${port}`);
});
