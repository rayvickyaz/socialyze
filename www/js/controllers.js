
var app = angular.module('socialyze.controllers', []);

// This directive use to convert timestamp into time ago format
app.filter('ago', function() {
    return function(date) {
      return moment(date).fromNow();
    };
})

app.filter('trusted', function($sce){
	return function(url){
		return $sce.trustAsResourceUrl(url);
	}
})

app.controller('AppCtrl', function($scope, $ionicModal, $http, $timeout, $ionicSideMenuDelegate, $state, $cordovaOauth, DashList) {

	$scope.productSlides = [
		{id: 1, img: 'img/ecommerce/camera-new.jpg'},+
		{id: 2, img: 'img/ecommerce/camera-old.jpg'},
		{id: 3, img: 'img/ecommerce/camera.jpg'}
	];

	$scope.mainmenu = DashList.getAllMenu();

	// Active INK Effect
	ionic.material.ink.displayEffect();
})

app.controller('DashListCtrl', function($scope, $stateParams, $ionicModal, $timeout, DashList) {
	$scope.data = DashList.getMenuById($stateParams.id);

    setTimeout(function() {
        ionic.material.motion.ripple();
    }, 500);

    // Active INK Effect
    ionic.material.ink.displayEffect();
});


/* fail
app.controller('DashCtrl', function($scope, $http, $state, $cordovaDialogs) {
	var user = window.localStorage.getItem("socialyze-fb");
    if (user)
    	$scope.me = JSON.parse(user);
return false;

    // Active INK Effect
    ionic.material.ink.displayEffect();
}) */
