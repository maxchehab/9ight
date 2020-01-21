import { Get, Lambda, Query, Params } from '9ight';

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
  async get(@Query() query: any, @Params() params: any) {
    return { ...params, ...query };
  }
}

export default Lambda(Posts);
