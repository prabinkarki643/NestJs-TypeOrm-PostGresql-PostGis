import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { Photo } from './photo.entity';
import { Point } from 'geojson';
import { GeoPointDto } from 'src/geoquery';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({type:GeoPointDto})
  @Index({ spatial: true })
  @Column({
      type: 'geography',
      spatialFeatureType: 'Point',
      srid:4326,
      nullable: true
  })
  location:Point

  @ApiProperty()
  @OneToMany(type => Photo, photo => photo.user,{eager:true,cascade:true})
  photos: Photo[];
}