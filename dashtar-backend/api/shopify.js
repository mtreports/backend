const {shopifyApp} = require('@shopify/shopify-app-express');
const {LATEST_API_VERSION} = require('@shopify/shopify-api');
const {restResources} = require('@shopify/shopify-api/rest/admin/2023-04');
const { SQLiteSessionStorage } = require("@shopify/shopify-app-session-storage-sqlite");


const PORT = process.env.PORT || 5055;
const DB_PATH = `${process.cwd()}/api/database.sqlite`;
const shopify = shopifyApp({
  api: {
    apiKey: '78622c500ca563f2eb03b709e399575f',
    apiSecretKey: '51215a6648fd8c75210bfa11d4b182dc',
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

module.exports = shopify;