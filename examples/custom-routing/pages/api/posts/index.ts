import { Get, Lambda, Post, Params } from '9ight';

const db = [
  { id: 0, title: 'A post' },
  { id: 1, title: 'Another post' },
  { id: 2, title: 'Yet another post' },
];

class Posts {
  @Get()
  async list() {
    return db;
  }

  @Get(':id/test/:test')
  async get(@Params() params: any) {
    return params;
  }
}

export default Lambda(Posts);
