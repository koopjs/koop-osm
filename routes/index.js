module.exports = {
  
  'get /osm': {
    controller: 'osm',
    action: 'listTypes'
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

  'get /osm/:type/distinct/:field': {
    controller: 'osm',
    action: 'getDistinct'
  },

  'get /osm/:type/state/:state': {
    controller: 'osm',
    action: 'getState'
  }
}
