import { Get, Lambda, Query, Post, Body } from 'spank';
import { IsString, validate } from 'class-validator';

class EchoQuery {
  @IsString() name!: string;
}

const Validator = (InputClass: any) => {
  return async function(input: any): Promise<boolean> {
    const instance = new InputClass();

    for (const prop in input) {
      instance[prop] = input[prop];
    }

    const errors = await validate(instance);

    return errors.length === 0;
  };
};

class Echo {
  // Using the @Query decorator with a validator
  @Get()
  async echo(@Query(Validator(EchoQuery)) query: EchoQuery) {
    return `Hello ${query.name}`;
  }

  // Using the @Body decorator with no validator.
  @Post()
  async postEcho(@Body() body: any) {
    return { body };
  }
}

export default Lambda(Echo);
