var extend = require('node.extend'),
  base = require('../../base/controller.js');

// inherit from base controller
var Controller = extend({
  serviceName: 'osm',

  tables: {
    points:'planet_osm_point_koop',
    polygons:'planet_osm_polygon_koop',
    lines: 'planet_osm_line_koop'
  },

  // a mapping of types to views 
  views:{
    points:'planet_osm_point_koop',
    polygons:'planet_osm_polygon_koop',
    lines: 'planet_osm_line_koop'
  }, 

  // renders an empty map with a text input 
  explore: function(req, res){
    res.view('osm/index', { locals:{ where: req.query.where } });
  },
    
  base_url: 'http://'+sails.config.host+':'+sails.config.port+'/osm',

  listTypes: function(req, res){
    var links = {};
    for (var type in Controller.tables ){
      links[type] = Controller.base_url + '/' + type;
    }
    res.json( links );
  },

  getData: function(req, res){
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else {
      OSM.getData( table, req.query, function(err, data){
        res.json( data );
      });
    } 
  },

  featureserver: function( req, res ){
    var callback = req.query.callback;
    delete req.query.callback;

    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else {
      OSM.getData( table, req.query, function(err, data){
        if (err) {
          res.send( err, 500);
        } else {
          req.query.geometry;
          req.query.where;
          Controller._processFeatureServer( req, res, err, [data], callback);
        }
      });
    }
  },

  _sendError: function(res, err){
    res.send(err,500);
  },

  getCounts: function(req, res){
    var view = Controller.views[req.params.type];
    if ( !view ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else {
      if ( req.params.boundaryType == 'state' && !req.query.where ){
        view = 'osm_'+req.params.type+'_state';
        OSM.staticCount( view, function(err, data){
          res.json( data );
        });
      } else if ( req.params.boundaryType == 'county' && !req.query.where ){
        view = 'osm_'+req.params.type+'_county';
        OSM.staticCount( view, function(err, data){
          res.json( data );
        });
      } else {
        OSM.count( req.params.boundaryType, view, req.query, function(err, data){
          res.json( data );
        });
      }
    }
  },

  getDistinct: function(req, res){
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else {
      OSM.distinct( req.params.field, table, req.query, function(err, data){
        res.json( data );
      });
    }
  },

  getFields: function(req, res){
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else {
      OSM.fields( table, req.query, function(err, data){
        res.json( data );
      });
    }
  },

  getState: function(req, res){
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else if ( !req.params.state ) {
      self._sendError(res, 'Invalid state name');
    } else {
      if ( req.query.where ){
        req.query.where = 'state=\''+req.params.state+'\' AND '+req.query.where;
      } else {
        req.query.where = 'state=\''+req.params.state+'\'';
      }
      OSM.getData( table, req.query, function(err, data){
        res.json( data );
      });
    }
  }


}, base);

module.exports = Controller;
