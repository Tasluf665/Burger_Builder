const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_SERVER)
  .then(() => console.log("Connected with mongodb"))
  .catch((err) => console.log("Could not connect to mongodb", err));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
