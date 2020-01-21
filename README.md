# 9ight

A Next.js or Node lambda Framework

```ts
import { Get, Lambda, Post, Body } from '9ight';

const db = [];

class Users {
  @Get()
  list() {
    return db;
  }

  @Post()
  create(@Body() body: any) {
    const user = { id: db.length, name: body.name };

    db.push(user);

    return user;
  }
}

export default Lambda(Users);
```
