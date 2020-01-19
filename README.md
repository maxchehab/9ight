# Spank

A Next.js or Node lambda Framework

```ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Get, Lambda, Post } from 'spank';

interface User {
  name: string;
  id: number;
}

const UserDB: Array<User> = [];

class Users {
  @Get()
  list(req: NextApiRequest, res: NextApiResponse) {
    return res.json(UserDB);
  }

  @Post()
  create(req: NextApiRequest, res: NextApiResponse) {
    const user = { id: UserDB.length, name: req.body.name };

    UserDB.push(user);

    return res.status(201).json(user);
  }
}

export default Lambda(Users);
```
