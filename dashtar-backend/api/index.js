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
var productbulkId = "";

async function connectToMongoDB() {
  try {
    const client = new MongoClient(uri);
   await client.connect();
    return client.db('test'); 
      // Return the connected database object
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

const uri = process.env.MONGO_URI; 

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


app.get('/api/Shop', async (req, res) => {
  try {
    const url = process.env.MONGO_URI; // MongoDB server URL
    const databaseName = 'test'; // Name of the MongoDB database
    const collectionName = 'shops'; // Name of the MongoDB collection

    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db(databaseName);

    // Fetch the data from the collection
    const data = await db.collection(collectionName).find().toArray();

    // Send the data as the response
    res.json(data);
  } catch (error) {
    console.error('Errors fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


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


  // get product api
let query1;
let b_id;

query1 =  `mutation {
  bulkOperationRunQuery(
   query: """
    {
      products{
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            vendor
            productType
            createdAt
            updatedAt
            
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

const MutationResponse =  await getProducts(session, query1);

var bulkOperationid = MutationResponse.body.data.bulkOperationRunQuery.bulkOperation.id;


const ShopData = await shopify.api.rest.Shop.all({
  session: res.locals.shopify.session,
});

var email  = ShopData.data[0].email;
var shop_url = ShopData.data[0].domain;
var name  = ShopData.data[0].name;

const db = await connectToMongoDB();
const collection = db.collection('shops'); 
const query = { shop_url: shop_url };
const result = await collection.findOne(query);
console.log(result);
let updatedList = [bulkOperationid]; 
console.log(updatedList);
if(result){
   if(result.bulkop[0] == ""){
    collection.updateOne({shop_url:shop_url },{$set:{bulkop: updatedList }});
    console.log(result);
   }
}

let databulk = "";

 
try {
  let query2 = `query {
    node(id: "${(result.bulkop[0] == "") ? bulkOperationid : result.bulkop[0]}") {
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

  
const response = await getProducts(session, query2);
databulk = response.body.data.node.url;

updatedList = [(result.bulkop[0] == "") ? bulkOperationid : result.bulkop[0], response.body.data.node.url];
collection.updateOne({shop_url:shop_url },{$set:{bulkop: updatedList }});
console.log(JSON.stringify(response.body.data));
} 

catch (error) {
  console.error('Error fetching bulk operation data:', error);
}


res.status(200).send(databulk);

});

app.get('/api/shopify/session', async (req, res) => {

  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  res.status(200).send(ShopData);
 
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
  bulkop: []
}

res.status(200).send(jsondata);

});
  
console.log("ddts");
app.use("/*", 
shopify.validateAuthenticatedSession(),
async (_req, res, _next) => {

   const response = await shopify.api.rest.Shop.all({
     session: res.locals.shopify.session,
   });
   
   var email  = response.data[0].email;
   var shop_url = response.data[0].domain;
   var name  = response.data[0].name;
   console.log(email + shop_url + name);

   return false;
   
   const db = await connectToMongoDB();

  // admin collection query
  const AdminDbcollection = db.collection('admins'); 
  const AdminQuery = { email: email };


  const Adminresult = await AdminDbcollection.findOne(AdminQuery);

 if (Adminresult) {

     return res.redirect(301, "https://mtreports.mandasadevelopment.com:443/login");
 } else {


     return res.redirect(301, "https://mtreports.mandasadevelopment.com:443/signup");
 }


});

app.get("/*", function (req, res){
   res.sendFile( path.join(_dirname, "../dashtar-admin/build/index.html"),
    function (err) { 
      if (err) { res.status (500).send(err); } }
       );
       });



app.listen(PORT, () => console.log(`server running on port ${PORT}`));
