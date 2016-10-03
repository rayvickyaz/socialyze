window.global = {
  Backand_AppName :'socialyze',
  Backand_Token   :'2c3955f1-41f6-4500-a62d-ae61dbcc6e17', // FROM Backand->Security & Auth->Configuration

  Facebook_APP_ID :'322762028113619', // Get this from https://developers.facebook.com
  Google_OAUTH_ID :'1084694160591-ovlshkh1hjr73766bmtmdj9lbr0ge1d5.apps.googleusercontent.com', // Get this from https://console.developers.google.com

  GCM_SENDER_ID   :'770342526185', // Get this from https://console.developers.google.com
  GCM_SERVER_KEY  :'AIzaSyD3Emjl3izyCLXR-VWOEhljSCEz7tWhVNM', // Get this from https://console.developers.google.com

  Admob_Unit_ID   :'xxxxxxxxxx'
}

angular.module('socialyze', ['ionic', 'backand', 'topscroller', 'ngCordova', 'ngCordovaOauth', 'socialyze.controllers', 'socialyze.services'])

.run(function($ionicPlatform, BackandService) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

      document.addEventListener("deviceready", function(){
        var push = PushNotification.init({
            android: {
                senderID: window.global.GCM_SENDER_ID
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });

        push.on('registration', function(x) {
          console.log(x.registrationId);
          BackandService.read('push').then(function(y){
            //console.log(y);
            if(y.data.totalRows==0){
              var data = {
                device_id: x.registrationId,
                platform: ionic.Platform.platform()
              };
              BackandService.create('push', data).then(function(z) {
                //console.log(z);
              });
            }
            else{
              for(var i in y.data.data){
                if(y.data.data[i].device_id != x.registrationId){
                  var data = {
                    device_id: x.registrationId,
                    platform: ionic.Platform.platform()
                  };
                  BackandService.create('push', data).then(function(z) {
                    //console.log(z);
                  });
                  break;
                }
              }
            }
          }, function(err){
            console.log(err);
          });
        });

        push.on('notification', function(data) {
          alert(JSON.stringify(data));
          alert(data.message);
        });

        push.on('error', function(e) {
            console.log(err);
        });

      }, false);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, BackandProvider) {
  BackandProvider.setAppName(window.global.Backand_AppName);
  BackandProvider.setAnonymousToken(window.global.Backand_Token);

  $ionicConfigProvider.backButton.text('');
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.icon('ion-android-arrow-back');

  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/themes/menu.html',
    controller: 'AppCtrl'
  })



  // HOME

  .state('app.dash', {
      cache: false,
      url: '/dash',
      views: {
        'menuContent': {
          templateUrl: 'templates/themes/dashboard.html',
          //liat punya profile.html
          controller: 'GpLoginCtrl'
        }
      }
    })

  .state('app.dashlist', {
      url: '/dash/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/themes/dashboard-list.html',
          controller: 'DashListCtrl'
        }
      }
    })

  // PUSH NOTIFICATION
  .state('app.localpush', {
      url: '/push/local',
      views: {
        'menuContent': {
          templateUrl: 'templates/push/local.html',
          controller: 'LocalPush'
        }
      }
    })

  .state('app.googlepush', {
      url: '/push/google',
      views: {
        'menuContent': {
          templateUrl: 'templates/push/google.html',
          controller: 'GooglePush'
        }
      }
    })

  // MENU DETAIL

  .state('app.newscategory', {
    url: '/newscategory',
    views: {
      'menuContent': {
        templateUrl: 'templates/themes/newscategory.html',
        controller: 'NewsCtrl'
      }
    }
  })

  .state('app.ecommerce', {
    url: '/ecommerce',
    views: {
      'menuContent': {
        templateUrl: 'templates/themes/ecommerce/home.html'
      }
    }
  })

  .state('app.ecommerce-category', {
    url: '/category',
    views: {
      'menuContent': {
        templateUrl: 'templates/themes/ecommerce/category.html'
      }
    }
  })

  .state('app.ecommerce-product', {
    url: '/ecommerce/product',
    views: {
      'menuContent': {
        templateUrl: 'templates/themes/ecommerce/product.html'
      }
    }
  })

  .state('app.ecommerce-cart', {
    url: '/ecommerce/cart',
    views: {
      'menuContent': {
        templateUrl: 'templates/themes/ecommerce/cart.html'
      }
    }
  })

  .state('app.ecommerce-wish', {
    url: '/ecommerce/wish',
    views: {
      'menuContent': {
        templateUrl: 'templates/themes/ecommerce/wish.html'
      }
    }
  })

  .state('app.hotel', {
    url: '/hotel',
    views: {
      'menuContent': {
        templateUrl: 'templates/themes/hotel.html',
        controller: 'HotelCtrl'
      }
    }
  })

  .state('app.socialmedia', {
    url: '/socialmedia',
    views: {
      'menuContent': {
        templateUrl: 'templates/themes/socialmedia.html'
      }
    }
  })


  /* MAP */

  .state('app.currentlocation', {
    url: '/current-location',
    views: {
      'menuContent': {
        templateUrl: 'templates/map/current-location.html',
        controller: 'CurrentLocationCtrl'
      }
    }
  })

  .state('app.navigator', {
    url: '/navigator',
    views: {
      'menuContent': {
        templateUrl: 'templates/map/navigator.html',
        controller: 'NavigatorCtrl'
      }
    }
  })

  // CRUD

  .state('app.localstorage', {
    url: '/crud/localstorage',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/crud/localstorage.html',
        controller: 'LocalStorageCtrl'
      }
    }
  })

  .state('app.localcreate', {
    url: '/crud/local/create',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/crud/local-create.html',
        controller: 'LocalCreateCtrl'
      }
    }
  })

  .state('app.localedit', {
    url: '/crud/local/edit/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/crud/local-edit.html',
        controller: 'LocalEditCtrl'
      }
    }
  })

  .state('app.backand', {
    url: '/crud/backand',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/crud/backand.html',
        controller: 'BackandCtrl'
      }
    }
  })

  .state('app.backandcreate', {
    url: '/crud/backand/create',
    views: {
      'menuContent': {
        templateUrl: 'templates/crud/backand-create.html',
        controller: 'BackandCreateCtrl'
      }
    }
  })

  .state('app.backandedit', {
    url: '/crud/backand/edit/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/crud/backand-edit.html',
        controller: 'BackandEditCtrl'
      }
    }
  })

  /* SOCIAL LOGIN */

  .state('app.fblogin', {
    cache: false,
    url: '/fb-login',
    views: {
      'menuContent': {
        templateUrl: 'templates/social-login/facebook/index.html',
        controller: 'FbLoginCtrl'
      }
    }
  })

  .state('app.fbprofile', {
    cache: false,
    url: '/fb-profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/social-login/facebook/profile.html',
        controller: 'FbProfileCtrl'

      }
    }
  })

  .state('app.fbfriends', {
    url: '/fb-friends',
    views: {
      'menuContent': {
        templateUrl: 'templates/social-login/facebook/friends.html',
        controller: 'FbFriendsCtrl'
      }
    }
  })

  .state('app.fbfeeds', {
    url: '/fb-feeds',
    views: {
      'menuContent': {
        templateUrl: 'templates/social-login/facebook/feeds.html',
        controller: 'FbFeedsCtrl'
      }
    }
  })




//is it Ray? make new state
  .state('app.gplogin', {
    cache: false,
    url: '/gp-login',
    views: {
      'menuContent': {
        templateUrl: 'templates/social-login/google/index.html',
        controller: 'GpLoginCtrl'
      }
    }
  })

  .state('app.gpprofile', {
    cache: false,
    url: '/gp-profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/social-login/google/profile.html',
        controller: 'GpProfileCtrl'
      }
    }
  })

  //  FEATURES

  .state('app.pull', {
    url: '/features/pull',
    views: {
      'menuContent': {
        templateUrl: 'templates/features/pull-to-refresh.html',
        controller: 'PullCtrl'
      }
    }
  })

  .state('app.infinite', {
    url: '/features/infinite',
    views: {
      'menuContent': {
        templateUrl: 'templates/features/infinite.html',
        controller: 'InfiniteCtrl'
      }
    }
  })

  .state('app.pinchzoom', {
    url: '/features/pinchzoom',
    views: {
      'menuContent': {
        templateUrl: 'templates/features/pinch-zoom.html',
        controller: 'PinchZoomCtrl'
      }
    }
  })

  .state('app.backtotop', {
    url: '/features/backtotop',
    views: {
      'menuContent': {
        templateUrl: 'templates/features/back-to-top.html',
        controller: 'BackToTopCtrl'
      }
    }
  })

  .state('app.youtube', {
    url: '/features/youtube',
    views: {
      'menuContent': {
        templateUrl: 'templates/features/youtube.html',
        controller: 'YoutubeCtrl'
      }
    }
  })

  .state('app.share', {
    url: '/features/share',
    views: {
      'menuContent': {
        templateUrl: 'templates/features/share.html',
        controller: 'SocialCtrl'
      }
    }
  })

  .state('app.callemailsms', {
    url: '/features/callemailsms',
    views: {
      'menuContent': {
        templateUrl: 'templates/features/call-email-sms.html',
        controller: 'CallEmailSmsCtrl'
      }
    }
  })

  .state('app.impicker', {
    url: '/features/impicker',
    views: {
      'menuContent': {
        templateUrl: 'templates/features/impicker.html',
        controller: 'ImgPickerCtrl'
      }
    }
  })

  .state('app.admob', {
    url: '/features/admob',
    views: {
      'menuContent': {
        templateUrl: 'templates/features/admob.html',
        controller: 'AdmobCtrl'
      }
    }
  })

  //  HARDWARE

  .state('app.vibra', {
    url: '/hardware/vibra',
    views: {
      'menuContent': {
        templateUrl: 'templates/hardware/vibra.html',
        controller: 'VibraCtrl'
      }
    }
  })

  .state('app.toast', {
    url: '/hardware/toast',
    views: {
      'menuContent': {
        templateUrl: 'templates/hardware/toast.html',
        controller: 'ToastCtrl'
      }
    }
  })

  .state('app.dialog', {
    url: '/hardware/dialog',
    views: {
      'menuContent': {
        templateUrl: 'templates/hardware/dialog.html',
        controller: 'DialogCtrl'
      }
    }
  })

  .state('app.devinfo', {
    url: '/hardware/devinfo',
    views: {
      'menuContent': {
        templateUrl: 'templates/hardware/devinfo.html',
        controller: 'DevInfoCtrl'
      }
    }
  })

  .state('app.flash', {
    url: '/hardware/flash',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/hardware/flashlight.html',
        controller: 'FlashCtrl'
      }
    }
  })

  .state('app.netinfo', {
    url: '/hardware/netinfo',
    views: {
      'menuContent': {
        templateUrl: 'templates/hardware/netinfo.html',
        controller: 'NetInfoCtrl'
      }
    }
  })

  //  MATERIAL DESIGN

  .state('app.component', {
    url: '/material/component',
    views: {
      'menuContent': {
        templateUrl: 'templates/material/components.html',
        controller: 'ComponentCtrl'
      }
    }
  })

  /*
  .state('app.loginfirst', {
    cache: false,
    url: '/dash/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/social-login/both/index.html',
        //kalo ada
        controller: 'FbLoginCtrlFirst, GpLoginCtrlFirst'
      }
    }
  }) */

  .state('app.motionlist', {
    cache: false,
    url: '/material/motion',
    views: {
      'menuContent': {
        templateUrl: 'templates/material/motion.html',
        controller: 'MotionCtrl'
      }
    }
  });;

  $urlRouterProvider.otherwise('/app/dash');
})


// It is used to convert datetime into time ago format

moment.locale('en', {
    relativeTime : {
        future: " %s",
        past:   "%s",
        s:  "1s",
        m:  "1m",
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        d:  "1d",
        dd: "%dd",
        M:  "1m",
        MM: "%dm",
        y:  "1y",
        yy: "%dy"
    }
});
