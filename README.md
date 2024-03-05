# Vink

A library that allows users to generate API routes from an specified file system.

## Demos

- [API with Middleware](https://github.com/Piktorika/vink/tree/main/examples/api-with-middleware)
- [Basic API](https://github.com/Piktorika/vink/tree/main/examples/basic-api)
- [CRUD API](https://github.com/Piktorika/vink/tree/main/examples/crud-api)


## Installation

### npm

```bash
npm install @piktorika/vink
```
### pnpm

```bash
pnpm install @piktorika/vink
```

## Usage

```javascript
import express from "express";

import {loadRoutes} from "@piktorika/vink";

const app = express();
const applicationPort = 3001;

// your initial express setup

const loadedRoutes = await loadRoutes("./relative-path-to-routes-folder");

app.use("/", loadedRoutes);

app.start(applicationPort);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
