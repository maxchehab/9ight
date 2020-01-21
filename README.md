# 9ight 🌒 

A Next.js API framework

```bash
yarn add 9ight next
```

```ts
// pages/api/users.ts

import { Body, Controller, Get, Params, Post } from '9ight';

const db = [];

@Controller('users')
export default class Users {

  @Get(':id')
  get(@Params() { id }) {
    return db[id];
  }

  @Patch(':id')
  update(@Body() body) {
    db[id] = Object.assign(db[id], body)
    return db[id];
  }

  @Post()
  create(@Body() body) {
    db.push({ id: db.length, name: body.name });
    return db.slice(-1)
  }

  @Get()
  list() {
    return db;
  }
}
```