var crypto = require('crypto'),
  fs = require('fs');

// inherit from base controller
var Controller = function( osm, BaseController ){

  var controller = {};
  controller.__proto__ = BaseController( );

  controller.tables = {
    points:'planet_osm_point_koop',
    polygons:'planet_osm_polygon_koop',
    lines: 'planet_osm_line_koop'
  };

  // a mapping of types to views 
  controller.views = {
    points:'planet_osm_point_koop',
    polygons:'planet_osm_polygon_koop',
    lines: 'planet_osm_line_koop'
  };

  // renders an empty map with a text input 
  controller.explore = function(req, res){
    res.view('osm/index', { locals:{ where: req.query.where } });
  };
    
  controller.base_url = '/osm'; //'http://'+config.host+':'+config.port+'/osm';

  controller.listTypes = function(req, res){
    var links = {};
    for (var type in controller.tables ){
      links[type] = controller.base_url + '/' + type;
    }
    res.json( links );
  };

  controller.getData = function(req, res){
    var table = controller.tables[req.params.type];
    if ( !table ){
      controller._sendError(res, 'Unknown data type ' + req.params.type);
    } else {
      if ( req.params.format ){
        var key = ['osm', crypto.createHash('md5').update(JSON.stringify(req.params)+JSON.stringify(req.query)).digest('hex')].join(':');
        var path = ['files', key].join('/');
        var fileName = key + '.' + req.params.format;

        osm.files.exists(path, fileName, function( exists, path ){
          if ( exists ){
            if (path.substr(0, 4) == 'http'){
              res.redirect( path );
            } else {
              res.sendfile( path );
            }
          } else {
            osm.getData( table, req.query, function(err, data){
              osm.exportToFormat( req.params.format, key, key, data, {}, function(err, file){
                if (err){
                  res.send(err, 500);
                } else {
                  res.sendfile( file );
                }
              });
            });
          }
        });

>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
      } else {
        osm.getData( table, req.query, function(err, data){
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
<<<<<<< HEAD
  },

  featureserver: function( req, res ){
=======
  };

  controller.featureserver = function( req, res ){
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
    var callback = req.query.callback;
    delete req.query.callback;

    var clause = '';
    if ( req.params.field ){
      var values = [];
      req.params.value.split(':').forEach(function(v,i){
        values.push("'"+v+"'");
      });
      clause = req.params.field +' in ('+values.join(",")+')';
    }

    if ( req.params.state ){
      clause += ' AND state = \''+req.params.state + '\'';
    }

    if ( req.params.county ){
      clause += ' AND county = \''+req.params.county +'\'';
    }

    if ( req.query.where ){
      req.query.where = clause + ' AND ' + req.query.where;
    } else {
      req.query.where = clause;
    }

<<<<<<< HEAD
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
=======
    var table = this.tables[req.params.type];
    if ( !table ){
      controller._sendError(res, 'Unknown data type ' + req.params.type);
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
    } else {
      osm.getData( table, req.query, function(err, data){
        if (err) {
          res.send( err, 500);
        } else {
          delete req.query.geometry;
          delete req.query.where;
<<<<<<< HEAD
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
=======
          controller.processFeatureServer( req, res, err, [data], callback);
        }
      });
    }
  };

  controller._sendError = function(res, err){
    res.send(err,500);
  };

  controller.getCounts = function(req, res){
    var view = controller.views[req.params.type];
    if ( !view ){
      controller._sendError(res, 'Unknown data type ' + req.params.type);
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
    } else {
      if ( req.params.boundaryType == 'state' && !req.query.where ){
        view = 'osm_'+req.params.type+'_state';
        osm.staticCount( view, function(err, data){
          res.json( data );
        });
      } else if ( req.params.boundaryType == 'county' && !req.query.where ){
        view = 'osm_'+req.params.type+'_county';
        osm.staticCount( view, function(err, data){
          res.json( data );
        });
      } else {
        osm.count( req.params.boundaryType, view, req.query, function(err, data){
          res.json( data );
        });
      }
    }
<<<<<<< HEAD
  },

  getCountsByField: function( req, res ){
    if ( !req.params.field || !req.params.value ){
      Controller.getCounts(req, res);
=======
  };

  controller.getCountsByField = function( req, res ){
    if ( !req.params.field || !req.params.value ){
      controller.getCounts(req, res);
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
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
<<<<<<< HEAD
      Controller.getCounts(req, res);
    }
  },

  getDistinct: function(req, res){
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
=======
      this.getCounts(req, res);
    }
  };

  controller.getDistinct = function(req, res){
    var table = controller.tables[req.params.type];
    if ( !table ){
      controller._sendError(res, 'Unknown data type ' + req.params.type);
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
    } else {
      osm.distinct( req.params.field, table, req.query, function(err, data){
        res.json( data );
      });
    }
<<<<<<< HEAD
  },

  getFields: function(req, res){
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
=======
  };

  controller.getFields = function(req, res){
    var table = controller.tables[req.params.type];
    if ( !table ){
      controller._sendError(res, 'Unknown data type ' + req.params.type);
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
    } else {
      osm.fields( table, req.query, function(err, data){
        res.json( data );
      });
    }
  },

<<<<<<< HEAD
  getState: function(req, res){
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else if ( !req.params.state ) {
      self._sendError(res, 'Invalid state name');
=======
  controller.getState = function(req, res){
    var table = controller.tables[req.params.type];
    if ( !table ){
      controller._sendError(res, 'Unknown data type ' + req.params.type);
    } else if ( !req.params.state ) {
      controller._sendError(res, 'Invalid state name');
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
    } else {
      if ( req.query.where ){
        req.query.where = 'state=\''+req.params.state+'\' AND '+req.query.where;
      } else {
        req.query.where = 'state=\''+req.params.state+'\'';
      }
<<<<<<< HEAD
      Controller.getData(req, res);
    }
  },

  getCounty: function(req, res){
    var table = Controller.tables[req.params.type];
    if ( !table ){
      self._sendError(res, 'Unknown data type ' + req.params.type);
    } else if ( !req.params.state || !req.params.county ) {
      self._sendError(res, 'Must provide both a state and county name');
=======
      controller.getData(req, res);
    }
  };

  controller.getCounty = function(req, res){
    var table = controller.tables[req.params.type];
    if ( !table ){
      controller._sendError(res, 'Unknown data type ' + req.params.type);
    } else if ( !req.params.state || !req.params.county ) {
      controller._sendError(res, 'Must provide both a state and county name');
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
    } else {
      if ( req.query.where ){
        req.query.where = 'county=\''+req.params.county+'\' AND state=\''+req.params.state+'\' AND '+req.query.where;
      } else {
        req.query.where = 'county=\''+req.params.county+'\' AND state=\''+req.params.state+'\'';
      }
<<<<<<< HEAD
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
=======
      controller.getData(req, res);
    }
  };

  controller.getAllByField = function(req, res){
    var clause;
    var table = controller.tables[req.params.type];
    if ( !table ){
      controller._sendError(res, 'Unknown data type ' + req.params.type);
    } else if ( !req.params.field || !req.params.value ) {
      controller._sendError(res, 'Must provide both a field and a value');
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
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
<<<<<<< HEAD
      Controller.getData(req, res);
    }
     
  },

  getCountyByField: function(req, res){
    if ( !req.params.state || !req.params.county ) {
      self._sendError(res, 'Must provide both a state and county name');
=======
      controller.getData(req, res);
    }
     
  };

  controller.getCountyByField = function(req, res){
    if ( !req.params.state || !req.params.county ) {
      _sendError(res, 'Must provide both a state and county name');
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
    } else {
      var clause = 'county=\''+req.params.county+'\' AND state=\''+req.params.state+'\'';
      if ( req.query.where ){
        req.query.where = clause + ' AND '+req.query.where;
      } else {
        req.query.where = clause;
      }
<<<<<<< HEAD
      Controller.getAllByField(req, res);
    }
  },

  getStateByField: function(req, res){
    if ( !req.params.state ) {
      self._sendError(res, 'Must provide a valid state name');
=======
      controller.getAllByField(req, res);
    }
  };

  controller.getStateByField = function(req, res){
    if ( !req.params.state ) {
      controller._sendError(res, 'Must provide a valid state name');
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb
    } else {
      var clause = 'state=\''+req.params.state+'\'';
      if ( req.query.where ){
        req.query.where = clause + ' AND '+req.query.where;
      } else {
        req.query.where = clause;
      }
<<<<<<< HEAD
      Controller.getAllByField(req, res);
    }
  }


}, BaseController);
=======
      controller.getAllByField(req, res);
    }
  };

  return controller;
};
>>>>>>> e301edc622a985984af6580b2ade56804faa8fcb

module.exports = Controller;
