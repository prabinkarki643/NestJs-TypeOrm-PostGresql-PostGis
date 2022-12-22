# Geo Query Docs

## Usages

- First define a geography column in the entity as follows

```sh
  import { Point } from 'geojson';

  @ApiProperty({type:GeoPoint})
  @Index({ spatial: true })
  @Column({
      type: 'geography',
      spatialFeatureType: 'Point',
      srid:4326,
      nullable: true
  })
  location:Point
```

Note that: Inorder to work with geography column we must install Postgis extension with Postgress, Please check Reference for more details.

- Next Define ApiQuery for swagger uses

```sh
 @GeoApiQuery()
```

- Next Use Request Interceptor to capture query from request

```sh
  @UseInterceptors(GeoRequestInterceptor)
```

- Next Use Param Decorator to capture query from request as a JSON

```sh
  @ParsedGeoJson() geoJson: ParsedGeoJsonI
```

- Now check for the geoJson value and based on that addWhere statement to support Geo Location Based Query as follows,

```sh
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
```

## Example

Final Example

```sh
  @ApiQuery({ name: 'geojson', type: String, required: false })
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
```

## References

- [Docker PostGIS and PGAdmin][https://crivetimihai.github.io/geospacial-engineering/setup/]
- [Postgres with Postgis support Docker Image][https://registry.hub.docker.com/r/postgis/postgis/]
- [Example][https://medium.com/@nooneypradeep/storing-geolocation-data-and-finding-range-in-postgres-node-js-nest-1e816d2c67ad]
