# sol-comments-parser
[![npm](https://img.shields.io/npm/dm/sol-comments-parser.svg)](https://www.npmjs.com/package/sol-comments-parser)
[![Build Status](https://travis-ci.org/HQ20/sol-comments-parser.svg?branch=master)](https://travis-ci.org/HQ20/sol-comments-parser)
[![Coverage Status](https://coveralls.io/repos/github/HQ20/sol-comments-parser/badge.svg?branch=master)](https://coveralls.io/github/HQ20/sol-comments-parser?branch=master)


This is a solidity comments parser, not to be used alone, but instead, help with any other package.

## Installation

Use the package manager npm or yarn to install.

```bash
npm i sol-comments-parser --save
# or
yarn add sol-comments-parser
```

## Usage

```javascript
import { mapComments } from 'sol-comments-parser';

const input = fs.readFileSync(solidityFile, encoding); // By-default used utf-8 
const result = mapComments(input);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPL-3.0](LICENSE.md)
