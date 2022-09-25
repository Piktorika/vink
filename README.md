# Vink

A library that allows users to generate API routes from an specified file system.

## Demo

<img src="https://github.com/Piktorika/vink/blob/main/static/demo1.png?raw=true" style="zoom: 50%;" />


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

const loadedRoutes = loadRoutes("your-absolute-route-path");

app.use("/", loadedRoutes);

app.start(applicationPort);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
