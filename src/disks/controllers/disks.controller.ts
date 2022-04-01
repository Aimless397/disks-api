import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../users/decorators/roles.decorator';
import { Role } from '../../users/enums/user-role.enum';
import { RolesGuard } from '../../users/guards/roles.guard';
import { CreateDiskDto } from '../dtos/request/create-disk.dto';
import { DiskUUidDto } from '../dtos/request/disk-uuid.dto';
import { GetDisksFilterDto } from '../dtos/request/get-disks-filter.dto';
import { PublicFileDto } from '../dtos/request/public-file.dto';
import { UpdateDiskDto } from '../dtos/request/update-disk.dto';
import { DiskDto } from '../dtos/response/get-disks.dto';
import { UserReactionDto } from '../dtos/response/user-reaction.dto';
import { DisksService } from '../services/disks.service';

@ApiTags('disks')
@Controller('disks')
export class DisksController {
  constructor(private readonly disksService: DisksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all no-disabled disks' })
  @ApiResponse({ status: 200, description: 'List of all disks' })
  getDisks(@Query() filterDto?: GetDisksFilterDto): Promise<DiskDto[]> {
    return this.disksService.getAll(filterDto);
  }

  @Get('/:uuid')
  @ApiOperation({ summary: 'Get one disk' })
  @ApiResponse({ status: 200, description: 'Detail of a disk' })
  @ApiBearerAuth()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param() { uuid }: DiskUUidDto): Promise<DiskDto> {
    return this.disksService.findOne(uuid);
  }

  @Post()
  @ApiOperation({ summary: 'Endpoint to create disks' })
  @ApiResponse({ status: 201, description: 'Disk created' })
  @ApiBearerAuth()
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createDiskDto: CreateDiskDto): Promise<DiskDto> {
    return this.disksService.create(createDiskDto);
  }

  @Patch('/:uuid')
  @ApiOperation({ summary: 'Endpoint to update disks' })
  @ApiResponse({ status: 200, description: 'Disk updated' })
  @ApiBearerAuth()
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Body() updateDiskDto: UpdateDiskDto,
    @Param() { uuid }: DiskUUidDto,
  ): Promise<DiskDto> {
    return this.disksService.update(uuid, updateDiskDto);
  }

  @Patch('/:uuid/disable')
  @ApiOperation({ summary: 'Endpoint to disable disk' })
  @ApiResponse({ status: 200, description: 'Disk disabled' })
  @ApiBearerAuth()
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  disable(@Param() { uuid }: DiskUUidDto): Promise<DiskDto> {
    return this.disksService.disable(uuid);
  }

  @Delete('/:uuid')
  @ApiOperation({ summary: 'Endpoint to delete disks' })
  @ApiResponse({ status: 200, description: 'Disk deleted' })
  @ApiBearerAuth()
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  delete(@Param() { uuid }: DiskUUidDto): Promise<DiskDto> {
    return this.disksService.delete(uuid);
  }

  @Patch('/:uuid/upload-cover')
  @ApiOperation({ summary: 'Endpoint to upload a disk cover' })
  @ApiResponse({ status: 200, description: 'Cover uploaded' })
  @ApiBearerAuth()
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadCover(
    @Param() { uuid }: DiskUUidDto,
    @Body() publicFileDto: PublicFileDto,
  ): Promise<DiskDto> {
    return this.disksService.uploadPublicFile(uuid, publicFileDto);
  }

  @Post('/:uuid/like')
  @ApiOperation({ summary: 'Endpoint to like a disk' })
  @ApiResponse({ status: 200, description: 'Disk liked' })
  @ApiBearerAuth()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  like(
    @Request() req,
    @Param() { uuid }: DiskUUidDto,
  ): Promise<UserReactionDto> {
    return this.disksService.like({
      userUuid: req.user.uuid,
      diskUuid: uuid,
    });
  }

  // UNUSED
  /* @Get('/:uuid/getPublicFile')
  getPublicFile(@Param() { uuid }: DiskUUidDto) {
    return this.disksService.getPublicFile(uuid);
  } */
}
