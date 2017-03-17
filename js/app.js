// Ionic Starter App
var domain = "https://health.shahandanchor.com/";
var apkInterfaceId =73;
angular.module('underscore', [])
        .factory('_', function () {
            return window._; // assumes underscore has already been loaded on the page
        });
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('your_app_name', [
    'ionic',
    'angularMoment',
    'your_app_name.controllers',
    'your_app_name.directives',
    'your_app_name.filters',
    'your_app_name.services',
    'your_app_name.factories',
    'your_app_name.config',
    'underscore',
    'ngMap',
    'ngResource',
    'ngCordova',
    'slugifier',
    'ionic.contrib.ui.tinderCards',
    'jett.ionic.filter.bar',
    'youtube-embed',
    'PasswordConfirm'
])
        .run(function ($ionicPlatform, $http, $state, $rootScope, $ionicPopup, $ionicConfig, $timeout, $ionicLoading, $ionicHistory) {
            $ionicPlatform.onHardwareBackButton(function (event) {
                event.preventDefault();
            });
//            $ionicPlatform.ready(function () {
//
//                // Check for network connection
//                alert(window.Connection);
//                if (window.Connection) {
//                    if (navigator.connection.type == Connection.NONE) {
//                        $ionicPopup.confirm({
//                            title: 'No Internet Connection',
//                            content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
//                        })
//                                .then(function (result) {
//                                    if (!result) {
//                                        ionic.Platform.exitApp();
//                                    }
//                                });
//                    }
//                }
//
//            });

            document.addEventListener("offline", onOffline, false);
            function onOffline() {
                // Handle the offline event
                alert('Sorry, no Internet connectivity detected. Please reconnect and try again.');
            }

            $ionicPlatform.on("deviceready", function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)

                // Enable to debug issues.
                // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});



                var notificationOpenedCallback = function (jsonData) {
                    // alert('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
                    console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));

                    // $state.go("app.content-library-setting");
                    try
                    {
                        if (jsonData.additionalData) {
                            //  alert("Inside additionalData");
                            console.log("additionalData " + jsonData.additionalData);
                            // console.log("additionalData "+jsonData.additionalData.push)
                            //  alert("id " + jsonData.additionalData.actionSelected);
//                            if (jsonData.additionalData.yourUrlKey) {
//                                alert("Inside additionalData yourUrlKey");
//                                location.href = jsonData.additionalData.yourUrlKey;
//                            }
                            //  alert()
                            $http({
                                method: 'GET',
                                url: domain + 'trigger/action-trigger',
                                params: {action: jsonData.additionalData, status: 1}
                            }).then(function successCallback(response) {
                                console.log(response.data);
                                try {
                                    if (response.data) {
                                        location.href = response.data;
                                    } else if (jsonData.additionalData.defaultUrl) {
                                        location.href = jsonData.additionalData.defaultUrl;
                                    }
                                } catch (err) {
                                    location.href = jsonData.additionalData.defaultUrl;
                                }

                            }, function errorCallback(e) {
                                console.log(e);
                            });


                            /* if (jsonData.additionalData.actionSelected == "id1")
                             {
                             
                             //  alert("Button id1 pressed!");
                             $http({
                             method: 'GET',
                             url: domain + 'tracker/captured',
                             params: {actionid: jsonData.additionalData.actionButtons[0].icon, status: 1}
                             }).then(function successCallback(response) {
                             
                             if (jsonData.additionalData.yourUrlKey) {
                             location.href = jsonData.additionalData.yourUrlKey;
                             }
                             
                             }, function errorCallback(e) {
                             console.log(e);
                             });
                             }
                             if (jsonData.additionalData.actionSelected == "id2")
                             {
                             //  alert("Button id2 pressed!");
                             
                             $http({
                             method: 'GET',
                             url: domain + 'tracker/captured',
                             params: {actionid: jsonData.additionalData.actionButtons[1].icon, status: 2}
                             }).then(function successCallback(response) {
                             
                             if (jsonData.additionalData.yourUrlKey) {
                             location.href = jsonData.additionalData.yourUrlKey;
                             }
                             }, function errorCallback(e) {
                             console.log(e);
                             });
                             }
                             if (jsonData.additionalData.actionSelected == "id3")
                             {
                             //   alert("Button id3 pressed!");
                             
                             $http({
                             method: 'GET',
                             url: domain + 'tracker/captured',
                             params: {actionid: jsonData.additionalData.actionButtons[2].icon, status: 3}
                             }).then(function successCallback(response) {
                             if (jsonData.additionalData.yourUrlKey) {
                             location.href = jsonData.additionalData.yourUrlKey;
                             }
                             }, function errorCallback(e) {
                             console.log(e);
                             });
                             }
                             */
                        }

                    } catch (err)
                    {
                        alert('No redirection ' + err);
                    }


                };

                window.plugins.OneSignal.init("eaa13ee8-5f59-4fe7-a532-aa47d00cbba0",
                        {googleProjectNumber: "769295732267"}, // jainam account GCM id
                        notificationOpenedCallback);

                try {
                    window.plugins.OneSignal.getIds(function (ids) {
                        console.log('getIds: ' + JSON.stringify(ids));
                        if (window.localStorage.getItem('id')) {
                            var userId = window.localStorage.getItem('id');
                        } else {
                            var userId = '';
                        }

                        $http({
                            method: 'GET',
                            url: domain + 'notification/insertPlayerId',
                            params: {userId: userId, playerId: ids.userId, pushToken: ids.pushToken}
                        }).then(function successCallback(response) {
                            if (response.data == 1) {
                                // alert('Notification setting updated');
                            }
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    });
                } catch (err) {
                    console.log(err);
                }



                // Show an alert box if a notification comes in when the user is in your app.
                // 

//                window.plugins.OneSignal.init("eaa13ee8-5f59-4fe7-a532-aa47d00cbba0",
//                               {googleProjectNumber: "769295732267",
//                                autoRegister: true},
//                                app.didReceiveRemoteNotificationCallBack);
//                                
                // window.plugins.OneSignal.registerForPushNotifications();

                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                //  PushNotificationsService.register();
            });
            $rootScope.$on('loading:show', function () {
                //$ionicLoading.show({template: 'Loading'})
            })

            $rootScope.$on('loading:hide', function () {
                //$ionicLoading.hide()
            })
            // This fixes transitions for transparent background views
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                if (toState.name.indexOf('auth.walkthrough') > -1)
                {
                    // set transitions to android to avoid weird visual effect in the walkthrough transitions
                    $timeout(function () {
                        $ionicConfig.views.transition('android');
                        $ionicConfig.views.swipeBackEnabled(false);
                        console.log("setting transition to android and disabling swipe back");
                    }, 0);
                }
                try {
                    if (toState.name == "app.doctor-join" || toState.name == "app.chat")
                    {
                        console.log("false state");
                        window.plugins.OneSignal.enableInAppAlertNotification(false);
                    } else {
                        console.log("true state");
                        window.plugins.OneSignal.enableInAppAlertNotification(true);
                    }
                } catch (err) {

                }


            });
            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                if (toState.name.indexOf('app.feeds-categories') > -1)
                {
                    // Restore platform default transition. We are just hardcoding android transitions to auth views.
                    $ionicConfig.views.transition('platform');
                    // If it's ios, then enable swipe back again
                    if (ionic.Platform.isIOS())
                    {
                        $ionicConfig.views.swipeBackEnabled(true);
                    }
                    console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
                }


            });

            $ionicPlatform.on("resume", function () {
                //   PushNotificationsService.register();
            });

        })

        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
            $httpProvider.interceptors.push(function ($rootScope) {
                return {
                    request: function (config) {
                        $rootScope.$broadcast('loading:show')
                        return config
                    },
                    response: function (response) {
                        $rootScope.$broadcast('loading:hide')
                        return response
                    }
                }
            })

            $stateProvider

                    //INTRO
                    .state('auth', {
                        url: "/auth",
                        templateUrl: "views/auth/auth.html",
                        abstract: true,
                        controller: 'AuthCtrl'
                    })

                    .state('auth.walkthrough', {
                        url: '/walkthrough',
                        templateUrl: "views/auth/walkthrough.html"
                    })

                    .state('auth.login', {
                        url: '/login',
                        templateUrl: function () {
                            return "views/auth/login.html";
                        },
                        controller: 'LoginCtrl'
                    })

                    .state('app.genericlogin', {
                        url: '/genericlogin',
                        templateUrl: function () {
                            return "views/app/generic_login.html";
                        },
                    })

                    .state('auth.signup', {
                        url: '/signup',
                        templateUrl: function () {
                            return "views/auth/signup.html";
                        },
                        controller: 'SignupCtrl'
                    })

                    .state('auth.check-otp', {
                        url: '/check-otp',
                        templateUrl: function () {
                            return "views/auth/check-otp.html";
                        },
                        controller: 'SignupCtrl'
                    })

                    .state('auth.forgot-password', {
                        url: "/forgot-password",
                        templateUrl: function () {
                            return "views/auth/forgot-password.html";
                        },
                        controller: 'ForgotPasswordCtrl'
                    })

                    .state('auth.update-password', {
                        url: "/update-password",
                        templateUrl: function () {
                            return "views/auth/update-password.html";
                        },
                        controller: 'ForgotPasswordCtrl'
                    })

                    .state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "views/app/side-menu.html",
                        controller: 'AppCtrl'
                    })

                    .state('app.change-password', {
                        url: "/change-password",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/change-password.html";
                                },
                                controller: 'ChangePasswordCtrl'
                            }
                        }
                    })

                    .state('app.category-list', {
                        cache: false,
                        url: "/category-listing",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/category-list.html";
                                },
                                controller: 'CategoryListCtrl'
                            }
                        }
                    })

                    .state('app.checkavailable', {
                        cache: false,
                        url: "/checkavailable/{data:int}/{uid:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/checkavailable.html";
                                },
                                controller: 'CheckavailableCtrl'
                            }
                        }
                    })

                    .state('app.category-detail', {
                        cache: false,
                        url: "/category-detail",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/category-detail.html";
                                },
                                controller: 'CategoryDetailCtrl'
                            }
                        }
                    })

                    .state('app.shared-with-you', {
                        cache: false,
                        url: "/shared-with-you",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/shared-with-you.html";
                                },
                                controller: 'SharedwithYouCtrl'
                            }
                        }
                    })

                    .state('app.add-category', {
                        cache: false,
                        url: "/add-category/{id:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/add-record.html";
                                },
                                controller: 'AddRecordCtrl'
                            }
                        }
                    })

                    .state('app.reminder', {
                        cache: false,
                        url: "/reminder",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/reminder.html";
                                },
                                controller: 'reminderCtrl'
                            }
                        }
                    })

                    .state('app.reminder-recent', {
                        cache: false,
                        url: "/reminder-recent",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/reminder-recent.html";
                                },
                                //controller: 'reminderRecentCtrl'
                                controller: 'reminderRecentCtrl'
                            }
                        }
                    })

                    .state('app.reminder-summary', {
                        cache: false,
                        url: "/reminder-summary",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/reminder-summary.html";
                                },
                                //controller: 'reminderRecentCtrl'
                                controller: 'reminderSummaryCtrl'
                            }
                        }
                    })

                    .state('app.reminder-summary-details', {
                        cache: false,
                        url: "/reminder-summary-details",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/reminder-summary-details.html";
                                },
                                //controller: 'reminderRecentCtrl'
                                controller: 'reminderSummaryDetailsCtrl'
                            }
                        }
                    })

                    .state('app.edit-record', {
                        url: "/edit-record/{id:int}/{cat:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/edit-record.html";
                                },
                                controller: 'EditRecordCtrl'
                            }
                        }
                    })

                    .state('app.records-view', {
                        cache: false,
                        url: "/records-view/{id:string}/{shared:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/records/records-view.html";
                                },
                                controller: 'RecordsViewCtrl'
                            }
                        }
                    })
                    // Records view with box of categories
                    .state('app.records-view-box', {
                        cache: false,
                        url: "/records-view-box/{id:int}/{name:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/records/records-view-box.html";
                                },
                                controller: 'RecordsViewBoxCtrl'
                            }
                        }
                    })

                    .state('app.confirmed-order', {
                        cache: false,
                        url: "/confirmed-order/{id:string}/{orderId:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/records/confirmed-order.html";
                                },
                                controller: 'ConfirmedOrderCtrl'
                            }
                        }
                    })

                    .state('app.order-comments', {
                        cache: false,
                        url: "/order-comments/{recordId:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/records/order-comments.html";
                                },
                                controller: 'OrderCommentsCtrl'
                            }
                        }
                    })

                    .state('app.user-addresses', {
                        cache: false,
                        url: "/user-addresses/",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/records/user-addresses.html";
                                },
                                controller: 'UserAddressesCtrl'
                            }
                        },
                        params: {
                            order: null
                        }
                    })

                    .state('app.user-address-create', {
                        cache: false,
                        url: "/user-address-create/",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/records/user-address-create.html";
                                },
                                controller: 'UserAddressesCreateCtrl'
                            }
                        },
                        params: {
                            order: null
                        }
                    })

                    .state('app.chatlist', {
                        cache: false,
                        url: "/chatlist",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/chatlist.html";
                                },
                                controller: 'ChatListCtrl'
                            }
                        }
                    })

                    .state('app.video-chat', {
                        cache: false,
                        url: "/video-chat",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/video-chat.html",
                                controller: 'VideoChatCtrl'
                            }
                        }
                    })

                    .state('app.chat-video-share', {
                        cache: false,
                        url: "/chat-video-share",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/chat-video-share.html",
                                controller: 'VideoChatShareCtrl'
                            }
                        }
                    })

                    .state('app.past-chatlist', {
                        cache: false,
                        url: "/past-chatlist",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/past-chatlist.html";
                                },
                                controller: 'PastChatListCtrl'
                            }
                        }
                    })

                    .state('app.chat', {
                        url: "/chat/{id:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/chat.html";
                                },
                                controller: 'ChatCtrl'
                            }
                        }
                    })

                    .state('app.pastchat', {
                        url: "/pastchat/{id:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/pastchat.html";
                                },
                                controller: 'PastChatCtrl'
                            }
                        }
                    })

                    .state('app.view-chat-video', {
                        cache: false,
                        url: "/view-chat-video/{id:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/view-chat-video.html",
                                controller: 'ViewVideoChatCtrl'
                            }
                        }
                    })

                    .state('app.record-details', {
                        cache: false,
                        url: "/record-details/{id:int}/{shared:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/records/record-details.html";
                                },
                                controller: 'RecordDetailsCtrl'
                            }
                        }
                    })

                    .state('app.preview-note', {
                        url: "/preview-note/{id:int}/{appId:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/preview/view-note/cnote-view.html",
                                controller: 'PreviewConsultationsNoteCtrl'
                            }
                        }
                    })

                    .state('app.patient-settings', {
                        cache: false,
                        url: "/patient-settings",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/patient-settings.html";
                                },
                                controller: 'PatientSettingsCtrl'
                            }
                        }
                    })

                    .state('app.medicine', {
                        cache: false,
                        url: "/medicines/medicine",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/medicines/medicine.html";
                                },
                                controller: 'MedicineCtrl'
                            }
                        }
                    })

                    .state('app.address', {
                        cache: false,
                        url: "/medicines/address",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/medicines/address.html";
                                },
                                controller: 'AddressCtrl'
                            }
                        }
                    })
                    //Consultations
                    .state('app.consultations-list', {
                        //cache: false,
                        url: "/consultations-list",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/consultations/consultations-list.html";
                                },
                                controller: 'ConsultationsListCtrl'
                            }
                        }
                    })

                    .state('app.consultations-current', {
                        url: "/consultations/current",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/consultations/consultations-current.html";
                                },
                                controller: 'ConsultationsListCurrentCtrl'
                            }
                        }
                    })

                    .state('app.consultations-past', {
                        url: "/consultations/past",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/consultations/consultations-past.html";
                                },
                                controller: 'ConsultationsListPastCtrl'
                            }
                        }
                    })

                    .state('app.consultation-cards', {
                        cache: false,
                        url: "/consultation-cards/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/consultations/consultation-cards.html";
                                },
                                controller: 'ConsultationCardsCtrl'
                            }
                        }
                    })

                    .state('app.consultation-single-cat-cards', {
                        cache: false,
                        url: "/consultation-single-cat-cards/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/consultations/consultation-single-cat-cards.html";
                                },
                                controller: 'ConsultationCardsCtrl'
                            }
                        }
                    })

                    .state('app.consultation-profile', {
                        //  cache: false,
                        url: "/consultation-profile/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/consultations/consultation-profile.html";
                                },
                                controller: 'ConsultationProfileCtrl'
                            }
                        }
                    })

                    .state('app.single-profile', {
                        //  cache: false,
                        url: "/single-profile/{id:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/consultations/consultation-single-profile.html";
                                },
                                controller: 'ConsultationProfileCtrl'
                            }
                        }
                    })

                    .state('app.current-tab', {
                        cache: false,
                        url: "/current-tab/{id:int}/{mode:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/current-tab.html";
                                },
                                controller: 'CurrentTabCtrl'
                            }
                        }
                    })

                    .state('app.reschedule-appointment', {
                        cache: false,
                        url: "/reschedule-appointment/{id:int}/{drServId:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/consultations/reschedule-appointment.html";
                                },
                                controller: 'RescheduleAppointmentCtrl'
                            }
                        }
                    })

                    .state('app.patient-join', {
                        cache: false,
                        url: "/patient-join/{id:int}/{mode:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/patient-join.html";
                                },
                                controller: 'PatientJoinCtrl'
                            }
                        }
                    })

                    .state('app.doctor-record-join', {
                        cache: false,
                        url: "/doctor-record-join",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/doctor-record-join.html";
                                },
                                controller: 'DoctorRecordJoinCtrl'
                            }
                        }
                    })

                    .state('app.join-chat', {
                        cache: false,
                        url: "/join-chat/{id:int}/{mode:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/join-chat.html";
                                },
                                controller: 'JoinChatCtrl'
                            }
                        }
                    })

                    //Payment
                    .state('app.payment', {
                        cache: false,
                        url: "/payment",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/payment.html";
                                },
                                controller: 'PaymentCtrl'
                            }
                        }
                    })

                    .state('app.Gopay', {
                        url: "/gopay/{link:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/go-payment.html";
                                },
                                controller: 'GoPayCtrl'
                            }
                        }
                    })

                    .state('app.gopayment', {
                        url: "/gopayment/{link:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/go-payment.html";
                                },
                                controller: 'GoPaymentCtrl'
                            }
                        }
                    })

                    .state('app.success', {
                        url: "/success/{id:int}/{serviceId:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/success.html";
                                },
                                controller: 'SuccessCtrl'
                            }
                        }
                    })

                    .state('app.failure', {
                        url: "/failure/{id:int}/{serviceId:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/failure.html";
                                },
                                controller: 'FailureCtrl'
                            }
                        }
                    })

                    .state('app.thankyou', {
                        url: "/thankyou/{data:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/thankyou.html";
                                },
                                controller: 'ThankyouCtrl'
                            }
                        }
                    })

                    .state('app.thankyouc', {
                        url: "/thankyouc/{data:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/thankyouc.html";
                                },
                                controller: 'ThankyouCtrl'
                            }
                        }
                    })

                    .state('app.chat-thankyou', {
                        url: "/chat-thankyou/{data:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/chat-thankyou.html";
                                },
                                controller: 'ThankyouChatCtrl'
                            }
                        }
                    })

                    .state('app.thankyoup', {
                        url: "/thankyoup/{data:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/thankyoup.html";
                                },
                                controller: 'ThankyouCtrl'
                            }
                        }
                    })

                    /* packaging */
                    .state('app.packaging', {
                        cache: false,
                        url: "/packaging",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/packaging/packaging.html";
                                },
                                controller: 'packagingCtrl'
                            }
                        }
                    })

                    .state('app.packaging-detail', {
                        cache: false,
                        url: "/packaging-detail/{id:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/packaging/packaging-detail.html";
                                },
                                controller: 'PackagingDetailCtrl'
                            }
                        }
                    })

                    .state('app.package-confirm', {
                        cache: false,
                        url: "/package-confirm/{id:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/packaging/package-confirm.html";
                                },
                                controller: 'packageConfirmCtrl'
                            }
                        }
                    })

                    .state('app.active-packages', {
                        url: "/active-packages",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/packaging/active-packages.html";
                                },
                                controller: 'ActivePackagesCtrl'
                            }
                        }
                    })

                    .state('app.packages-view', {
                        url: "/packages-view/{id:string}/{ord:string}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/packaging/packages-view.html";
                                },
                                controller: 'PackagesViewCtrl'
                            }
                        }
                    })

                    .state('app.past-packages', {
                        url: "/past-packages",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/packaging/past-packages.html";
                                },
                                controller: 'PastPackagesCtrl'
                            }
                        }
                    })
                    /* end of packaging */

                    /* Pathology  */
                    .state('app.pathology', {
                        url: "/pathology",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/pathology/pathology.html";
                                },
                                controller: 'PathologyCtrl'
                            }
                        }
                    })

                    .state('app.packages-list', {
                        url: "/packages-list",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/pathology/packages-list.html";
                                },
                                controller: 'PackagesListCtrl'
                            }
                        }
                    })
                    /* End Pathology  */

                    .state('app.content-library', {
                        cache: false,
                        url: "/content-library",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/content-library/content-library.html";
                                },
                                controller: 'ContentLibraryCtrl'
                            }
                        }
                    })

                    .state('app.content-library-setting', {
                        cache: false,
                        url: "/content-library-setting",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/content-library/content-library-setting.html";
                                },
                                controller: 'ContentLibrarySettingCtrl'
                            }
                        }
                    })

                    .state('app.view-content-value', {
                        //  cache: false,
                        url: "/view-content-value/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: function () {
                                    return "views/app/content-library/view-content-value.html";
                                },
                                controller: 'ViewContentCtrl'
                            }
                        }
                    })

                    .state('app.logout', {
                        url: "/logout",
                        views: {
                            'menuContent': {
                                //templateUrl: "views/app/bookmarks.html",
                                controller: 'AppCtrl'
                            }
                        }
                    })
                    .state('app.video-broadcast', {
                        cache: false,
                        url: "/video-broadcast",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/video-broadcast.html",
                                controller: 'VideoBroadcastCtrl'
                            }
                        }
                    })
                    .state('app.video-broadcast-create', {
                        cache: false,
                        url: "/video-broadcast-create",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/video-broadcast-create.html",
                                controller: 'VideoBroadcastCreateCtrl'
                            }
                        }
                    })
                    .state('app.video-broadcast-stream', {
                        cache: false,
                        url: "/video-broadcast-stream/{session_id:string}/{token:string}/{publish:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/video-broadcast-stream.html",
                                controller: 'VideoBroadcastStreamCtrl'
                            }
                        }
                    })
                    .state('app.video-broadcast-interactive', {
                        cache: false,
                        url: "/video-broadcast-interactive/{session_id:string}/{token:string}/{publish:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/video-broadcast-interactive.html",
                                controller: 'VideoBroadcastInteractiveCtrl'
                            }
                        }
                    })
                    .state('app.schedule-video-broadcast', {
                        cache: false,
                        url: "/video-broadcast-schedule",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/video-broadcast-schedule.html",
                                controller: 'VideoBroadcastScheduleCtrl'
                            }
                        }
                    })
                    .state('app.consultationnotes', {
                        url: "/consultationnotes/{appId:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-notes-list.html",
                                controller: 'ConsultationsNotesListCtrl'
                            }
                        }
                    })
                    .state('app.consultation-note-details', {
                        url: "/consultationnotedetails/{appId:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note-details.html",
                                controller: 'ConsultationsNotesDetailsCtrl'
                            }
                        }
                    })
                    .state('app.consultation-note-records', {
                        url: "/consultation-note-records/{appId:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note-records.html",
                                controller: 'ConsultationNoteRecordsCtrl'
                            }
                        }
                    })
                    ;

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/category-listing');
        });
 