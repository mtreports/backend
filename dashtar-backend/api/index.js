const express = require("express");
const router = express.Router();
const Cookies = require("js-cookie");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const axios = require('axios');
const fetch  = require('node-fetch'); 
const helmet = require("helmet");
const path = require('path');
const shopify = require("./shopify.js");
const { connectDB } = require("../config/db.js");
const productRoutes = require("../routes/productRoutes");
const customerRoutes = require("../routes/customerRoutes");
const adminRoutes = require("../routes/adminRoutes");
const orderRoutes = require("../routes/orderRoutes");
const customerOrderRoutes = require("../routes/customerOrderRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const couponRoutes = require("../routes/couponRoutes");
const attributeRoutes = require("../routes/attributeRoutes");
const settingRoutes = require("../routes/settingRoutes");
const currencyRoutes = require("../routes/currencyRoutes");
const languageRoutes = require("../routes/languageRoutes");
const { isAuth, isAdmin } = require("../config/auth");
const {GDPRWebhookHandlers} = require('./gdpr.js');
const getProducts = require("./getproduct.js");
require("dotenv").config();

connectDB();
const app = express();
app.use(cors());


const PORT = process.env.PORT || 5055;


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


//root route
// app.get("/", (req, res) => {
//   res.send("App works properly!");
// });


//this for route will need for store front, also for admin dashboard
app.use("/api/products/", productRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/coupon/", couponRoutes);
app.use("/api/customer/", customerRoutes);
app.use("/api/order/", isAuth, customerOrderRoutes);
app.use("/api/attributes/", attributeRoutes);
app.use("/api/setting/", settingRoutes);
app.use("/api/currency/", isAuth, currencyRoutes);
app.use("/api/language/", languageRoutes);

//if you not use admin dashboard then these two route will not needed.
app.use("/api/admin/", adminRoutes);
app.use("/api/orders/", orderRoutes);


// // login apis
// const instance = axios.create({
//   baseURL: `http://localhost:5055/api`,
//   timeout: 50000,
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   },
// });

// const responseBody = (response) => response.data;

// const req_ = {

//   post: (url, body) => instance.post(url, body).then(responseBody)

// };

// Use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});


app.get('/api/shopify/shop_login', async (_req, res) => {
//  console.log(res.locals.shopify.session);
const response = await shopify.api.rest.Shop.all({
  session: res.locals.shopify.session,
});

var email  = response.data[0].email;
var domain  = response.data[0].domain;
var name  = response.data[0].name;

var jsondata = {
  name: name,
  email:email,
  password: domain,
  role: "Admin",
}

res.status(200).send(jsondata);

});
  

app.use("/*", 
shopify.validateAuthenticatedSession(),
async (_req, res, _next) => {

   const response = await shopify.api.rest.Shop.all({
     session: res.locals.shopify.session,
   });
  
   var email  = response.data[0].email;
    console.log(email);
    
    const uri = process.env.MONGO_URI; 
  const client = new MongoClient(uri, {
    useUnifiedTopology: true,
  });
  await client.connect();
  const database = client.db('test'); 
  const collection = database.collection('admins'); 
  const query = { email: email };
  const result = await collection.findOne(query);
  // console.log("Result " + result);
  console.log(result);
}
);

// app.get("/*", function (req, res){
//    res.sendFile( path.join(_dirname, "../dashtar-admin/build/index.html"),
//     function (err) { 
//       if (err) { res.status (500).send(err); } }
//        );
//        });

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
