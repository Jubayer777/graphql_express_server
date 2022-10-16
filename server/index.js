const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const cors = require("cors");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/isAuth");
const roleGurd = require("./middleware/roleGurd");

const graphqlHTTP = require("express-graphql").graphqlHTTP;

app.use(bodyParser.json());
  // app.use(cors(
  //   {
  //         origin:'*',
  //         credentials: true,
  //   }
  // ));


app.use(isAuth);
app.use(roleGurd);

app.use(
  "/graphql",
  cors<cors.CorsRequest>({
    origin: '*',
    credentials: true,
  }),
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log("connection error", err);
  });
app.listen(port||4000, () => {
  console.log(`This site is running on http://localhost:${port}`);
});
