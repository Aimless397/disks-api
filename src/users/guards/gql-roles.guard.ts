import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/user-role.enum';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(executionContext: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      executionContext.getHandler(),
      executionContext.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const context = GqlExecutionContext.create(executionContext);
    const { req } = context.getContext();

    return requiredRoles.some((role) => req.user.role?.includes(role));
  }
}
