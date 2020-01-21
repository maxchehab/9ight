import { Get, Lambda, Post } from '6ix';

class Posts {
  // Using the @Query decorator with a validator
  @Get()
  async list() {
    return `list posts`;
  }

  // Using the @Body decorator with no validator.
  @Post()
  async create() {
    return 'creating posts';
  }
}

export default Lambda(Posts);
