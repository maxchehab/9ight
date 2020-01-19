import { Get, Lambda, Query } from 'spank';
import { IsString } from 'class-validator';

class EchoQuery {
  @IsString() name!: string;
}

class Echo {
  @Get()
  list(@Query(EchoQuery) query: EchoQuery) {
    return `Hello ${query.name}  👋`;
  }
}

export default Lambda(Echo);
