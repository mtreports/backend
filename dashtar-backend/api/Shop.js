require("dotenv").config();
const { List } = require("immutable");
const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');

const AddShop = async ({domain, name, bulkop}) => {
 


  const userSchema = new mongoose.Schema({
    shop_url: String,
    name: String,
    bulkop: Object
  });
  
  const Shop = mongoose.model('Shop', userSchema);
  

  const newShop = new Shop({
    shop_url: domain,
    name: name,
    bulkop: bulkop
  });
  
  newShop.save()
    .then(() => {
      console.log('Shop created successfully!');
    })
    .catch((error) => {
      console.error('Error creating user:', error);
    });

};

module.exports = {
  AddShop,
};

