# express-imagefilter
> This is a midlleware of express.js.it can filter image request by depending config;

## usage
```
npm i express-image-filter

import express from 'express';
import filterImg from 'express-image-filter';

const app = express();

app.use(filterImg({
  blockNotImg: true,
  allowHost: ['localhost:5000'],
},express.static('./file')));

type config = {
  allowHost?: string[],
  blockNotImg?: boolean,
}
```
