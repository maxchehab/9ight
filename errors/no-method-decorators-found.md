# No Method Decorators Found

#### Why This Error Occurred

You supplied a Class that has no method decorators. 

#### Possible Ways to Fix It

Apply a method decorator to the Class.

```ts
// before

import { Lambda } from '9ight';

class Users {

    list(): Promise<User[]> {
        return usersService.findAll()
    }
}

export default Lambda(Users)
```

```ts
// after

import { Get, Lambda } from '9ight';

class Users {
    
    @Get()
    list(): Promise<User[]> {
        return usersService.findAll()
    }
}

export default Lambda(Users)
```
