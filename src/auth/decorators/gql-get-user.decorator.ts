import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';

export const GqlGetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const { req } = gqlContext.getContext();

    return req.user;
  },
);
