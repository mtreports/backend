const express = require("express");
const cors = require("cors");
const {LATEST_API_VERSION} = require('@shopify/shopify-api');
const {shopifyApp} = require('@shopify/shopify-app-express');
const {restResources} = require('@shopify/shopify-api/rest/admin/2023-04');
const {GDPRWebhookHandlers} = require('./gdpr.js');
const { SQLiteSessionStorage } = require("@shopify/shopify-app-session-storage-sqlite");

const app = express();
app.use(cors());

const PORT = 4000;
const DB_PATH = `${process.cwd()}/database.sqlite`;
const shopify = shopifyApp({
  api: {
    apiKey: '8e265ab334a071389918ac8cd3e58164',
    apiSecretKey: '401ba2a667897f6a263032696a3f6268',
    scopes: ['read_products'],
    isEmbeddedApp: false,
    apiVersion: LATEST_API_VERSION,
    restResources,
    hostScheme: 'https',
    hostName: `mtreports.mandasadevelopment.com:80`,
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback',
  },
  webhooks: {
    path: '/api/webhooks',
  },
  sessionStorage: new SQLiteSessionStorage(DB_PATH)
});

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

app.get('/api/products/count', shopify.validateAuthenticatedSession(), async (_req, res) => {
const countData = await shopify.api.rest.Product.count({
session: res.locals.shopify.session,
});
res.status(200).send(countData);
});


app.listen(PORT, () => console.log(`server running on port ${PORT}`));