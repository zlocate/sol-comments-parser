# sol-comments-parser

This is a solidity comments parser, not to be used alone, but instead, help with any other package.

## Installation

Use the package manager npm or yarn to install.

```bash
npm install sol-comments-parser --save
# or
yarn add sol-comments-parser
```

## Usage

```javascript
import { mapComments } from 'sol-comments-parser';

const input = fs.readFileSync(solidityFile).toString();
const result = mapComments(input);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPL-3.0](LICENSE.md)
