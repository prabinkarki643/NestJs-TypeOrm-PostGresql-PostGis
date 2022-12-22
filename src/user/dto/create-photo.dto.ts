import { ApiProperty } from '@nestjs/swagger';
export class CreatePhotoDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  location: string;
}
