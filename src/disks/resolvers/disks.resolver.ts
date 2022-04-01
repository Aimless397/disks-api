import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileInterceptor } from '@nestjs/platform-express';
import { GqlGetUser } from '../../auth/decorators/gql-get-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { Roles } from '../../users/decorators/roles.decorator';
import { Role } from '../../users/enums/user-role.enum';
import { GqlRolesGuard } from '../../users/guards/gql-roles.guard';
import { User } from '../../users/models/user.model';
import { CreateDiskInput } from '../dtos/input/create-disk.input';
import { GetDisksFilterInput } from '../dtos/input/get-disks-filter.input';
import { UpdateDiskInput } from '../dtos/input/update-disk.input';
import { UploadFileInput } from '../dtos/input/upload-file.input';
import { Disk } from '../models/disk.model';
import { UserReaction } from '../models/user-reaction.model';
import { DisksService } from '../services/disks.service';

@Resolver(() => Disk)
export class DisksResolver {
  constructor(private disksService: DisksService) {}

  @Query(() => [Disk])
  getDisks(@Args('filterInput') filterInput: GetDisksFilterInput) {
    return this.disksService.getAll(filterInput);
  }

  @Query(() => Disk)
  @Roles(Role.CLIENT)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  getDisk(@Args('uuid') uuid: string) {
    return this.disksService.findOne(uuid);
  }

  @Mutation(() => Disk)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  createDisk(@Args('diskInput') diskInput: CreateDiskInput) {
    return this.disksService.create(diskInput);
  }

  @Mutation(() => Disk)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  updateDisk(
    @Args('uuid') uuid: string,
    @Args('diskInput') diskInput: UpdateDiskInput,
  ) {
    return this.disksService.update(uuid, diskInput);
  }

  @Mutation(() => Disk)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  disableDisk(@Args('uuid') uuid: string) {
    return this.disksService.disable(uuid);
  }

  @Mutation(() => Disk)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  deleteDisk(@Args('uuid') uuid: string) {
    return this.disksService.delete(uuid);
  }

  @Mutation(() => Disk)
  @Roles(Role.MANAGER)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadCover(
    @Args('uuid') uuid: string,
    @Args('uploadFileInput') uploadFileInput: UploadFileInput,
  ) {
    return this.disksService.uploadPublicFile(uuid, uploadFileInput);
  }

  @Mutation(() => UserReaction)
  @Roles(Role.CLIENT)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  likeDisk(@GqlGetUser() user: User, @Args('uuid') uuid: string) {
    return this.disksService.like({
      userUuid: user.uuid,
      diskUuid: uuid,
    });
  }
}
