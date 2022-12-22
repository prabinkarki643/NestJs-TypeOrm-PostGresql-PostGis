import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Photo } from './entities/photo.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,

    @InjectRepository(Photo)
    public photosRepository: Repository<Photo>,
  ) {
    super(usersRepository);
  }

  public async getRange(lat:number,long:number,range:number = 1000) {
    let origin = {
      type: "Point",
      coordinates: [lat,long]
    };
   let  locations = await this.repo
        .createQueryBuilder()
        // .select(['ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)))/1000 AS distance' ])
        .where("ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)) ,:range)")
        // .orderBy("distance","ASC")
        .setParameters({
           // stringify GeoJSON
          origin: JSON.stringify(origin),
          range:range*1000 //KM conversion
        })
       .getMany();
    return locations;
  }
}
