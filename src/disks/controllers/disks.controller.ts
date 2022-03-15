import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../users/decorators/roles.decorator';
import { Role } from '../../users/enums/user-role.enum';
import { CreateDiskDto } from '../dtos/request/create-disk.dto';
import { GetDisksFilterDto } from '../dtos/request/get-disks-filter.dto';
import { DiskDto } from '../dtos/response/get-disks.dto';
import { DisksService } from '../services/disks.service';
import { RolesGuard } from '../../users/guards/roles.guard';
import { DiskUUidDto } from '../dtos/request/disk-uuid.dto';
import { UpdateDiskDto } from '../dtos/request/update-disk.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('disks')
@Controller('disks')
export class DisksController {
  constructor(private disksService: DisksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all no-disabled disks' })
  @ApiResponse({ status: 200, description: 'List of all disks' })
  getDisks(@Query() filterDto?: GetDisksFilterDto): Promise<DiskDto[]> {
    return this.disksService.getAll(filterDto);
  }

  @Post()
  @ApiOperation({ summary: 'Endpoint to create disks' })
  @ApiResponse({ status: 201, description: 'Disk created' })
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createDiskDto: CreateDiskDto): Promise<DiskDto> {
    return this.disksService.create(createDiskDto);
  }

  @Patch('/:uuid')
  @ApiOperation({ summary: 'Endpoint to update and disable disks' })
  @ApiResponse({ status: 200, description: 'Disk updated' })
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Body() updateDiskDto: UpdateDiskDto,
    @Param() { uuid }: DiskUUidDto,
  ): Promise<DiskDto> {
    return this.disksService.update(uuid, updateDiskDto);
  }

  @Delete('/:uuid')
  @ApiOperation({ summary: 'Endpoint to delete disks' })
  @ApiResponse({ status: 200, description: 'Disk deleted' })
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  delete(@Param() { uuid }: DiskUUidDto): Promise<boolean> {
    return this.disksService.delete(uuid);
  }
}
