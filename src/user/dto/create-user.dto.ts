import { ApiProperty } from '@nestjs/swagger';
import { CreatePhotoDto } from './create-photo.dto';
import { GeoPointDto } from 'src/geoquery';

export class CreateUserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  location:GeoPointDto

  @ApiProperty({type:CreatePhotoDto,isArray:true})
  photos: CreatePhotoDto[];

}
