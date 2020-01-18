import { NextApiRequest, NextApiResponse } from 'next';
import { ulid } from 'ulid';

import { Lambda, Post, Get } from '../lib';

interface User {
  name: string;
  id: string;
}

const UserDB: Array<User> = [];

class Users {
  @Get()
  list(_req: NextApiRequest, res: NextApiResponse) {
    return res.json(UserDB);
  }

  @Post()
  create(req: NextApiRequest, res: NextApiResponse) {
    const user = { id: `usr_${ulid()}`, name: req.body.name };

    UserDB.push(user);

    return res.status(201).json(user);
  }
}

export default Lambda(Users);
