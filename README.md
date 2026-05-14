# OpenAPI Typescript Codegen

> Node.js library that generates Typescript clients based on the OpenAPI specification.

## Install

This package is published to **GitHub Packages** under the `@yottaltd` scope. Consumers
need an `.npmrc` entry pointing the `@yottaltd` scope at GitHub:

```
@yottaltd:registry=https://npm.pkg.github.com
```

Then:

```
npm install @yottaltd/openapi-typescript-codegen --save-dev
```

The public `npmjs.com` registry is **not** used — this package only exists on GitHub
Packages. Local installs need a GitHub personal access token with `read:packages` scope
in `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=<token>
```

For releasing new versions of this package, see [HOW_TO_RELEASE.md](./HOW_TO_RELEASE.md).

## Usage

**package.json**

```json
{
  "scripts": {
    "generate": "openapi --input ./spec.json --output ./dist"
  }
}
```

```
$ openapi --help

  Usage: openapi [options]

  Options:
    -V, --version             output the version number
    -i, --input <value>       OpenAPI specification, can be a path, url or string content (required)
    -o, --output <value>      Output directory (required)
    -c, --client <value>      HTTP client to generate [fetch, xhr, node] (default: "fetch")
    --useOptions              Use options instead of arguments
    --useUnionTypes           Use union types instead of enums
    --exportCore <value>      Write core files to disk (default: true)
    --exportServices <value>  Write services to disk (default: true)
    --exportModels <value>    Write models to disk (default: true)
    --exportSchemas <value>   Write schemas to disk (default: false)

  Examples
    $ openapi --input ./spec.json
    $ openapi --input ./spec.json --output ./dist
    $ openapi --input ./spec.json --output ./dist --client xhr
```

## Features

### Argument style vs. Object style `--useOptions`

There's no [named parameter](https://en.wikipedia.org/wiki/Named_parameter) in JavaScript or TypeScript, because of
that, we offer the flag `--useOptions` to generate code in two different styles.

**Argument-style:**

```typescript
function createUser(name: string, password: string, type?: string, address?: string) {
  // ...
}

// Usage
createUser('Jack', '123456', undefined, 'NY US');
```

**Object-style:**

```typescript
function createUser({
  name,
  password,
  type,
  address,
}: {
  name: string;
  password: string;
  type?: string;
  address?: string;
}) {
  // ...
}

// Usage
createUser({
  name: 'Jack',
  password: '123456',
  address: 'NY US',
});
```

### Enums vs. Union Types `--useUnionTypes`

The OpenAPI spec allows you to define [enums](https://swagger.io/docs/specification/data-models/enums/) inside the
data model. By default, we convert these enums definitions to [TypeScript enums](https://www.typescriptlang.org/docs/handbook/enums.html).
However, these enums are merged inside the namespace of the model, this is unsupported by Babel, [see docs](https://babeljs.io/docs/en/babel-plugin-transform-typescript#impartial-namespace-support).
Because we also want to support projects that use Babel [@babel/plugin-transform-typescript](https://babeljs.io/docs/en/babel-plugin-transform-typescript),
we offer the flag `--useUnionTypes` to generate [union types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types)
instead of the traditional enums. The difference can be seen below:

**Enums:**

```typescript
// Model
export interface Order {
  id?: number;
  quantity?: number;
  status?: Order.status;
}

export namespace Order {
  export enum status {
    PLACED = 'placed',
    APPROVED = 'approved',
    DELIVERED = 'delivered',
  }
}

// Usage
const order: Order = {
  id: 1,
  quantity: 40,
  status: Order.status.PLACED,
};
```

**Union Types:**

```typescript
// Model
export interface Order {
  id?: number;
  quantity?: number;
  status?: 'placed' | 'approved' | 'delivered';
}

// Usage
const order: Order = {
  id: 1,
  quantity: 40,
  status: 'placed',
};
```
