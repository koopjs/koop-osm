CREATE MATERIALIZED VIEW planet_osm_polygon_koop as select planet_osm_polygon.*, states.name as state, counties.name as county from planet_osm_polygon, states, counties WHERE ST_Within(ST_Transform(way,4326), states.geom) AND ST_Within(ST_Transform(way,4326), counties.geom);

create MATERIALIZED view planet_osm_point_koop as select planet_osm_point.*, states.name as state, counties.name as county from planet_osm_point, states, counties WHERE ST_Within(ST_Transform(way,4326), states.geom) AND ST_Within(ST_Transform(way,4326), counties.geom);

create MATERIALIZED view planet_osm_line_koop as select planet_osm_line.*, states.name as state, counties.name as county from planet_osm_line, states, counties WHERE ST_Within(ST_Transform(way,4326), states.geom) AND ST_Within(ST_Transform(way,4326), counties.geom);

create MATERIALIZED view planet_osm_roads_koop as select planet_osm_roads.*, states.name as state, counties.name as county from planet_osm_roads, states, counties WHERE ST_Within(ST_Transform(way,4326), states.geom) AND ST_Within(ST_Transform(way,4326), counties.geom);

SELECT count(osm_id)::int, planet_osm_point_koop.state INTO osm_points_state FROM planet_osm_point_koop GROUP BY planet_osm_point_koop.state;

SELECT count(osm_id)::int, planet_osm_point_koop.state, planet_osm_point_koop.county INTO osm_points_county FROM planet_osm_point_koop GROUP BY planet_osm_point_koop.county, planet_osm_point_koop.state;

SELECT count(osm_id)::int, planet_osm_polygon_koop.state INTO osm_polygons_state FROM planet_osm_polygon_koop GROUP BY planet_osm_polygon_koop.state;

SELECT count(osm_id)::int, planet_osm_polygon_koop.state, planet_osm_polygon_koop.county INTO osm_polygons_county FROM planet_osm_polygon_koop GROUP BY planet_osm_polygon_koop.county, planet_osm_polygon_koop.state;

SELECT count(osm_id)::int, planet_osm_line_koop.state INTO osm_lines_state FROM planet_osm_line_koop GROUP BY                   planet_osm_line_koop.state;

SELECT count(osm_id)::int, planet_osm_line_koop.state, planet_osm_line_koop.county INTO osm_lines_county FROM planet_osm_line_koop GROUP BY planet_osm_line_koop.county, planet_osm_line_koop.state;
