import { Get, Lambda, Post, Body } from '9ight';

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
  create(@Body() body: any) {
    const user = { id: db.length, name: body.name };

    db.push(user);

    return user;
  }
}

export default Lambda(Users);
