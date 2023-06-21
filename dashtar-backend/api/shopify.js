const {shopifyApp} = require('@shopify/shopify-app-express');
const {LATEST_API_VERSION} = require('@shopify/shopify-api');
const {restResources} = require('@shopify/shopify-api/rest/admin/2023-04');
const { SQLiteSessionStorage } = require("@shopify/shopify-app-session-storage-sqlite");


const PORT = process.env.PORT || 5055;
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
    hostName: `3.6.228.94:80`,
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

module.exports = shopify;