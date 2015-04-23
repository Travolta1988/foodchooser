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

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    })

    .state('product_list', {
      url: '/product_list',
      templateUrl: 'templates/product-list.html'
    })
    ;
  $urlRouterProvider.otherwise('/login');
})

.controller('MainCtrl', function($scope, $firebaseObject, $firebaseArray, $state, $ionicHistory) {


  //Hidden Login of user. There is no standart login form. Only button "enter". 
  var usersRef = new Firebase('https://foodchooser.firebaseio.com/users');
  $scope.data = $firebaseObject(usersRef)
  console.log($scope.data)

    $scope.anonimLogin = function(){
        usersRef.authAnonymously(
            function userState(error, authData){
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    var userLoggedIn = {
                        userInfo : {
                            name: 'Anonym',
                            uid: authData.uid
                        }
                    };
                    console.log(userLoggedIn);
                    usersRef.child(authData.uid).set(userLoggedIn);
                    $state.go('product_list');
                }
            });
    };

  //displaying product collection on product list page  
  var productsRef = new Firebase('https://foodchooser.firebaseio.com/products');
   $scope.dataOfProducts = [];
    productsRef.once('value', function(nameSnapshot) {
        var products = nameSnapshot.val();
        $scope.arr = [];
        for(index in products){
          items = {
            name: index,
            listOfProducts: products[index]
          }
          $scope.arr.push(items)
        }
    });

  //Adding user choise to DB for current user  
    var authData = usersRef.getAuth();
    if (authData) {
        $state.go('product_list');
        console.log("Authenticated user with uid:", authData.uid);
    } else {
        console.log("loggedout");
    }
    var currentUser = authData.uid;

  $scope.addToCart = function(group, item){
    var group1 = group.name;
    var userChoice = {
        "groupName": group1,
        "choosenItem": item
    };
    usersRef.child(currentUser).child('choosenItems').push(angular.fromJson(angular.toJson(userChoice)));
  };

        var currentUserRef = new Firebase('https://foodchooser.firebaseio.com/users/');
        $scope.currentUserData = $firebaseObject(currentUserRef);
        var refreshChoosenItems = function(){
            currentUserRef.child(currentUser).child('choosenItems').once('value', function(snap) {
                var choosenProducts = snap.val();
                $scope.array = [];
                for(index in choosenProducts){
                    items = {
                        name: index,
                        listOfProducts: choosenProducts[index]
                    };
                    $scope.array.push(items)
                }
            });
        };

        $('a').click(function(){
            alert(2222)
        })

        refreshChoosenItems();

  //Accordion   
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