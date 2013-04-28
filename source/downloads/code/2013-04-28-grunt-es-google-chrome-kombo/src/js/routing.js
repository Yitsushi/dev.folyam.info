(function(Angular) {
  var templatePrefix = "static/templates";

  Angular.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', { templateUrl: templatePrefix + "/Dialer.html",
                   controller: Application.Controllers.DialerController
                 })
      .otherwise({redirectTo: '/'});
  }]);
})(Application.angular);
