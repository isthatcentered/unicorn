[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## [Lerna](https://github.com/lerna/lerna) TLDR;

### Useful commands

- `$ yarn lerna --help`
- `$ yarn lerna {command} --help`
- `$ lerna run watch --ignore package-{1,2,5} --include-dependencies --stream` runs watch command in all packages [filtering options](https://www.npmjs.com/package/@lerna/filter-options)
- `$ yarn lerna init`
- `$ yarn lerna bootstrap` installs dependencies for all packages
- `$ yarn lerna publish`

### Tools

- [Lerna wizard](https://github.com/szarouski/lerna-wizard)

### Independant mode

Each package has it's own version

```json
// lerna.json
{
  // ...
  "version": "independant"
}
```
