(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name common.factory:Socket
   *
   * @description
   *
   */
  angular
    .module('common')
    .factory('Socket', Socket);

  function Socket(socketFactory) {
    let SocketBase = socketFactory();
    SocketBase.forward('error');
    return SocketBase;
  }
}());
