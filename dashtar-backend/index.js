const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const helmet = require("helmet");
const path = require('path');
const shopify = require("./shopify.js");
const {GDPRWebhookHandlers} = require('./gdpr.js');
const getProducts = require("./getproduct.js");
require("dotenv").config();

const app = express();
app.use(cors());


const PORT = 80;


app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot(),
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers }),
);


// We are using this for the express-rate-limit middleware
// See: https://github.com/nfriedly/express-rate-limit
// app.enable('trust proxy');
app.set("trust proxy", 1);

app.use(express.json({ limit: "4mb" }));
app.use(helmet());
app.use("/api/shopify/*", shopify.validateAuthenticatedSession());


app.get('/api/shopify/products/count', async (_req, res) => {
//  console.log(res.locals.shopify.session);
  var countData = await shopify.api.rest.Product.count({
  session: res.locals.shopify.session,
  });

  res.status(200).send(countData);
  });

app.get("/api/shopify/getproducts", async (req, res) => {
  const session = res.locals.shopify.session;

let first20products = [];
let pageInfo;
let endCursor = "";
let counter = 1;
let condition;
let query1;

query1 =  `mutation {
  bulkOperationRunQuery(
   query: """
    {
      products{
        edges {
          node {
            id
            title
          }
        }
      }
    }
    """
  ) {
    bulkOperation {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
}`;


const response =  await getProducts(session, query1);
const bulkOperationid = response.body.data.bulkOperationRunQuery.bulkOperation.id;
let databulk = "";
try {
     
  let query2 = `query {
    node(id: "${bulkOperationid}") {
      ... on BulkOperation {
        id
        status
        errorCode
        createdAt
        completedAt
        objectCount
        fileSize
        url
      }
    }
  }`;

const response =  await getProducts(session, query2);
databulk = response.body;

} 
catch (error) {
  console.error('Error fetching bulk operation data:', error);
}
 
// console.log(databulk);
res.status(200).send(databulk);

});


const _dirname = path.dirname("");
const buildPath = path.join(_dirname ,"../dashtar-admin/build"); 

app.use(express.static (buildPath));

// Use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
