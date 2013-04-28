(function(C) {
  var addSite = function(url) {

  };

  C.DialerController = function($scope) {
    $scope.items = [
      { id: 1, title: "Contacts", target: "https://www.google.com/contacts/" },
      { id: 2, title: "Emails", target: "https://mail.google.com/" },
      { id: 3, title: "Google+", target: "https://plus.google.com/" },
      { id: 4, title: "Google Play", target: "https://play.google.com/store" },
      { id: 4, title: "Chrome Store", target: "https://chrome.google.com/webstore" }
    ];
  }
  C.DialerController.$inject = ["$scope"];
})(Application.Controllers);
