const shopify = require("./shopify.js");
const express = require("express");
const { MongoClient } = require('mongodb');
const { connectDB } = require("../config/db.js");
const cors = require("cors");
const {GDPRWebhookHandlers} = require('./gdpr.js');
const helmet = require("helmet");
const path = require('path');


// Function to synchronize Shopify data
async function syncShopifyData() {
    try {
 
    connectDB();
    const app = express();
    app.use(cors());
    

    
    console.log('Shopify data synchronized successfully.');


    } catch (error) {
      console.error('An error occurred while synchronizing Shopify data:', error);
    }
  }
  module.exports = { syncShopifyData };  