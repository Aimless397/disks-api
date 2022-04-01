import { Injectable, ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  canActivate(
    executionContext: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const context = GqlExecutionContext.create(executionContext);
    const { req } = context.getContext();

    return super.canActivate(new ExecutionContextHost([req]));
  }
}
