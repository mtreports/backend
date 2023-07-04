require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require('path');
const { connectDB } = require("../config/db");
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
const shopify = require("./shopify.js");
const getProducts = require("./getproduct.js");

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

  
// app.use("/api/*", shopify.validateAuthenticatedSession());


app.get('/api/products/count', shopify.validateAuthenticatedSession(), async (_req, res) => {
//  console.log(res.locals.shopify.session);
  const countData = await shopify.api.rest.Product.count({
  session: res.locals.shopify.session,
  });
});
app.get('/api/shopify/data', shopify.validateAuthenticatedSession(), async (_req, res) => {
      res.send("data successfully recived");
  });

 

app.get("/api/getproducts", shopify.validateAuthenticatedSession(), async (req, res) => {
  const session = res.locals.shopify.session;
  const query = `{
    products(first: 6) {
    nodes {
      id
      title
      variants(first: 1) {
        nodes {
          id
          price
          title
        }
      }
      images(first: 1) {
        nodes {
          url
        }
      }
      options(first: 1) {
        name
        values
      }
    }
  }
}`;
  
    const response =  await getProducts(session, query);
  const productdata = response.body.data.products;
  // const countData = await shopify.api.rest.Product.count({
  //   session: res.locals.shopify.session,
  // });
  res.status(200).send(productdata);
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

// app.listen(PORT, () => console.log(`server running on port ${PORT}`));
app.use("/*", 
shopify.validateAuthenticatedSession(),
async (_req, res, _next) => {
  const shop = res.locals.shopify.session.shop;
  const accesstoken = res.locals.shopify.session.accessToken;
  console.log(_req);
  // res.send("App works properly!");
   return res.redirect(301, "https://mtreports.mandasadevelopment.com");
}
);


app.get("/*", function (req, res){
   res.sendFile( path.join(_dirname, "../dashtar-admin/build/index.html"),
    function (err) { 
      if (err) { res.status (500).send(err); } }
       );
       });

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
