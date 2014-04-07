var extend = require('node.extend'),
  crypto = require('crypto'),
  fs = require('fs'),
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
      if ( req.params.format ){
        var key = ['osm', crypto.createHash('md5').update(JSON.stringify(req.params)+JSON.stringify(req.query)).digest('hex')].join(':');
        var fileName = [sails.config.data_dir + 'files', key, key + '.' + req.params.format].join('/');
        if (fs.existsSync( fileName )){
          res.sendfile( fileName );
        } else {
          OSM.getData( table, req.query, function(err, data){
            Exporter.exportToFormat( req.params.format, key, data, function(err, file){
              if (err){
                res.send(err, 500);
              } else {
                res.sendfile( file );
              }
            });
          });
        }
      } else {
        OSM.getData( table, req.query, function(err, data){
          if ( req.query.topojson ){
            Topojson.convert(data, function(err, topology){ 
              res.json( topology );
            });
          } else {
            res.json( data );
          }
        });
      }
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

  getCountsByField: function( req, res ){
    if ( !req.params.field || !req.params.value ){
      Controller.getCounts(req, res);
    } else {
      var values = [];
      req.params.value.split(':').forEach(function(v,i){
        values.push("'"+v+"'");
      });
      var clause = req.params.field +' in ('+values.join(",")+')';  
      if ( req.query.where ){
        req.query.where = clause + ' AND ' + req.query.where;
      } else {
        req.query.where = clause;
      }
      Controller.getCounts(req, res);
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
      Controller.getData(req, res);
    }
  },

  getCounty: function(req, res){
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else if ( !req.params.state || !req.params.county ) {
      self._sendError(res, 'Must provide both a state and county name');
    } else {
      if ( req.query.where ){
        req.query.where = 'county=\''+req.params.county+'\' AND state=\''+req.params.state+'\' AND '+req.query.where;
      } else {
        req.query.where = 'county=\''+req.params.county+'\' AND state=\''+req.params.state+'\'';
      }
      Controller.getData(req, res);
    }
  },

  getAllByField: function(req, res){
    var clause;
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else if ( !req.params.field || !req.params.value ) {
      self._sendError(res, 'Must provide both a field and a value');
    } else {
      if ( req.params.value.split(':').length ){
        var values = [];
        req.params.value.split(':').forEach(function(v,i){
          values.push("'"+v+"'");
        });
        clause = req.params.field +' in ('+values.join(",")+')';
      } else {
        clause = req.params.field +'=\''+req.params.value+'\'';
      }
 
      if ( req.query.where ){
        req.query.where = clause + ' AND ' + req.query.where;
      } else {
        req.query.where = clause;
      }
      Controller.getData(req, res);
    }
     
  },

  getCountyByField: function(req, res){
    if ( !req.params.state || !req.params.county ) {
      self._sendError(res, 'Must provide both a state and county name');
    } else {
      var clause = 'county=\''+req.params.county+'\' AND state=\''+req.params.state+'\'';
      if ( req.query.where ){
        req.query.where = clause + ' AND '+req.query.where;
      } else {
        req.query.where = clause;
      }
      Controller.getAllByField(req, res);
    }
  },

  getStateByField: function(req, res){
    if ( !req.params.state ) {
      self._sendError(res, 'Must provide a valid state name');
    } else {
      var clause = 'state=\''+req.params.state+'\'';
      if ( req.query.where ){
        req.query.where = clause + ' AND '+req.query.where;
      } else {
        req.query.where = clause;
      }
      Controller.getAllByField(req, res);
    }
  }


}, base);

module.exports = Controller;
