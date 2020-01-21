import { Get, Lambda, Post } from '9ight';

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
