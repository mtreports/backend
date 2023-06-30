const { GraphqlQueryError } = require('@shopify/shopify-api');
const shopify = require("./shopify.js");
module.exports = async function getProducts(session,query) {
  const client = new shopify.api.clients.Graphql({ session });
  try {
    return await client.query({
        data: query,
      });
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}