import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlGetUser } from '../../auth/decorators/gql-get-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/user-role.enum';
import { GqlRolesGuard } from '../guards/gql-roles.guard';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @Roles(Role.CLIENT)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async profile(@GqlGetUser() user: User) {
    return this.usersService.findByUuid(user.uuid);
  }
}
