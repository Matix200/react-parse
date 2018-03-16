(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'regenerator-runtime', 'redux-saga/effects', '../server/apiSagaWrapper', '../types', '../server/api', '../helpers', './actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('regenerator-runtime'), require('redux-saga/effects'), require('../server/apiSagaWrapper'), require('../types'), require('../server/api'), require('../helpers'), require('./actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.regeneratorRuntime, global.effects, global.apiSagaWrapper, global.types, global.api, global.helpers, global.actions);
    global.saga = mod.exports;
  }
})(this, function (exports, _regeneratorRuntime, _effects, _apiSagaWrapper, _types, _api, _helpers, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = fetchCloudCode;

  var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

  var _types2 = _interopRequireDefault(_types);

  var _api2 = _interopRequireDefault(_api);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _marked = _regeneratorRuntime2.default.mark(fetchCloudCode);

  var START = _types2.default.FETCH_START;
  var FAILED = _types2.default.FETCH_FAILED;
  var FAILED_NETWORK = _types2.default.FETCH_FAILED_NETWORK;
  var FINISHED = _types2.default.FETCH_FINISHED;

  function fetchCloudCode(action) {
    var _action$payload, functionName, targetName, params, digToData, target, res, errType, data;

    return _regeneratorRuntime2.default.wrap(function fetchCloudCode$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _action$payload = action.payload, functionName = _action$payload.functionName, targetName = _action$payload.targetName, params = _action$payload.params, digToData = _action$payload.digToData;
            target = targetName || functionName;
            _context.next = 4;
            return (0, _effects.put)((0, _actions.setOnStore)({ targetName: target, status: START, error: null }));

          case 4:
            _context.next = 6;
            return (0, _apiSagaWrapper.httpRequest)(_api2.default.getCloudFunction, functionName, params);

          case 6:
            res = _context.sent;

            if (!(res.error || (0, _helpers.dig)(res, 'response.data.error'))) {
              _context.next = 14;
              break;
            }

            errType = res.message === 'Network Error' ? FAILED_NETWORK : FAILED;
            _context.next = 11;
            return (0, _effects.put)((0, _actions.setOnStore)({ targetName: target, status: errType, error: res }));

          case 11:
            console.error('getCloudFunction err: ', functionName, res.error);
            _context.next = 17;
            break;

          case 14:
            data = (0, _helpers.dig)(res, digToData);
            _context.next = 17;
            return (0, _effects.put)((0, _actions.setOnStore)({
              targetName: target,
              status: FINISHED,
              error: null,
              data: data,
              info: {
                params: params,
                timestamp: Date.now()
              }
            }));

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _marked, this);
  }
});