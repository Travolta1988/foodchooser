// Ionic Starter App
angular.module('starter', ['ionic', 'firebase'])
angular.module('app', ['ionic', 'firebase'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    })
    
    .state('product_list', {
      url: '/product_list',
      controller: 'MyCtrl',
      templateUrl: 'templates/product-list.html'
    })
    ;  
  $urlRouterProvider.otherwise('/login');
})

.controller('MyCtrl', function($scope, $firebaseObject) {

  var usersRef = new Firebase('https://foodchooser.firebaseio.com');
  $scope.data = $firebaseObject(usersRef)
  console.log($scope.data)

  $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<5; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
  
});