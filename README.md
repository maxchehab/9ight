# 9ight

A Next.js API framework

```bash
yarn add 9ight next
```

```ts
// pages/api/user.ts

import { Body, Controller, Get, Params, Post } from '9ight';

const db = [];

@Controller('/users')
export default class Users {

  @Get(':id')
  get(@Params() { id }) {
    return db[id];
  }

  @Patch(':id')
  update(@Body() body) {
    const user = db[id];
    db[id] = Object.join(user, body)

    return user
  }

  @Post()
  create(@Body() body: any) {
    const user = { id: db.length, name: body.name };
    db.push(user);
    return user;
  }

  @Get()
  list() {
    return db;
  }
}
```