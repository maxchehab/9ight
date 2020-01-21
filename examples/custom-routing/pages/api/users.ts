import { Get, Lambda, Post } from '9ight';

class Users {
  @Get()
  async list() {
    return `list users`;
  }

  @Post()
  async create() {
    return 'creating users';
  }
}

export default Lambda(Users);
