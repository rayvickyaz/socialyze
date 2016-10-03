// file info: controller.js
//

app.controller('GpProfileCtrl', function($scope, $http, $state, $cordovaDialogs) {
	var user = window.localStorage.getItem("socialyze-gp");
    if (user)
    	$scope.me = JSON.parse(user);

    $scope.gpLogout = function(){
		$cordovaDialogs.confirm('Do you want to logout Google Plus?', 'Confirm to Logout', ['Yes','No'])
          .then(function(buttonIndex) {
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            if(buttonIndex==1){
            	window.localStorage.removeItem("socialyze-gp");
    			$state.go("app.dash", {}, {reload: true});
            }else
              return false;
		});
    };

    // Active INK Effect
    ionic.material.ink.displayEffect();
})

app.controller('GpLoginCtrl', function($scope, $http, $state, $ionicModal, $timeout, $cordovaOauth) {
	$scope.isGPlogin = false;

	var user = window.localStorage.getItem("socialyze-gp");
	if (user)
		$scope.isGPlogin = true;

	$scope.GPlogin = function(){
		$cordovaOauth.google(window.global.Google_OAUTH_ID, ["email profile"]).then(function(result) {
		    displayData(result.access_token);
			//	$state.go("app.gpprofile");
			//	$state.go("app.dash", {}, {reload: true, inherit: true, notify: true});
			//$state.transitionTo("app.dash", {}, {reload: true, inherit: true, notify: true});
/*this is fucking fail and wrong, you have to put this in the end of click function stupidhead*/
$state.go($state.currentState, {}, {reload: true, inherit: true, notify: true});
				$state.reload();
				$window.location.reload();
		}, function(error) {
		    console.log("Error -> " + error);
		});
	};

	function displayData(access_token){
	    $http.get("https://www.googleapis.com/oauth2/v2/userinfo", {params: {access_token: access_token}}).then(function(result) {
	        result.data.access_token = access_token;
	       	window.localStorage.setItem("socialyze-gp", JSON.stringify(result.data));
					$state.go("app.dash", {}, {reload: true, inherit: true, notify: true});
	    }, function(error) {
	        alert("Error: " + error);
	    });
	}
})
/*
app.controller('GpLoginCtrlFirst', function($scope, $http, $state, $ionicModal, $timeout, $cordovaOauth) {
	$scope.isGPlogin = false;

	var user = window.localStorage.getItem("socialyze-gp");
	if (user)
		$scope.isGPlogin = true;

	$scope.GPlogin = function(){
		$cordovaOauth.google(window.global.Google_OAUTH_ID, ["email profile"]).then(function(result) {
		    displayData(result.access_token);
		    $state.go("app.dash", {}, {reload: true});
		}, function(error) {
		    console.log("Error -> " + error);
		});
	};

	function displayData(access_token){
	    $http.get("https://www.googleapis.com/oauth2/v2/userinfo", {params: {access_token: access_token}}).then(function(result) {
	        result.data.access_token = access_token;
	       	window.localStorage.setItem("socialyze-gp", JSON.stringify(result.data));
	    }, function(error) {
	        alert("Error: " + error);
	    });
	}
}) */
