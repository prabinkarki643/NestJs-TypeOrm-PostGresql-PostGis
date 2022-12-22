import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  createParamDecorator,
  applyDecorators,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';

export const PARSED_GEOJSON_REQUEST_KEY = 'PARSED_GEOJSON_REQUEST_KEY';
export const GEOJSON_QUERY_NAME = 'geojson';

/**
 * GeoJson Query Interface for frontend to refer
 */
export class GeoJsonQueryI {
  latitude: number;
  longitude: number;
  range: number;
}

export function GeoApiQuery() {
  return applyDecorators(
    ApiQuery({
      name: GEOJSON_QUERY_NAME,
      type: String,
      required: false,
      example: `{"latitude":number,"longitude":number,"range":number}`,
    }),
  );
}

//Dto used for the entity
export class GeoPointDto {
  @ApiProperty()
  type: string;
  @ApiProperty()
  coordinates: [number, number];
}

/**
 * Parsed GeoJson Interface
 */
export interface ParsedGeoJsonI {
  origin: {
    type: 'Point';
    coordinates: [number, number];
  };
  range: number;
}

/**
 * Request Interceptor, which will add a Geo Json Object to request object
 */
@Injectable()
export class GeoRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const req = context.switchToHttp().getRequest();
      if (req?.query?.[GEOJSON_QUERY_NAME]) {
        var parsedGeoJson: GeoJsonQueryI = JSON.parse(
          req?.query?.[GEOJSON_QUERY_NAME],
        );
        if(!parsedGeoJson.latitude || !parsedGeoJson.longitude || !parsedGeoJson.range ){
            throw new BadRequestException("Invalid Geojson format");
        }
        parsedGeoJson.latitude=Number(parsedGeoJson.latitude)
        parsedGeoJson.longitude=Number(parsedGeoJson.longitude)
        parsedGeoJson.range=Number(parsedGeoJson.range)
        req[PARSED_GEOJSON_REQUEST_KEY] = {
          origin: {
            type: 'Point',
            coordinates: [parsedGeoJson.latitude, parsedGeoJson.longitude],
          },
          range: parsedGeoJson.range,
        };
      }
      return next.handle();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

/**
 * Param Decorator to get Parsed Geo Json Object
 */
export const ParsedGeoJson = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req[PARSED_GEOJSON_REQUEST_KEY];
  },
);
