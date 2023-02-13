import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const shopifySchema = {
  [`https://${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_URL}/api/2023-01/graphql.json`]:
    {
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env
          .NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_KEY as string
      }
    }
};
const contentfulSchema = {
  [`https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`]:
    {
      headers: {
        Authorization: `Bearer ${
          process.env.NEXT_PUBLIC_CONTENTFUL_CDN_API as string
        }`
      }
    }
};

const tsPrepend = `// @ts-ignore`;

const config: CodegenConfig = {
  overwrite: true,
  config: {
    avoidOptionals: true
  },
  // hooks: { afterOneFileWrite: ['prettier --write'] },
  generates: {
    'src/graphql/shopify/generated/types.ts': {
      documents: 'src/graphql/shopify/operations/**/*.gql',
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
        {
          add: {
            content: tsPrepend
          }
        }
      ],
      schema: shopifySchema
    },
    'src/graphql/shopify/generated/schema.graphql': {
      plugins: [
        'schema-ast',
        {
          add: {
            content:
              'directive @api(name: String) on QUERY | MUTATION | FRAGMENT_DEFINITION'
          }
        }
      ],
      schema: shopifySchema
    },
    'src/graphql/contentful/generated/types.ts': {
      documents: 'src/graphql/contentful/operations/**/*.gql',
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
        {
          add: {
            content: tsPrepend
          }
        }
      ],
      schema: contentfulSchema
    },
    'src/graphql/contentful/generated/schema.graphql': {
      plugins: [
        'schema-ast',
        {
          add: {
            content:
              'directive @api(name: String) on QUERY | MUTATION | FRAGMENT_DEFINITION'
          }
        }
      ],
      schema: contentfulSchema
    }
  }
};

export default config;
