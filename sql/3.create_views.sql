CREATE MATERIALIZED VIEW planet_osm_polygon_koop as select planet_osm_polygon.*, states.name as state, counties.name as county from planet_osm_polygon, states, counties WHERE ST_Within(ST_Transform(way,4326), states.geom) AND ST_Within(ST_Transform(way,4326), counties.geom);

create MATERIALIZED view planet_osm_point_koop as select planet_osm_point.*, states.name as state, counties.name as county from planet_osm_point, states, counties WHERE ST_Within(ST_Transform(way,4326), states.geom) AND ST_Within(ST_Transform(way,4326), counties.geom);

create MATERIALIZED view planet_osm_line_koop as select planet_osm_line.*, states.name as state, counties.name as county from planet_osm_line, states, counties WHERE ST_Within(ST_Transform(way,4326), states.geom) AND ST_Within(ST_Transform(way,4326), counties.geom);

create MATERIALIZED view planet_osm_roads_koop as select planet_osm_roads.*, states.name as state, counties.name as county from planet_osm_roads, states, counties WHERE ST_Within(ST_Transform(way,4326), states.geom) AND ST_Within(ST_Transform(way,4326), counties.geom);
