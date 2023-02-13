The following is prepended to each `schema.graphql` so that the
GraphQL Language Server does not throw errors when using the `@api()` directive

```gql
directive @api(name: String) on QUERY | MUTATION
```

If the GraphQL Language Server still throws an error, try reloading the plugin
with the `VSCode GraphQL: Manual Restart` command
