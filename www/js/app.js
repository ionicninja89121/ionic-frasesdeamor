var appVersion = "1.0.1";

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('application', ['ionic', 'ngCordova', 'ionic-toast', 'base64', 'application.controllers', 'application.services', 'ngSpecialOffer', 'ngStorage'])

    .run(function($ionicPlatform, $state, $cordovaGoogleAnalytics, $specialOffer, $cordovaDevice) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        /************ AdMob Service ***********/
        var adMobId = {
          admob_banner_key: 'ca-app-pub-7847520016045456/6472401574',
          admob_interstitial_key: 'ca-app-pub-7847520016045456/6472401574'
        };
        if(window.AdMob) {
          var currentDate = new Date();
          window.localStorage['lastAdMobDateAmor'] = currentDate.valueOf();
          AdMob.prepareInterstitial( {adId:adMobId.admob_interstitial_key, autoShow:true} );
          AdMob.showInterstitial();
        }

        /************ In App Browser ***********/
        document.addEventListener('deviceready', function () {
          window.open = cordova.InAppBrowser.open;
        }, false);

        /************ Google Analytics ***********/
        if(typeof $cordovaGoogleAnalytics !== undefined) {
          $cordovaGoogleAnalytics.startTrackerWithId("UA-4872125-67");
          $cordovaGoogleAnalytics.trackView('RunApp');
        } else {
          console.log("Google Analytics Unavailable");
        }

        /************ Rate this App ***********/
        var appVersion = '2.0.0';
        var iosId = '945771188';
        var androidPackageName = 'com.goodbarber.frasesdeamor';

        $specialOffer.init({
          id           : 'frasesdeamor-special-offer' + appVersion,
          showOnCount  : 2,
          title        : 'Belas Frases de Amor',
          text         : 'Gostou do nosso app? Avalie-nos!',
          agreeLabel   : 'Avaliar agora',
          remindLabel  : 'Lembre-me mais tarde',
          declineLabel : 'Agora não',
          onAgree      : function () {
            // agree
            if ($cordovaDevice.getPlatform() === 'iOS') {
              window.open($specialOffer.appStoreUrl(iosId));
            } else if ($cordovaDevice.getPlatform() === 'Android') {
              window.open($specialOffer.googlePlayUrl(androidPackageName));//'http://play.google.com/store/apps/details?id='+androidPackageName);
            }
          },
          onDecline   : function () {
            // declined
          },
          onRemindMeLater : function () {
            // will be reminded in 5 more uses
          },
        });

        /************ OneSignal ***********/
        document.addEventListener('deviceready', function () {
          // Enable to debug issues.
          // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

          var notificationOpenedCallback = function(jsonData) {
            //alert('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
            if (jsonData.additionalData.categoryID !== undefined) {
//              alert('categoryID'+jsonData.additionalData.categoryID);
              var categoryDesc = "";
              if (jsonData.additionalData.categoryDesc !== undefined) {
                categoryDesc = jsonData.additionalData.categoryDesc;
              }
              $state.go('app.category', { 'categoryId': jsonData.additionalData.categoryID, 'categoryDesc':categoryDesc });
            } else if (jsonData.additionalData.postID !== undefined) {
//              alert('postID'+jsonData.additionalData.postID);
              $state.go('app.post', { 'postId': jsonData.additionalData.postID });
            } else {
//              alert('Home Page');
            }
          };

          window.plugins.OneSignal.init("df5bb503-53c4-4409-b2b8-463d0e063a05",
            {googleProjectNumber: "915865837355"},
            notificationOpenedCallback);

          // Show an alert box if a notification comes in when the user is in your app.
          window.plugins.OneSignal.enableInAppAlertNotification(true);
        }, false);

      });
    })

    .directive('whenScrolled', function() {
        return function(scope, elm, attr) {
            var raw = elm[0];

            elm.bind('scroll', function() {
                console.log('Doing Scrolling', raw.scrollTop);
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };
    })

    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider

          .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
          })

          .state('app.home', {
            url: '/home',
            views: {
              'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
              }
            },
            cache: false
          })

          .state('app.search', {
              url: '/search/:searchKeyword',
              views: {
                  'menuContent': {
                      templateUrl: 'templates/search-result.html',
                      controller: 'SearchCtrl'
                  }
              },
//            cache: false
          })

          .state('app.category', {
            url: '/categories/:categoryId-:categoryDesc',
            views: {
              'menuContent': {
                templateUrl: 'templates/category.html',
                controller: 'CategoryCtrl'
              }
            },
//            cache: false
          })

          .state('app.favorites', {
              url: '/favorites',
              views: {
                  'menuContent': {
                      templateUrl: 'templates/favorite.html',
                      controller: 'FavoriteCtrl'
                  }
              },
              cache: false
          })

          .state('app.splash', {
            url: '/splash',
            views: {
              'menuContent': {
                templateUrl: 'templates/temp.html',
                controller: 'SplashCtrl'
              }
            },
            cache: false
          })

          .state('app.post', {
              url: '/posts/:postId-:categoryDesc',
              views: {
                  'menuContent': {
                      templateUrl: 'templates/post.html',
                      controller: 'PostCtrl'
                  }
              },
//              cache: false
          });
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');

    });
