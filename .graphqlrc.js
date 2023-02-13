module.exports = {
  projects: {
    shopify: {
      schema: 'src/graphql/shopify/generated/schema.graphql',
      documents: 'src/graphql/shopify/operations/**/*.gql'
    },
    contentful: {
      schema: 'src/graphql/contentful/generated/schema.graphql',
      documents: 'src/graphql/contentful/operations/**/*.gql'
    }
  }
};
