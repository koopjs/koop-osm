module.exports = {
  
  'get /osm': {
    controller: 'osm',
    action: 'listTypes'
  },

  'get /osm/:type.:format': {
    controller: 'osm',
    action: 'getData'
  },

  'get /osm/:type': {
    controller: 'osm',
    action: 'getData'
  },

  'get /osm/:type/FeatureServer/:layer/:method': {
    controller: 'osm',
    action: 'featureserver'
  },

  'get /osm/:type/FeatureServer/:layer': {
    controller: 'osm',
    action: 'featureserver'
  },
  
  'get /osm/:type/FeatureServer': {
    controller: 'osm',
    action: 'featureserver'
  },

  'get /osm/:type/fields': {
    controller: 'osm',
    action: 'getFields'
  },

  'get /osm/:type/:boundaryType/count': {
    controller: 'osm',
    action: 'getCounts'
  },

  'get /osm/:type/:boundaryType/count/:field/:value': {
    controller: 'osm',
    action: 'getCountsByField'
  },

  'get /osm/:type/distinct/:field': {
    controller: 'osm',
    action: 'getDistinct'
  },
  
  'get /osm/:type/state/:state.:format': {
    controller: 'osm',
    action: 'getState'
  },

  'get /osm/:type/state/:state': {
    controller: 'osm',
    action: 'getState'
  },

  'get /osm/:type/state/:state/county/:county.:format': {
    controller: 'osm',
    action: 'getCounty'
  },

  'get /osm/:type/state/:state/county/:county': {
    controller: 'osm',
    action: 'getCounty'
  },

  'get /osm/:type/state/:state/county/:county/field/:field/:value.:format': {
    controller: 'osm',
    action: 'getCountyByField'
  },

  'get /osm/:type/state/:state/county/:county/field/:field/:value': {
    controller: 'osm',
    action: 'getCountyByField'
  },

  'get /osm/:type/state/:state/field/:field/:value.:format': {
    controller: 'osm',
    action: 'getStateByField'
  },

  'get /osm/:type/state/:state/field/:field/:value': {
    controller: 'osm',
    action: 'getStateByField'
  },

  'get /osm/:type/field/:field/:value.:format': {
    controller: 'osm',
    action: 'getAllByField'
  },

  'get /osm/:type/field/:field/:value': {
    controller: 'osm',
    action: 'getAllByField'
  },

  'get /osm/:type/state/:state/county/:county/field/:field/:value/FeatureServer/:layer/:method': {
    controller: 'osm',
    action: 'featureserver'
  },

  'get /osm/:type/state/:state/county/:county/field/:field/:value/FeatureServer/:layer': {
    controller: 'osm',
    action: 'featureserver'
  },

  'get /osm/:type/state/:state/county/:county/field/:field/:value/FeatureServer': {
    controller: 'osm',
    action: 'featureserver'
  },

  
  'get /osm/:type/state/:state/field/:field/:value/FeatureServer/:layer/:method': {
    controller: 'osm',
    action: 'featureserver'
  },

  'get /osm/:type/state/:state/field/:field/:value/FeatureServer/:layer': {
    controller: 'osm',
    action: 'featureserver'
  },

  'get /osm/:type/state/:state/field/:field/:value/FeatureServer': {
    controller: 'osm',
    action: 'featureserver'
  },
}
