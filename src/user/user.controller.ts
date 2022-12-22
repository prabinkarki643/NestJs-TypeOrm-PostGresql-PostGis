import { Controller, UseInterceptors, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  CrudRequestInterceptor,
} from '@nestjsx/crud';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import {
  GeoApiQuery,
  GeoRequestInterceptor,
  ParsedGeoJson,
  ParsedGeoJsonI,
} from 'src/geoquery';

export class GetRangeDto {
  @ApiProperty()
  lat: number;
  @ApiProperty()
  long: number;
  @ApiProperty()
  range: number;
}

@Crud({
  model: {
    type: User,
  },
  query: {
    join: {
      photos: {
        eager: true,
      },
    },
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto,
  },
})
@Controller('users')
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}
  get base(): CrudController<User> {
    return this;
  }

  @GeoApiQuery()
  @UseInterceptors(GeoRequestInterceptor)
  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedGeoJson() geoJson: ParsedGeoJsonI,
  ) {
    const createBuilder = await this.service.createBuilder(
      req.parsed,
      req.options,
    );
    if (geoJson) {
      const { origin, range } = geoJson;
      createBuilder.andWhere(
        'ST_DWithin(User.location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(User.location)) ,:range)',
      );
      createBuilder.setParameters({
        origin: JSON.stringify(origin), // stringify GeoJSON
        range: range * 1000, //KM conversion
      });
    }
    return createBuilder.getMany();
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Get('/locations/users')
  async exportSome(@ParsedRequest() req: CrudRequest) {
    console.log('req', req);
    return this.service.createBuilder(req.parsed, req.options);
    // return req
  }
  @Post('range')
  public async getRange(@Body() location: GetRangeDto) {
    return await this.service.getRange(
      location.lat,
      location.long,
      location.range,
    );
  }
}
