import { NextApiRequest } from 'next';
import { Get, Lambda, Post } from 'spank';

interface User {
  name: string;
  id: number;
}

const db: Array<User> = [];

class Users {
  @Get()
  list() {
    return db;
  }

  @Post()
  create(req: NextApiRequest) {
    const user = { id: db.length, name: req.body.name };

    db.push(user);

    return user;
  }
}

export default Lambda(Users);
