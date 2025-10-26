# eu4-parser
eu4-parser is a lightweight Node.js library that parses [Europa Universalis IV](https://en.wikipedia.org/wiki/Europa_Universalis_IV) save game files (.eu4) into structured JavaScript objects. Whether you're building analytics tools, visualizations, or modding utilities, this parser gives you direct access to game state data.

## Installation

Using npm:

```bash
npm install eu4-parser
```

## Features

- Converts EU4 save game data into a navigable JavaScript object
- Parses compressed as well as uncompressed save games files (.eu4)
- Makes alle meta data and gamestate data accessible - e.g. like provinces, countries, diplomacy, armies, events
- Can be used via ESM and CJS import

## Usage example

ESM
```js
import { parseEu4Savegame } from 'eu4-parser';

const savegame = parseEu4Savegame(pathToSavegameFile);
console.log(JSON.stringify(savegame));
```

CJS
```js
const { parseEu4Savegame } = require('eu4-parser');

const result = parseEu4Savegame(pathToSavegameFile);
console.log(JSON.stringify(savegame));
```




