import { Get, Lambda, Post } from 'spank';

class Users {
  // Using the @Query decorator with a validator
  @Get()
  async list() {
    return `list users`;
  }

  // Using the @Body decorator with no validator.
  @Post()
  async create() {
    return 'creating users';
  }
}

export default Lambda(Users);
