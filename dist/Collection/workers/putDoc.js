(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'regenerator-runtime', 'redux-saga/effects', '../../server/httpWrapper', '../../types', '../../server/api', '../../server/Logger', '../actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('regenerator-runtime'), require('redux-saga/effects'), require('../../server/httpWrapper'), require('../../types'), require('../../server/api'), require('../../server/Logger'), require('../actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.regeneratorRuntime, global.effects, global.httpWrapper, global.types, global.api, global.Logger, global.actions);
    global.putDoc = mod.exports;
  }
})(this, function (exports, _regeneratorRuntime, _effects, _httpWrapper, _types, _api, _Logger, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = putDoc;

  var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

  var _httpWrapper2 = _interopRequireDefault(_httpWrapper);

  var _types2 = _interopRequireDefault(_types);

  var _api2 = _interopRequireDefault(_api);

  var _Logger2 = _interopRequireDefault(_Logger);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _marked = _regeneratorRuntime2.default.mark(putDoc);

  var START = _types2.default.PUT_START;
  var FAILED = _types2.default.PUT_FAILED;
  var FAILED_NETWORK = _types2.default.PUT_FAILED_NETWORK;
  var FINISHED = _types2.default.PUT_FINISHED;

  function putDoc(action) {
    var _action$payload, targetName, schemaName, objectId, data, target, res, errType;

    return _regeneratorRuntime2.default.wrap(function putDoc$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _action$payload = action.payload, targetName = _action$payload.targetName, schemaName = _action$payload.schemaName, objectId = _action$payload.objectId, data = _action$payload.data;
            target = targetName || schemaName;
            _context.next = 4;
            return (0, _effects.put)((0, _actions.setOnStore)({ targetName: target, status: START, error: null }));

          case 4:
            return _context.delegateYield((0, _httpWrapper2.default)(_api2.default.updateObject, schemaName, objectId, data), 't0', 5);

          case 5:
            res = _context.t0;

            if (!res.error) {
              _context.next = 14;
              break;
            }

            errType = res.message === 'Network Error' ? FAILED_NETWORK : FAILED;

            console.error('putDoc err', schemaName, objectId, res.err);
            _Logger2.default.onError(action, errType);
            _context.next = 12;
            return (0, _effects.put)((0, _actions.setOnStore)({ targetName: target, status: errType, error: res }));

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.next = 16;
            return (0, _effects.put)((0, _actions.setOnStore)({ targetName: target, status: FINISHED, error: null }));

          case 16:
            _Logger2.default.onSuccses(action, FINISHED);

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _marked, this);
  }
  /* eslint no-unused-vars: "off" */
});