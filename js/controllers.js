var publisher;
var session;
var subscriber;
angular.module('your_app_name.controllers', ['ionic', 'ngCordova'])
        .controller('AuthCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            $scope.interface = window.localStorage.setItem('interface_id', apkInterfaceId);
            if (window.localStorage.getItem('id') != null) {
                $rootScope.userLogged = 1;
                $rootScope.username = window.localStorage.getItem('fname');
            } else {
                if ($rootScope.userLogged == 0)
                    //  $rootScope.userLogged = 0;
                    $state.go('auth.forgot-password');
            }
            $scope.backtohome = function () {
                $state.go('app.category-list');
            }
        })

angular.module('PasswordConfirm', []).directive('changePasswordC', function () {
    //console.log("hgjhfjhfjh");
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$setValidity('noMatch1', true);

            attrs.$observe('changePasswordC', function (newVal) {
                // console.log("vnvnbv" + newVal);
                if (newVal === 'true') {
                    ctrl.$setValidity('noMatch1', true);
                } else {
                    ctrl.$setValidity('noMatch1', false);
                }
            });
        }
    }
})

// APP

        .controller('AppCtrl', function ($scope, $ionicModal, $http, $state, $ionicConfig, $rootScope, $ionicLoading, $ionicHistory, $timeout, $ionicScrollDelegate) {

            $rootScope.imgpath = domain + "/public/frontend/user/";
            $rootScope.attachpath = domain + "/public";
            console.log('sdad---' + $rootScope.userLogged + " == " + window.localStorage.getItem('id'));
            // added generic code ---

            window.localStorage.setItem('interface_id', apkInterfaceId);
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userType = 'patient';
            $scope.action = 'login';
            $scope.registervia = window.localStorage.setItem('registervia', 'apk');

            $rootScope.$on('showLoginModal', function ($event, scope, cancelCallback, callback) {
                //bhavana----------


                $scope.user = {};
                $scope.user.name = '';
                $scope.user.email = '';
                $scope.user.phone = '';
                $scope.user.password = '';
                //bhavana--------------

                $scope.showLogin = true;
                $scope.registerToggle = function () {
                    $scope.showLogin = !$scope.showLogin;
                }
                $scope = scope || $scope;
                $scope.viewLogin = true;
                $ionicModal.fromTemplateUrl('views/app/generic_login.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.loginModal = modal;
                    $scope.loginModal.show();
                    $scope.hide = function () {
                        $scope.loginModal.hide();
                        if (typeof cancelCallback === 'function') {
                            cancelCallback();
                        }
                    }

                    $scope.forgotpassword = function () {
                        // alert('fads');
                        $scope.loginModal.hide();
                        $state.go('auth.forgot-password')
                    }



                    // console.log("jfskdjfk");
                    $scope.doLogIn = function () {
                        // console.log("khjfgkdjfhg");
                        $ionicLoading.show({template: 'Loading...'});
                        var data = new FormData(jQuery("#loginuser")[0]);
                        $.ajax({
                            type: 'POST',
                            url: domain + "chk-user",
                            data: data,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                console.log(response);
                                if (angular.isObject(response)) {
                                    $scope.loginError = '';
                                    $scope.loginError.digest;
                                    store(response);
                                    $rootScope.userLogged = 1;
                                    $rootScope.username = response.fname;
                                    $ionicLoading.hide();

                                    $http({
                                        method: 'GET',
                                        url: domain + 'get-login-logout-log',
                                        params: {userId: window.localStorage.getItem('id'), interface: $scope.interface, type: $scope.userType, action: $scope.action}
                                    }).then(function successCallback(response) {
                                        $http({
                                            method: 'GET',
                                            url: domain + 'get-login',
                                            params: {id: window.localStorage.getItem('id'), interface: $scope.interface}
                                        }).then(function successCallback(response) {
                                            console.log(response.data.lang.language);
                                            $scope.langtext = response.data.data;
                                            $scope.language = response.data.lang.language;

                                            //$scope.apkLanguage = window.localStorage.setItem('apkLanguage', response.data.lang.language);

                                            window.localStorage.setItem('apkLanguage', response.data.lang.language);
                                            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
                                            //$scope.sideMenu();

                                            window.location.reload();

                                        }, function errorCallback(response) {
                                            console.log(response);
                                        });
                                    }, function errorCallback(e) {

                                        console.log(e);
                                    });

                                    try {
                                        window.plugins.OneSignal.getIds(function (ids) {
                                            console.log('getIds: ' + JSON.stringify(ids));
                                            if (window.localStorage.getItem('id')) {
                                                $scope.userId = window.localStorage.getItem('id');
                                            } else {
                                                $scope.userId = '';
                                            }

                                            $http({
                                                method: 'GET',
                                                url: domain + 'notification/insertPlayerId',
                                                params: {userId: $scope.userId, playerId: ids.userId, pushToken: ids.pushToken}
                                            }).then(function successCallback(response) {
                                                if (response.data == 1) {
                                                    // alert('Notification setting updated');
                                                    // $state.go('app.category-list');
                                                }
                                            }, function errorCallback(e) {
                                                console.log(e);
                                                // $state.go('app.category-list');
                                            });
                                        });
                                    } catch (err) {
                                        // $state.go('app.category-list');
                                    }

                                    //   $rootScope.url = document.referrer;
                                    if (typeof callback === 'function') {
                                        callback();
                                    }
                                    //$state.go('app.category-list');

                                    $scope.loginModal.hide();
                                } else {
                                    $rootScope.userLogged = 0;
                                    $scope.loginError = response;
                                    $scope.loginError.digest;
                                    $ionicLoading.hide();
                                    $timeout(function () {
                                        $scope.loginError = response;
                                        $scope.loginError.digest;
                                    })
                                    //console.log('else part login');
                                    if (typeof cancelCallback === 'function') {
                                        cancelCallback();
                                    }
                                }
                                $rootScope.$digest;
                                $rootScope.$response;
                            },
                            error: function (e) {
                                //  console.log(e.responseText);
                            }
                        });
                    };
                    $scope.registerUser = function (data) {
                        Loader.show('Registering')
                        APIFactory.registerUser(data).then(function (response) {
                            console.log(response);
                            if (response.data == 'EmailExist') {
                                Loader.toggleLoadingWithMessage('Email is already registered!', 2000);
                            } else if (response.data == 'UsernameExist') {
                                Loader.toggleLoadingWithMessage('Username is already registered!', 2000);
                            } else if (response.data == 'success') {
                                Loader.toggleLoadingWithMessage('Registration Successful', 2000);
                                var cred = {
                                    logusername: data.regEmail,
                                    logpassword: data.regPassword
                                };
                                $scope.authUser(cred);
                            }
                        }, function (error) {
                            console.error(error)
                        })
                    }
                    $scope.doSignUp = function () {
                        var data = "name=" + $scope.user.name + "&email=" + $scope.user.email + "&phone=" + $scope.user.phone + "&password=" + $scope.user.password + "&interface=" + $scope.interface + "&registervia=" + $scope.registervia;
                        //var data = new FormData(jQuery("#signup")[0]);
                        $('#checkotp').removeClass('hide');
                        $('#signup').addClass('hide');
                        $.ajax({
                            type: 'GET',
                            url: domain + "check-otp",
                            data: data,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                window.localStorage.setItem('code', response.otpcode);
                                $ionicScrollDelegate.scrollTop([true]);
                                store($scope.user);
                                alert('Kindly check your mobile for OTP')
                                $ionicScrollDelegate.scrollTop();

                            }
                        });
                    };
                    //check OTP bhavana
                    $scope.checkOTP = function (otp) {
                        $ionicLoading.show({template: 'Loading..'});
                        $scope.interface = window.localStorage.getItem('interface_id');
                        $scope.registervia = window.localStorage.getItem('registervia');
                        $scope.user = {};
                        $scope.user.name = window.localStorage.getItem('name');
                        $scope.user.email = window.localStorage.getItem('email');
                        $scope.user.phone = window.localStorage.getItem('phone');
                        $scope.user.password = window.localStorage.getItem('password');
                        var data = "name=" + $scope.user.name + "&email=" + $scope.user.email + "&phone=" + $scope.user.phone + "&password=" + $scope.user.password + "&interface=" + $scope.interface + "&registervia=" + $scope.registervia;
                        console.log("data " + data);
                        var code = window.localStorage.getItem('code');
                        if (parseInt(code) === parseInt(otp)) {
                            console.log('code' + code + '--otp--' + otp)
                            $.ajax({
                                type: 'GET',
                                url: domain + "register",
                                data: data,
                                cache: false,
                                contentType: false,
                                processData: false,
                                success: function (response) {
                                    $ionicLoading.hide();
                                    if (angular.isObject(response)) {
                                        store(response);
                                        $rootScope.userLogged = 1;
                                        $rootScope.username = response.fname;
                                        try {
                                            window.plugins.OneSignal.getIds(function (ids) {
                                                console.log('getIds: ' + JSON.stringify(ids));
                                                if (window.localStorage.getItem('id')) {
                                                    $scope.userId = window.localStorage.getItem('id');
                                                } else {
                                                    $scope.userId = '';
                                                }

                                                $http({
                                                    method: 'GET',
                                                    url: domain + 'notification/insertPlayerId',
                                                    params: {userId: $scope.userId, playerId: ids.userId, pushToken: ids.pushToken}
                                                }).then(function successCallback(response) {
                                                    if (response.data == 1) {
                                                        // alert('You are sucessfully registered');
                                                        // $state.go('app.category-list', {}, {reload: true});
                                                    }
                                                }, function errorCallback(e) {
                                                    console.log(e);
                                                });
                                            });
                                        } catch (err) {

                                        }
                                        alert('You are sucessfully registered');
                                        if (typeof callback === 'function') {
                                            callback();
                                        }
                                        $scope.loginModal.hide();
                                        // $state.go('app.category-list', {}, {reload: true});
                                    } else {
                                        alert('Please fill all the details for signup');
                                    }
                                    $rootScope.$digest;

                                },
                                error: function (e) {
                                    $ionicLoading.hide();
                                    console.log(e.responseText);
                                }
                            });
                        } else {
                            $ionicLoading.hide();
                            alert('Enterd OTP code is incorrect.Kindly ckeck');
                        }
                    };
                    //Check if email is already registered
                    $scope.checkEmail = function (email) {
                        $scope.interface = window.localStorage.getItem('interface_id');
                        $http({
                            method: 'GET',
                            url: domain + 'check-user-email',
                            params: {userEmail: email, interface: $scope.interface}
                        }).then(function successCallback(response) {
                            if (response.data > 0) {
                                $scope.user.email = '';
                                $scope.emailError = "This email-id is already registered!";
                                $scope.emailError.digest;
                            } else {
                                $scope.emailError = "";
                                $scope.emailError.digest;
                            }
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    };
                    //Check if phone is already registered - bhavana
                    $scope.checkPhone = function (phone) {
                        $scope.interface = window.localStorage.getItem('interface_id');
                        $http({
                            method: 'GET',
                            url: domain + 'check-user-phone',
                            params: {userPhone: phone, interface: $scope.interface}
                        }).then(function successCallback(response) {
                            if (response.data > 0) {
                                $scope.user.phone = '';
                                $scope.phoneError = "This phone number is already registered!";
                                $scope.phoneError.digest;
                            } else {
                                $scope.phoneError = "";
                                $scope.phoneError.digest;
                            }
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    };
                });

            });


            //-------------
            console.log('getItem ' + window.localStorage.getItem('id'));
            if (window.localStorage.getItem('id')) {
                $rootScope.userLogged = 1;
                $rootScope.username = window.localStorage.getItem('fname');
            } else {
                if ($rootScope.userLogged == 0)
                    // $rootScope.userLogged = 0;
                    $state.go('app.category-list');
            }

            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = window.localStorage.getItem('id');
            $scope.userType = 'patient';
            $scope.action = 'logout';
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.CurrentDate = new Date();
            $ionicLoading.show({template: 'Loading..'});
            $http({
                method: 'GET',
                url: domain + 'get-sidemenu-lang',
                params: {id: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                if (response.data) {
                    $scope.menuItem = response.data.menuItem;
                    $scope.menutext = response.data.dataMenu;
                    $scope.language = response.data.lang.language;
                    $ionicLoading.hide();

                } else {
                }
            }, function errorCallback(response) {
                // console.log(response);
            });

            $rootScope.$on("sideMenu", function () {
                $scope.sideMenu();
            });
            $scope.sideMenu = function () {
                $ionicLoading.show({template: 'Loading..'});
                $http({
                    method: 'GET',
                    url: domain + 'get-sidemenu-lang',
                    params: {id: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    if (response.data) {
                        $scope.menuItem = response.data.menuItem;
                        $scope.menutext = response.data.dataMenu;
                        $scope.language = response.data.lang.language;
                        window.localStorage.setItem('apkLanguage', $scope.language);
                        window.location.url = window.location.url;
                        window.location.reload();
                        $ionicLoading.hide();
                    } else {
                    }
                }, function errorCallback(response) {
                    // console.log(response);
                });
            }

            $scope.logout = function () {
                $ionicLoading.show({template: 'Logging out....'});
                $http({
                    method: 'GET',
                    url: domain + 'get-login-logout-log',
                    params: {userId: window.localStorage.getItem('id'), interface: $scope.interface, type: $scope.userType, action: $scope.action}
                }).then(function successCallback(response) {
                    window.localStorage.clear();
                    $rootScope.userLogged = 0;
                    $rootScope.$digest;
                    $timeout(function () {
                        $ionicLoading.hide();
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                        //$state.go('auth.walkthrough', {}, {reload: true});
                        window.localStorage.setItem('apkLanguage', 'english');
                        window.localStorage.setItem('interface_id', apkInterfaceId);
                        $scope.sideMenu();
                        $state.go('app.category-list');
                    }, 30);
                }, function errorCallback(e) {
                    console.log(e);
                });



            };
            $scope.checkCat = function () {
                console.log('console');
                $http({
                    method: 'GET',
                    url: domain + 'doctors/check-doctrs',
                    params: {id: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data.doctrs.length == 1) {
                        $state.go('app.single-profile', {id: response.data.doctrs[0].user_id}, {reload: true});
                        $rootScope.single = 'profile';
                    } else if (response.data.spec.length == 1) {
                        $state.go('app.consultation-single-cat-cards', {id: response.data.spec[0].category_id}, {reload: true});
                        $rootScope.single = 'cat';
                    } else {
                        $state.go('app.consultations-list', {}, {reload: true});
                        $rootScope.single = '';
                    }
                }, function errorCallback(e) {
                    console.log(e);
                });
            };

            $scope.checkRedirect = function (url) {
                // alert(url);
                $rootScope.$broadcast('showLoginModal', $scope, function () {
                    console.log("logged in fail");

                }, function () {
                    console.log("succesfully logged in");
                    $state.go(url);

                });
            }

        })

        .controller('SearchBarCtrl', function ($scope, $state, $ionicConfig, $rootScope) {

        })
//LOGIN
        .controller('LoginCtrl', function ($scope, $state, $http, $ionicHistory, $templateCache, $q, $rootScope, $ionicLoading, $timeout) {
            window.localStorage.setItem('interface_id', apkInterfaceId);
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userType = 'patient';
            $scope.action = 'login';
            // $scope.val = {"message":"zxczc","additionalData":{"actionButtons":[{"id":"id1","text":"ignore","icon":"1"}],"actionSelected":"id1","title":"czxczxc"},"isActive":false};
            // console.log($scope.val.additionalData.actionButtons[0].id);
            $http({
                method: 'GET',
                url: domain + 'get-login',
                params: {id: window.localStorage.getItem('id'), interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.lang.language);
                $scope.langtext = response.data.data;
                $scope.language = response.data.lang.language;
                if (response.data) {
                    $scope.apkLanguage = window.localStorage.setItem('apkLanguage', response.data.lang.language);
                } else {

                }
            }, function errorCallback(response) {
                console.log(response);
            });

            $scope.doLogIn = function () {
                $ionicLoading.show({template: 'Loading...'});
                var data = new FormData(jQuery("#loginuser")[0]);
                $.ajax({
                    type: 'POST',
                    url: domain + "chk-user",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        //console.log(response);
                        if (angular.isObject(response)) {
                            $scope.loginError = '';
                            $scope.loginError.digest;
                            store(response);
                            $rootScope.userLogged = 1;
                            $rootScope.username = response.fname;
                            $ionicLoading.hide();
                            $http({
                                method: 'GET',
                                url: domain + 'get-login-logout-log',
                                params: {userId: window.localStorage.getItem('id'), interface: $scope.interface, type: $scope.userType, action: $scope.action}
                            }).then(function successCallback(response) {
                            }, function errorCallback(e) {
                                console.log(e);
                            });

                            try {
                                window.plugins.OneSignal.getIds(function (ids) {
                                    console.log('getIds: ' + JSON.stringify(ids));
                                    if (window.localStorage.getItem('id')) {
                                        $scope.userId = window.localStorage.getItem('id');
                                    } else {
                                        $scope.userId = '';
                                    }

                                    $http({
                                        method: 'GET',
                                        url: domain + 'notification/insertPlayerId',
                                        params: {userId: $scope.userId, playerId: ids.userId, pushToken: ids.pushToken}
                                    }).then(function successCallback(response) {
                                        if (response.data == 1) {
                                            // alert('Notification setting updated');
                                            //  $state.go('app.category-list');
                                        }
                                    }, function errorCallback(e) {
                                        console.log(e);
                                        // $state.go('app.category-list');
                                    });
                                });
                            } catch (err) {
                                // $state.go('app.category-list');
                            }

                            $timeout(function () {
                                $ionicLoading.hide();
                                $ionicHistory.clearCache();
                                $ionicHistory.clearHistory();
                                $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                                $state.go('app.category-list', {}, {reload: true});
                            }, 30);





                        } else {
                            $rootScope.userLogged = 0;
                            $scope.loginError = response;
                            $scope.loginError.digest;
                            $ionicLoading.hide();
                            $timeout(function () {
                                $scope.loginError = response;
                                $scope.loginError.digest;
                            })
                            //console.log('else part login');
                        }
                        $rootScope.$digest;
                        $rootScope.$response;
                    },
                    error: function (e) {
                        //  console.log(e.responseText);
                    }
                });
            };
            $scope.user = {};
            $scope.user.email = "";
            $scope.user.pin = "";
            // We need this for the form validation
            $scope.selected_tab = "";
            $scope.$on('my-tabs-changed', function (event, data) {
                $scope.selected_tab = data.title;
            });
        })

        .controller('LogoutCtrl', function ($scope, $state, $http, $ionicLoading, $ionicHistory, $timeout, $q, $rootScope) {
            $ionicLoading.show({template: 'Logging out....'});
            window.localStorage.clear();
            $rootScope.userLogged = 0;
            $rootScope.$digest;
            $timeout(function () {
                $ionicLoading.hide();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                $state.reload('app.category-list');
            }, 30);

        })

        .controller('SignupCtrl', function ($scope, $state, $http, $rootScope, $ionicScrollDelegate) {
            $scope.interface = window.localStorage.setItem('interface_id', apkInterfaceId);
            $scope.registervia = window.localStorage.setItem('registervia', 'apk');
            $scope.user = {};
            $scope.user.name = '';
            $scope.user.email = '';
            $scope.user.phone = '';
            $scope.user.password = '';
            $scope.doSignUp = function () {
                var data = "name=" + $scope.user.name + "&email=" + $scope.user.email + "&phone=" + $scope.user.phone + "&password=" + $scope.user.password + "&interface=" + $scope.interface + "&registervia=" + $scope.registervia;
                //var data = new FormData(jQuery("#signup")[0]);
                $.ajax({
                    type: 'GET',
                    url: domain + "check-otp",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        window.localStorage.setItem('code', response.otpcode);
                        $ionicScrollDelegate.scrollTop([true]);
                        store($scope.user);
                        alert('Kindly check your mobile for OTP')
                        $state.go('auth.check-otp', {}, {reload: true});
                    }
                });
            };
            //check OTP bhavana
            $scope.checkOTP = function (otp) {
                $scope.interface = window.localStorage.getItem('interface_id');
                $scope.registervia = window.localStorage.getItem('registervia');
                $scope.user = {};
                $scope.user.name = window.localStorage.getItem('name');
                $scope.user.email = window.localStorage.getItem('email');
                $scope.user.phone = window.localStorage.getItem('phone');
                $scope.user.password = window.localStorage.getItem('password');
                var data = "name=" + $scope.user.name + "&email=" + $scope.user.email + "&phone=" + $scope.user.phone + "&password=" + $scope.user.password + "&interface=" + $scope.interface + "&registervia=" + $scope.registervia;
                console.log("data " + data);
                var code = window.localStorage.getItem('code');
                if (parseInt(code) === parseInt(otp)) {
                    console.log('code' + code + '--otp--' + otp)
                    $.ajax({
                        type: 'GET',
                        url: domain + "register",
                        data: data,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (angular.isObject(response)) {
                                store(response);
                                $rootScope.userLogged = 1;
                                try {
                                    window.plugins.OneSignal.getIds(function (ids) {
                                        console.log('getIds: ' + JSON.stringify(ids));
                                        if (window.localStorage.getItem('id')) {
                                            $scope.userId = window.localStorage.getItem('id');
                                        } else {
                                            $scope.userId = '';
                                        }

                                        $http({
                                            method: 'GET',
                                            url: domain + 'notification/insertPlayerId',
                                            params: {userId: $scope.userId, playerId: ids.userId, pushToken: ids.pushToken}
                                        }).then(function successCallback(response) {
                                            if (response.data == 1) {
                                                // alert('You are sucessfully registered');
                                                // $state.go('app.category-list', {}, {reload: true});
                                            }
                                        }, function errorCallback(e) {
                                            console.log(e);
                                        });
                                    });
                                } catch (err) {

                                }

                                alert('You are sucessfully registered');
                                $state.go('app.category-list', {}, {reload: true});
                            } else {
                                alert('Please fill all the details for signup');
                            }
                            $rootScope.$digest;
                        },
                        error: function (e) {
                            console.log(e.responseText);
                        }
                    });
                } else {
                    alert('Enterd OTP code is incorrect.Kindly ckeck');
                }
            };
            //Check if email is already registered
            $scope.checkEmail = function (email) {
                $scope.interface = window.localStorage.getItem('interface_id');
                $http({
                    method: 'GET',
                    url: domain + 'check-user-email',
                    params: {userEmail: email, interface: $scope.interface}
                }).then(function successCallback(response) {
                    if (response.data > 0) {
                        $scope.user.email = '';
                        $scope.emailError = "This email-id is already registered!";
                        $scope.emailError.digest;
                    } else {
                        $scope.emailError = "";
                        $scope.emailError.digest;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            //Check if phone is already registered - bhavana
            $scope.checkPhone = function (phone) {
                $scope.interface = window.localStorage.getItem('interface_id');
                $http({
                    method: 'GET',
                    url: domain + 'check-user-phone',
                    params: {userPhone: phone, interface: $scope.interface}
                }).then(function successCallback(response) {
                    if (response.data > 0) {
                        $scope.user.phone = '';
                        $scope.phoneError = "This phone number is already registered!";
                        $scope.phoneError.digest;
                    } else {
                        $scope.phoneError = "";
                        $scope.phoneError.digest;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('ForgotPasswordCtrl', function ($scope, $state, $ionicLoading) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.recoverPassword = function (email, phone) {
                window.localStorage.setItem('email', email);
                console.log("email:  " + email);
                $scope.email = email;
                $scope.phone = phone;
                $.ajax({
                    type: 'GET',
                    url: domain + "recovery-password",
                    data: {email: $scope.email, phone: $scope.phone, interface: $scope.interface},
                    cache: false,
                    success: function (response) {
                        if (response == '0') {
                            alert('Email and mobile mismatch.');
                            $state.go('auth.forgot-password', {reload: true});
                        } else {
                            console.log("respone passcode" + response.passcode);
                            window.localStorage.setItem('passcode', response.passcode);
                            $state.go('auth.update-password', {}, {reload: true});
                        }
                    }
                });
            };
            $scope.updatePassword = function (passcode, password, cpassword) {
                var email = window.localStorage.getItem('email');

                $.ajax({
                    type: 'GET',
                    url: domain + "update-password",
                    data: {passcode: passcode, password: password, cpassword: cpassword, email: email, interface: $scope.interface},
                    cache: false,
                    success: function (response) {
                        if (response == 1) {
                            if (parseInt(passcode) == parseInt(window.localStorage.getItem('passcode'))) {
                                alert('Please login with your new password.');
                                $state.go('auth.login', {}, {reload: true});
                            } else {
                                alert('Please enter valid OTP.');
                            }
                        } else if (response == 2) {
                            alert('Password Mismatch.');
                        } else {
                            alert('Oops something went wrong.');
                        }
                    }
                });
            };
            $scope.user = {};
        })

        .controller('ChangePasswordCtrl', function ($scope, $state, $ionicLoading) {
            $scope.email = window.localStorage.getItem('email');
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            // $scope.user = {};
            $scope.oldpassword = '';
            $scope.password = '';
            $scope.cpassword = '';
            console.log($scope.userId + '--' + $scope.email + "****" + $scope.interface);
            $scope.doChangepassword = function () {
                $.ajax({
                    type: 'GET',
                    url: domain + "change-password",
                    data: {userId: $scope.userId, email: $scope.email, interface: $scope.interface, oldpassword: $scope.oldpassword, password: $scope.password},
                    cache: false,
                    success: function (response) {
                        if (response == 1) {
                            alert('Password updated successfully.');
                        } else if (response == 2) {
                            alert('Old password incorrect.');
                        } else {
                            alert('Password update unsuccessfully. Please try again!');
                        }

                    }
                });
            }

        })

        .controller('RateApp', function ($scope) {
            $scope.rateApp = function () {
                if (ionic.Platform.isIOS()) {
                    //you need to set your own ios app id
                    AppRate.preferences.storeAppURL.ios = '1234555553>';
                    AppRate.promptForRating(true);
                } else if (ionic.Platform.isAndroid()) {
                    //you need to set your own android app id
                    AppRate.preferences.storeAppURL.android = 'market://details?id=ionFB';
                    AppRate.promptForRating(true);
                }
            };
        })

        .controller('SendMailCtrl', function ($scope) {
            $scope.sendMail = function () {
                cordova.plugins.email.isAvailable(
                        function (isAvailable) {
                            cordova.plugins.email.open({
                                to: 'envato@startapplabs.com',
                                cc: 'hello@startapplabs.com',
                                // bcc:     ['john@doe.com', 'jane@doe.com'],
                                subject: 'Greetings',
                                body: 'How are you? Nice greetings from IonFullApp'
                            });
                        }
                );
            };
        })

        .controller('AdsCtrl', function ($scope, $http, $state, $ionicActionSheet, AdMob, iAd, $ionicModal) {
            $scope.interface = window.localStorage.getItem('interface_id');
            // Load the modal from the given template URL
            $ionicModal.fromTemplateUrl('addrecord.html', function ($ionicModal) {
                $scope.modal = $ionicModal;
                $scope.getCategory = function () {
                    $http({
                        method: 'GET',
                        url: domain + 'records/get-record-categories',
                        params: {userId: $scope.userid, interface: $scope.interface}
                    }).then(function successCallback(response) {
                        $scope.cats = response.data;
                        $scope.modal.show();
                        // angular.forEach(response.data, function (value, key) {
                        // $scope.cats.push({text: value.category, id: value.id});
                        // });
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                };
                $scope.addRecord = function ($ab) {
                    $state.go('app.add-category', {'id': $ab}, {reload: true});
                    $scope.modal.hide();
                };
            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
        })

//bring specific category providers

        .controller('CategoryListCtrl', function ($scope, $state, $http, $stateParams, $rootScope, $ionicLoading, $ionicSlideBoxDelegate, $timeout) {
            $http({
                method: 'GET',
                url: domain + 'image-slider',
                params: {interfaceno: $scope.interface}
            }).then(function successCallback(response) {
                $scope.sliderImages = response.data;
                $timeout(function () {
                    $ionicSlideBoxDelegate.update();
                }, 1000);
            });
            if (get('id') != null) {
                $rootScope.userLogged = 1;
            } else {
                $rootScope.userLogged = 0;
            }
            window.localStorage.setItem('interface_id', apkInterfaceId);
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = window.localStorage.getItem('id');
            $http({
                method: 'GET',
                url: domain + 'image-slider',
                params: {interfaceno: $scope.interface}
            }).then(function successCallback(response) {
                $scope.sliderImages = response.data;
            });
            $scope.getcatlang = function () {
                $http({
                    method: 'GET',
                    url: domain + 'get-categoty-lang',
                    params: {id: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    if (response.data.dataCat) {
                        $scope.menuItem = response.data.menuItem;
                        $scope.cattext = response.data.dataCat;
                        $scope.language = response.data.lang.language;
                        $scope.apkLanguage = response.data.lang.language;
                        window.localStorage.setItem('apkLanguage', response.data.lang.language);
                    }
                    $http({
                        method: 'GET',
                        url: domain + 'assistants/get-chat-unread-cnt',
                        params: {userId: $scope.userId}
                    }).then(function sucessCallback(response) {
                        console.log(response);
                        $scope.unreadCnt = response.data;
                        $ionicLoading.hide();
                    }, function errorCallback(e) {
                        console.log(e);
                    });
                }, function errorCallback(response) {
                    // console.log(response);
                });
            };


            if (get('id') != null) {
                $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
                $scope.getcatlang();

                console.log("lang  IF " + window.localStorage.getItem('apkLanguage'));
            } else {
                window.localStorage.setItem('apkLanguage', 'english');
                $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
                $scope.getcatlang();
//                 $scope.updatesideMenu();

                console.log("lang Else " + window.localStorage.getItem('apkLanguage'));
            }

            $scope.checkRedirect = function (url) {
                // alert(url);
                $rootScope.$broadcast('showLoginModal', $scope, function () {
                    console.log("logged in fail");

                }, function () {
                    console.log("succesfully logged in");
                    $state.go(url);

                });
            }
        })

        .controller('PatientSettingsCtrl', function ($scope, $http, $ionicPlatform, $state, $stateParams, $timeout, $ionicModal, $ionicLoading, $rootScope, $sce) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = window.localStorage.getItem('id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.lang_id = '';
            $http({
                method: 'GET',
                url: domain + 'doctors/get-patient-setting',
                params: {patientId: window.localStorage.getItem('id'), interface: $scope.interface}
            }).then(function successCallback(response) {
                $scope.allow_lang = response.data.allow_lang;
                $scope.getlang = response.data.getlang;
                $scope.lang_id = response.data.getlang.language_id;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                $scope.notification = response.data.notification;

            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.patient_language = function (langId) {
                $http({
                    method: 'POST',
                    url: domain + 'doctors/update-patient-language',
                    params: {langId: langId, patientId: window.localStorage.getItem('id'), interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response);
                    if (response.data == '1') {
                        $rootScope.$emit("sideMenu");
                        alert("Setting updated!");

                    }
                }, function errorCallback(e) {
                    console.log(e);
                });
            }

            $scope.pushNotification = function (notification) {
                console.log("val " + notification);
                if (notification == true) {
//               alert('register user');
                    $ionicPlatform.on("deviceready", function () {


                        window.plugins.OneSignal.getIds(function (ids) {

                            console.log('getIds: ' + JSON.stringify(ids));
                            //  alert('UserID: ' + JSON.stringify(ids.userId));
                            $http({
                                method: 'GET',
                                url: domain + 'notification/insertPlayerId',
                                params: {userId: window.localStorage.getItem('id'), playerId: ids.userId}
                            }).then(function successCallback(response) {
                                if (response.data == 1) {
                                    alert('Notification setting updated');
                                }
                            }, function errorCallback(e) {
                                console.log(e);
                            });

                        });
                    });
                } else {
                    $ionicPlatform.on("deviceready", function () {
                        window.plugins.OneSignal.enableInAppAlertNotification(true);
                        $http({
                            method: 'GET',
                            url: domain + 'notification/changeStatus',
                            params: {userId: window.localStorage.getItem('id')}
                        }).then(function successCallback(response) {
                            alert('Notification setting updated');
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    });
                }
            }
        })

        .controller('CategoryDetailCtrl', function ($scope, $http, $stateParams, $ionicFilterBar, $ionicModal, $timeout, $ionicLoading) {
            $scope.catIds = [];
            $scope.catId = [];
            $scope.docId = '';
            $scope.shared = 0;
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.categoryId = $stateParams.categoryId;
            //console.log(get('id'));
            $scope.userid = get('id');
            $scope.patientId = get('id');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'records/view-patient-record-category',
                params: {userId: $scope.userid, patientId: $scope.patientId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.categories = response.data.categories;
                $scope.doctrs = response.data.doctrs;
                $scope.userRecords = response.data.recordCount;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });

            $scope.getIds = function (id) {
                console.log(id);
                if ($scope.catId[id]) {
                    $scope.catIds.push(id);
                } else {
                    var index = $scope.catIds.indexOf(id);
                    $scope.catIds.splice(index, 1);
                }
                console.log($scope.catIds);
            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //Delete all Records by category
            $scope.delete = function () {
                if ($scope.catIds.length > 0) {
                    var confirm = window.confirm("Do you really want to delete?");
                    if (confirm) {
                        console.log($scope.catIds);
                        $ionicLoading.show({template: 'Loading...'});
                        $http({
                            method: 'POST',
                            url: domain + 'records/delete-all',
                            params: {ids: JSON.stringify($scope.catIds), userId: $scope.userid}
                        }).then(function successCallback(response) {
                            alert("Records deleted successfully!");
                            $ionicLoading.hide();
                            window.location.reload();
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    }
                } else {
                    alert("Please select records to delete!");
                }
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.catIds.length > 0) {
                    if ($scope.docId != '') {
                        var confirm = window.confirm("Do you really want to share?");
                        if (confirm) {
                            console.log($scope.catIds);
                            $ionicLoading.show({template: 'Loading...'});
                            $http({
                                method: 'POST',
                                url: domain + 'records/share-all',
                                params: {ids: JSON.stringify($scope.catIds), userId: $scope.userid, docId: $scope.docId}
                            }).then(function successCallback(response) {
                                console.log(response);
                                if (response.data == 'Success') {
                                    alert("Records shared successfully!");
                                    $ionicLoading.hide();
                                    window.location.reload();
                                }
                            }, function errorCallback(e) {
                                console.log(e);
                            });

                        }
                    } else {
                        alert("Please select doctor to share with!");
                    }
                } else {
                    alert("Please select records to share!");
                }
            };
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };

            var filterBarInstance;
            $scope.selectMe = function (event) {
                $(event.target).toggleClass('active');
            };

            $scope.showFilterBar = function () {
                filterBarInstance = $ionicFilterBar.show({
                    items: $scope.items,
                    update: function (filteredItems, filterText) {
                        $scope.items = filteredItems;
                        if (filterText) {
                            console.log(filterText);
                        }
                    }
                });
            };
            $scope.refreshItems = function () {
                if (filterBarInstance) {
                    filterBarInstance();
                    filterBarInstance = null;
                }
                $timeout(function () {
                    getItems();
                    $scope.$broadcast('scroll.refreshComplete');
                }, 1000);
            };
        })

        .controller('SharedwithYouCtrl', function ($scope, $http, $state, $stateParams, $timeout, $ionicModal, $rootScope, $sce, $ionicLoading) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.patientId = get('id');
            $scope.shared = 1;
            $scope.userId = get('id');
            $scope.catIds = [];
            $scope.catId = [];
            $scope.docId = '';
            // $http({
            //     method: 'GET',
            //     url: domain + 'records/get-shared-record-category',
            //     params: {userId: $scope.userId, patientId: $scope.patientId, interface: $scope.interface, shared: $scope.shared}
            // }).then(function successCallback(response) {
            //     console.log(response.data);
            //     $scope.categories = response.data.categories;
            //     $scope.doctrs = response.data.doctrs;
            //     $scope.userRecords = response.data.recordCount;
            //     $scope.patient = response.data.patient;
            //     $scope.langtext = response.data.langtext;
            //     $scope.language = response.data.lang.language;

            // }, function errorCallback(e) {
            //     console.log(e);
            // });
            $scope.getIds = function (id) {
                console.log(id);
                if ($scope.catId[id]) {
                    $scope.catIds.push(id);
                } else {
                    var index = $scope.catIds.indexOf(id);
                    $scope.catIds.splice(index, 1);
                }
                console.log($scope.catIds);
            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //Delete all Records by category
            $scope.delete = function () {
                if ($scope.catIds.length > 0) {
                    var confirm = window.confirm("Do you really want to delete?");
                    if (confirm) {
                        console.log($scope.catIds);
                        $http({
                            method: 'GET',
                            url: domain + 'records/delete-all',
                            params: {ids: JSON.stringify($scope.catIds), userId: $scope.userId, shared: $scope.shared}
                        }).then(function successCallback(response) {
                            alert("Records deleted successfully!");
                            window.location.reload();
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    }
                } else {
                    alert("Please select records to delete!");
                }
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.catIds.length > 0) {
                    if ($scope.docId != '') {
                        var confirm = window.confirm("Do you really want to share?");
                        if (confirm) {
                            console.log($scope.catIds);
                            $http({
                                method: 'GET',
                                url: domain + 'records/share-all',
                                params: {ids: JSON.stringify($scope.catIds), userId: $scope.userId, patientId: $scope.patientId, docId: $scope.docId, shared: $scope.shared}
                            }).then(function successCallback(response) {
                                console.log(response);
                                if (response.data == 'Success') {
                                    alert("Records shared successfully!");
                                }
                            }, function errorCallback(e) {
                                console.log(e);
                            });
                        }
                    } else {
                        alert("Please select doctor to share with!");
                    }
                } else {
                    alert("Please select records to share!");
                }
            };
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };

            // Added by Tushar at 11/01 
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/get-shared-record-doctors',
                params: {userId: $scope.userId, patientId: $scope.patientId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.userRecords = response.data;
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('MedicineCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;

            $ionicModal.fromTemplateUrl('prescription-type', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('AddressCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;

            $ionicModal.fromTemplateUrl('addnewaddress', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('CloseModalCtrl', function ($scope, $ionicModal, $state) {
            $scope.modalclose = function (ulink) {
                $state.go(ulink);
                $scope.modal.hide();
            }
        })

        .controller('knowConditionCtrl', function ($scope, $ionicModal, $state) {
            $ionicModal.fromTemplateUrl('knowcondition', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('mealDetailsCtrl', function ($scope, $ionicModal, $state) {
            $ionicModal.fromTemplateUrl('mealdetails', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('AddRecordCtrl', function ($scope, $http, $state, $stateParams, $compile, $ionicModal, $ionicHistory, $filter, $timeout, $ionicLoading, $cordovaCamera, $cordovaFile, $rootScope) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.images = [];
            $scope.image = [];
            $scope.tempImgs = [];
            $scope.prescription = 'Yes';
            $scope.coverage = 'Family Floater';
            $scope.probstatus = 'Current';
            $scope.taskstatus = 'Onetime';

            $scope.conId = [];
            $scope.conIds = [];
            $scope.selConditions = [];
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'HH:mm');
            $scope.endDate = '0000-00-00';
            $scope.endTime = $filter('date')($scope.endTime, 'HH:mm');
            //$scope.curT = new Date()$filter('date')(new Date(), 'H:i');
            $scope.userId = get('id');

            $scope.categoryId = $stateParams.id;
            $scope.fields = [];
            $scope.problems = [];
            $scope.doctrs = [];
            $scope.day = '';
            $scope.meals = [{time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}];
            $scope.mealDetails = [];
            $scope.dayMeal = [];
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'records/add',
                params: {id: $stateParams.id, patientId: $scope.userId, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.record = response.data.record;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.category = $stateParams.id;
                $scope.conditions = response.data.knownHistory;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                if ($scope.category == '6') {
                    angular.forEach($scope.fields, function (value, key) {
                        if (value.field == 'Coverage') {
                            $scope.coverage = 'Family Floater';
                        }
                    });
                }
                if ($scope.category == '14') {
                    angular.forEach($scope.fields, function (value, key) {
                        if (value.field == 'Status') {
                            console.log(value.field);
                            $scope.probstatus = 'Current';
                        }
                    });
                }
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.getCondition = function (id, con) {
                console.log(id + "==" + con);
                var con = con.toString();
                if ($scope.conId[id]) {
                    $scope.conIds.push(id);
                    $scope.selConditions.push({'condition': con});
                } else {
                    var index = $scope.conIds.indexOf(id);
                    $scope.conIds.splice(index, 1);
                    for (var i = $scope.selConditions.length - 1; i >= 0; i--) {
                        if ($scope.selConditions[i].condition == con) {
                            $scope.selConditions.splice(i, 1);
                        }
                    }
                }
                jQuery("#selcon").val($scope.conIds);
                console.log($scope.selConditions);
                console.log($scope.conIds);
            };
            $scope.addOther = function (name, field, val) {
                console.log(name, field, val);
                addOther(name, field, val);
            };
            $scope.addNewElement = function (ele) {
                addNew(ele);
            };
            $scope.submit = function () {
                //console.log(jQuery("#addRecordForm")[0].length);                
                //alert($scope.tempImgs.length);
                if ($scope.tempImgs.length > 0) {
                    angular.forEach($scope.tempImgs, function (value, key) {
                        $scope.picData = getImgUrl(value);
                        var imgName = value.substr(value.lastIndexOf('/') + 1);
                        $scope.ftLoad = true;
                        $scope.uploadPicture();
                        $scope.image.push(imgName);
                        console.log($scope.image);
                    });
                    jQuery('#camfilee').val($scope.image);
                    console.log($scope.images);
                    $ionicLoading.show({template: 'Adding...'});
                    var data = new FormData(jQuery("#addRecordForm")[0]);
                    callAjax("POST", domain + "records/save", data, function (response) {
                        console.log(response);
                        $ionicLoading.hide();
                        if (angular.isObject(response.records)) {
                            $ionicHistory.nextViewOptions({
                                historyRoot: true
                            });
                            //$scope.image = [];
                            alert("Record added successfully!");
                            $timeout(function () {
                                $state.go('app.records-view', {'id': $scope.categoryId}, {}, {reload: true});
                            }, 1000);
                        } else if (response.err != '') {
                            alert('Please fill mandatory fields');
                        }
                    });
                } else {
                    if (jQuery("#addRecordForm")[0].length > 2) {
                        $ionicLoading.show({template: 'Adding...'});
                        var data = new FormData(jQuery("#addRecordForm")[0]);
                        callAjax("POST", domain + "records/save", data, function (response) {
                            console.log(response);
                            $ionicLoading.hide();
                            if (angular.isObject(response.records)) {
                                $ionicHistory.nextViewOptions({
                                    historyRoot: true
                                });
                                alert("Record added successfully!");
                                $timeout(function () {
                                    $state.go('app.records-view', {'id': $scope.categoryId}, {}, {reload: true});
                                }, 1000);
                            } else if (response.err != '') {
                                alert('Please fill mandatory fields');
                            }
                        });
                    }
                }

                function getImgUrl(imageName) {
                    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
                    var trueOrigin = cordova.file.dataDirectory + name;
                    return trueOrigin;
                }
            };

            $scope.getPrescription = function (pre) {
                console.log('pre ' + pre);
                if (pre === ' No') {
                    console.log("no");
                    jQuery('#convalid').addClass('hide');
                } else if (pre === 'Yes') {
                    console.log("yes");
                    jQuery('#convalid').removeClass('hide');
                }
            };
            //Take images with camera
            $scope.takePict = function (name) {
                //console.log(name);
                var camimg_holder = $("#camera-status");
                camimg_holder.empty();
                // 2
                var options = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                };
                // 3
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    //alert(imageData);
                    onImageSuccess(imageData);
                    function onImageSuccess(fileURI) {
                        createFileEntry(fileURI);
                    }
                    function createFileEntry(fileURI) {
                        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                    }
                    // 5
                    function copyFile(fileEntry) {
                        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                        var newName = makeid() + name;
                        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                            fileEntry.copyTo(
                                    fileSystem2,
                                    newName,
                                    onCopySuccess,
                                    fail
                                    );
                        },
                                fail);
                    }
                    // 6
                    function onCopySuccess(entry) {
                        var imageName = entry.nativeURL;
                        $scope.$apply(function () {
                            $scope.tempImgs.push(imageName);
                        });
                        $scope.picData = getImgUrl(imageName);
                        //alert($scope.picData);
                        $scope.ftLoad = true;
                        camimg_holder.append('<button class="button button-positive remove" onclick="removeCamFile()">Remove Files</button><br/>');
                        $('<span class="upattach"><i class="ion-paperclip"></i></span>').appendTo(camimg_holder);
                    }
                    function fail(error) {
                        console.log("fail: " + error.code);
                    }
                    function makeid() {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 5; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return text;
                    }
                    function getImgUrl(imageName) {
                        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
                        var trueOrigin = cordova.file.dataDirectory + name;
                        return trueOrigin;
                    }
                }, function (err) {
                    console.log(err);
                });
            };

            $scope.uploadPicture = function () {
                //$ionicLoading.show({template: 'Uploading..'});
                var fileURL = $scope.picData;
                var name = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;
                var params = {};
//                params.value1 = "someparams";
//                params.value2 = "otherparams";
//                options.params = params;
                var uploadSuccess = function (response) {
                    alert('Success  ====== ');
                    console.log("Code = " + r.responseCode);
                    console.log("Response = " + r.response);
                    console.log("Sent = " + r.bytesSent);
                    //$scope.image.push(name);
                    //$ionicLoading.hide();
                }
                var ft = new FileTransfer();
                ft.upload(fileURL, encodeURI(domain + 'records/upload'), uploadSuccess, function (error) {
                    //$ionicLoading.show({template: 'Error in connecting...'});
                    //$ionicLoading.hide();
                }, options);
            };

            $scope.chkDt = function (dt) {
                console.log(dt);
                console.log($scope.curTime);
                console.log($scope.curTime < dt);
                if (!($scope.curTime < dt)) {
                    alert('End date should be greater than start date.');
                    jQuery('#enddt').val('');
                }
            };

            $scope.check = function (val) {
                console.log(val);
                if ($scope.categoryId == 7) {
                    if (val) {
                        jQuery('#billStatus').val('Paid');
                        jQuery('#billmode').removeClass('hide');
                    } else {
                        jQuery('#billStatus').val('Unpaid');
                        jQuery('#billmode').addClass('hide');
                    }
                }
                if ($scope.categoryId == 3) {
                    if (val) {
                        jQuery('#mediStatus').val('Active');
                    } else {
                        jQuery('#mediStatus').val('Inactive');
                    }
                }
                if ($scope.categoryId == 2) {
                    if (val) {
                        jQuery('#immrcvdate').val('Received');
                        jQuery('#imdtrcv').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#immrcvdate').val('To be received');
                        jQuery('#imdtrcv').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
                if ($scope.categoryId == 4) {
                    if (val) {
                        jQuery('#proconduct').val('Conducted On');
                        jQuery('#proconon').removeClass('hide');
                        jQuery('.proc').removeClass('hide');
                        jQuery('#proconbef').addClass('hide');
                    } else {
                        jQuery('#proconduct').val('To be conducted');
                        jQuery('#proconon').addClass('hide');
                        jQuery('.proc').addClass('hide');
                        jQuery('#proconbef').removeClass('hide');
                    }
                }
                if ($scope.categoryId == 5) {
                    if (val) {
                        jQuery('#invconduct').val('Conducted');
                        jQuery('#invconon').removeClass('hide');
                        jQuery('.inv').removeClass('hide');
                        jQuery('#invconbef').addClass('hide');
                    } else {
                        jQuery('#invconduct').val('To be conducted');
                        jQuery('#invconon').addClass('hide');
                        jQuery('.inv').addClass('hide');
                        jQuery('#invconbef').removeClass('hide');
                    }
                }
            };

            $scope.rcheck = function (val) {
                console.log(val);
                if ($scope.categoryId == 2) {
                    if (val) {
                        jQuery('#immrepeat').val('Yes');
                        jQuery('#imrpton').removeClass('hide');
                        //jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#immrepeat').val('No');
                        jQuery('#imrpton').addClass('hide');
                        //jQuery('.imd').addClass('hide');
                    }
                }
            };

            $scope.shCheck = function (val) {
                console.log(val);
                if ($scope.categoryId == 3) {
                    if (val == '') {
                        jQuery('#prescribeDt').addClass('hide');
                    } else {
                        jQuery('#prescribeDt').removeClass('hide');
                    }
                }
            };

            $scope.radChange = function (prob) {
                console.log(prob);
                if ($scope.categoryId == 14) {
                    if (prob != 'Past') {
                        jQuery('#probend').addClass('hide');
                    } else {
                        jQuery('#probend').removeClass('hide');
                    }
                }
                if ($scope.categoryId == 30) {
                    if (prob != 'Onetime') {
                        jQuery('#endtime').removeClass('hide');
                        jQuery('#enddate').removeClass('hide');
                        jQuery('.taskn').removeClass('hide');

                    } else {
                        jQuery('#endtime').addClass('hide');
                        jQuery('#enddate').addClass('hide');
                        jQuery('.taskn').addClass('hide');

                    }
                }
            };

            $scope.setFile = function (element) {
                $scope.currentFile = element.files[0];
                console.log('length = ' + element.files.length);
                var image_holder = $("#image-holder");
                image_holder.empty();
                if (element.files.length > 0) {
                    jQuery('#convalid').removeClass('hide');
                    jQuery('#coninprec').removeClass('hide');
                    //jQuery('#valid-till').attr('required', true);
                    image_holder.append('<button class="button button-small button-assertive remove icon ion-close" onclick="removeFile()"></button>');
                } else {
                    jQuery('#convalid').addClass('hide');
                    jQuery('#coninprec').addClass('hide');
                    //jQuery('#valid-till').attr('required', false);
                }
                if (typeof (FileReader) != "undefined") {
                    //loop for each file selected for uploaded.
                    for (var i = 0; i < element.files.length; i++) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
//                            $("<img />", {
//                                "src": e.target.result,
//                                "class": "thumb-image"
//                            }).appendTo(image_holder);
                            $('<span class="upattach"><i class="ion-paperclip"></i></span>').appendTo(image_holder);
                        }
                        image_holder.show();
                        reader.readAsDataURL(element.files[0]);
                    }
                }
            };

            $scope.getEnd = function () {
                //console.log(stdt + " === " + $scope.nodays + " === " + endDate);
                var noDays = $('#dietdays').val();
                var startDate = $filter('date')(($('#diet-start').val()), 'yyyy-MM-dd');
                var enDate = getDayAfter(startDate, noDays);
                console.log(startDate + " === " + noDays + " === " + enDate);
                console.log($filter('date')(enDate, 'yyyy-MM-dd'));
                $('#diet-end').val($filter('date')(enDate, 'yyyy-MM-dd'));
            };

            $ionicModal.fromTemplateUrl('mealdetails', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.daymodal = function (day) {
                    console.log('Index = ' + day + ' day' + (day - 1));
                    $scope.day = 'day' + (day - 1);
                    $scope.modal.show();
                };

            });
            $scope.dietdetails = function (days) {
                console.log(days);
                $scope.dayMeal = [];
                for (var i = 1, j = 1; i <= days; i++, j++) {
                    $scope.mealDetails['day' + (i - 1)] = [{time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}];
                    $scope.dayMeal.push(i);
                    console.log(JSON.stringify($scope.mealDetails['day' + (i - 1)]));
                    console.log((i - 1));
                    //jQuery('#day' + (i - 1)).val(JSON.stringify($scope.mealDetails['day' + (i - 1)]));
                }
                console.log($scope.mealDetails);
                var stdt = $('#diet-start').val();
                var endDate = getDayAfter(stdt, days);
                console.log(endDate);
                $('#diet-end').val($filter('date')(endDate, 'yyyy-MM-dd'));
            };
            $scope.saveMeal = function (day) {
                console.log(day);
                //console.log('Is empty object ' + checkIsMealEmpty($scope.mealDetails[day]));
                if (checkIsMealEmpty($scope.mealDetails[day]) == 'not empty') {
                    console.log('Has value');
                    jQuery('#' + day).val(JSON.stringify($scope.mealDetails[day]));
                    jQuery('#fill' + day.charAt(day.length - 1)).removeClass('filled-data').addClass('filldata');
                } else {
                    console.log('Empty');
                }
                //console.log(JSON.stringify($scope.mealDetails[day]));
                $scope.modal.hide();
            };

            $scope.submitmodal = function () {
                $scope.modal.hide();
                $scope.mealDetails[($scope.day - 1)] = [{time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}];
            };
        })

        .controller('EditRecordCtrl', function ($scope, $http, $state, $stateParams, $sce) {
            $scope.fields = [];
            $http({
                method: 'GET',
                url: domain + 'records/add',
                params: {id: $stateParams.cat}
            }).then(function successCallback(response) {
                $scope.fields.push($sce.trustAsHtml("<input type='hidden' ng-model='record.recordId' value='" + $stateParams.id + "' name='recordId' /><input type='hidden' ng-model='record.recordCat' value='" + $stateParams.cat + "' name='recordCat' />"));
                angular.forEach(response.data, function (value, key) {
                    $scope.fields.push($sce.trustAsHtml(createElement(value)));
                });
                $http({
                    method: "GET",
                    url: domain + "records/get-record-value",
                    params: {id: $stateParams.id}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    angular.forEach(response.data, function (value, key) {
                        modelname = value.field_id;
                        if (!$scope.$$phase) {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    //wrapped this within $apply
                                    $scope.modelname = value.value;
                                    console.log('message:' + $scope.modelname);
                                });
                            }, 0);
                        }
                    });
                }, function errorCallback(e) {
                    console.log(e.responseText);
                });
            }, function errorCallback(response) {
                console.log(response);
            });
        })

        .controller('RecordsViewCtrl', function ($scope, $http, $state, $stateParams, $sce, $rootScope, $ionicLoading, $cordovaPrinter, $ionicModal, $timeout) {
            $scope.interface = window.localStorage.getItem('interface_id');
            unset(['patientId', 'doctorId', 'recId']);
            $scope.userId = get('doctorid');
            $scope.create = get('create');
            unset(['create']);
            $scope.category = [];
            $scope.catId = $stateParams.id;
            $scope.shared = $stateParams.shared;
            $scope.limit = 3;
            $scope.recId = [];
            $scope.recIds = [];
            $scope.orderRec = 0;
            $scope.userId = get('doctorid');
            $scope.patientId = get('id');
            $scope.repeatFreq = [];
            $scope.repeatNo = [];
            $ionicLoading.show({template: 'Loading...'});
            jQuery(".ordercart").hide();
        
            $http({
                    method: 'GET',
                    url: domain + 'get-pharmacy-allow',
                    params: {record_id: $stateParams.id,interface_id: $scope.interface}
                }).then(function successCallback(response) {                    
                    if(2575 == window.localStorage.getItem('id') && response.data == 1){                        
                        jQuery(".ordercart").show();
                    }else{
                        jQuery(".ordercart").hide();
                    }
                });                
          
            $http({
                method: 'GET',
                url: domain + 'records/get-records-details',
                params: {id: $stateParams.id, userId: $scope.userId, patientId: $scope.patientId, interface: $scope.interface, shared: $scope.shared}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.records = response.data.records;
                if ($scope.records.length != 0) {
                    if ($scope.records[0].record_metadata.length == 6) {
                        $scope.limit = 3; //$scope.records[0].record_metadata.length;
                    }
                    angular.forEach($scope.records, function (value, key) {
                        //console.log(key);
                        angular.forEach(value.record_metadata, function (val, k) {
                            console.log();
                            if ($scope.catId == 30) {
                                if (val.field_id == 'no-of-frequency') {
                                    $scope.repeatFreq[key] = val.value;
                                }
                                if (val.field_id == 'no-of-times') {
                                    $scope.repeatNo[key] = val.value;
                                }
                            }
                            if ($scope.catId == 3) {
                                if (val.field_id == 'no-of-frequency-1') {
                                    $scope.repeatFreq[key] = val.value;
                                }
                            }
                        });
                    });
                }
                $scope.createdby = response.data.createdby;
                $scope.category = response.data.category;
                $scope.doctors = response.data.doctors;
                $scope.patient = response.data.patient;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.shareDoctrs;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });

            $scope.doRefresh = function () {
                $http({
                    method: 'GET',
                    url: domain + 'records/get-records-details',
                    params: {id: $stateParams.id, userId: $scope.userId, patientId: $scope.patientId, interface: $scope.interface, shared: $scope.shared}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.records = response.data.records;
                    if ($scope.records.length != 0) {
                        if ($scope.records[0].record_metadata.length == 6) {
                            $scope.limit = 3; //$scope.records[0].record_metadata.length;
                        }
                        angular.forEach($scope.records, function (value, key) {
                            //console.log(key);
                            angular.forEach(value.record_metadata, function (val, k) {
                                console.log();
                                if ($scope.catId == 30) {
                                    if (val.field_id == 'no-of-frequency') {
                                        $scope.repeatFreq[key] = val.value;
                                    }
                                    if (val.field_id == 'no-of-times') {
                                        $scope.repeatNo[key] = val.value;
                                    }
                                }
                                if ($scope.catId == 3) {
                                    if (val.field_id == 'no-of-frequency-1') {
                                        $scope.repeatFreq[key] = val.value;
                                    }
                                }
                            });
                        });
                    }
                    $scope.createdby = response.data.createdby;
                    $scope.category = response.data.category;
                    $scope.doctors = response.data.doctors;
                    $scope.patient = response.data.patient;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.shareDoctrs;
                    $scope.langtext = response.data.langtext;
                    $scope.language = response.data.lang.language;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                }, function errorCallback(response) {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }
            $scope.getRecords = function (cat) {
                console.log(cat);
                $scope.catId = cat;
                //$stateParams.id = cat;
                $http({
                    method: 'GET',
                    url: domain + 'records/get-records-details',
                    params: {id: cat, userId: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.records = response.data.records;
                    if ($scope.records.length != 0) {
                        if ($scope.records[0].record_metadata.length == 6) {
                            $scope.limit = 3; //$scope.records[0].record_metadata.length;
                        }
                    }
                    $scope.doctrs = response.data.shareDoctrs;
                    //$scope.category = response.data.category;
                    console.log($scope.catId);
                }, function errorCallback(response) {
                    console.log(response);
                });
                $rootScope.$digest;
            };
            $scope.addRecord = function () {
                $state.go('app.add-category', {'id': button.id}, {reload: true});
            };
            //Delete Records by Category
            $scope.getRecIds = function (id) {
                console.log(id);
                if ($scope.recId[id]) {
                    $scope.recIds.push(id);
                } else {
                    var index = $scope.recIds.indexOf(id);
                    $scope.recIds.splice(index, 1);
                }
                console.log($scope.recIds);

            };
            $scope.selectradio = function (id){
                $scope.orderRec = id;
                console.log($scope.orderRec);
            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //place an order
            $scope.confirmOrder = function (){
                if(confirm('You Sure you want to place this order?')){
                    console.log('place order for: ' + $scope.orderRec);
                    console.log('going to accept comments page');
                    $http({
                            method: 'GET',
                            url: domain + 'records/check-attachment',
                            params: {record: $scope.orderRec, user: window.localStorage.getItem('id'), interface_id: $scope.interface}
                        }).then(function successCallback(response) {   
                            alert(response.data.message); 
                            console.log('status: ' + response.data.status);                
                            if(response.data.status == "1"){

                                $state.go('app.order-comments', {'recordId': $scope.orderRec}, {reload: true});
                                console.log('hello');
                            }
                        });   
                    
                }else{
                    console.log('didnt confirm');
                }
            }
            //Delete all Records by category
            $scope.delete = function () {
                if ($scope.recIds.length > 0) {
                    var confirm = window.confirm("Do you really want to delete?");
                    if (confirm) {
                        console.log($scope.recIds);
                        $http({
                            method: 'POST',
                            url: domain + 'records/delete-by-category',
                            params: {ids: JSON.stringify($scope.recIds), userId: $scope.userId, shared: $scope.shared}
                        }).then(function successCallback(response) {
                            alert("Records deleted successfully!");
                            window.location.reload();
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    }
                } else {
                    alert("Please select records to delete!");
                }
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.recIds.length > 0) {
                    if ($scope.docId != '') {
                        var confirm = window.confirm("Do you really want to share?");
                        if (confirm) {
                            console.log($scope.recIds);
                            $http({
                                method: 'POST',
                                url: domain + 'records/share-by-category',
                                params: {ids: JSON.stringify($scope.recIds), userId: $scope.userId, docId: $scope.docId, shared: $scope.shared}
                            }).then(function successCallback(response) {
                                console.log(response);
                                if (response.data == 'Success') {
                                    alert("Records shared successfully!");
                                    //window.location.reload();
                                    $scope.submitmodal();
                                    $scope.CancelAction();
                                }
                            }, function errorCallback(e) {
                                console.log(e);
                            });
                        } else {
                            $scope.submitmodal();
                            $scope.CancelAction();
                        }
                    } else {
                        alert("Please select doctor to share with!");
                    }
                } else {
                    alert("Please select records to share!");
                }
            };
            // Delete and share buttons hide show
            $scope.recordDelete = function () {
                jQuery('.selectrecord').css('display', 'block');
                jQuery('.btview').css('display', 'none');
                jQuery('#rec1').css('display', 'none');
                jQuery('#rec3').css('display', 'block');

            };
            $scope.placeOrder = function (){
                jQuery('.radiorecord').css('display', 'block');
                jQuery('.btview').css('display', 'none');
                jQuery('#rec1').css('display', 'none');
                jQuery('#rec4').css('display', 'block');
            };
            $scope.recordShare = function () {
                jQuery('.selectrecord').css('display', 'block');
                jQuery('.btview').css('display', 'none');
                jQuery('#rec1').css('display', 'none');
                jQuery('#rec2').css('display', 'block');
            };
            $scope.CancelAction = function () {
                jQuery('.selectrecord').css('display', 'none');
                jQuery('.radiorecord').css('display', 'none');
                jQuery('.btview').css('display', 'block');
                jQuery('#rec1').css('display', 'block');
                jQuery('#rec2').css('display', 'none');
                jQuery('#rec3').css('display', 'none');
                jQuery('#rec4').css('display', 'none');
            };
            $scope.selectcheckbox = function ($event) {
                console.log($event);
                // if($event==true){
                // jQuery(this).addClass('asd123');
                // }
            };
            //Show share model
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();

            };

            $scope.print = function () {
                //  console.log("fsfdfsfd");
                //  var printerAvail = $cordovaPrinter.isAvailable();
                var print_page = '<img src="http://stage.doctrs.in/public/frontend/uploads/attachments/7V7Lr1456500103323.jpg"  height="600" width="300" />';
                //console.log(print_page);  
                cordova.plugins.printer.print(print_page, 'alpha', function () {
                    alert('printing finished or canceled');
                });
            };

            $scope.path = "";
            $scope.name = "";
            $ionicModal.fromTemplateUrl('filesview.html', function ($ionicModal) {
                $scope.fileModal = $ionicModal;
                $scope.showm = function (ahost, path, name) {
                    $scope.path = path;
                    $scope.name = name;
                    console.log(path + '=afd =' + name);
                    $scope.value = ahost + path + name;
                    $scope.fileModal.show();
                };
                $scope.closeModal = function () {
                    $scope.fileModal.hide();
                };

            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };


            //View details
            $scope.viewDetails = function (recId, appId, userId, patientId, doctorId) {
                console.log("RecId ==" + recId + "App Id ==" + appId + "== Cat" + $scope.catId + "User Id " + userId + "Patient -" + patientId + " doc - " + doctorId);
                if ($scope.userId != userId && $scope.catId == '8') {
                    store({'backurl': 'records-view', 'patientId': patientId, 'doctorId': doctorId,'create':$scope.create});
                    $state.go('app.preview-note', {'id': recId, 'appId': appId, 'res': 'json'}, {reload: true});
                } else{
                    store({'create':$scope.create});
                    $state.go('app.record-details', {'id': recId, 'shared': $scope.shared, 'res': 'json'}, {reload: true});
                }
            };
        })

        .controller('ConfirmedOrderCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading) {
            $scope.hours = 1;
            console.log($stateParams);
            $scope.orderId = $stateParams.orderId;
            jQuery("#orderid").html($stateParams.orderId);
            $scope.gotohome = function(){
                $state.go('app.category-detail');
            }
        })

        .controller('OrderCommentsCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.recordId = $stateParams.recordId;            
            $scope.ordercomments = "enter comments here";
            $scope.create ={};


            $scope.gotoAddress = function(){
                console.log('placing order for: '+ $scope.recordId);
                $scope.create['record'] = $scope.recordId
                $scope.create['user'] = window.localStorage.getItem('id');
                $scope.create['interface_id'] = $scope.interface;
                $scope.create['comments'] = jQuery("#ordercomments").val();
                console.log($scope.create);
                console.log(JSON.stringify($scope.create));
                $state.go('app.user-addresses', {'order': $scope.create});                    
            }
        })
        .controller('UserAddressesCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading) {
            $scope.order = $stateParams.order; 
            $scope.addressId = "o";
            $scope.addresses ={};           
            

            $scope.addressSelected = function(val){
                $scope.addressId =val;
                console.log($scope.addressId);
            }

            $http({
                    method: "GET",
                    url: domain + "get-user-address",
                    params: {user: $scope.order.user}
                }).then(function successCallback(response) {
                    $scope.addresses = response.data;
                    console.log(response.data);
                });

            $scope.addnewaddress = function(){
                $state.go('app.user-address-create',{'order': $scope.order});
            }

            $scope.confirmOrder = function(){
                if($scope.addressId != "o"){
                    $scope.order['addressId'] = $scope.addressId;
                    console.log('placing order');
                    console.log($scope.order);
                    
                    $http({
                            method: 'POST',
                            url: domain + 'placeOrder',
                            data: JSON.stringify($scope.order)
                        }).then(function successCallback(response) {   
                            alert(response.data.message);                 
                            console.log(response.data);
                            if(response.data.status == 1){
                                $state.go('app.confirmed-order', {'id': response.data.request_master_id, 'orderId': response.data.orderId});
                            }
                            
                        });
                }else{
                    alert('please select an address');
                }
                    
            }
                
        })

        .controller('UserAddressesCreateCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading) {
            $scope.order = $stateParams.order;
            console.log('order');
            console.log($scope.order);

            $scope.pincodes = {};
            $http({
                    method: "GET",
                    url: domain + "get-pincodes",
                    params: {}
                }).then(function successCallback(response) {
                    $scope.pincodes = response.data;
                    console.log(response.data);
                });

            $scope.createaddress= {};
            $scope.createaddress['user'] = window.localStorage.getItem('id');
            $scope.createaddress['line1'] = "";
            $scope.createaddress['street'] = "";
            $scope.createaddress['locality'] = "";
            $scope.createaddress['city'] = "";
            $scope.createaddress['pin'] = "";
            $scope.createaddress['default'] = 0;

            $scope.submit = function(){
                console.log(JSON.stringify($scope.createaddress));
                $http({
                            method: 'POST',
                            url: domain + 'addAddress',
                            data: JSON.stringify($scope.createaddress)
                        }).then(function successCallback(response) {   
                            alert(response.data);                 
                            $state.go('app.user-addresses', {'order': $scope.order});
                            
                        });
            }

        })

        .controller('PreviewConsultationsNoteCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading) {
            $scope.appId = $stateParams.appId;
            $scope.recId = $stateParams.id;
            store({'recId': $scope.recId});
            $scope.pcaseId = '';
            $scope.prescription = 'No';
            $scope.testResult = {};
            $scope.objText = {};
            $scope.diaText = {};
            $ionicLoading.show({template: 'Loading...'});
            $scope.patientId = get('patientId');
            $scope.doctorId = get('doctorId');
            if ($scope.appId != 0) {
                $http({
                    method: "GET",
                    url: domain + "doctrsrecords/get-app-details",
                    params: {appId: $scope.appId}
                }).then(function successCallback(response) {
                    //console.log(response.data.patient.id);
                    $scope.patientId = response.data.patient.id;
                    $scope.doctorId = response.data.doctr.id
                    $scope.app = response.data.app;
                    $scope.patient = response.data.patient;
                    $scope.prevRecord = response.data.record;
                    $scope.prevRecordDetails = response.data.recordDetails;
                    if (response.data.record != null) {
                        $scope.precId = response.data.record.id;
                        $scope.recId = response.data.record.id;
                    }
                    store({'patientId': $scope.patientId, 'doctorId': $scope.doctorId, 'recId': $scope.recId});
                    if ($scope.prevRecordDetails.length > 0) {
                        angular.forEach($scope.prevRecordDetails, function (val, key) {
                            if (val.fields.field == 'Case Id') {
                                $scope.pcaseId = val.value;
                            }
                            if (val.fields.field == 'Attachments') {
                                $scope.isAttachment = val.attachments.length;
                            }
                            if (val.fields.field == 'Includes Prescription') {
                                $scope.prescription = val.value;
                                if (val.value == 'Yes') {
                                    //jQuery('#convalid').removeClass('hide');
                                }
                            }
                            if (val.fields.field == 'Valid till') {
                                $scope.validTill = $filter('date')(new Date(val.value), 'dd-MM-yyyy');
                            }

                        });
                    }
                    if (response.data.app.mode == 1) {
                        $scope.mode = 'Video';
                    } else if (response.data.app.mode == 2) {
                        $scope.mode = 'Chat';
                    } else if (response.data.app.mode = 3) {
                        $scope.mode = 'Clinic'
                    } else if (response.data.app.mode == 4) {
                        $scope.mode = 'Home';
                    }
                    jQuery('#convalid').addClass('hide');
                    //console.log($scope.mode);
                    $scope.conDate = $filter('date')(new Date(response.data.app.scheduled_start_time), 'dd-MM-yyyy'); //response.data.app.scheduled_start_time; //$filter('date')(new Date(), 'MM-dd-yyyy');
                    $scope.curTimeo = $filter('date')(new Date(response.data.app.scheduled_start_time), 'hh:mm a');
                    //console.log($scope.conDate);
                    $http({
                        method: 'GET',
                        url: domain + 'doctrsrecords/get-fields',
                        params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        $scope.record = response.data.record;
                        $scope.fields = response.data.fields;
                        $scope.problems = response.data.problems;
                        $scope.doctrs = response.data.doctrs;
                        $scope.patients = response.data.patients;
                        $scope.cases = response.data.cases;
                        $rootScope.$emit("GetPatientDetails", {});
                        $rootScope.$emit("GetFamilyDetails", {});
                        $scope.getEvaluationDetails();
                        $ionicLoading.hide();
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }, function errorCallback(e) {
                    console.log(e);
                });
            } else {
                console.log("App zero");
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-fields',
                    params: {patient: $scope.patientId, doctorId: $scope.doctorId, userId: $scope.userId, recId: $stateParams.id, catId: $scope.catId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.record = response.data.record;
                    $scope.fields = response.data.fields;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.doctrs;
                    $scope.patients = response.data.patients;
                    $scope.cases = response.data.cases;
                    $scope.records = response.data.recordData;
                    $scope.patientId = $scope.records.for;
                    $scope.doctorId = $scope.records.doctor_id;
                    $scope.app = $scope.records.appointment_id;
                    //store({'patientId': $scope.patientId, 'doctorId': $scope.records.doctor_id});
                    store({'patientId': $scope.patientId, 'doctorId': $scope.records.doctor_id, 'recId': $scope.recId});
                    $scope.prevRecordDetails = response.data.recordDetails;
                    if (response.data.recordDetails.length > 0) {
                        //store({'precId': response.data.recordData.id});
                        angular.forEach(response.data.recordDetails, function (val, key) {
                            if (val.fields.field == 'Case Id') {
                                $scope.casetype = '0';
                                $scope.caseId = val.value;
                                $scope.pcaseId = val.value;
                                //$scope.getCase($scope.casetype);
                            }
                            if (val.fields.field == 'Attachments') {
                                console.log("Attach length " + val.attachments.length);
                                $scope.isAttachment = val.attachments.length;
                                if (val.attachments.length > 0) {
                                    jQuery('#coninprec').removeClass('hide');
                                }
                            }
                            if (val.fields.field == 'Includes Prescription') {
                                $scope.prescription = val.value;
                                if (val.value == 'Yes') {
                                    jQuery('#convalid').removeClass('hide');
                                }
                            }
                            if (val.fields.field == 'Valid till') {
                                $scope.validTill = $filter('date')(new Date(val.value), 'dd-MM-yyyy');
                            }
                            if (val.fields.field == 'Consultation Date') {
                                // $scope.conDate = $filter('date')(new Date(val.value), 'dd-MM-yyyy');
                            }
                            if (val.fields.field == 'Consultation Time') {
                                // $scope.curTimeo = $filter('date')(new Date(val.value), 'hh:mm a');
                            }
                            if (val.fields.field == 'Patient Type') {
                                $scope.pType = val.value;
                            }
                            if (val.fields.field == 'Mode') {
                                $scope.mode = val.value;
                            }
                        });
                    } else {
                        $scope.pType = 'Outpatient';
                        //$scope.conDate = new Date(); //$filter('date')(new Date(), 'dd-MM-yyyy'); //response.data.app.scheduled_start_time; //$filter('date')(new Date(), 'MM-dd-yyyy');
                        //$scope.curTimeo = $filter('date')(new Date(), 'hh:mm a');
                    }
                    $ionicLoading.hide();
                    $scope.getEvaluationDetails();
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
            $ionicModal.fromTemplateUrl('filesview.html', function ($ionicModal) {
                $scope.modal = $ionicModal;
                $scope.showAttach = function (recDetails) {
                    //console.log(path + "=====" + name);
                    $scope.cnAttachments = recDetails;
                    $scope.modal.show();
                };
            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
            $ionicModal.fromTemplateUrl('singlefileview', {
                scope: $scope
            }).then(function (modal) {
                $scope.filemodal = modal;
                $scope.showRecAttach = function (ahost, apath, aname) {
                    //alert(apath + "======" + aname); domain + 'public'
                    $scope.attachValue = ahost + apath + aname;
                    //$('#recattach').modal('show');
                    $scope.filemodal.show();
                };
            });
            /* new added */
            $scope.shownext = function (bd, ab) {
                jQuery('#' + bd).hide();
                jQuery('#' + ab).show();
                jQuery('.headtab span').removeClass('active');
                jQuery('.headtab span[rel="' + ab + '"]').addClass('active');
            };
            $scope.accordiantab = function (pq) {
                //jQuery('#'+pq).toggleClass('active');
                jQuery('#' + pq).slideToggle();
                // jQuery(this).toggleClass('active');
            };
            $scope.tabclick = function (taburl) {
                console.log(taburl);
                if (taburl == 'tabtwo') {
                    $rootScope.$emit("GetMeasurements", {});
                } else if (taburl == 'tabthree') {
                    $rootScope.$emit("getInvestigations", {});
                    $rootScope.$emit("getMedications", {});
                    $rootScope.$emit("getProcedures", {});
                    $rootScope.$emit("getLifestyle", {});
                    $rootScope.$emit("getReferral", {});
                    $rootScope.$emit("GetDietPlan", {});

                }
                jQuery('.notetab').hide();
                jQuery('#' + taburl).show();
                jQuery('.headtab span').removeClass('active');
                jQuery('.tab-buttons .tbtn').removeClass('active');
                jQuery('.headtab span[rel="' + taburl + '"]').addClass('active');
                jQuery('.tab-buttons .tbtn[rel="' + taburl + '"]').addClass('active');
            };
            $scope.gotopage = function (glink) {
                $state.go(glink);
            };
            $scope.goto = function () {
                var backurl = get('backurl');
                unset(['backurl', 'recId', 'patientId', 'doctorId']);
                if (backurl == 'records-view') {
                    $state.go('app.records-view', {'id': 8, 'shared': 1}, {reload: true});
                } else if (backurl == 'consultations-current') {
                    $state.go('app.consultations-current', {}, {reload: true});
                } else if (backurl == 'consultations-past') {
                    $state.go('app.consultations-past', {}, {reload: true});
                }
            };
            /* New Added */
            $scope.intext = 'more';
            $scope.infomore = function (r, type) {
                console.log(r + " more =>  type => " + type);
                jQuery('#' + r).toggleClass('active');
                if (jQuery('#' + r).hasClass('active')) {
                    if (type == 'inv')
                        jQuery('#' + r + 't').html('Less');
                    else if (type == 'medi')
                        jQuery('#' + r + 'm').html('Less');
                    else if (type == 'proc')
                        jQuery('#' + r + 'p').html('Less');
                    else if (type == 'life')
                        jQuery('#' + r + 'l').html('Less');
                    else if (type == 'ref')
                        jQuery('#' + r + 'r').html('Less');
                    else if (type == 'diet')
                        jQuery('#' + r + 'd').html('Less');
                } else {
                    if (type == 'inv')
                        jQuery('#' + r + 't').html('More');
                    else if (type == 'medi')
                        jQuery('#' + r + 'm').html('More');
                    else if (type == 'proc')
                        jQuery('#' + r + 'p').html('More');
                    else if (type == 'life')
                        jQuery('#' + r + 'l').html('More');
                    else if (type == 'ref')
                        jQuery('#' + r + 'r').html('More');
                    else if (type == 'diet')
                        jQuery('#' + r + 'd').html('More');
                }

            };
            $scope.getEvaluationDetails = function () {
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-testresult-lang',
                    params: {userId: $scope.userId, objId: $scope.testId, recId: $scope.recId}
                }).then(function successCallback(response) {
                    if (response.data.recdata != '') {
                        $scope.testId = response.data.recdata.record_id;
                        $scope.testresult = response.data.recdata;
                        $scope.testResult = response.data.recdata.metadata_values;
                    } else {
                        $scope.testResult = '';
                    }
                }, function errorCallback(e) {
                    console.log(e);
                });
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-observations-lang',
                    params: {userId: $scope.userId, interface: $scope.interface, objId: $scope.objId, recId: $scope.recId}
                }).then(function successCallback(response) {
                    if (response.data.recdata != '') {
                        $scope.objId = response.data.recdata.record_id;
                        $scope.observation = response.data.recdata;
                        $scope.objText = response.data.recdata.metadata_values;
                    } else {
                        $scope.objText = '';
                    }
                }, function errorCallback(e) {
                    console.log(e);
                });
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-diagnosis-lang',
                    params: {userId: $scope.userId, diaId: $scope.diaId, recId: $scope.recId}
                }).then(function successCallback(response) {
                    if (response.data.recdata != '') {
                        $scope.diaId = response.data.recdata.record_id;
                        $scope.diaText = response.data.recdata;
                        console.log("Dia length " + $scope.diaText.length);
                        $scope.diaText.value = response.data.recdata.value;
                    } else {
                        $scope.diaText.value = '';
                    }
                    console.log("Dia length " + $scope.diaText);
                }, function errorCallback(e) {
                    console.log(e);
                });
                $ionicLoading.hide();
            };
        })

        .controller('FamilyHistoryCtrl', function ($scope, $http, $state, $ionicModal, $ionicLoading, $rootScope, $timeout) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.catId = 'Family History';
            $scope.conId = [];
            $scope.conIds = [];
            $scope.famHist = [];
            $rootScope.famHist = [];
            $scope.selConditions = [];
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-family-history',
                params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId}
            }).then(function successCallback(response) {
                $scope.record = response.data.record;
                $scope.recorddata = response.data.recorddata;
                $scope.knConditions = response.data.recConditions;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patients;
                $scope.cases = response.data.cases;
                $scope.abt = response.data.abt;
                $scope.conditions = response.data.conditions;
                $scope.selCondition = response.data.knConditions;
                $scope.familyhistory = response.data.familyhistory;
//                if ($scope.selCondition.length > 0) {
//                    angular.forEach($scope.selCondition, function (val, key) {
//                        $scope.conIds.push(val.id);
//                        $scope.selConditions.push({'condition': val.condition});
//                    });
//                }
            }, function errorCallback(response) {
                console.log(response);
            });
//            $ionicModal.fromTemplateUrl('addrelation', {
//                scope: $scope
//            }).then(function (modal) {
//                $scope.conIds = [];
//                $scope.modal = modal;
//            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
            $rootScope.$on("GetFamilyDetails", function () {
                $scope.getFamHistory();
            });
            $scope.getFamHistory = function () {
                $scope.patientId = get('patientId');
                $scope.doctorId = get('doctorId');
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-family-history',
                    params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId}
                }).then(function successCallback(response) {
                    $scope.record = response.data.record;
                    $scope.recorddata = response.data.recorddata;
                    $scope.knConditions = response.data.recConditions;
                    $scope.fields = response.data.fields;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.doctrs;
                    $scope.patients = response.data.patients;
                    $scope.cases = response.data.cases;
                    $scope.abt = response.data.abt;
                    $scope.conditions = response.data.conditions;
                    $scope.selCondition = response.data.knConditions;
                    $scope.familyhistory = response.data.familyhistory;
//                    if ($scope.selCondition.length > 0) {
//                        angular.forEach($scope.selCondition, function (val, key) {
//                            $scope.conIds.push(val.id);
//                            $scope.selConditions.push({'condition': val.condition});
//                        });
//                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.getCondition = function (id, con) {
                console.log(id + "==" + con);
                var con = con.toString();
                if ($scope.conId[id]) {
                    $scope.conIds.push(id);
                    $scope.selConditions.push({'condition': con});
                } else {
                    var index = $scope.conIds.indexOf(id);
                    $scope.conIds.splice(index, 1);
                    for (var i = $scope.selConditions.length - 1; i >= 0; i--) {
                        if ($scope.selConditions[i].condition == con) {
                            $scope.selConditions.splice(i, 1);
                        }
                    }
                }
                jQuery("#selconFam").val($scope.conIds);
                console.log($scope.selConditions);
                console.log($scope.conIds);
            };
            $scope.saveFamilyHistory = function () {
                if ($rootScope.patientId) {
                    $scope.patientId = $rootScope.patientId;
                }
                jQuery('#patientId').val($scope.patientId);
                //alert('dsfsdf');
                $ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addFamilyForm")[0]);
                // alert(data);
                console.log(data);
                callAjax("POST", domain + "doctrsrecords/save-family-history", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (angular.isObject(response.records)) {
                        alert("Family History saved successfully!");
                        jQuery("#addFamilyForm")[0].reset();
                        $scope.famHist.push(response.records.id);
                        $rootScope.famHist = $scope.famHist;
                        $scope.getFamHistory();
                        // $state.go('app.notetype',{reload: true});
                        $scope.modal.hide();
                        //$state.go('app.family-history', {}, {reload: true});
                        ////window.location.reload();
                        //$state.go('app.consultations-note', {'appId': $scope.appId}, {reload: true});
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
            };
            $scope.showfamilyknown = function () {
                jQuery('#tfamilyhistory').slideToggle("slow", function () { })
                jQuery("#addFamilyForm")[0].reset();
            };
            $scope.hidefamilyknown = function () {
                jQuery('.toggleslidediv').hide();
            };
            $scope.saveFamilyHist = function () {
                jQuery('#patientId').val($scope.patientId);
                var data = new FormData(jQuery("#addFamilyForm")[0]);
                callAjax("POST", domain + "doctrsrecords/save-family-history", data, function (response) {
                    $scope.loading = false;
                    if (response.err == '') {
                        $rootScope.famHist.unshift(response.records.id);
                        $rootScope.$emit("GetFamilyDetails", {});
                        //  jQuery('#tfamilyhistory').slideToggle("slow", function () { })
                        jQuery('#tfamilyhistory').removeClass('active');
                        jQuery("#addFamilyForm")[0].reset();
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
                $timeout(function () {
                    $scope.familyknwcontion = false;
                    $scope.addless = '+ Add';
                }, 2000);
//        } else {
//            alert('Please fill mandatory fields');
//        }
            };
        })

        .controller('PatientHistoryCtrl', function ($scope, $http, $stateParams, $state, $rootScope, $ionicModal, $timeout, $filter, $cordovaCamera, $ionicLoading) {
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId'); //$stateParams.drId
            $scope.catId = 'Patient History';
            $scope.conId = [];
            $scope.conIds = [];
            $scope.gender = '';
            $scope.gend = '';
            $scope.selConditions = [];
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm a');
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-about-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.record = response.data.record;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patients;
                $scope.cases = response.data.cases;
                $scope.abt = response.data.abt;
                $scope.dob = new Date(response.data.dob);
                //$scope.dob = $filter('date')(response.data.dob, 'MM dd yyyy');
                if ($scope.abt.length > 0) {
                    angular.forEach($scope.abt, function (val, key) {
                        console.log(val.fields.field + "==" + val.value);
                        var field = val.fields.field;
                        if (field.toString() == 'Gender') {
                            console.log(field);
                            $scope.gender = val.value;
                            console.log(val.value);
                            if (val.value == 1) {
                                $scope.gender = 'Male';
                            } else if (val.value == 2) {
                                $scope.gender = 'Female';
                            }
                        }
                    });
                }
                console.log($scope.gender);
                $scope.selCondition = response.data.knConditions;
                if ($scope.selCondition.length > 0) {
                    angular.forEach($scope.selCondition, function (val, key) {
                        $scope.conIds.push(val.id);
                        $scope.selConditions.push({'condition': val.condition});
                    });
                }
                $scope.conditions = response.data.conditions;
                console.log($scope.conIds);
            }, function errorCallback(response) {
                console.log(response);
            });
            $rootScope.$on("GetPatientDetails", function () {
                $scope.getPatDetails();
            });
            $rootScope.$on("SavePatient", function (pid) {
                $scope.savePatientHistory();
            });
            $scope.getPatDetails = function () {
                $scope.patientId = get('patientId');
                $scope.doctorId = get('doctorId');
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-about-fields',
                    params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.record = response.data.record;
                    $scope.fields = response.data.fields;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.doctrs;
                    $scope.patients = response.data.patients;
                    $scope.cases = response.data.cases;
                    $scope.abt = response.data.abt;
                    $scope.dob = new Date(response.data.dob);
                    //$scope.dob = $filter('date')(response.data.dob, 'MM dd yyyy');
                    if ($scope.abt.length > 0) {
                        angular.forEach($scope.abt, function (val, key) {
                            console.log(val.fields.field + "==" + val.value);
                            var field = val.fields.field;
                            if (field.toString() == 'Gender') {
                                console.log(field);
                                $scope.gender = val.value;
                                console.log(val.value);
                                if (val.value == 1) {
                                    $scope.gender = 'Male';
                                } else if (val.value == 2) {
                                    $scope.gender = 'Female';
                                }
                            }
                        });
                    } else {
                        if (response.data.patients[0].gender == 1) {
                            $scope.gender = 'Male';
                        } else if (response.data.patients[0].gender == 2) {
                            $scope.gender = 'Female';
                        }
                    }
                    console.log($scope.gender);
                    $scope.selCondition = response.data.knConditions;
                    if ($scope.selCondition.length > 0) {
                        angular.forEach($scope.selCondition, function (val, key) {
                            $scope.conIds.push(val.id);
                            $scope.selConditions.push({'condition': val.condition});
                        });
                    }
                    $scope.conditions = response.data.conditions;
                    console.log($scope.conIds);
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.gotopage = function (glink) {
                $state.go(glink);
            };
            $scope.getCondition = function (id, con) {
                console.log(id + "==" + con);
                var con = con.toString();
                if ($scope.conId[id]) {
                    $scope.conIds.push(id);
                    $scope.selConditions.push({'condition': con});
                } else {
                    var index = $scope.conIds.indexOf(id);
                    $scope.conIds.splice(index, 1);
                    for (var i = $scope.selConditions.length - 1; i >= 0; i--) {
                        if ($scope.selConditions[i].condition == con) {
                            $scope.selConditions.splice(i, 1);
                        }
                    }
                }
                jQuery("#selcon").val($scope.conIds);
                console.log($scope.selConditions);
            };
            $scope.getCheck = function (gen) {
                console.log(gen);
            };
            $scope.getPreCon = function (conId) {
                if ($scope.conIds.indexOf(conId) != -1)
                    return 1;
                else
                    return 0;
//                for (var i = $scope.selConditions.length - 1; i >= 0; i--) {
//                    if($scope.conIds.indexOf(conId)!= -1)
//                        return 1;
//                    else return 0;
//                }
            };
            //Save Patient History
            $scope.savePatientHistory = function () {
                //$ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addPatientForm")[0]);
                callAjax("POST", domain + "doctrsrecords/save-patient-history", data, function (response) {
                    console.log(response);
                    //$ionicLoading.hide();
                    if (angular.isObject(response.records)) {
                        //alert("Patient History saved successfully!");
                        //$state.go('app.consultations-note', {'appId': $scope.appId}, {}, {reload: true});
                    } else if (response.err != '') {
                        //alert('Please fill mandatory fields');
                    }
                });
            };
            //Save Patient History
            $scope.vsavePatientHistory = function () {
                $ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#adddPatientForm")[0]);
                callAjax("POST", domain + "doctrsrecords/save-patient-history", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (angular.isObject(response.records)) {
                        alert("Patient History saved successfully!");
                        console.log('remove slide');
                        jQuery('.ciframecontainer').removeClass('active');
                    } else if (response.err != '') {
                        //alert('Please fill mandatory fields');
                    }
                });
            };
        })

        .controller('MeasurementCtrl', function ($scope, $http, $stateParams, $state, $rootScope, $ionicModal, $timeout, $filter, $cordovaCamera, $ionicLoading) {
            $scope.mid = $stateParams.mid;
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.catId = 'Measurements';
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-measure-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, mid: $stateParams.mid, recId: $scope.recId}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.mrecords = response.data.record;
                $scope.mfields = response.data.fields;
                $scope.editRec = response.data.editRec;
                $scope.abt = response.data.abt;
                $scope.measurement = response.data.measurement;
                $scope.mid = response.data.mid;
                if (response.data.mid.length > 0) {
                    $scope.measure = 'yes';
                }
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.saveDMeasurements = function () {
                //$ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addMeasureForm")[0]);
                callAjax("POST", domain + "doctrsrecords/save-measurements", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (response.err == '') {
                        alert("Measurements saved successfully!");
                        $rootScope.measure = 'yes';
                        $rootScope.measurement = response.records;
                        console.log('remove slide');
                        jQuery('.ciframecontainer').removeClass('active');
                        //$state.go('app.consultations-note', {'appId': $scope.appId}, {reload: true});
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
            };
            $rootScope.$on("GetMeasurements", function () {
                $scope.getMeasurements();
            });
            $scope.getMeasurements = function () {
                console.log('Get note measures');
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-measure-fields',
                    params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, mid: '', recId: $scope.recId}
                }).then(function successCallback(response) {
                    //console.log(response);
                    $scope.mrecords = response.data.record;
                    $scope.mfields = response.data.fields;
                    $scope.editRec = response.data.editRec;
                    $scope.abt = response.data.abt;
                    $scope.measurement = response.data.measurement;
                    $scope.mid = response.data.mid;
                    if (response.data.mid.length > 0) {
                        $scope.measure = 'yes';
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('InvestigationsCtrl', function ($scope, $http, $stateParams, $ionicModal, $rootScope, $filter, $ionicLoading) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.recId = window.localStorage.getItem('recId');
            $scope.catId = 'Investigations';
            $scope.invStatus = 'To be Conducted';
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm');
            $scope.investigation = [];
            $scope.invData = [];
            $scope.inv = [];
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-investigation-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.records = response.data.record;
                $scope.fields = response.data.fields;
                $scope.category = $scope.records.id;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.investigation = response.data.prevRec;
                $scope.invData = response.data.prevData;
                angular.forEach(response.data.prevRec, function (val, key) {
                    $scope.inv.unshift(val.id);
                });
                console.log("INV ===" + $scope.investigation);
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.chkDt = function (dt) {
                console.log(dt);
                console.log($scope.curTime);
                console.log($scope.curTime < dt);
                if (!($scope.curTime < dt)) {
                    alert('End date should be greater than start date.');
                    jQuery('#enddt').val('');
                }
            };
            $scope.addOther = function (name, field, val) {
                addOther(name, field, val);
            };
            $scope.check = function (val) {
                console.log(val);
                if ($scope.category == 7) {
                    if (val) {
                        jQuery('#billStatus').val('Paid');
                        jQuery('#billmode').removeClass('hide');
                    } else {
                        jQuery('#billStatus').val('Unpaid');
                        jQuery('#billmode').addClass('hide');
                    }
                }
                if ($scope.category == 2) {
                    if (val) {
                        jQuery('#immrcvdate').val('Received');
                        jQuery('#imdtrcv').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#immrcvdate').val('To be received');
                        jQuery('#imdtrcv').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
                if ($scope.category == 4) {
                    if (val) {
                        jQuery('#proconduct').val('Conducted On');
                        jQuery('#proconon').removeClass('hide');
                        jQuery('#proconbef').addClass('hide');
                    } else {
                        jQuery('#proconduct').val('To be conducted');
                        jQuery('#proconon').addClass('hide');
                        jQuery('#proconbef').removeClass('hide');
                    }
                }
                if ($scope.category == 5) {
                    if (val) {
                        jQuery('#invconduct').val('Conducted On');
                        jQuery('#invconon').removeClass('hide');
                        jQuery('.inv').removeClass('hide');
                        jQuery('#invconbef').addClass('hide');
                    } else {
                        jQuery('#invconduct').val('To be conducted');
                        jQuery('#invconon').addClass('hide');
                        jQuery('.inv').addClass('hide');
                        jQuery('#invconbef').removeClass('hide');
                    }
                }
            };
            $scope.rcheck = function (val) {
                console.log(val);
                if ($scope.categoryId == 2) {
                    if (val) {
                        jQuery('#imrpton').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#imrpton').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
            };
            $scope.saveInvestigation = function () {
                console.log("From Investigations");
                var data = new FormData(jQuery("#addInvForm")[0]);
                console.log(data);
                //$ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addInvForm")[0]);
                callAjax("POST", domain + "doctrsrecords/save-treatment-plan", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (response.records != '') {
                        alert("Investigation saved successfully!");
                        $scope.investigation.push(response.records);
                        $scope.invData.push(response.recordsData);
                        $scope.inv.push(response.records.id);
                        console.log($scope.investigation);
                        console.log($scope.invData);
                        $rootScope.inv = $scope.inv;
                        //$rootScope.measure = 'yes';
                        //$rootScope.measurement = response.records;
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
            };
            $rootScope.$on('getInvestigations', function () {
                $scope.getInvDetails();
            });
            $scope.getInvDetails = function () {
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-investigation-fields',
                    params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
                }).then(function successCallback(response) {
                    console.log(response);
                    $scope.records = response.data.record;
                    $scope.fields = response.data.fields;
                    $scope.category = $scope.records.id;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.doctrs;
                    $scope.investigation = response.data.prevRec;
                    $scope.invData = response.data.prevData;
                    angular.forEach(response.data.prevRec, function (val, key) {
                        $scope.inv.unshift(val.id);
                    });
                    console.log("INV ===" + $scope.investigation);
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

        })

        .controller('MedicationsCtrl', function ($scope, $http, $stateParams, $ionicModal, $rootScope, $filter, $ionicLoading) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.recId = window.localStorage.getItem('recId');
            $scope.catId = 'Medications';
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm');
            $scope.medication = [];
            $scope.mediData = [];
            $scope.medi = [];
            $scope.repeatFreq = [];
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-investigation-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.records = response.data.record;
                $scope.fields = response.data.fields;
                $scope.category = $scope.records.id;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.medication = response.data.prevRec;
                $scope.mediData = response.data.prevData;
                angular.forEach(response.data.prevRec, function (val, key) {
                    $scope.medi.push(val.id);
                });
                angular.forEach(response.data.prevData, function (val, key) {
                    angular.forEach(val, function (medi, k) {
                        if (medi.field_id == 'no-of-frequency-1') {
                            $scope.repeatFreq[(k - 1)] = medi.value;
                        }
                    });
                });
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.chkDt = function (dt) {
                console.log(dt);
                console.log($scope.curTime);
                console.log($scope.curTime < dt);
                if (!($scope.curTime < dt)) {
                    alert('End date should be greater than start date.');
                    jQuery('#enddt').val('');
                }
            };
            $scope.addOther = function (name, field, val) {
                addOther(name, field, val);
            };
            $scope.check = function (val) {
                console.log(val);
                if ($scope.category == 7) {
                    if (val) {
                        jQuery('#billStatus').val('Paid');
                        jQuery('#billmode').removeClass('hide');
                    } else {
                        jQuery('#billStatus').val('Unpaid');
                        jQuery('#billmode').addClass('hide');
                    }
                }
                if ($scope.category == 2) {
                    if (val) {
                        jQuery('#immrcvdate').val('Received');
                        jQuery('#imdtrcv').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#immrcvdate').val('To be received');
                        jQuery('#imdtrcv').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
                if ($scope.category == 4) {
                    if (val) {
                        jQuery('#proconduct').val('Conducted On');
                        jQuery('#proconon').removeClass('hide');
                        jQuery('#proconbef').addClass('hide');
                    } else {
                        jQuery('#proconduct').val('To be conducted');
                        jQuery('#proconon').addClass('hide');
                        jQuery('#proconbef').removeClass('hide');
                    }
                }
                if ($scope.category == 5) {
                    if (val) {
                        jQuery('#invconduct').val('Conducted On');
                        jQuery('#invconon').removeClass('hide');
                        jQuery('.inv').removeClass('hide');
                        jQuery('#invconbef').addClass('hide');
                    } else {
                        jQuery('#invconduct').val('To be conducted');
                        jQuery('#invconon').addClass('hide');
                        jQuery('.inv').addClass('hide');
                        jQuery('#invconbef').removeClass('hide');
                    }
                }
            };
            $scope.rcheck = function (val) {
                console.log(val);
                if ($scope.categoryId == 2) {
                    if (val) {
                        jQuery('#imrpton').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#imrpton').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
            };
            $scope.saveMedication = function () {
                console.log("From Medication");
                var data = new FormData(jQuery("#addMedicationForm")[0]);
                console.log(data);
                //$ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addMedicationForm")[0]);
                callAjax("POST", domain + "doctrsrecords/save-treatment-plan", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (response.records != '') {
                        alert("Medication saved successfully!");
                        $scope.medication.push(response.records);
                        $scope.mediData.push(response.recordsData);
                        $scope.medi.push(response.records.id);
                        console.log($scope.medication);
                        console.log($scope.mediData);
                        $rootScope.medi = $scope.medi;
                        //$rootScope.measure = 'yes';
                        //$rootScope.measurement = response.records;
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
            };

            $rootScope.$on('getMedications', function () {
                $scope.getMediDetails();
            });
            $scope.getMediDetails = function () {
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-investigation-fields',
                    params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
                }).then(function successCallback(response) {
                    console.log(response);
                    $scope.records = response.data.record;
                    $scope.fields = response.data.fields;
                    $scope.category = $scope.records.id;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.doctrs;
                    $scope.medication = response.data.prevRec;
                    $scope.mediData = response.data.prevData;
                    angular.forEach(response.data.prevRec, function (val, key) {
                        $scope.medi.push(val.id);
                    });
                    angular.forEach(response.data.prevData, function (val, key) {
                        angular.forEach(val, function (medi, k) {
                            if (medi.field_id == 'no-of-frequency-1') {
                                $scope.repeatFreq[(k - 1)] = medi.value;
                            }
                        });
                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('ProceduresCtrl', function ($scope, $http, $stateParams, $ionicModal, $rootScope, $filter, $ionicLoading) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.recId = window.localStorage.getItem('recId');
            $scope.catId = 'Procedures';
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm');
            $scope.procedure = [];
            $scope.proData = [];
            $scope.proc = [];
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-investigation-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.records = response.data.record;
                $scope.fields = response.data.fields;
                $scope.category = $scope.records.id;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.procedure = response.data.prevRec;
                $scope.proData = response.data.prevData;
                angular.forEach(response.data.prevRec, function (val, key) {
                    $scope.proc.push(val.id);
                });
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.chkDt = function (dt) {
                console.log(dt);
                console.log($scope.curTime);
                console.log($scope.curTime < dt);
                if (!($scope.curTime < dt)) {
                    alert('End date should be greater than start date.');
                    jQuery('#enddt').val('');
                }
            };
            $scope.addOther = function (name, field, val) {
                addOther(name, field, val);
            };
            $scope.check = function (val) {
                console.log(val);
                if ($scope.category == 7) {
                    if (val) {
                        jQuery('#billStatus').val('Paid');
                        jQuery('#billmode').removeClass('hide');
                    } else {
                        jQuery('#billStatus').val('Unpaid');
                        jQuery('#billmode').addClass('hide');
                    }
                }
                if ($scope.category == 2) {
                    if (val) {
                        jQuery('#immrcvdate').val('Received');
                        jQuery('#imdtrcv').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#immrcvdate').val('To be received');
                        jQuery('#imdtrcv').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
                if ($scope.category == 4) {
                    if (val) {
                        jQuery('#proconduct').val('Conducted On');
                        jQuery('#proconon').removeClass('hide');
                        jQuery('#proconbef').addClass('hide');
                    } else {
                        jQuery('#proconduct').val('To be conducted');
                        jQuery('#proconon').addClass('hide');
                        jQuery('#proconbef').removeClass('hide');
                    }
                }
                if ($scope.category == 5) {
                    if (val) {
                        jQuery('#invconduct').val('Conducted On');
                        jQuery('#invconon').removeClass('hide');
                        jQuery('.inv').removeClass('hide');
                        jQuery('#invconbef').addClass('hide');
                    } else {
                        jQuery('#invconduct').val('To be conducted');
                        jQuery('#invconon').addClass('hide');
                        jQuery('.inv').addClass('hide');
                        jQuery('#invconbef').removeClass('hide');
                    }
                }
            };
            $scope.rcheck = function (val) {
                console.log(val);
                if ($scope.categoryId == 2) {
                    if (val) {
                        jQuery('#imrpton').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#imrpton').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
            };
            $scope.saveProcedure = function () {
                console.log("From Procedure");
                var data = new FormData(jQuery("#addProcedureForm")[0]);
                console.log(data);
                //$ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addProcedureForm")[0]);
                callAjax("POST", domain + "doctrsrecords/save-treatment-plan", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (response.records != '') {
                        alert("Procedure saved successfully!");
                        $scope.procedure.push(response.records);
                        $scope.proData.push(response.recordsData);
                        $scope.proc.push(response.records.id);
                        console.log($scope.procedure);
                        console.log($scope.proData);
                        $rootScope.proc = $scope.proc;
                        //$rootScope.measure = 'yes';
                        //$rootScope.measurement = response.records;
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
            };
            $rootScope.$on('getProcedures', function () {
                $scope.getProcDetails();
            });
            $scope.getProcDetails = function () {
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-investigation-fields',
                    params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
                }).then(function successCallback(response) {
                    console.log(response);
                    $scope.records = response.data.record;
                    $scope.fields = response.data.fields;
                    $scope.category = $scope.records.id;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.doctrs;
                    $scope.procedure = response.data.prevRec;
                    $scope.proData = response.data.prevData;
                    angular.forEach(response.data.prevRec, function (val, key) {
                        $scope.proc.push(val.id);
                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('LifeStyleCtrl', function ($scope, $http, $stateParams, $ionicModal, $rootScope, $filter, $ionicLoading) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.recId = window.localStorage.getItem('recId');
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm');
            $scope.catId = 'Activity & Lifestyle';
            $scope.lifestyle = [];
            $scope.lifeData = [];
            $scope.life = [];
            $scope.repeatFreq = [];
            $scope.repeatNo = [];
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-investigation-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.records = response.data.record;
                $scope.fields = response.data.fields;
                $scope.category = $scope.records.id;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.lifestyle = response.data.prevRec;
                $scope.lifeData = response.data.prevData;
                angular.forEach(response.data.prevRec, function (val, key) {
                    $scope.life.push(val.id);
                });
                angular.forEach(response.data.prevData, function (val, key) {
                    angular.forEach(val, function (medi, k) {
                        if (medi.field_id == 'no-of-frequency') {
                            $scope.repeatFreq[(k - 2)] = medi.value;
                        }
                        if (medi.field_id == 'no-of-times') {
                            $scope.repeatNo[(k - 1)] = medi.value;
                        }
                    });
                });
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.chkDt = function (dt) {
                console.log(dt);
                console.log($scope.curTime);
                console.log($scope.curTime < dt);
                if (!($scope.curTime < dt)) {
                    alert('End date should be greater than start date.');
                    jQuery('#enddt').val('');
                }
            };
            $scope.addOther = function (name, field, val) {
                addOther(name, field, val);
            };
            $scope.check = function (val) {
                console.log(val);
                if ($scope.category == 7) {
                    if (val) {
                        jQuery('#billStatus').val('Paid');
                        jQuery('#billmode').removeClass('hide');
                    } else {
                        jQuery('#billStatus').val('Unpaid');
                        jQuery('#billmode').addClass('hide');
                    }
                }
                if ($scope.category == 2) {
                    if (val) {
                        jQuery('#immrcvdate').val('Received');
                        jQuery('#imdtrcv').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#immrcvdate').val('To be received');
                        jQuery('#imdtrcv').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
                if ($scope.category == 4) {
                    if (val) {
                        jQuery('#proconduct').val('Conducted On');
                        jQuery('#proconon').removeClass('hide');
                        jQuery('#proconbef').addClass('hide');
                    } else {
                        jQuery('#proconduct').val('To be conducted');
                        jQuery('#proconon').addClass('hide');
                        jQuery('#proconbef').removeClass('hide');
                    }
                }
                if ($scope.category == 5) {
                    if (val) {
                        jQuery('#invconduct').val('Conducted On');
                        jQuery('#invconon').removeClass('hide');
                        jQuery('.inv').removeClass('hide');
                        jQuery('#invconbef').addClass('hide');
                    } else {
                        jQuery('#invconduct').val('To be conducted');
                        jQuery('#invconon').addClass('hide');
                        jQuery('.inv').addClass('hide');
                        jQuery('#invconbef').removeClass('hide');
                    }
                }
            };
            $scope.rcheck = function (val) {
                console.log(val);
                if ($scope.categoryId == 2) {
                    if (val) {
                        jQuery('#imrpton').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#imrpton').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
            };
            $scope.saveLifestyle = function () {
                console.log("From Lifestyle");
                var data = new FormData(jQuery("#addLifeStyleForm")[0]);
                console.log(data);
                //$ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addLifeStyleForm")[0]);
                callAjax("POST", domain + "doctrsrecords/save-treatment-plan", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (response.records != '') {
                        alert("Investigation saved successfully!");
                        $scope.lifestyle.push(response.records);
                        $scope.lifeData.push(response.recordsData);
                        $scope.life.push(response.records.id);
                        console.log($scope.lifestyle);
                        console.log($scope.lifeData);
                        $rootScope.life = $scope.life;
                        //$rootScope.measure = 'yes';
                        //$rootScope.measurement = response.records;
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
            };
            $rootScope.$on('getLifestyle', function () {
                $scope.getLifeDetails();
            });
            $scope.getLifeDetails = function () {
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-investigation-fields',
                    params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
                }).then(function successCallback(response) {
                    console.log(response);
                    $scope.records = response.data.record;
                    $scope.fields = response.data.fields;
                    $scope.category = $scope.records.id;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.doctrs;
                    $scope.lifestyle = response.data.prevRec;
                    $scope.lifeData = response.data.prevData;
                    angular.forEach(response.data.prevRec, function (val, key) {
                        $scope.life.push(val.id);
                    });
                    angular.forEach(response.data.prevData, function (val, key) {
                        angular.forEach(val, function (medi, k) {
                            if (medi.field_id == 'no-of-frequency') {
                                $scope.repeatFreq[(k - 2)] = medi.value;
                            }
                            if (medi.field_id == 'no-of-times') {
                                $scope.repeatNo[(k - 1)] = medi.value;
                            }
                        });
                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('ReferralCtrl', function ($scope, $http, $stateParams, $ionicModal, $rootScope, $filter, $ionicLoading) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.recId = window.localStorage.getItem('recId');
            $scope.catId = 'Referral';
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm');
            $scope.referral = [];
            $scope.refData = []
            $scope.refer = [];
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-investigation-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.records = response.data.record;
                $scope.fields = response.data.fields;
                $scope.category = $scope.records.id;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.referral = response.data.prevRec;
                $scope.refData = response.data.prevData;
                angular.forEach(response.data.prevRec, function (val, key) {
                    $scope.refer.push(val.id);
                });
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.chkDt = function (dt) {
                console.log(dt);
                console.log($scope.curTime);
                console.log($scope.curTime < dt);
                if (!($scope.curTime < dt)) {
                    alert('End date should be greater than start date.');
                    jQuery('#enddt').val('');
                }
            };
            $scope.addOther = function (name, field, val) {
                addOther(name, field, val);
            };
            $scope.check = function (val) {
                console.log(val);
                if ($scope.category == 7) {
                    if (val) {
                        jQuery('#billStatus').val('Paid');
                        jQuery('#billmode').removeClass('hide');
                    } else {
                        jQuery('#billStatus').val('Unpaid');
                        jQuery('#billmode').addClass('hide');
                    }
                }
                if ($scope.category == 2) {
                    if (val) {
                        jQuery('#immrcvdate').val('Received');
                        jQuery('#imdtrcv').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#immrcvdate').val('To be received');
                        jQuery('#imdtrcv').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
                if ($scope.category == 4) {
                    if (val) {
                        jQuery('#proconduct').val('Conducted On');
                        jQuery('#proconon').removeClass('hide');
                        jQuery('#proconbef').addClass('hide');
                    } else {
                        jQuery('#proconduct').val('To be conducted');
                        jQuery('#proconon').addClass('hide');
                        jQuery('#proconbef').removeClass('hide');
                    }
                }
                if ($scope.category == 5) {
                    if (val) {
                        jQuery('#invconduct').val('Conducted On');
                        jQuery('#invconon').removeClass('hide');
                        jQuery('.inv').removeClass('hide');
                        jQuery('#invconbef').addClass('hide');
                    } else {
                        jQuery('#invconduct').val('To be conducted');
                        jQuery('#invconon').addClass('hide');
                        jQuery('.inv').addClass('hide');
                        jQuery('#invconbef').removeClass('hide');
                    }
                }
            };
            $scope.rcheck = function (val) {
                console.log(val);
                if ($scope.categoryId == 2) {
                    if (val) {
                        jQuery('#imrpton').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#imrpton').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
            };
            $scope.saveReferral = function () {
                console.log("From Referral");
                var data = new FormData(jQuery("#addReferralForm")[0]);
                console.log(data);
                //$ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addReferralForm")[0]);
                callAjax("POST", domain + "doctrsrecords/save-treatment-plan", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (response.records != '') {
                        alert("Referral saved successfully!");
                        $scope.referral.push(response.records);
                        $scope.refData.push(response.recordsData);
                        $scope.refer.push(response.records.id);
                        console.log($scope.referral);
                        console.log($scope.refData);
                        $rootScope.refer = $scope.refer;
                        //$rootScope.measure = 'yes';
                        //$rootScope.measurement = response.records;
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
            };

            $rootScope.$on('getReferral', function () {
                $scope.getRefDetails();
            });

            $scope.getRefDetails = function () {
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-investigation-fields',
                    params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, recId: $scope.recId}
                }).then(function successCallback(response) {
                    console.log(response);
                    $scope.records = response.data.record;
                    $scope.fields = response.data.fields;
                    $scope.category = $scope.records.id;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.doctrs;
                    $scope.referral = response.data.prevRec;
                    $scope.refData = response.data.prevData;
                    angular.forEach(response.data.prevRec, function (val, key) {
                        $scope.refer.push(val.id);
                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('DietCtrl', function ($scope, $http, $stateParams, $ionicModal, $rootScope, $filter) {
            $scope.catId = 'Diet Plan';
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.recId = window.localStorage.getItem('recId');
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm a');
            $scope.day = '';
            $scope.meals = [{time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}];
            $scope.mealDetails = [];
            $scope.dayMeal = [];
            $scope.dietData = [];
            $scope.diet = [];
            $scope.dietId = [];
            $scope.catId = 'Diet Plan';
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'HH:mm');
            $scope.nodays = [];
            //console.log('diet ctrl');
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-investigation-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, mid: $stateParams.mid, recId: $scope.recId}
            }).then(function successCallback(response) {
                //console.log(response);
                $scope.records = response.data.record;
                $scope.fields = response.data.fields;
                $scope.category = $scope.records.id;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.prevDietRec = response.data.prevRec;
                $scope.dietRec = response.data.dietRec;
                $scope.prevDietData = response.data.prevData;
                $scope.dietDetails = response.data.dietDetails;
                $scope.dayMeal = response.data.dietRec;
                angular.forEach(response.data.prevRec, function (val, key) {
                    $scope.dietId.push(val.id);
                });
                angular.forEach($scope.prevData, function (val, k) {
                    angular.forEach(val, function (value, key) {
                        //console.log(value.fields.name);
                        if (value.fields.name == 'no-of-days') {
                            $scope.nodays[key] = val.value;
                        }
                    });
                });
                //console.log("No days" + $scope.nodays);
            }, function errorCallback(response) {
                console.log(response);
            });
//            $ionicModal.fromTemplateUrl('mealdetails', {
//                scope: $scope
//            }).then(function (modal) {
//                $scope.dietmodal = modal;
//                $scope.daymodal = function (day) {
//                    console.log('Index = ' + day + ' day' + (day - 1));
//                    $scope.Mealday = day;
//                    $scope.day = 'day' + (day - 1);
//                    $scope.dietmodal.show();
//                };
//            });
            $ionicModal.fromTemplateUrl('mealdispdetails', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.daymodalDisp = function (pDay, day) {
                    console.log("Display modal-----" + pDay + " --------- " + day);
                    $scope.dietPlanDetails = [];
                    $scope.diet = $scope.dietRec[pDay][day];
                    $scope.Mealday = (day + 1);
                    var i, j, temparray, chunk = 4;
                    for (i = 0, j = $scope.diet.length; i < j; i += chunk) {
                        $scope.dietPlanDetails.push($scope.diet.slice(i, i + chunk));
                    }
                    $scope.modal.show();
                };
            });

            $scope.dietdetails = function (days) {
                $scope.dayMeal = [];
                for (var i = 1, j = 1; i <= days; i++, j++) {
                    $scope.mealDetails['day' + (i - 1)] = [{time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}];
                    $scope.dayMeal.push(i);
                }
                var stdt = $('#diet-start').val();
                var endDate = getDayAfter(stdt, days);
                console.log(stdt + " === " + days + " === " + endDate);
                console.log($filter('date')(endDate, 'yyyy-MM-dd'));
                $('#diet-end').val($filter('date')(endDate, 'yyyy-MM-dd'));
            };
            $scope.getEnd = function () {
                //console.log(stdt + " === " + $scope.nodays + " === " + endDate);
                var noDays = $('#dietdays').val();
                var startDate = $filter('date')(($('#diet-start').val()), 'yyyy-MM-dd');
                var enDate = getDayAfter(startDate, noDays);
                console.log(startDate + " === " + noDays + " === " + enDate);
                console.log($filter('date')(enDate, 'yyyy-MM-dd'));
                $('#diet-end').val($filter('date')(enDate, 'yyyy-MM-dd'));
            };
            $scope.saveMeal = function (day) {
                jQuery('#' + day).val(JSON.stringify($scope.mealDetails[day]));
                jQuery('#fill' + day.charAt(day.length - 1)).removeClass('filled-data').addClass('filldata');
//        if (checkIsMealEmpty($scope.mealDetails[day]) == 'not empty') {
//            //console.log('Has value');
//            jQuery('#' + day).val(JSON.stringify($scope.mealDetails[day]));
//            jQuery('#fill' + day.charAt(day.length - 1)).removeClass('filled-data').addClass('filldata');
//        } else {
//            console.log('Empty');
//        }
                //$scope.dietmodal.hide();
            };

            $scope.submitmodal = function () {
                $scope.mealDetails[($scope.day - 1)] = [{time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}];
                //$scope.dietmodal.hide();
                $scope.modal.hide();
            };
            $rootScope.$on("GetDietPlan", function () {
                $scope.getDietPlan();
            });
            $scope.getDietPlan = function () {
                $scope.recId = window.localStorage.getItem('recId');
                $http({
                    method: 'GET',
                    url: domain + 'doctrsrecords/get-investigation-fields',
                    params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, mid: $stateParams.mid, recId: $scope.recId}
                }).then(function successCallback(response) {
                    //console.log(response);
                    $scope.records = response.data.record;
                    $scope.fields = response.data.fields;
                    $scope.category = $scope.records.id;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.doctrs;
                    $scope.prevDietRec = response.data.prevRec;
                    $scope.dietRec = response.data.dietRec;
                    $scope.prevDietData = response.data.prevData;
                    $scope.dietDetails = response.data.dietDetails;
                    $scope.dayMeal = response.data.dietRec;
                    angular.forEach(response.data.prevRec, function (val, key) {
                        $scope.dietId.push(val.id);
                    });
                    angular.forEach($scope.prevData, function (val, k) {
                        angular.forEach(val, function (value, key) {
                            //console.log(value.fields.name);
                            if (value.fields.name == 'no-of-days') {
                                $scope.nodays[key] = val.value;
                            }
                        });
                    });
                    //console.log("No days" + $scope.nodays);
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

            $rootScope.$on("saveDiet", function () {
                $scope.saveDietplan();
            });
            $scope.saveDietplan = function () {
                $scope.loading = true;
                var data = new FormData(jQuery("#addDietForm")[0]);
                if ($('#dietdays').val() != '' && $('#dietdays').val() > 0) {
                    var data = new FormData(jQuery("#addDietForm")[0]);
                    callAjax("POST", domain + "doctrsrecords/save-treatment-plan", data, function (response) {
                        if (response.records != '') {
                            jQuery("#addDietForm")[0].reset();
                            $('input[name=inv]').attr('checked', false);
                            //$rootScope.$emit("GetDietPlan", {});
                            $scope.getDietPlan();
                            $scope.tdiet = false;
                            $scope.loading = false;
                        } else if (response.err != '') {
                            alert('Please fill mandatory fields');
                        }
                    });
                }
            };
        })

        .controller('RecordDetailsCtrl', function ($scope, $http, $state, $stateParams, $timeout, $ionicModal, $ionicLoading, $rootScope, $sce) {
            $scope.create = get('create');
            $scope.recordId = $stateParams.id;
            $scope.userId = get('id');
            $scope.shared = $stateParams.shared;
            $scope.Bstatus = '';
            $scope.Istatus = '';
            $scope.repeatStatus = '';
            $scope.InvStatus = '';
            $scope.probstatus = '';
            $scope.prescstatus = '';
            $scope.repeatFreq = '';
            $scope.repeatNo = '';
            $scope.selConditions = [];
            $scope.diet = [];
            $scope.dietPlanDetails = [];
            $scope.Mealday = '';
            $scope.isAttachment = '';
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.isNumber = function (num) {
                return angular.isNumber(num);
            };
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'records/get-record-details',
                params: {id: $stateParams.id, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.recordDetails = response.data.recordsDetails;
                $scope.category = response.data.record;
                $scope.problem = response.data.problem;
                $scope.doctors = response.data.doctrs;
                $scope.patient = response.data.patient;
                $scope.doctrs = response.data.shareDoctrs;
                $scope.selConditions = response.data.conditions;
                $scope.dietData = response.data.dietData;
                $scope.dietDetails = response.data.dietDetails;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                angular.forEach($scope.dietDetails, function (value, key) {
                    angular.forEach(value.data, function (val, k) {

                    });
                });
                angular.forEach($scope.recordDetails, function (val, key) {
                    if ($scope.category.categories.id == '7') {
                        console.log(val.fields.field);
                        if (val.fields.field == 'Status') {
                            $scope.Bstatus = val.value;
                        }
                    }
                    if ($scope.category.categories.id == 30) {
                        if (val.field_id == 'no-of-frequency') {
                            $scope.repeatFreq = val.value;
                        }
                        if (val.field_id == 'no-of-times') {
                            $scope.repeatNo = val.value;
                        }
                    }
                    if ($scope.category.categories.id == 3) {
                        if (val.field_id == 'no-of-frequency-1') {
                            $scope.repeatFreq = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '19') {
                        if (val.fields.field == 'End Date') {
                            $scope.endtime = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '2') {
                        if (val.fields.field == 'Status') {
                            $scope.Istatus = val.value;
                        }
                        if (val.fields.field == 'Repeat') {
                            $scope.repeatStatus = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '5' || $scope.category.categories.id == '4') {
                        if (val.fields.field == 'Status') {
                            $scope.InvStatus = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '14') {
                        if (val.fields.field == 'Status') {
                            $scope.probstatus = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '8') {
                        if (val.fields.field == 'Includes Prescription') {
                            $scope.prescstatus = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '8') {
                        if (val.fields.field == 'Attachments') {
                            $scope.isAttachment = val.attachments.length;
                        }
                    }
                    console.log($scope.isAttachment);
                });
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            //DELETE Modal
            $scope.delete = function (id) {
                console.log($scope.category.category);
                $http({
                    method: 'POST',
                    url: domain + 'records/delete',
                    params: {id: $scope.recordId, shared: $scope.shared, userId: $scope.userId}
                }).then(function successCallback(response) {
                    alert("Record deleted successfully!");
                    $state.go('app.records-view', {'id': $scope.category.category, shared: $scope.shared}, {reload: true});
                }, function errorCallback(e) {
                    console.log(e);
                });
            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.docId != '') {
                    var confirm = window.confirm("Do you really want to share?");
                    if (confirm) {
                        console.log($scope.recordId);
                        $http({
                            method: 'POST',
                            url: domain + 'records/share',
                            params: {id: $scope.recordId, userId: $scope.userId, docId: $scope.docId, shared: $scope.shared}
                        }).then(function successCallback(response) {
                            console.log(response);
                            if (response.data == 'Success') {
                                alert("Records shared successfully!");
                            }
                        }, function errorCallback(e) {
                            console.log(e);
                        });

                    }
                } else {
                    alert("Please select doctor to share with!");
                }
            };

            $scope.path = "";
            $scope.name = "";
            $ionicModal.fromTemplateUrl('filesview.html', function ($ionicModal) {
                $scope.modal = $ionicModal;
                $scope.showm = function (ahost, path, name) {
                    $scope.path = path;
                    $scope.name = name;
                    //$rootScope.attachpath
                    console.log(path + '=afd =' + name);
                    $scope.value = ahost + path + name;
                    $scope.modal.show();
                };

            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };

            $scope.submitmodal = function () {
                //console.log($scope.catIds);
                $scope.modal.hide();
            };

            $scope.print = function () {
                //  console.log("fsfdfsfd");
                //  var printerAvail = $cordovaPrinter.isAvailable();

                var print_page = '<img src="' + $rootScope.attachpath + $scope.path + $scope.name + '"  height="auto" maxwidth="100%" />';

                cordova.plugins.printer.print(print_page, 'Print', function () {
                    alert('printing finished or canceled');
                });
            };
        })

        .controller('mealDetails2Ctrl', function ($scope, $ionicModal) {
            
            $ionicModal.fromTemplateUrl('mealdispdetails', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.daymodal2 = function(day,parent) {
                    console.log(day);
                    console.log(parent);
                    $scope.dietPlanDetails = [];
                    $scope.dietData = $scope.cardsViewRecords['diet-details'][parent][day]['data'];
                    console.log($scope.dietData);
                    $scope.diet = $scope.cardsViewRecords['diet-details'][parent][day]['data'];
                    console.log('Day ' + day);
                    $scope.Mealday = (day + 1);
                    var i, j, temparray, chunk = 4;
                    for (i = 0, j = $scope.diet.length; i < j; i += chunk) {
                        $scope.dietPlanDetails.push($scope.diet.slice(i, i + chunk));
                    }
                    console.log($scope.dietPlanDetails);
                    $scope.modal.show();
                };
                $scope.daymodal = function (day,parent) {
                    console.log(day);
                    console.log(parent);
                    $scope.dietPlanDetails = [];
                    $scope.dietData = $scope.cards['diet-details'][parent][day]['data'];
                    console.log($scope.dietData);
                    $scope.diet = $scope.cards['diet-details'][parent][day]['data'];
                    console.log('Day ' + day);
                    $scope.Mealday = (day + 1);
                    var i, j, temparray, chunk = 4;
                    for (i = 0, j = $scope.diet.length; i < j; i += chunk) {
                        $scope.dietPlanDetails.push($scope.diet.slice(i, i + chunk));
                    }
                    console.log($scope.dietPlanDetails);
                    $scope.modal.show();
                };
            });
            $scope.submitmodal = function () {
                //console.log($scope.catIds);
                $scope.modal.hide();
            };
        })
        .controller('mealDetailsCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('mealdetails', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.daymodal = function (day) {
                    $scope.dietPlanDetails = [];
                    console.log($scope.dietData[day]);
                    $scope.diet = $scope.dietData[day];
                    console.log('Day ' + day);
                    $scope.Mealday = (day + 1);
                    var i, j, temparray, chunk = 4;
                    for (i = 0, j = $scope.diet.length; i < j; i += chunk) {
                        $scope.dietPlanDetails.push($scope.diet.slice(i, i + chunk));
                    }
                    console.log($scope.dietPlanDetails);
                    $scope.modal.show();
                };
            });
            $scope.submitmodal = function () {
                //console.log($scope.catIds);
                $scope.modal.hide();
            };
        })

        .controller('shareModalCtrl', function ($scope, $http, $state, $stateParams, $timeout, $ionicModal, $rootScope, $sce) {
            //Show share model
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };
        })

        .controller('ConsultationsListCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory) {
            $scope.dnlink = function ($nurl) {
                $state.go($nurl);
            }
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.imgpath = domain;
            $scope.specializations = {};
            $scope.userId = get('id');
            $scope.drId = '';
            if (get('drId') != null) {
                $scope.drId = get('drId');
            } else {
                $scope.drId = '';
            }
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/consultations',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                $scope.specializations = response.data.spec;
                $scope.langtext = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                //Video
                $scope.video_time = response.data.video_time;
                $scope.video_app = response.data.video_app;
                $scope.video_doctorsData = response.data.video_doctorsData;
                $scope.video_products = response.data.video_products;
                $scope.video_end_time = response.data.video_end_time;
                // Video past
                $scope.video_time_past = response.data.video_time_past;
                $scope.video_app_past = response.data.video_app_past;
                $scope.video_doctorsData_past = response.data.video_doctorsData_past;
                $scope.video_products_past = response.data.video_products_past;
                $scope.video_end_time_past = response.data.video_end_time_past;
                //console.log('##########'+ $scope.video_app_past);
                //Clinic
                $scope.clinic_app = response.data.clinic_app;
                $scope.clinic_doctorsData = response.data.clinic_doctorsData;
                $scope.clinic_products = response.data.clinic_products;
                $scope.clinic_time = response.data.clinic_time;
                $scope.clinic_end_time = response.data.clinic_end_time;

                $scope.clinic_app_past = response.data.clinic_app_past;
                $scope.clinic_doctorsData_past = response.data.clinic_doctorsData_past;
                $scope.clinic_products_past = response.data.clinic_products_past;
                $scope.clinic_time_past = response.data.clinic_time_past;
                $scope.clinic_end_time = response.data.clinic_end_time;
                //Home
                $scope.home_app = response.data.home_app;
                $scope.home_doctorsData = response.data.home_doctorsData;
                $scope.home_products = response.data.home_products;
                //Chat 
                $scope.chat_app = response.data.chat_app;
                $scope.chat_doctorsData = response.data.chat_doctorsData;
                $scope.chat_products = response.data.chat_products;
                $ionicLoading.hide();
                //$state.go('app.category-detail');
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.deleteApp = function (appId, prodId, mode, startTime) {
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctorsapp/patient-delete-app',
                    params: {appId: appId, prodId: prodId, userId: $scope.userId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $ionicLoading.hide();
                    if (response.data == 1) {
                        alert('Your appointment is cancelled successfully.');
                        $state.go('app.consultations-current', {}, {reload: true});
                    }
                    //$state.go('app.consultations-current', {}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

            $scope.joinVideo = function (mode, start, end, appId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    //$state.go('app.patient-join', {}, {reload: true});
                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {cache: false}, {reload: true});
                } else {
                    alert("You can join video 15 minutes before the appointment");
                }
            };
        })

        .controller('ConsultationsListCurrentCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory, $timeout, $ionicFilterBar) {

            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.imgpath = domain;
            $scope.specializations = {};
            $scope.userId = get('id');
            $scope.drId = '';
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $ionicLoading.show({template: 'Loading...'});


            $scope.doRefresh = function () {
                console.log("jskhfksjdf bhavana");

                $http({
                    method: 'GET',
                    url: domain + 'doctors/consultations-current',
                    params: {userId: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.specializations = response.data.spec;
                    $scope.langtext = response.data.tabmenu;
                    $scope.language = response.data.lang.language;

                    $scope.all_video = response.data.all_video;

                    //Time Limit For Interface
                    $scope.timeLimit = response.data.timelimit.cancellation_time;

                    //Video
                    $scope.video_time = response.data.video_time;
                    $scope.video_app = response.data.video_app;
                    $scope.video_note = response.data.video_note;
                    $scope.video_doctorsData = response.data.video_doctorsData;
                    $scope.video_products = response.data.video_products;
                    $scope.video_end_time = response.data.video_end_time;
                    // Video past
                    $scope.video_time_past = response.data.video_time_past;
                    $scope.video_app_past = response.data.video_app_past;
                    $scope.video_past_note = response.data.video_past_note;
                    $scope.video_doctorsData_past = response.data.video_doctorsData_past;
                    $scope.video_products_past = response.data.video_products_past;
                    $scope.video_end_time_past = response.data.video_end_time_past;
                    //console.log('##########'+ $scope.video_app_past);
                    //Clinic
                    $scope.clinic_app = response.data.clinic_app;
                    $scope.clinic_doctorsData = response.data.clinic_doctorsData;
                    $scope.clinic_products = response.data.clinic_products;
                    $scope.clinic_time = response.data.clinic_time;
                    $scope.clinic_end_time = response.data.clinic_end_time;

                    $scope.clinic_app_past = response.data.clinic_app_past;
                    $scope.clinic_doctorsData_past = response.data.clinic_doctorsData_past;
                    $scope.clinic_products_past = response.data.clinic_products_past;
                    $scope.clinic_time_past = response.data.clinic_time_past;
                    $scope.clinic_end_time = response.data.clinic_end_time;
                    //Home
                    $scope.home_app = response.data.home_app;
                    $scope.home_doctorsData = response.data.home_doctorsData;
                    $scope.home_products = response.data.home_products;
                    //Chat 
                    $scope.chat_app = response.data.chat_app;
                    $scope.chat_doctorsData = response.data.chat_doctorsData;
                    $scope.chat_products = response.data.chat_products;
                    $ionicLoading.hide();
                    // $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                }, function errorCallback(e) {
                    $scope.$broadcast('scroll.refreshComplete');
                })

            };
            $http({
                method: 'GET',
                url: domain + 'doctors/consultations-current',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                $scope.specializations = response.data.spec;
                $scope.langtext = response.data.tabmenu;
                $scope.language = response.data.lang.language;

                $scope.all_video = response.data.all_video;

                //Time Limit For Interface
                $scope.timeLimit = response.data.timelimit.cancellation_time;

                //Video
                $scope.video_time = response.data.video_time;
                $scope.video_app = response.data.video_app;
                $scope.video_note = response.data.video_note;
                $scope.video_doctorsData = response.data.video_doctorsData;
                $scope.video_products = response.data.video_products;
                $scope.video_end_time = response.data.video_end_time;
                // Video past
                $scope.video_time_past = response.data.video_time_past;
                $scope.video_app_past = response.data.video_app_past;
                $scope.video_past_note = response.data.video_past_note;
                $scope.video_doctorsData_past = response.data.video_doctorsData_past;
                $scope.video_products_past = response.data.video_products_past;
                $scope.video_end_time_past = response.data.video_end_time_past;
                //console.log('##########'+ $scope.video_app_past);
                //Clinic
                $scope.clinic_app = response.data.clinic_app;
                $scope.clinic_doctorsData = response.data.clinic_doctorsData;
                $scope.clinic_products = response.data.clinic_products;
                $scope.clinic_time = response.data.clinic_time;
                $scope.clinic_end_time = response.data.clinic_end_time;

                $scope.clinic_app_past = response.data.clinic_app_past;
                $scope.clinic_doctorsData_past = response.data.clinic_doctorsData_past;
                $scope.clinic_products_past = response.data.clinic_products_past;
                $scope.clinic_time_past = response.data.clinic_time_past;
                $scope.clinic_end_time = response.data.clinic_end_time;
                //Home
                $scope.home_app = response.data.home_app;
                $scope.home_doctorsData = response.data.home_doctorsData;
                $scope.home_products = response.data.home_products;
                //Chat 
                $scope.chat_app = response.data.chat_app;
                $scope.chat_doctorsData = response.data.chat_doctorsData;
                $scope.chat_products = response.data.chat_products;
                $ionicLoading.hide();
                //$state.go('app.category-detail');
            }, function errorCallback(e) {
                console.log(e);
            });

            /* search plugin */
            var filterBarInstance;
            $scope.showFilterBar = function () {
                filterBarInstance = $ionicFilterBar.show({
                    items: $scope.items,
                    update: function (filteredItems, filterText) {

                        if (filterText) {
                            console.log(filterText);
                            $scope.filterall = filterText
                        } else {
                            $scope.filterall = '';
                        }
                    }
                });
            };

            /* end of search plugin */

            $scope.deleteApp = function (appId, prodId, mode, startTime) {
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctorsapp/patient-delete-app',
                    params: {appId: appId, prodId: prodId, userId: $scope.userId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $ionicLoading.hide();
                    if (response.data == 1) {
                        alert('Your appointment is cancelled successfully.');
                        $state.go('app.consultations-current', {}, {reload: true});
                    }
                    //$state.go('app.consultations-current', {}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

            $scope.joinVideo = function (mode, start, end, appId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect to join');

                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {cache: false}, {reload: true});
                } else {
                    alert("You can join video 15 minutes before the appointment");
                }
            };

            //View details
            $scope.viewNote = function (recId, appId) {
                store({'backurl': 'consultations-current'});
                console.log("RecId ==" + recId + "App Id ==" + appId);
                $state.go('app.preview-note', {'id': recId, 'appId': appId, 'res': 'json'}, {reload: true});
            };
        })

        .controller('DoctorRecordJoinCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory) {
        })

        .controller('ConsultationsListPastCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory, $timeout, $ionicFilterBar) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.imgpath = domain;
            $scope.specializations = {};
            $scope.userId = get('id');
            $scope.items = [];
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $ionicLoading.show({template: 'Loading...'});
            $scope.doRefresh = function () {
                console.log("jskhfksjdf");
                $http({
                    method: 'GET',
                    url: domain + 'doctors/consultations-past',
                    params: {userId: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.specializations = response.data.spec;
                    $scope.langtext = response.data.tabmenu;
                    $scope.language = response.data.lang.language;
                    //Video
                    $scope.video_time = response.data.video_time;
                    $scope.video_app = response.data.video_app;
                    $scope.video_doctorsData = response.data.video_doctorsData;
                    $scope.video_products = response.data.video_products;
                    $scope.video_end_time = response.data.video_end_time;

                    // Video past
                    $scope.video_time_past = response.data.video_time_past;
                    $scope.video_app_past = response.data.video_app_past;
                    $scope.video_past_note = response.data.video_past_note;
                    $scope.video_doctorsData_past = response.data.video_doctorsData_past;
                    $scope.video_products_past = response.data.video_products_past;
                    $scope.video_end_time_past = response.data.video_end_time_past;
                    $scope.all_video = response.data.all_video;
                    //console.log('##########'+ $scope.video_app_past);
                    //Clinic
                    $scope.clinic_app = response.data.clinic_app;
                    $scope.clinic_doctorsData = response.data.clinic_doctorsData;
                    $scope.clinic_products = response.data.clinic_products;
                    $scope.clinic_time = response.data.clinic_time;
                    $scope.clinic_end_time = response.data.clinic_end_time;

                    $scope.clinic_app_past = response.data.clinic_app_past;
                    $scope.clinic_doctorsData_past = response.data.clinic_doctorsData_past;
                    $scope.clinic_products_past = response.data.clinic_products_past;
                    $scope.clinic_time_past = response.data.clinic_time_past;
                    $scope.clinic_end_time = response.data.clinic_end_time;
                    $scope.all_clinic = response.data.all_clinic;
                    //Home
                    $scope.home_app = response.data.home_app;
                    $scope.home_doctorsData = response.data.home_doctorsData;
                    $scope.home_products = response.data.home_products;
                    //Chat 
                    $scope.chat_app = response.data.chat_app;
                    $scope.chat_doctorsData = response.data.chat_doctorsData;
                    $scope.chat_products = response.data.chat_products;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                }, function errorCallback(e) {
                    $scope.$broadcast('scroll.refreshComplete');
                })

            };
            $http({
                method: 'GET',
                url: domain + 'doctors/consultations-past',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                $scope.specializations = response.data.spec;
                $scope.langtext = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                //Video
                $scope.video_time = response.data.video_time;
                $scope.video_app = response.data.video_app;
                $scope.video_doctorsData = response.data.video_doctorsData;
                $scope.video_products = response.data.video_products;
                $scope.video_end_time = response.data.video_end_time;

                // Video past
                $scope.video_time_past = response.data.video_time_past;
                $scope.video_app_past = response.data.video_app_past;
                $scope.video_past_note = response.data.video_past_note;
                $scope.video_doctorsData_past = response.data.video_doctorsData_past;
                $scope.video_products_past = response.data.video_products_past;
                $scope.video_end_time_past = response.data.video_end_time_past;
                $scope.all_video = response.data.all_video;
                //console.log('##########'+ $scope.video_app_past);
                //Clinic
                $scope.clinic_app = response.data.clinic_app;
                $scope.clinic_doctorsData = response.data.clinic_doctorsData;
                $scope.clinic_products = response.data.clinic_products;
                $scope.clinic_time = response.data.clinic_time;
                $scope.clinic_end_time = response.data.clinic_end_time;

                $scope.clinic_app_past = response.data.clinic_app_past;
                $scope.clinic_doctorsData_past = response.data.clinic_doctorsData_past;
                $scope.clinic_products_past = response.data.clinic_products_past;
                $scope.clinic_time_past = response.data.clinic_time_past;
                $scope.clinic_end_time = response.data.clinic_end_time;
                $scope.all_clinic = response.data.all_clinic;
                //Home
                $scope.home_app = response.data.home_app;
                $scope.home_doctorsData = response.data.home_doctorsData;
                $scope.home_products = response.data.home_products;
                //Chat 
                $scope.chat_app = response.data.chat_app;
                $scope.chat_doctorsData = response.data.chat_doctorsData;
                $scope.chat_products = response.data.chat_products;
                $ionicLoading.hide();

                //$state.go('app.category-detail');
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.pastDitemsv = 2
            $scope.pastvideo = function (done) {
                if ($scope.video_app_past.length > $scope.pastDitemsv) {
                    $scope.pastDitemsv += 2; // load number of more items
                }
                $scope.$broadcast('scroll.infiniteScrollComplete')
            }
            $scope.pastclinicitems = 2
            $scope.pastclinic = function (done) {
                if ($scope.clinic_app_past.length > $scope.pastclinicitems) {
                    $scope.pastclinicitems += 2; // load number of more items
                }
                $scope.$broadcast('scroll.infiniteScrollComplete')
            }

            /* search plugin */
            var filterBarInstance;
            $scope.showFilterBar = function () {
                filterBarInstance = $ionicFilterBar.show({
                    items: $scope.items,
                    update: function (filteredItems, filterText) {
                        $scope.items = filteredItems;
                        if (filterText) {
                            console.log(filterText);
                            $scope.filterall = filterText
                        } else {
                            $scope.filterall = '';
                        }
                    }
                });
            };
            $scope.refreshItems = function () {
                if (filterBarInstance) {
                    filterBarInstance();
                    filterBarInstance = null;
                }

                $timeout(function () {
                    //getItems();
                    $scope.$broadcast('scroll.refreshComplete');
                }, 1000);
            };
            /* end of search plugin */

            $scope.deleteApp = function (appId, prodId, mode, startTime) {
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctorsapp/patient-delete-app',
                    params: {appId: appId, prodId: prodId, userId: $scope.userId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $ionicLoading.hide();
                    if (response.data == 1) {
                        alert('Your appointment is cancelled successfully.');
                        $state.go('app.consultations-current', {}, {reload: true});
                    }
                    //$state.go('app.consultations-current', {}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

            $scope.joinVideo = function (mode, start, end, appId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    //$state.go('app.patient-join', {}, {reload: true});
                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {cache: false}, {reload: true});
                } else {
                    alert("You can join video 15 minutes before the appointment");
                }
            };

            //View details
            $scope.viewNote = function (recId, appId) {
                store({'backurl': 'consultations-past'});
                console.log("RecId ==" + recId + "App Id ==" + appId);
                $state.go('app.preview-note', {'id': recId, 'appId': appId, 'res': 'json'}, {reload: true});
            };
        })

        .controller('ConsultationCardsCtrl', function ($scope, $http, $stateParams, $ionicLoading, $filter) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $ionicLoading.show({template: 'Loading...'});
            $scope.specId = $stateParams.id;
            $scope.userId = get('id');
            $scope.docServices = [];
            $scope.services = [];
            $http({
                method: 'GET',
                url: domain + 'doctors/list',
                params: {id: $stateParams.id, interface: $scope.interface, userId: $scope.userId}
            }).then(function successCallback(response) {
                $scope.doctors = response.data.user;
                $scope.langtext = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                //$scope.services = response.data.services;
                //$scope.doctors = $filter('orderBy')($scope.doctors, ['instpermission.instant_permission', '-doctorpresense.presence', 'fname', 'lname']);
                $scope.spec = response.data.spec;
                $ionicLoading.hide();
//                angular.forEach($scope.doctors, function (value, key) {
//                    $http({
//                        method: 'GET',
//                        url: domain + 'doctors/get-doctor-services',
//                        params: {id: value.id, interface: $scope.interface}
//                    }).then(function successCallback(responseData) {
//                        $ionicLoading.hide();
//                        //console.log(responseData);
//                        $scope.services[key] = responseData.data.docServices;
//                        $scope.docServices[key] = responseData.data.data;
//                    }, function errorCallback(response) {
//                        console.log(response);
//                    });
//                    console.log($scope.services);
//                    $scope.spec = response.data.spec;
//                    $ionicLoading.hide();
//                });
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('ConsultationProfileCtrl', function ($scope, $http, $state, $stateParams, $rootScope, $filter, $ionicLoading, $ionicModal, $timeout, $ionicTabsDelegate) {
            $scope.apply = '0';
            $scope.discountApplied = '0';
            $scope.vSch = [];
            $scope.schV = [];
            $scope.schdate = [];
            $scope.nextdate = [];
            $scope.cSch = [];
            $scope.schC = [];
            $scope.schCdate = [];
            $scope.nextCdate = [];
            $scope.hSch = [];
            $scope.schH = [];
            $scope.schHdate = [];
            $scope.nextHdate = [];
            $scope.bookingSlot = '';
            $scope.supId = '';
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = window.localStorage.getItem('id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            console.log($scope.apkLanguage);
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/get-details',
                params: {id: $stateParams.id, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.doctor = response.data.user;
                $scope.videoProd = response.data.video_product;
                $scope.instVideo = response.data.inst_video;
                $scope.videoInc = response.data.video_inclusions;
                $scope.videoSch = response.data.videoSch;
                $scope.videoFollow = response.data.videoFollowServices;
                $scope.chatProd = response.data.chat_product;
                $scope.chatInc = response.data.chat_inclusions;
                $scope.chatFollow = response.data.chatFollowServices;
                $scope.homeProd = response.data.home_product;
                $scope.homeInc = response.data.home_inclusions;
                $scope.homeSch = response.data.homeSch;
                $scope.homeFollow = response.data.homeFollowServices;
                $scope.clinicProd = response.data.clinic_product;
                $scope.clinicProds = response.data.clinic_products;
                $scope.clinicInc = response.data.clinic_inclusions;
                $scope.clinicSch = response.data.clinicSch;
                $scope.clinicFollow = response.data.clinicFollowServices;
//                $scope.chatProd = response.data.chat_product;
//                $scope.chatInc = response.data.chat_inclusions;
                $scope.packages = response.data.packages;
                $scope.services = response.data.services;
                $scope.service = response.data.service;
                $scope.video = response.data.video;
                $scope.chat = response.data.chat;
                $scope.clinic = response.data.clinic;
                $scope.home = response.data.home;
                $scope.procced = response.data.procced;
                $scope.scheduled_video = response.data.scheduled_video;
                $scope.instant_video = response.data.instant_video;
                $scope.earliest_slot = response.data.earliest_slot;
                $scope.next_slot = response.data.next_slot;
                $scope.active = response.data.active;
                $scope.book = response.data.book;
                $scope.past = response.data.past;
                $scope.language = response.data.lang.language;
                //console.log("prodId " + $scope.instVideo + "popopo");
                //$ionicLoading.hide();
                angular.forEach($scope.videoSch, function (value, key) {
                    var supsassId = value.supersaas_id;
                    //var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    //console.log(supsassId);
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.vSch[key] = responseData.data.slots;
                        $scope.schV[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = tomorrow;
                        } else {
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });
                });
                angular.forEach($scope.clinicSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.cSch[key] = responseData.data.slots;
                        $scope.schC[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schCdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = tomorrow;
                        } else {
                            $scope.schCdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
                angular.forEach($scope.homeSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.hSch[key] = responseData.data.slots;
                        $scope.schH[key] = supsassId;
                        if (responseData.data.lastdate == '') {
                            $scope.schHdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = tomorrow;
                        } else {
                            $scope.schHdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
                $ionicLoading.hide();
            });
            $scope.toggleaddress = function ($id) {
                jQuery("#" + $id + "short").toggle("slow");
                jQuery("#" + $id + "full").toggle("slow");
            };
            $scope.doit = function () {
                console.log("removeitem");
                window.localStorage.removeItem('startSlot');
                window.localStorage.removeItem('endSlot');
            };
            $scope.checkAvailability = function (uid, prodId) {
                if (checkLogin()) {
                    //alert($scope.instVideo.user_id);
                    $scope.interface = window.localStorage.getItem('interface_id');
                    console.log("prodId " + prodId);
                    console.log("uid " + uid);
                    if (uid) {
                        $scope.uid = uid;
                        $scope.prodId = prodId;
                    } else {
                        $scope.prodId = $scope.instVideo.id;
                        $scope.uid = $scope.instVideo.user_id;
                    }
                    $rootScope.$broadcast('loading:hide');
                    $ionicLoading.show();
                    $http({
                        method: 'GET',
                        url: domain + 'kookoo/check-doctor-availability',
                        params: {id: $scope.uid, interface: $scope.interface}
                    }).then(function successCallback(responseData) {
                        if (responseData.data.status == 1) {
                            $state.go('app.checkavailable', {'data': $scope.prodId, 'uid': $scope.uid});
                        } else {
                            alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                        }
                    });
                } else {
                    $rootScope.$broadcast('showLoginModal', $scope, function () {
                        console.log("logged in fail");

                    }, function () {
                        console.log("succesfully logged in");
                        $scope.checkAvailability();
                    });
                }
            };
            $scope.getNextSlots = function (nextDate, supsassId, key, serv) {
                console.log(nextDate + '=======' + supsassId + '=====' + key + "Seveice == " + serv);
                var from = $filter('date')(new Date(nextDate), 'yyyy-MM-dd') + '+05:30:00';  // HH:mm:ss
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    cache: false,
                    params: {id: supsassId, from: from}
                }).then(function successCallback(responseData) {
                    //$ionicLoading.hide();
                    if (responseData.data.lastdate == '') {
                        if (serv == 1) {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date();
                            $scope.nextdate[key] = $filter('date')(new Date(), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 3) {
                            console.log('Serv = if');
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date();
                            $scope.nextCdate[key] = $filter('date')(new Date(), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 4) {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date();
                            $scope.nextHdate[key] = $filter('date')(new Date(), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        }
                    } else {
                        if (serv == 1) {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 3) {
                            console.log('Serv = else');
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 4) {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        }
                    }
                    $ionicLoading.hide();
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.getFirstSlots = function (supsassId, key, serv) {
                //var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                }).then(function successCallback(responseData) {
                    //$ionicLoading.hide();
                    if (serv == 1) {
                        if (responseData.data.slots == '') {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        } else {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    } else if (serv == 3) {
                        if (responseData.data.slots == '') {
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        } else {
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    } else if (serv == 4) {
                        if (responseData.data.slots == '') {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        } else {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    }
                    $ionicLoading.hide();
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.bookSlot = function (starttime, endtime, supid, servId) {
                $scope.bookingStart = starttime;
                $scope.bookingEnd = endtime;
                $scope.supId = supid;
                $scope.servId = servId;
                console.log(servId);
            };
            $scope.bookAppointment = function (prodId, serv) {
                $scope.userId = get('id');
                console.log("getid" + $scope.userId);

                $scope.apply = '0';
                $scope.discountApplied = '0';
                window.localStorage.setItem('coupondiscount', '0');
                console.log($scope.bookingStart);
                if ($scope.bookingStart) {
                    window.localStorage.setItem('supid', $scope.supId);
                    // added code//
                    window.localStorage.removeItem('IVendSlot');
                    window.localStorage.removeItem('IVstartSlot');
                    window.localStorage.removeItem('instantV');
                    //end code
                    window.localStorage.setItem('startSlot', $scope.bookingStart);
                    window.localStorage.setItem('endSlot', $scope.bookingEnd);
                    window.localStorage.setItem('prodId', prodId);
                    window.localStorage.setItem('mode', serv);
                    window.localStorage.setItem('servId', $scope.servId);
                    $rootScope.supid = $scope.supId;
                    $rootScope.startSlot = $scope.bookingStart;
                    $rootScope.endSlot = $scope.bookingEnd;
                    $rootScope.prodid = prodId;
                    $rootScope.url = 'app.payment';
                    $rootScope.$digest;
                    if (serv == 1) {
                        if (checkLogin())
                        {
                            $ionicLoading.show({template: 'Loading...'});
                            console.log('1')
                            $state.go('app.payment');
                        } else {
                            // $ionicLoading.show({template: 'Loading...'});
                            //$state.go('auth.login');

//                            $ionicModal.fromTemplateUrl('views/app/generic_login.html', {
//                                scope: $scope
//                            }).then(function (modal) {
//                                $scope.loginmodal = modal;
//                                $scope.loginmodal.show();
//                            });

                            $rootScope.$broadcast('showLoginModal', $scope, function () {
                                console.log("logged in fail");

                            }, function () {
                                console.log("succesfully logged in");
                                $state.go('app.payment');
                            });
                            //$scope.loginmodal.show();
                        }
                    } else if (serv == 3 || serv == 4) {
                        if (checkLogin())
                        {
                            $ionicLoading.show({template: 'Loading...'});
                            console.log('2')
                            $state.go('app.payment');
                        } else {
                            //  $ionicLoading.show({template: 'Loading...'});
                            //  $state.go('auth.login');
                            $rootScope.$broadcast('showLoginModal', $scope, function () {
                                console.log("logged in fail");

                            }, function () {
                                console.log("succesfully logged in");
                                $state.go('app.payment');
                            });
                        }
                    }
                } else {
                    alert('Please select slot');
                }
            };
            $scope.bookChatAppointment = function (prodId, serv) {
                window.localStorage.setItem('prodId', prodId);
                //window.localStorage.setItem('url', 'app.payment');
                window.localStorage.setItem('mode', serv);
                $rootScope.prodid = prodId;
                $rootScope.url = 'app.payment';
                if (checkLogin()) {
                    $ionicLoading.show({template: 'Loading...'});
                    $state.go('app.payment');
                } else
                {
                    // $ionicLoading.show({template: 'Loading...'});
                    //$state.go('auth.login');
                    $rootScope.$broadcast('showLoginModal', $scope, function () {
                        console.log("logged in fail");

                    }, function () {
                        console.log("succesfully logged in");
                        $state.go('app.payment');
                    });
                }
            };
            /* view more doctor profile modalbox*/
            $ionicModal.fromTemplateUrl('viewmoreprofile.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
            /* end profile */
            $ionicLoading.show({template: 'Loading...'});
            $timeout(function () {
                $ionicLoading.hide();
                $ionicTabsDelegate.select(0);
            }, 10);
        })

        .controller('PaymentCtrl', function ($scope, $http, $state, $filter, $location, $stateParams, $rootScope, $ionicLoading, $ionicPlatform, $timeout, $ionicHistory, $ionicModal) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.counter1 = 300;
            var stopped1;
            console.log($rootScope.single);
//            var customBackButton = function () {
//                console.log("this is custom behaviour");
//            };
            $scope.$on('$destroy', function () {
                $timeout.cancel(stopped1);
//                $ionicPlatform.registerBackButtonAction(
//                        customBackButton, 0
//                        );
            });
            $scope.paynowcountdown = function () {
                stopped1 = $timeout(function () {
                    console.log($scope.counter1);
                    $scope.counter1--;
                    $scope.paynowcountdown();
                }, 1000);
                if ($scope.counter1 == 0) {
                    //console.log('fadsf af daf');
                    $timeout.cancel(stopped1);
                    $scope.kookooID = window.localStorage.getItem('kookooid1');
                    $scope.prodid = window.localStorage.getItem('prodId');
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'kookoo/payment-time-expired',
                        params: {kookooid: $scope.kookooID}
                    }).then(function successCallback(responseData) {
                        $ionicLoading.hide();
                        alert('Sorry, Your payment time expired');
                        window.localStorage.removeItem('kookooid');
                        window.localStorage.removeItem('kookooid1');
                        $state.go('app.consultation-profile', {'id': $scope.product[0].user_id}, {reload: true});
                        // $timeout(function () {
                        //
                        // }, 3000);
                    }, function errorCallback(response) {
                        if ($rootScope.single == 'profile') {
                            $state.go('app.single-profile', {'id': $scope.product[0].user_id}, {reload: true});
                        } else {
                            $state.go('app.consultation-profile', {'id': $scope.product[0].user_id}, {reload: true});
                        }
                        //$state.go('app.consultations-list', {reload: true});
                    });
                }
            };
            $timeout(function () {
                $scope.paynowcountdown();
            }, 0);
            $scope.mode = window.localStorage.getItem('mode');
            $scope.servId = window.localStorage.getItem('servId');
            $scope.supid = window.localStorage.getItem('supid');
            $scope.startSlot = window.localStorage.getItem('startSlot');
            $scope.endSlot = window.localStorage.getItem('endSlot');
            $scope.prodid = window.localStorage.getItem('prodId');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = window.localStorage.getItem('id');
            $scope.apply = '0';
            $scope.ccode = '';
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.discountApplied = '0';
            $scope.packageId = 0;
            $scope.orderId = 0;
            $scope.selPack = '';
            $scope.packages = [];

            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/get-order-review',
                params: {id: $scope.supid, userId: $scope.userId, prodId: $scope.prodid, interface: $scope.interface}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
                //$ionicLoading.hide();
                $scope.patient = responseData.data.patient;
                $scope.payment = responseData.data.payment;
                $scope.confirm = responseData.data.confirm;
                $scope.confirm_appointment = responseData.data.confirm_appointment;
                $scope.language = responseData.data.lang.language;
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
                $scope.IVstartSlot = responseData.data.IVstart;
                $scope.IVendSlot = responseData.data.IVend;
                $scope.packages = responseData.data.packages;
                console.log($scope.packages.length);
                window.localStorage.setItem('IVstartSlot', $scope.IVstartSlot);
                window.localStorage.setItem('IVendSlot', $scope.IVendSlot);
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.bookNow = function () {
                $timeout.cancel(stopped1);
                $ionicLoading.show({template: 'Loading...'});
                $scope.interface = window.localStorage.getItem('interface_id');
                $scope.startSlot = window.localStorage.getItem('startSlot');
                $scope.endSlot = window.localStorage.getItem('endSlot');
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'buy/book-appointment',
                    params: {prodId: $scope.prodid, interface: $scope.interface, userId: $scope.userId, servId: $scope.servId, supId: $scope.supid, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $ionicLoading.hide();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('app.thankyouc', {'data': response.data}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.payNow = function (finalamount) {
                console.log(finalamount);
                $timeout.cancel(stopped1);
                $scope.interface = window.localStorage.getItem('interface_id');
                if (window.localStorage.getItem('instantV') == 'instantV') {
                    $scope.startSlot = window.localStorage.getItem('IVstartSlot');
                    $scope.endSlot = window.localStorage.getItem('IVendSlot');
                } else {
                    $scope.startSlot = window.localStorage.getItem('startSlot');
                    $scope.endSlot = window.localStorage.getItem('endSlot');
                }
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                $scope.discount = window.localStorage.getItem('coupondiscount');
                $scope.kookooID = window.localStorage.getItem('kookooid');
                $scope.kookooID = window.localStorage.getItem('kookooid1');
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'buy/buy-individual',
                    params: {interface: $scope.interface, kookooID: $scope.kookooID, ccode: $scope.ccode, discount: $scope.discount, disapply: $scope.discountApplied, servId: $scope.servId, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    $ionicLoading.hide();
                    window.localStorage.removeItem('coupondiscount');
                    window.localStorage.setItem('coupondiscount', '')
                    console.log(response.data);
                    if (finalamount > 0) {
                        //$timeout.cancel(stopped1);
                        $state.go('app.Gopay', {'link': response.data});
                        console.log(response.data);
                    } else {
                        $scope.discountval = response.data.discount;
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        if ($scope.mode == 2) {
                            //$timeout.cancel(stopped1);
                            $state.go('app.chat-thankyou', {'data': response.data}, {reload: true});
                        } else {
                            $state.go('app.thankyou', {'data': response.data}, {reload: true});
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.applyCouponCode = function (ccode) {
                $scope.apply = '0';
                $scope.discountApplied = '0';
                window.localStorage.setItem('coupondiscount', '0');
                $scope.interface = window.localStorage.getItem('interface_id');
                $scope.startSlot = window.localStorage.getItem('startSlot');
                $scope.endSlot = window.localStorage.getItem('endSlot');
                $scope.prodid = window.localStorage.getItem('prodId');
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                $scope.ccode = ccode;
                console.log($scope.discount + '--' + $scope.discountApplied + '++++ ' + $scope.userId);
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'buy/apply-coupon-code',
                    params: {interface: $scope.interface, couponCode: ccode, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    // console.log(response);
                    console.log(response.data);
                    if (response.data == '0') {
                        alert('Please provide a valid coupon code');
                        $('#coupon').val("");
                        $('#coupon_error').html('Please provide a valid coupon code');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else
                    if (response.data == '2') {
                        alert('Sorry, this coupon code has been expired');
                        $('#coupon').val("");
                        $('#coupon_error').html('Sorry, this coupon code has been expired');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else
                    if (response.data == '3' || response.data == '5') {
                        alert('Sorry, this coupon is not valid for this doctor');
                        $('#coupon').val("");
                        $('#coupon_error').html('Sorry,  this coupon is not valid for this doctor');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else
                    if (response.data == '4') {
                        alert('Sorry, this coupon is not valid for this user');
                        $('#coupon').val("");
                        $('#coupon_error').html('Sorry, this coupon is not valid for this user');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else
                    {
                        $('#coupon').val("");
                        $scope.apply = 1;
                        $scope.discountApplied = response.data;
                        $('#coupon_error').html('Coupon Applied.');
                        window.localStorage.setItem('coupondiscount', response.data);
                    }
                    $ionicLoading.hide();
                });
            };

            $ionicModal.fromTemplateUrl('pkg-details', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.select = function (packageId, ind, orderId) {
                console.log(packageId + "==" + ind + "==" + orderId);
                $scope.packageId = packageId;
                $scope.orderId = orderId;
                $scope.selPack = $scope.packages[ind];
                $scope.modal.hide();
            };
            $scope.validate = function (packId, ind, orderId) {
                console.log(packId + "==" + ind + "==" + orderId);
                $ionicLoading.show({template: 'Validating...'});
                $http({
                    method: 'GET',
                    url: domain + 'patient/validate-package',
                    params: {prodId: $scope.prodid, interface: $scope.interface, userId: $scope.userId, packId: packId, orderId: orderId}
                }).then(function successCallback(response) {
                    console.log(response);
                    if (response.data == 'success') {
                        alert("This package is valid");
                        $scope.packageId = packId;
                        $scope.orderId = orderId;
                        $scope.selPack = $scope.packages[ind];
                        $scope.modal.hide();
                    } else if (response.data == 'error') {
                        alert("This package is not valid");
                    }
                    console.log($scope.packageId);
                    $ionicLoading.hide();
                }, function errorCallback(e) {
                    console.log(e);
                });
            };

            $scope.bookWithPackage = function () {
                if ($scope.packageId != 0) {
                    $timeout.cancel(stopped1);
                    $scope.interface = window.localStorage.getItem('interface_id');
                    if (window.localStorage.getItem('instantV') == 'instantV') {
                        $scope.startSlot = window.localStorage.getItem('IVstartSlot');
                        $scope.endSlot = window.localStorage.getItem('IVendSlot');
                    } else {
                        $scope.startSlot = window.localStorage.getItem('startSlot');
                        $scope.endSlot = window.localStorage.getItem('endSlot');
                    }
                    $scope.appUrl = $location.absUrl();
                    $scope.userId = get('id');
                    $scope.discount = window.localStorage.getItem('coupondiscount');
                    $scope.kookooID = window.localStorage.getItem('kookooid');
                    $scope.kookooID = window.localStorage.getItem('kookooid1');
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'patient/book-with-package',
                        params: {interface: $scope.interface, kookooID: $scope.kookooID, ccode: $scope.ccode, discount: $scope.discount, disapply: $scope.discountApplied, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot, packageId: $scope.packageId, prevOrd: $scope.orderId}
                    }).then(function successCallback(response) {
                        $ionicLoading.hide();
                        window.localStorage.removeItem('coupondiscount');
                        window.localStorage.setItem('coupondiscount', '')
                        console.log(response.data);
                        $scope.discountval = response.data.discount;
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        //$timeout.cancel(stopped1);
                        $state.go('app.thankyou', {'data': response.data}, {reload: true});
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                } else {
                    alert("Please select the package to pay with!");
                }
            };

        })

        .controller('pkgViewCtrl', function ($scope, $ionicModal, $http, $stateParams, $state, $ionicLoading) {
            $ionicModal.fromTemplateUrl('pkg-details', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

        })

        .controller('ThankyouCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $sce, $ionicHistory) {
            console.log($stateParams.data);
            $scope.data = $stateParams.data;
            $scope.id = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'assistants/thankyou-lang',
                params: {id: $scope.id, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log($scope.apkLanguage);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
            }, function errorCallback(response) {
                console.log(response);
            });
            window.localStorage.removeItem('startSlot');
            window.localStorage.removeItem('endSlot');
            window.localStorage.removeItem('prodId');
            window.localStorage.removeItem('supid');
            window.localStorage.removeItem('mode');
            window.localStorage.removeItem('kookooid');
            window.localStorage.removeItem('kookooid1');
            window.localStorage.removeItem('coupondiscount');
            window.localStorage.removeItem('IVendSlot');
            window.localStorage.removeItem('IVstartSlot');
            window.localStorage.removeItem('instantV');
            $scope.gotohome = function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                window.localStorage.removeItem('startSlot');
                window.localStorage.removeItem('endSlot');
                window.localStorage.removeItem('prodId');
                window.localStorage.removeItem('supid');
                window.localStorage.removeItem('mode');
                window.localStorage.removeItem('kookooid');
                window.localStorage.removeItem('kookooid1');
                window.localStorage.removeItem('coupondiscount');
                window.localStorage.removeItem('IVendSlot');
                window.localStorage.removeItem('IVstartSlot');
                window.localStorage.removeItem('instantV');
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
//                $scope.$on("$destroy", function () {
//                    
//                    console.log('cleared');
                // });

                //$state.go('app.category-list', {}, {reload: true});
                $state.go('app.consultations-current', {}, {reload: true});
            }
            $scope.gotoshare = function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                window.localStorage.removeItem('startSlot');
                window.localStorage.removeItem('endSlot');
                window.localStorage.removeItem('prodId');
                window.localStorage.removeItem('supid');
                window.localStorage.removeItem('mode');
                window.localStorage.removeItem('kookooid');
                window.localStorage.removeItem('kookooid1');
                window.localStorage.removeItem('coupondiscount');
                window.localStorage.removeItem('IVendSlot');
                window.localStorage.removeItem('IVstartSlot');
                window.localStorage.removeItem('instantV');
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();

                $state.go('app.category-detail', {}, {reload: true});
            } 
        })

        .controller('ThankyouChatCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $sce, $ionicHistory) {
            console.log($stateParams.data);
            $scope.data = $stateParams.data;
            $scope.id = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $scope.gotoshare = function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                window.localStorage.removeItem('startSlot');
                window.localStorage.removeItem('endSlot');
                window.localStorage.removeItem('prodId');
                window.localStorage.removeItem('supid');
                window.localStorage.removeItem('mode');
                window.localStorage.removeItem('kookooid');
                window.localStorage.removeItem('kookooid1');
                window.localStorage.removeItem('coupondiscount');
                window.localStorage.removeItem('IVendSlot');
                window.localStorage.removeItem('IVstartSlot');
                window.localStorage.removeItem('instantV');
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();

                $state.go('app.category-detail', {}, {reload: true});
            } 
            $http({
                method: 'GET',
                url: domain + 'assistants/thankyou-lang',
                params: {id: $scope.id, interface: $scope.interface}
            }).then(function successCallback(response) {
                //console.log($scope.apkLanguage);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
            }, function errorCallback(response) {
                console.log(response);
            });
            window.localStorage.removeItem('startSlot');
            window.localStorage.removeItem('endSlot');
            window.localStorage.removeItem('prodId');
            window.localStorage.removeItem('supid');
            window.localStorage.removeItem('mode');
            window.localStorage.removeItem('kookooid');
            window.localStorage.removeItem('kookooid1');
            window.localStorage.removeItem('coupondiscount');
            window.localStorage.removeItem('IVendSlot');
            window.localStorage.removeItem('IVstartSlot');
            window.localStorage.removeItem('instantV');
        })

        .controller('GoPayCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $sce, $ionicHistory) {
            console.log($stateParams.link);
            $scope.link = $stateParams.link;
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };
            $timeout(function () {
                jQuery("iframe").css("height", jQuery(window).height());
            }, 100);
            $scope.goPackages = function () {
                $state.go('app.packaging', {}, {reload: true});
            };
        })

        .controller('SuccessCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading) {
            $scope.startSlot = window.localStorage.getItem('startSlot');
            $scope.endSlot = window.localStorage.getItem('endSlot');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'orders/get-order-details',
                params: {id: $stateParams.id, serviceId: $stateParams.serviceId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
                $scope.appointment = responseData.data.app;
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            window.localStorage.removeItem('supid');
            window.localStorage.removeItem('startslot');
            window.localStorage.removeItem('endslot');
            window.localStorage.removeItem('prodid');
            $scope.shareRecords = function (drId) {
                window.localStorage.setItem('shareDrId', drId);
                $state.go('app.category-detail', {}, {reload: true});
            };
        })

        .controller('FailureCtrl', function ($scope, $http, $stateParams, $ionicLoading) {
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'orders/get-failure-order-details',
                params: {id: $stateParams.id, serviceId: $stateParams.serviceId}
            }).then(function successCallback(responseData) {
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            window.localStorage.removeItem('supid');
            window.localStorage.removeItem('slot');
            window.localStorage.removeItem('prodid');
        })

        .controller('CurrentTabCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory) {
            $scope.appId = $stateParams.id;
            $scope.mode = $stateParams.mode;
            $scope.userId = get('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'appointment/get-app-details',
                params: {id: $scope.appId, userId: $scope.userId, mode: $scope.mode}
            }).then(function successCallback(response) {
                $scope.time = response.data.time;
                $scope.endTime = response.data.end_time;
                $scope.app = response.data.app;
                $scope.doctor = response.data.doctorsData;
                $scope.products = response.data.products;
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.joinDoctor = function (mode, start, end, appId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {reload: true});
                } else {
                    alert("You can join video before 15 minutes.");
                }
            };
        })

        .controller('PatientJoinCtrl', function ($window, $ionicPlatform, $scope, $http, $stateParams, $sce, $filter, $timeout, $state, $ionicHistory, $ionicLoading) {
            $ionicLoading.show({template: 'Loading...'});
            $scope.interface = window.localStorage.getItem('interface_id');
//            if (!get('loadedOnce')) {
//                store({'loadedOnce': 'true'});
//                $window.location.reload(true);
//                // don't reload page, but clear localStorage value so it'll get reloaded next time
//                $ionicLoading.hide();
//            } else {
//                // set the flag and reload the page
//                window.localStorage.removeItem('loadedOnce');
//                $ionicLoading.hide();
//            }
            // $ionicHistory.clearCache();
            var statstimer;
            $scope.appId = $stateParams.id;
            $scope.mode = $stateParams.mode;
            $scope.vjhId = '';
            $scope.framerate = '';
            $scope.userId = get('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

            $scope.$on('$destroy', function () {

                try {
                    publisher.off();
                    //alert('EXIT : publisher off try');
                    publisher.destroy();
                    //alert('publisher destroy');
                    subscriber.destroy();
                    //alert('subscriber destroy');
                    //session.unsubscribe();
                    session.off();
                    //alert('EXIT : session off try');
                    session.disconnect();
                    // alert('session disconnected try');
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    window.clearInterval(statstimer);
                    statstimer = '';


                } catch (err) {
                    // alert('err while exitvideo ' + err);
                    session.off();
                    // alert('EXIT : session off catch');
                    session.disconnect();
                    // alert('session disconnected catch');
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    window.clearInterval(statstimer);
                    statstimer = '';

                }
            });
            $scope.pushEvent = 'video_join';
            $http({
                method: 'GET',
                url: domain + 'appointment/join-doctor',
                params: {id: $scope.appId, userId: $scope.userId, mode: $scope.mode, interface: $scope.interface}
            }).then(function sucessCallback(response) {
                console.log(response.data);

                $scope.user = response.data.user;
                $scope.app = response.data.app;
                $scope.vjhId = response.data.vjhId;
                //$scope.oToken = "https://test.doctrs.in/opentok/opentok?session=" + response.data.app[0].appointments.opentok_session_id;
                var apiKey = response.data.key; //'45121182';
                console.log("@@@@@" + apiKey);
                var sessionId = response.data.app[0].appointments.opentok_session_id;
                console.log('sessionId' + sessionId);
                var token = response.data.oToken;
                console.log('token' + token);
                if (OT.checkSystemRequirements() == 1) {
                    session = OT.initSession(apiKey, sessionId);
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                    alert("Your device is not compatible");
                }

                session.on({
                    streamDestroyed: function (event) {
                        event.preventDefault();
                        window.clearInterval(statstimer);
                        statstimer = '';
                        var subscribers = session.getSubscribersForStream(event.stream);
                        console.log('stream distroy: ' + subscribers);
                        // alert('stream distroy length: ' + subscribers.length);
                        console.log('on streamDestroyed Destroy reason: ' + event.reason);
                        // alert('on streamDestroyed  reason: ' + event.reason);

                        jQuery("#subscribersDiv").html("Doctor left the consultation");
                        session.unsubscribe();
                    },
                    streamCreated: function (event) {
                        $ionicLoading.hide();
                        console.log('stream created....');
                        subscriber = session.subscribe(event.stream, 'subscribersDiv', {width: "100%", height: "100%", subscribeToAudio: true},
                                function (error) {
                                    if (error) {
                                        console.log("subscriber Error " + error.code + '--' + error.message);
                                    } else {
                                        console.log('Subscriber added.');
                                        var subscribers2 = session.getSubscribersForStream(event.stream);
                                        console.log('Subscriber length.' + subscribers2.length);
                                        // alert('APK Subscriber length.' + subscribers2.length)
                                        console.log('stream created: ' + subscribers2);

                                        var prevStats;
                                        statstimer = window.setInterval(function () {
                                            $ionicLoading.hide();
                                            subscriber.getStats(function (error, stats) {
                                                if (error) {
                                                    console.error('Error getting subscriber stats. ', error.message);
                                                    return;
                                                }
                                                if (prevStats) {
                                                    var videoPacketLossRatio = stats.video.packetsLost /
                                                            (stats.video.packetsLost + stats.video.packetsReceived);
                                                    console.log('video packet loss ratio: ', videoPacketLossRatio);
                                                    var videoBitRate = 8 * (stats.video.bytesReceived - prevStats.video.bytesReceived);
                                                    console.log('video bit rate: ', videoBitRate, 'bps');
                                                    var audioPacketLossRatio = stats.audio.packetsLost /
                                                            (stats.audio.packetsLost + stats.audio.packetsReceived);
                                                    console.log('audio packet loss ratio: ', audioPacketLossRatio);
                                                    var audioBitRate = 8 * (stats.audio.bytesReceived - prevStats.audio.bytesReceived);
                                                    console.log('audio bit rate: ', audioBitRate, 'bps');
                                                    $ionicLoading.hide();
                                                    $http({
                                                        method: 'GET',
                                                        url: domain + 'log/stats-log',
                                                        params: {id: $scope.appId,
                                                            userId: $scope.userId,
                                                            videoPacketLossRatio: videoPacketLossRatio,
                                                            videoBitRate: videoBitRate,
                                                            audioPacketLossRatio: audioPacketLossRatio,
                                                            audioBitRate: audioBitRate
                                                        }
                                                    }).then(function successCallback(response) {
                                                        $ionicLoading.hide();
                                                    }, function errorCallback(e) {

                                                    });
                                                }
                                                prevStats = stats;
                                            });

                                        }, 5000);

                                    }
                                });

                        $http({
                            method: 'GET',
                            url: domain + 'appointment/update-join',
                            params: {id: $scope.appId, userId: $scope.userId}
                        }).then(function sucessCallback(response) {
                            console.log(response);
                            $ionicLoading.hide();
                        }, function errorCallback(e) {
                            $ionicLoading.hide();
                            console.log(e);
                        });
                    },
                    sessionDisconnected: function (event) {
                        var subscribers3 = session.getSubscribersForStream(event.stream);
                        console.log('sessionDisconnected : ' + subscribers3.length);
                        if (event.reason === 'networkDisconnected') {
                            $ionicLoading.hide();
                            alert('You lost your internet connection.'
                                    + 'Please check your connection and try connecting again.');
                            var subscribers4 = session.getSubscribersForStream(event.stream);
                            console.log('sessionDisconnected----1 : ' + subscribers4.length);


                        }
                    }
                });

                session.connect(token, function (error) {
                    if (error) {
                        $ionicLoading.hide();
                        alert("Error connecting session patient: ", error.code, error.message);
                    } else {
                        publisher = OT.initPublisher('myPublisherDiv', {width: "30%", height: "30%"});
                        session.publish(publisher, function (error) {
                            if (error) {
                                //  console.log("publisher Error code/msg: ", error.code, error.message);
                            } else {
                                $http({
                                    method: 'GET',
                                    url: domain + 'notification/push-notification',
                                    params: {id: $scope.appId, userId: $scope.userId, pushEvent: $scope.pushEvent}
                                }).then(function successCallback(response) {

                                }, function errorCallback(e) {

                                });
                                publisher.on('streamCreated', function (event) {
                                    var subscribers5 = session.getSubscribersForStream(event.stream);
                                    //console.log('on publish: ' + subscribers5);
                                    console.log('on publish lenghth.' + subscribers5.length);
                                    //alert('APK on publish lenghth.');
                                    //  console.log('stream created: ' + subscribers5);


                                });

                                publisher.on('streamDestroyed', function (event) {
                                    var subscribers6 = session.getSubscribersForStream(event.stream);
                                    console.log('on Destroy: ' + subscribers6);
                                    // alert('on publisher Destroy: ' + subscribers6.length);
                                    console.log('on publisher Destroy reason: ' + event.reason);
                                    // alert('on publisher Destroy reason: ' + event.reason);

                                    // session.unsubscribe();
                                    subscriber.destroy();
                                    // console.log("subscriber.destroy" + subscriber.destroy);
                                    alert("subscriber destroy because publish stream destroyed");
                                    // session.disconnect()
                                });

                                var mic = 1;
                                var mute = 1;
                                var mutevideo = 1;
                                jQuery(".muteVideo").click(function () {
                                    console.log('fasfd');
                                    if (mutevideo == 1) {
                                        publisher.publishVideo(false);
                                        mutevideo = 0;
                                    } else {
                                        publisher.publishVideo(true);
                                        mutevideo = 1;
                                    }
                                });
                                jQuery(".muteMic").click(function () {
                                    if (mic == 1) {
                                        publisher.publishAudio(false);
                                        mic = 0;
                                        $ionicLoading.hide();
                                    } else {
                                        publisher.publishAudio(true);
                                        mic = 1;
                                        $ionicLoading.hide();
                                    }
                                });
                                jQuery(".muteSub").click(function () {
                                    if (mute == 1) {
                                        subscriber.subscribeToAudio(false);
                                        mute = 0;
                                        $ionicLoading.hide();
                                    } else {
                                        subscriber.subscribeToAudio(true);
                                        mute = 1;
                                        $ionicLoading.hide();
                                    }
                                });

                            }
                        });
                    }
                });
            }, function errorCallback(e) {
                console.log(e);
                $ionicLoading.hide();
            });
            $scope.exitVideo = function () {
                try {
                    publisher.off();
                    // alert('EXIT : publisher off try');
                    publisher.destroy();
                    //alert('publisher destroy');
                    subscriber.destroy();
                    //alert('subscriber destroy');
                    //session.unsubscribe();
                    session.off();
                    //alert('EXIT : session off try');
                    session.disconnect();
                    // alert('session disconnected try');
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    window.clearInterval(statstimer);
                    statstimer = '';


                } catch (err) {
                    //   alert('err while exitvideo ' + err);
                    session.off();
                    //   alert('EXIT : session off catch');
                    session.disconnect();
                    //  alert('session disconnected catch');
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    window.clearInterval(statstimer);
                    statstimer = '';

                }
                $http({
                    method: 'GET',
                    url: domain + 'appointment/patient-exit-video',
                    params: {id: $scope.appId, userId: $scope.userId}
                }).then(function successCallback(response) {
                    $state.go('app.consultations-current', {}, {reload: true});
                }, function errorCallback(e) {

                    $state.go('app.consultations-current', {}, {reload: true});
                });

            };


            /* rightsidetab */
            $scope.intext = 'more';
            $scope.infomore = function (r) {
                jQuery('#' + r).toggleClass('active');
                if (jQuery('#' + r).hasClass('active')) {
                    $scope.intext = 'less'
                } else {
                    $scope.intext = 'more';
                }

            }

            sidetab('#cstab1');
            // sidetab('#cstab2');

            $scope.pulltab = function (d) {
                var ww = (jQuery(window).width()) - 40;
                jQuery('#' + d).toggleClass('active');
                if (jQuery('#' + d).hasClass('active')) {
                    jQuery('#' + d).css('transform', 'translate3d(0px, 0px, 0px)')
                } else {
                    jQuery('#' + d).css('transform', 'translate3d(' + ww + 'px, 0px, 0px)')
                }


            }

            /* end of rightsidetab */




        })

        .controller('ChatListCtrl', function ($scope, $state, $filter, $http, $stateParams, $rootScope, $ionicLoading) {
            $scope.doctorId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.curDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.participant = [];
            $scope.msg = [];
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctorsapp/get-active-chats',
                params: {drid: $scope.doctorId, interface: $scope.interface}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.chatParticipants = response.data.participants;
                $scope.language = response.data.lang.language;
                $scope.langtext = response.data.langtext;
                angular.forEach($scope.chatParticipants, function (value, key) {
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'doctorsapp/get-chat-msg',
                        params: {partId: value[0].participant_id, chatId: value[0].chat_id}
                    }).then(function successCallback(responseData) {
                        console.log('Msg ' + responseData.data.msg)
                        if (responseData.data.msg !== null) {
                            //keygeneration
                            var partA = responseData.data.user[0].id.toString();
                            var partB = window.localStorage.getItem('id').toString();
                            var passphrase = "9773001965";
                            if (partA > partB) {
                                passphrase = partA + partB;
                            } else {
                                passphrase = partB + partA;
                            }
                            privateKey = cryptico.generateRSAKey(passphrase, 1024);
                            responseData.data.msg.message = decrypt(responseData.data.msg.message);
                        }
                        console.log(responseData);
                        $scope.participant[key] = responseData.data.user;
                        $scope.msg[key] = responseData.data.msg;
                        $rootScope.$digest;
                        $ionicLoading.hide();
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });
                });
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.goChat = function (chatId, chatStart, chatDate) {
                console.log(chatId + "=====" + chatStart + "========" + chatDate);
                console.log(chatStart + "@@@" + $scope.curDate);
                //var chatDate = $filter('date')(chatStart, 'MMM dd, yyyy - HH:mm a');
                if (chatStart <= $scope.curDate)
                    $state.go('app.chat', {'id': chatId}, {reload: true});
                else {
                    alert('You can start chat at ' + chatDate);
                }
            };
        })

        .controller('PastChatListCtrl', function ($scope, $filter, $http, $stateParams, $rootScope, $ionicLoading) {
            $scope.doctorId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.curDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            $scope.participant = [];
            $scope.msg = [];
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctorsapp/get-past-chats',
                params: {drid: $scope.doctorId, interface: $scope.interface}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.chatParticipants = response.data.participants;
                $scope.language = response.data.lang.language;
                $scope.langtext = response.data.langtext;
                angular.forEach($scope.chatParticipants, function (value, key) {
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'doctorsapp/get-chat-msg',
                        params: {partId: value[0].participant_id, chatId: value[0].chat_id}
                    }).then(function successCallback(responseData) {
                        if (responseData.data.msg !== null) {
                            //keygeneration

                            var partA = responseData.data.user[0].id.toString();
                            var partB = window.localStorage.getItem('id').toString();
                            var passphrase = "9773001965";
                            if (partA > partB) {
                                passphrase = partA + partB;
                            } else {
                                passphrase = partB + partA;
                            }
                            privateKey = cryptico.generateRSAKey(passphrase, 1024);
                            responseData.data.msg.message = decrypt(responseData.data.msg.message);
                        }
                        console.log(responseData);
                        $scope.participant[key] = responseData.data.user;
                        $scope.msg[key] = responseData.data.msg;
                        $rootScope.$digest;
                        $ionicLoading.hide();
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });
                });
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('ChatCtrl', function ($scope, $state, $http, $stateParams, $timeout, $filter, $ionicLoading, $ionicScrollDelegate) {

            $scope.chatId = $stateParams.id;
            window.localStorage.setItem('chatId', $stateParams.id);
            $scope.partId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.msg = '';
            $scope.chatMsgs = [];
            //var apiKey = '45121182';
            //console.log($scope.chatId);
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctorsapp/get-chat-token',
                params: {chatId: $scope.chatId, userId: $scope.partId, interface: $scope.interface}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.user = response.data.user;
                $scope.otherUser = response.data.otherUser;
                $scope.chatMsgs = response.data.chatMsgs;
                $scope.token = response.data.token;
                $scope.otherToken = response.data.otherToken;
                $scope.sessionId = response.data.chatSession;
                $scope.chatActive = response.data.chatActive;

                //keygeneration

                var partA = $scope.user.id.toString();
                var partB = $scope.otherUser.id.toString();
                var passphrase = "9773001965";
                if (partA > partB) {
                    passphrase = partA + partB;
                } else {
                    passphrase = partB + partA;
                }
                privateKey = cryptico.generateRSAKey(passphrase, 1024);
                publicKey = cryptico.publicKeyString(privateKey);

                window.localStorage.setItem('Toid', $scope.otherUser.id);
                //$scope.connect("'" + $scope.token + "'");
                $scope.apiKey = response.data.apiKey;
                var session = OT.initSession($scope.apiKey, $scope.sessionId);
                $scope.session = session;
                var chatWidget = new OTSolution.TextChat.ChatWidget({session: $scope.session, container: '#chat'});
                console.log(chatWidget);
                session.connect($scope.token, function (err) {
                    if (!err) {
                        console.log("Connection success");
                    } else {
                        console.error(err);
                    }
                });
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.returnjs = function () {
                jQuery(function () {
                    var wh = jQuery('window').height();
                    //  jQuery('#chat').css('height', wh);
                    //  console.log(wh);

                })
            };
            $scope.returnjs();
            $scope.iframeHeight = $(window).height() - 87;
            //   $('#chat').css('height', $scope.iframeHeight);
            //Previous Chat 
            $scope.appendprevious = function () {
                $ionicLoading.show({template: 'Retrieving messages...'});
                $(function () {
                    angular.forEach($scope.chatMsgs, function (value, key) {
                        value.message = decrypt(value.message);
                        var msgTime = $filter('date')(new Date(value.tstamp), 'd MMM, yyyy - HH:mm a');
                        if (value.sender_id == $scope.partId) {
                            $ionicLoading.hide();
                            $('#chat .ot-textchat .ot-bubbles').append('<section class="ot-bubble mine" data-sender-id=""><div><header class="ot-bubble-header"><p class="ot-message-sender"></p><time class="ot-message-timestamp">' + msgTime + '</time></header><div class="ot-message-content">' + value.message + '</div></div></section>');
                        } else {
                            $ionicLoading.hide();
                            $('#chat .ot-textchat .ot-bubbles').append('<section class="ot-bubble" data-sender-id=""><div><header class="ot-bubble-header"><p class="ot-message-sender"></p><time class="ot-message-timestamp">' + msgTime + '</time></header><div class="ot-message-content">' + value.message + '</div></div></section>');
                        }
                    });
                })
            };

            $timeout(function () {
                console.log("append");
                if ($scope.chatMsgs.length > 0) {
                    $scope.appendprevious();
                    $ionicScrollDelegate.scrollBottom([true]);

                } else {
                    $ionicScrollDelegate.scrollBottom([true]);
                    //$('#chat').html('<p> No </p>');
                }
            }, 2000);
            $scope.msgSend = function () {
                $timeout(function () {
                    $ionicScrollDelegate.scrollBottom([true]);
                }, 500);
            };

            $scope.getchatsharedata = function () {
                $state.go('app.chat-video-share', {reload: true});

            }

        })

        .controller('PastChatCtrl', function ($scope, $ionicLoading, $http, $stateParams, $timeout, $filter) {
            $scope.chatId = $stateParams.id;
            window.localStorage.setItem('chatId', $stateParams.id);
            $scope.partId = get('id');
            $scope.interface = get('interface_id');
            $scope.apkLanguage = get('apkLanguage');
            $scope.msg = '';
            $scope.chatMsgs = [];
            $http({
                method: 'GET',
                url: domain + 'doctorsapp/get-chat-token-past',
                params: {chatId: $scope.chatId, userId: $scope.partId, interface: $scope.interface}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.user = response.data.user;
                $scope.otherUser = response.data.otherUser;
                $scope.chatMsgs = response.data.chatMsgs;
                $scope.sessionId = response.data.chatSession;
                $scope.chatActive = response.data.chatActive;
                $scope.apiKey = response.data.apiKey;
                //keygeneration

                var partA = $scope.user.id.toString();
                var partB = $scope.otherUser.id.toString();
                var passphrase = "9773001965";
                if (partA > partB) {
                    passphrase = partA + partB;
                } else {
                    passphrase = partB + partA;
                }
                privateKey = cryptico.generateRSAKey(passphrase, 1024);
                publicKey = cryptico.publicKeyString(privateKey);
                console.log(response.data.chatMsgs);
                // $scope.apiKey = apiKey;
                // var session = OT.initSession($scope.apiKey, $scope.sessionId);
                // $scope.session = session;
                // var chatWidget = new OTSolution.TextChat.ChatWidget({session: $scope.session, container: '#chat'});
                // console.log("error source 1" + chatWidget);

            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.returnjs = function () {
                jQuery(function () {
                    var wh = jQuery('window').height();
                    jQuery('#chat').css('height', wh);
                    //  console.log(wh);
                })
            };
            $scope.returnjs();
            $scope.iframeHeight = $(window).height() - 88;
            $('#chat').css('height', $scope.iframeHeight);
            //Previous Chat 

            $scope.appendprevious = function () {
                $ionicLoading.show({template: 'Retrieving messages...'});
                $(function () {
                    angular.forEach($scope.chatMsgs, function (value, key) {
                        value.message = decrypt(value.message);
                        var msgTime = $filter('date')(new Date(value.tstamp), 'd MMM, yyyy - HH:mm a');
                        if (value.sender_id == $scope.partId) {
                            $ionicLoading.hide();
                            $('#pchat .ot-textchat .ot-bubbles').append('<section class="ot-bubble mine" data-sender-id=""><div><header class="ot-bubble-header"><p class="ot-message-sender"></p><time class="ot-message-timestamp">' + msgTime + '</time></header><div class="ot-message-content">' + value.message + '</div></div></section>');
                        } else {
                            $ionicLoading.hide();
                            $('#pchat .ot-textchat .ot-bubbles').append('<section class="ot-bubble" data-sender-id=""><div><header class="ot-bubble-header"><p class="ot-message-sender"></p><time class="ot-message-timestamp">' + msgTime + '</time></header><div class="ot-message-content">' + value.message + '</div></div></section>');
                        }
                    });
                });
            };

            $scope.movebottom = function () {
                jQuery(function () {
                    var dh = $('.ot-bubbles').height();
                    $('.chatscroll').scrollTop(dh);
                });
            };

            $timeout(function () {
                $scope.appendprevious();
                $scope.movebottom();
            }, 1000);
            $scope.getchatsharedata = function () {
                $http({
                    method: 'GET',
                    url: domain + 'contentlibrary/get-video-chat-share-data',
                    params: {userId: window.localStorage.getItem('id'), chatId: $scope.chatId}
                }).then(function sucessCallback(response) {
                    console.log(response.data);
                    $scope.videodata = response.data;
                    $state.go('app.chat-video-share', {reload: true});
                }, function errorCallback(response) {
                    console.log(response.responseText);
                });
            }
        })

        .controller('JoinChatCtrl', function ($scope, $http, $stateParams, $sce, $ionicLoading) {
            $scope.appId = $stateParams.id;
            $scope.mode = $stateParams.mode;
            $scope.userId = get('id');
            $scope.msgs = {};
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'chat/patient-join-chat',
                params: {id: $scope.appId, userId: $scope.userId, mode: $scope.mode}
            }).then(function sucessCallback(response) {
                $ionicLoading.hide();
                //console.log(response.data);
                $scope.user = response.data.user;
                $scope.app = response.data.app;
                $scope.msgs = response.data.chat;
                //$scope.oToken = "https://test.doctrs.in/opentok/opentok?session=" + response.data.app[0].appointments.opentok_session_id;
                var apiKey = '45121182';
                var sessionId = response.data.app[0].appointments.opentok_session_id;
                var token = response.data.oToken;
                var session = OT.initSession(apiKey, sessionId);
                session.connect(token, function (error) {
                    if (error) {
                        console.log("Error connecting: ", error.code, error.message);
                    } else {
                        console.log("Connected to the session.");
                    }
                });
                session.on("signal", function (event) {
                    console.log("Signal sent from connection " + event.from.id);
                    $('#subscribersDiv').append(event.data);
                });
                $scope.send = function () {
                    session.signal({data: jQuery("[name='msg']").val()},
                            function (error) {
                                if (error) {
                                    console.log("signal error ("
                                            + error.code
                                            + "): " + error.message);
                                } else {
                                    var msg = jQuery("[name='msg']").val();
                                    $http({
                                        method: 'GET',
                                        url: domain + 'chat/add-patient-chat',
                                        params: {from: $scope.userId, to: $scope.user[0].id, msg: msg}
                                    }).then(function sucessCallback(response) {
                                        console.log(response);
                                        jQuery("[name='msg']").val('');
                                    }, function errorCallback(e) {
                                        console.log(e.responseText);
                                    });
                                    console.log("signal sent.");
                                }
                            }
                    );
                };
            }, function errorCallback(e) {
                console.log(e.responseText);
            });
        })

        .controller('CheckavailableCtrl', function ($scope, $rootScope, $ionicLoading, $state, $http, $stateParams, $timeout, $ionicModal, $ionicPopup) {
            $scope.data = $stateParams.data;
            $scope.uid = $stateParams.uid;
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'kookoo/check-doctor-availability',
                params: {id: $scope.uid, interface: $scope.interface}
            }).then(function successCallback(responseData) {
                $scope.check_availability = responseData.data.check_availability;
                $scope.instant_video = responseData.data.instant_video;
                $scope.language = responseData.data.lang.language;
                $ionicLoading.hide();
            });

            /* patient confirm */
            $scope.showConfirm = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: '<p align="center"><strong>Doctor is Available</strong></p><div>The specialist has accepted your request for an instant video call. Do you want to continue?</div>'
                });
                confirmPopup.then(function (res) {
                    if (res != true) {
                        $scope.kookooID = window.localStorage.getItem('kookooid');
                        $scope.prodid = window.localStorage.getItem('prodId');
                        $ionicLoading.show({template: 'Loading...'});
                        $http({
                            method: 'GET',
                            url: domain + 'kookoo/reject-by-patient',
                            params: {kookooid: $scope.kookooID}
                        }).then(function successCallback(patientresponse) {
                            console.log(patientresponse.data);
                            window.localStorage.removeItem('kookooid');
                            //$state.go('app.consultations-profile', {'data': $scope.prodid}, {reload: true});
                            if ($rootScope.single == 'profile') {
                                $state.go('app.single-profile', {'id': $scope.uid}, {reload: true});
                            } else {
                                $state.go('app.consultation-profile', {'id': $scope.uid}, {reload: true});
                            }
                        }, function errorCallback(patientresponse) {
                            //  alert('Oops something went wrong!');
                        });
                    } else {
                        $http({
                            method: 'GET',
                            url: domain + 'kookoo/accept-by-patient',
                            params: {kookooid: $scope.kookooID}
                        }).then(function successCallback(patientresponse) {
                            console.log(patientresponse.data);
                            // window.localStorage.setItem('kookooid', response.data);
                            $state.go('app.payment', {}, {reload: true});
                        }, function errorCallback(patientresponse) {
                            //  alert('Oops something went wrong!');
                        });
                    }
                });
            };
            /*timer */
            $scope.IsVisible = false;
            $scope.counter = 60;
            var stopped;
            $scope.countdown = function (dataId, uid) {
                // dataId product id , uid =>user id
                // console.log("dataId"+dataId);
                // console.log("uid"+uid)
                window.localStorage.setItem('prodId', $scope.data);
                window.localStorage.setItem('instantV', 'instantV');
                window.localStorage.setItem('mode', 1);
                //alert(dataId);
                $scope.kookooID = window.localStorage.getItem('kookooid');
                var myListener = $rootScope.$on('loading:show', function (event, data) {
                    $ionicLoading.hide();
                });
                $scope.$on('$destroy', myListener);
                var myListenern = $rootScope.$on('loading:hide', function (event, data) {
                    $ionicLoading.hide();
                });
                $scope.$on('$destroy', myListenern);
                $scope.$on('$destroy', function () {
                    $scope.checkavailval = 0;
                    // console.log("jhffffhjfhj" + $scope.checkavailval);
                    $timeout.cancel(stopped);
                    window.localStorage.removeItem('kookooid');
                });
                $http({
                    method: 'GET',
                    url: domain + 'kookoo/check-kookoo-value',
                    params: {kookooId: $scope.kookooID}
                }).then(function successCallback(responsekookoo) {
                    console.log(responsekookoo.data);
                    $scope.checkavailval = responsekookoo.data;
                    if ($scope.checkavailval == 1) {
                        $timeout.cancel(stopped);
                        $scope.showConfirm();
                        // $state.go('app.payment');

                    } else if ($scope.checkavailval == 2) {
                        $timeout.cancel(stopped);
                        window.localStorage.removeItem('kookooid');
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                        if ($rootScope.single == 'profile') {
                            $state.go('app.single-profile', {'id': $scope.uid}, {reload: true});
                        } else {
                            $state.go('app.consultation-profile', {'id': $scope.uid}, {reload: true});
                        }
                    }

                }, function errorCallback(responsekookoo) {
                    if (responsekookoo.data == 0)
                    {
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                        $state.go('app.consultations-list', {}, {reload: true});
                    }
                });
                $scope.IsVisible = true;
                stopped = $timeout(function () {
                    // console.log($scope.counter);
                    $scope.counter--;
                    $scope.countdown();
                }, 1000);
                if ($scope.counter == 59) {
                    $scope.kookooID = window.localStorage.getItem('kookooid');
                    var myListener = $rootScope.$on('loading:show', function (event, data) {
                        $ionicLoading.hide();
                    });
                    $scope.$on('$destroy', myListener);
                    var myListenern = $rootScope.$on('loading:hide', function (event, data) {
                        $ionicLoading.hide();
                    });
                    $scope.$on('$destroy', myListenern);
                    $http({
                        method: 'GET',
                        url: domain + 'kookoo/check-doctrs-response',
                        params: {uid: $scope.uid, pid: window.localStorage.getItem('id'), interface: $scope.interface}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        if (response.data == '0')
                        {
                            alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                            $timeout.cancel(stopped);
                            if ($rootScope.single == 'profile') {
                                $state.go('app.single-profile', {'id': $scope.uid}, {reload: true});
                            } else {
                                $state.go('app.consultation-profile', {'id': $scope.uid}, {reload: true});
                            }

                        } else {
                            window.localStorage.setItem('kookooid', response.data);
                            window.localStorage.setItem('kookooid1', response.data);
                        }

                    }, function errorCallback(response) {
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                        //$state.go('app.consultation-profile', {'id': $scope.product[0].user_id}, {reload: true});
                        if ($rootScope.single == 'profile') {
                            $state.go('app.single-profile', {'id': $scope.uid}, {reload: true});
                        } else {
                            $state.go('app.consultation-profile', {'id': $scope.uid}, {reload: true});
                        }
                    });
                }

                if ($scope.counter == 0) {
                    $scope.IsVisible = false;
                    // $scope.showConfirm();
                    $timeout.cancel(stopped);
                    alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                    $state.go('app.consultation-profile', {'id': $scope.uid}, {reload: true});
                }
            };
            $scope.hidediv = function () {
                $scope.IsVisible = false;
                $timeout.cancel(stopped);
                $scope.prodid = window.localStorage.getItem('prodId');
                $scope.kookooID = window.localStorage.getItem('kookooid');
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'kookoo/cancel-by-patient',
                    params: {kookooid: $scope.kookooID}
                }).then(function successCallback(patientresponse) {
                    console.log(patientresponse.data);
                    $timeout.cancel(stopped);
                    window.localStorage.removeItem('kookooid');
                    $state.go('app.consultation-profile', {'id': $scope.uid}, {reload: true});
                    $ionicLoading.hide();
                    if ($rootScope.single == 'profile') {
                        $state.go('app.single-profile', {'id': $scope.product[0].user_id}, {reload: true});
                    } else {
                        $state.go('app.consultation-profile', {'id': $scope.product[0].user_id}, {reload: true});
                    }
                }, function errorCallback(patientresponse) {

                });
                // $scope.counter = 20;
            };
        })

        .controller('packagingCtrl', function ($scope, $http, $rootScope, $ionicLoading, $state, $stateParams, $ionicModal) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = get('id');
            $scope.doctrs = [];
            $ionicLoading.show({'template': 'Loading..'});
            $http({
                method: 'GET',
                url: domain + 'patient/get-packages',
                params: {interface: $scope.interface, userId: $scope.userId}
            }).then(function successCallback(response) {
                console.log(response.data.packages);
                $scope.packages = response.data.packages;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });

        })

        .controller('PackagingDetailCtrl', function ($scope, $http, $rootScope, $ionicLoading, $state, $stateParams) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = get('id');
            $scope.packageId = $stateParams.id;
            $scope.ordId = '';
            $ionicLoading.show({'template': 'Loading..'});
            $http({
                method: 'GET',
                url: domain + 'patient/get-package-details',
                params: {interface: $scope.interface, userId: $scope.userId, packageId: $scope.packageId, ordId: $scope.ordId}
            }).then(function successCallback(response) {
                console.log(response.data.packages);
                $scope.pack = response.data.packages;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('pkgDetailsCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('pkg-details', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
        })

        .controller('pkgtermsCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('pkg-terms', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
        })

        .controller('alldoctrsCtrl', function ($scope, $ionicModal, $http, $ionicLoading) {
            $ionicModal.fromTemplateUrl('catdoctrs', {
                scope: $scope
            }).then(function ($ionicModal) {
                $scope.modal = $ionicModal;

            });

            $scope.showDrs = function (ind) {
                console.log(ind);
                $scope.doctrs = $scope.packages[ind].specialist;
                $scope.terms = $scope.packages[ind].packages.terms_and_conditions;
                $scope.modal.show();
            };
            $scope.showDr = function () {
                console.log();
                $scope.doctrs = $scope.pack.specialist;
                $scope.terms = $scope.pack.package.terms_and_conditions;
                $scope.modal.show();
            };
        })

        .controller('anydoctrsCtrl', function ($scope, $ionicModal, $http, $ionicLoading) {
            $ionicModal.fromTemplateUrl('anydoctrs', {
                scope: $scope
            }).then(function ($ionicModal) {
                $scope.modal = $ionicModal;

            });
            $scope.showDrs = function (ind) {
                console.log(ind);
                //$scope.doctrs = $scope.packages[ind].specialist;
                $scope.terms = $scope.packages[ind].packages.terms_and_conditions;
                $scope.modal.show();
            };
            $scope.showDr = function () {
                console.log();
                //$scope.doctrs = $scope.packages[ind].specialist;
                $scope.terms = $scope.pack.package.terms_and_conditions;
                $scope.modal.show();
            };
        })

        .controller('infodoctrsCtrl', function ($scope, $ionicModal, $http, $ionicLoading) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $ionicModal.fromTemplateUrl('infodoctrs', {
                scope: $scope
            }).then(function ($ionicModal) {
                $scope.modal = $ionicModal;
                $scope.showDr = function (drId) {
                    $http({
                        method: 'GET',
                        url: domain + 'patient/get-dr-details',
                        params: {drId: drId, interface: $scope.interface}
                    }).then(function successCallback(response) {
                        console.log(response.data.doctr);
                        $scope.doc = response.data.doctr;
                        //$ionicLoading.hide();
                        $scope.modal.show();
                    }, function errorCallback(e) {
                        console.log(e);
                    });
                };
            });
        })

        .controller('doctrsInfoCtrl', function ($scope, $ionicModal, $http, $ionicLoading) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $ionicModal.fromTemplateUrl('catdoctrs', {
                scope: $scope
            }).then(function ($ionicModal) {
                $scope.modal = $ionicModal;
                $scope.showDrs = function (catId) {

                    $http({
                        method: 'GET',
                        url: domain + 'patient/get-cat-doctrs',
                        params: {catId: catId, interface: $scope.interface}
                    }).then(function successCallback(response) {
                        console.log(response.data.doctrs);
                        $scope.doctrs = response.data.doctrs;
                        //$ionicLoading.hide();
                        $scope.modal.show();
                    }, function errorCallback(e) {
                        console.log(e);
                    });
                };
            });
        })

        .controller('packageConfirmCtrl', function ($scope, $ionicModal, $rootScope, $http, $ionicLoading, $stateParams, $timeout, $filter, $ionicHistory, $state, $location) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = get('id');
            //Set Product Id
            window.localStorage.setItem('prodId', $stateParams.id);
            $scope.packageId = $stateParams.id;
            $scope.prodId = $stateParams.id;
            $scope.appUrl = $location.absUrl().split('#')[0];
            console.log($scope.appUrl);
            $scope.counter1 = 300;
            var stopped1;
            $scope.apply = '0';
            $scope.ccode = '';
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.discountApplied = '0';

            $scope.$on('$destroy', function () {
                $timeout.cancel(stopped1);
            })

            $scope.paynowcountdown = function () {
                stopped1 = $timeout(function () {
                    console.log($scope.counter1);
                    $scope.counter1--;
                    $scope.paynowcountdown();
                }, 1000);
                if ($scope.counter1 == 0) {
                    //console.log('fadsf af daf');
                    $timeout.cancel(stopped1);
                    alert('Sorry, Your payment time expired');
                    $state.go('app.packaging', {reload: true});

                }
            };
            $ionicLoading.show({'template': 'Loading..'});
            $http({
                method: 'GET',
                url: domain + 'patient/get-package-details',
                params: {interface: $scope.interface, userId: $scope.userId, packageId: $scope.packageId}
            }).then(function successCallback(response) {
                console.log(response.data.packages);
                $scope.pack = response.data.packages;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                if ($scope.pack.package.doctor_restriction == 1) {
                    $scope.doctr = $scope.pack.specialist;
                } else {
                    $scope.doctr = 'all';
                }
                $ionicLoading.hide();
                $timeout(function () {
                    $scope.paynowcountdown();
                }, 0);
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.applyCouponCode = function (ccode) {
                $scope.apply = '0';
                $scope.discountApplied = '0';
                window.localStorage.setItem('coupondiscount', '0');
                $scope.interface = window.localStorage.getItem('interface_id');
                $scope.prodId = window.localStorage.getItem('prodId');
                $scope.userId = get('id');
                $scope.ccode = ccode;
                console.log($scope.discount + '--' + $scope.discountApplied + '++++ ' + $scope.userId);
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'buy/apply-coupon-code',
                    params: {interface: $scope.interface, couponCode: ccode, prodId: $scope.prodId, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    // console.log(response);
                    console.log(response.data);
                    if (response.data == '0') {
                        alert('Please provide a valid coupon code');
                        $('#coupon').val("");
                        $('#coupon_error').html('Please provide a valid coupon code');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else if (response.data == '2') {
                        alert('Sorry, this coupon code has been expired');
                        $('#coupon').val("");
                        $('#coupon_error').html('Sorry, this coupon code has been expired');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else if (response.data == '3' || response.data == '5') {
                        alert('Sorry, this coupon is not valid for this doctor');
                        $('#coupon').val("");
                        $('#coupon_error').html('Sorry, this coupon is not valid for this doctor');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else if (response.data == '4') {
                        alert('Sorry, this coupon is not valid for this user');
                        $('#coupon').val("");
                        $('#coupon_error').html('Sorry, this coupon is not valid for this user');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else {
                        $('#coupon').val("");
                        $scope.apply = 1;
                        $scope.discountApplied = response.data;
                        $('#coupon_error').html('Coupon Applied.');
                        window.localStorage.setItem('coupondiscount', response.data);
                    }
                    $ionicLoading.hide();
                    console.log($scope.discount + '--' + $scope.discountApplied + '++++ ' + $scope.userId);
                });
            };
            $scope.payNow = function (finalamount) {
                console.log(finalamount);
                $timeout.cancel(stopped1);
                $scope.interface = window.localStorage.getItem('interface_id');
                $scope.userId = get('id');
                $scope.discount = window.localStorage.getItem('coupondiscount');
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'buy/buy-package',
                    params: {interface: $scope.interface, ccode: $scope.ccode, appUrl: $scope.appUrl, discount: $scope.discount, disapply: $scope.discountApplied, prodId: $scope.prodId, userId: $scope.userId}
                }).then(function successCallback(response) {
                    $ionicLoading.hide();
                    window.localStorage.removeItem('coupondiscount');
                    window.localStorage.setItem('coupondiscount', '')
                    console.log(response.data);
                    if (finalamount > 0) {
                        $timeout.cancel(stopped1);
                        $state.go('app.gopayment', {'link': response.data});
                        // console.log(response.data);
                    } else {
                        $scope.discountval = response.data.discount;
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        //$timeout.cancel(stopped1);
                        $state.go('app.thankyoup', {'data': response.data}, {reload: true});
                    }
                }, function errorCallback(response) {
                    console.log(response);
                })
            };


        })

        .controller('GoPaymentCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $sce, $ionicHistory) {
            console.log($stateParams.link);
            $scope.link = $stateParams.link;
            window.localStorage.removeItem('startSlot');
            window.localStorage.removeItem('endSlot');
            window.localStorage.removeItem('prodId');
            window.localStorage.removeItem('supid');
            window.localStorage.removeItem('mode');
            window.localStorage.removeItem('kookooid');
            window.localStorage.removeItem('kookooid1');
            window.localStorage.removeItem('coupondiscount');
            window.localStorage.removeItem('IVendSlot');
            window.localStorage.removeItem('IVstartSlot');
            window.localStorage.removeItem('instantV');
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };
            $timeout(function () {
                jQuery("iframe").css("height", jQuery(window).height());
            }, 100);
            $scope.goPackages = function () {
                $state.go('app.packaging', {}, {reload: true});
            };
        })

        /* packages */
        .controller('ActivePackagesCtrl', function ($scope, $http, $ionicLoading, $state, $stateParams) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = get('id');
            $ionicLoading.show({'template': 'Loading..'});
            $http({
                method: 'GET',
                url: domain + 'patient/get-active-packages',
                params: {interface: $scope.interface, userId: $scope.userId}
            }).then(function successCallback(response) {
                console.log(response.data.packages);
                $scope.packages = response.data.packages;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('PackagesViewCtrl', function ($scope, $http, $rootScope, $ionicLoading, $state, $stateParams) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = get('id');
            $scope.packageId = $stateParams.id;
            $scope.ordId = $stateParams.ord;
            $ionicLoading.show({'template': 'Loading..'});
            $http({
                method: 'GET',
                url: domain + 'patient/get-package-details',
                params: {interface: $scope.interface, userId: $scope.userId, packageId: $scope.packageId, ordId: $scope.ordId}
            }).then(function successCallback(response) {
                console.log(response.data.packages);
                $scope.pack = response.data.packages;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });

        })

        .controller('PastPackagesCtrl', function ($scope, $http, $ionicLoading, $state, $stateParams) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = get('id');
            $ionicLoading.show({'template': 'Loading..'});
            $http({
                method: 'GET',
                url: domain + 'patient/get-past-packages',
                params: {interface: $scope.interface, userId: $scope.userId}
            }).then(function successCallback(response) {
                console.log(response.data.packages);
                $scope.packages = response.data.packages;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });
        })
        /* packages */

        /* Pathology */
        .controller('PathologyCtrl', function ($scope) {})

        .controller('PackagesListCtrl', function ($scope) {})
        /* Pathology */

        .controller('RescheduleCtrl', function ($scope, $http, $stateParams, $ionicLoading, $rootScope, $ionicHistory, $filter, $state) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            console.log($scope.timeLimit);
            $scope.cancelApp = function (appId, drId, mode, startTime, drServId) {
                $scope.appId = appId;
                $scope.userId = get('id');
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(curtime + "===" + startTime + "===" + timeDiff);
                if (timeDiff < $scope.timeLimit) {
                    if (mode == 1) {
                        alert("Appointment can not be cancelled now!");
                    } else {
                        $ionicLoading.show({template: 'Loading...'});
                        $http({
                            method: 'GET',
                            url: domain + 'appointment/cancel-app',
                            params: {appId: $scope.appId, userId: $scope.userId, interface: $scope.interface}
                        }).then(function successCallback(response) {
                            console.log(response.data);
                            $ionicLoading.hide();
                            if (response.data == 'success') {
                                alert('Your appointment is cancelled successfully.');
                                $state.go('app.consultations-current', {}, {reload: true});
                            } else {
                                alert('Sorry your appointment is not cancelled.');
                            }
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    }
                } else {
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'appointment/cancel-app',
                        params: {appId: $scope.appId, userId: $scope.userId, interface: $scope.interface}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        $ionicLoading.hide();
                        if (response.data == 'success') {
                            alert('Your appointment is cancelled successfully.');
                            $state.go('app.consultations-current', {}, {reload: true});
                        } else {
                            alert('Sorry your appointment is not cancelled.');
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
            };
            $scope.rescheduleApp = function (appId, drId, mode, startTime, drServId) {
                console.log(appId + "===" + drId + "===" + mode + "===" + startTime + " === " + drServId);
                $scope.appId = appId;
                $scope.userId = get('id');
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff);
                if (timeDiff < 15) {
                    alert("Sorry. The time limit to reschedule this appointment has expired!");
                } else if (timeDiff > 15) {
                    if (mode == 1) {
                        if (timeDiff < 60) {
                            alert("Sorry. The time limit to reschedule this appointment has expired!");
                        } else {
                            console.log('redirect');
                            window.localStorage.setItem('appId', appId);
                            $state.go('app.reschedule-appointment', {'id': drId, 'drServId': drServId}, {reload: true});
                        }
                    } else {
                        window.localStorage.setItem('appId', appId);
                        $state.go('app.reschedule-appointment', {'id': drId, 'drServId': drServId}, {reload: true});
                    }
                }
            };
        })

        .controller('RescheduleAppointmentCtrl', function ($scope, $http, $ionicModal, $stateParams, $ionicLoading, $rootScope, $ionicHistory, $filter, $state) {
            $scope.pSch = [];
            $scope.schP = [];
            $scope.schdate = [];
            $scope.nextdate = [];
            $scope.appId = window.localStorage.getItem('appId');
            $scope.interface = window.localStorage.getItem('interface_id');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/get-service-details',
                params: {id: $stateParams.id, appId: $scope.appId, drServId: $stateParams.drServId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.appointment = response.data.app;
                $scope.doctor = response.data.user;
                $scope.Prod = response.data.product;
                $scope.Inc = response.data.inclusions;
                $scope.prSch = response.data.pSch;
                angular.forEach($scope.prSch, function (value, key) {
                    var supsassId = value.supersaas_id;
                    //var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    //console.log(supsassId);
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.pSch[key] = responseData.data.slots;
                        $scope.schP[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = tomorrow;
                        } else {
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });
                });
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.getNextSlots = function (nextDate, supsassId, key, serv) {
                console.log(nextDate + '=======' + supsassId + '=====' + key);
                var from = $filter('date')(new Date(nextDate), 'yyyy-MM-dd') + '+05:30:00';  // HH:mm:ss
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    cache: false,
                    params: {id: supsassId, from: from}
                }).then(function successCallback(responseData) {
                    console.log(responseData.data);
                    if (responseData.data.lastdate == '')
                    {
                        $scope.pSch[key] = responseData.data.slots;
                        $scope.schdate[key] = new Date();
                        $scope.nextdate[key] = new Date();
                        $rootScope.$digest;
                    } else {
                        $scope.pSch[key] = responseData.data.slots;
                        $scope.schdate[key] = new Date(responseData.data.lastdate);
                        var tomorrow = new Date(responseData.data.lastdate);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        $rootScope.$digest;
                    }
                    $ionicLoading.hide();
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.getFirstSlots = function (supsassId, key, serv) {
                console.log(supsassId + ' - ' + key + ' - ' + serv);
                //var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    params: {id: supsassId, from: new Date()}
                }).then(function successCallback(responseData) {
                    console.log(responseData);
                    if (responseData.data.slots == '') {
                        $scope.pSch[key] = responseData.data.slots;
                        $scope.schdate[key] = new Date();
                        var tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                    } else {
                        $scope.pSch[key] = responseData.data.slots;
                        $scope.schdate[key] = new Date(responseData.data.lastdate);
                        var tomorrow = new Date(responseData.data.lastdate);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                    }
                    $ionicLoading.hide();
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            /* view more doctor profile modalbox*/
            $ionicModal.fromTemplateUrl('viewmoreprofile.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
            /* end profile */
            $scope.bookSlot = function (starttime, endtime, supid) {
                console.log(starttime + '===' + endtime + '=========' + supid);
                $scope.bookingStart = starttime;
                $scope.bookingEnd = endtime;
                $scope.supId = supid;
            };
            $scope.bookNewAppointment = function (prodId) {
                $scope.prodid = prodId;
                $scope.userId = get('id');
                if ($scope.bookingStart) {
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'appointment/schedule-new-app',
                        params: {interface: $scope.interface, appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.bookingStart, endSlot: $scope.bookingEnd}
                    }).then(function successCallback(response) {
                        console.log(response);
                        $ionicLoading.hide();
                        if (response.data == 'error') {
                            alert("Sorry. The time limit to reschedule this appointment has expired!");
                        } else {
                            if (response.data.httpcode == 'error') {
                                alert("Sorry, new appointment is not booked due to some issue!");
                            } else {
                                alert('Your appointment is rescheduled successfully.');
                                $ionicHistory.clearHistory();
                                $ionicHistory.clearCache();
                                $state.go('app.consultations-current', {}, {reload: true});
                            }
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                } else {
                    alert('Please select slot');
                }
            };
            $scope.cancelReschedule = function () {
                window.localStorage.removeItem('appId');
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.consultations-current', {}, {reload: true});
            };
        })

        .controller('ContentLibraryCtrl', function ($scope, $sce, $http, $ionicModal, $stateParams, $ionicLoading, $rootScope, $ionicHistory, $filter, $state) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $http({
                method: 'GET',
                url: domain + 'contentlibrary/get-patient-article',
                params: {patientId: window.localStorage.getItem('id'), interface: $scope.interface}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.clab = response.data.getArticle;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl($filter('split')(src, '?', 0));
            };
        })

        .controller('ContentLibrarySettingCtrl', function ($scope, $http, $ionicModal, $stateParams, $ionicLoading, $rootScope, $ionicHistory, $filter, $state) {
            $scope.patientId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $http({
                method: 'GET',
                url: domain + 'contentlibrary/get-article-setting',
                params: {patientId: window.localStorage.getItem('id'), interface: $scope.interface}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.category = response.data.category;
                $scope.cat = response.data.cat;
                $scope.lang = response.data.lang;
                $scope.languages = response.data.languages;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.langs.language;

            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.submitSetting = function () {
                $scope.from = get('from');
                $ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#clsetting")[0]);
                callAjax("POST", domain + "contentlibrary/save-clsetting", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();

                    alert('Updated sucessfully.')
                    //  $state.go("app.content-library-setting", {reload: true});

                });



            }
        })

        .controller('reminderCtrl', function ($scope, $http, $filter) {
            $scope.cards = [];
            $scope.curDate = new Date();
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.doRefresh = function () {
                $scope.$broadcast('scroll.refreshComplete');
            };
            $http({
                method: 'GET',
                url: domain + 'tracker/get-reminder',
                params: {userId: window.localStorage.getItem('id'), interface: $scope.interface}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.reminder = response.data.reminder;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;

            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.addCard = function (img, name) {
                var newCard = {image: img, name: name};
                newCard.id = Math.random();
                $scope.cards.unshift(angular.extend({}, newCard));
            };

            $scope.addCards = function (count) {
                $http.get('http://api.randomuser.me/?results=' + count).then(function (value) {
                    angular.forEach(value.data.results, function (v) {
                        $scope.addCard(v.user.picture.large, v.user.name.first + " " + v.user.name.last);
                    });
                });
            };

            $scope.addFirstCards = function () {
                $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png", "Nope");
                $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
            };

            $scope.addFirstCards();
            // $scope.addCards(5);

            $scope.cardDestroyed = function (index) {
                $scope.cards.splice(index, 1);
                //$scope.addCards(1);
            };

            $scope.transitionOut = function (card) {
                console.log('card transition out');


            };

            $scope.transitionRight = function (card) {
                $scope.card = card;
                console.log('card removed to the right');
                console.log(card);
                $http({
                    method: 'GET',
                    url: domain + 'tracker/update-reminder',
                    params: {userId: window.localStorage.getItem('id'), interface: window.localStorage.getItem('interface_id'), aid: $scope.card, captured: 3}
                }).then(function sucessCallback(response) {


                }, function errorCallback(e) {
                    console.log(e);
                });
            };


            $scope.transitionLeft = function (card) {
                $scope.card = card;
                console.log('card removed to the left');
                console.log(card);
                $http({
                    method: 'GET',
                    url: domain + 'tracker/update-reminder',
                    params: {userId: window.localStorage.getItem('id'), interface: window.localStorage.getItem('interface_id'), aid: $scope.card, captured: 2}
                }).then(function sucessCallback(response) {


                }, function errorCallback(e) {
                    console.log(e);
                });
            };
        })
        
        .controller('reminderSummaryCtrl', function($scope, $http, $filter){
            $scope.cards ={};
            $http({
                    method: 'GET',
                    url: domain + 'tracker/getSummary',
                    params: {user: window.localStorage.getItem('id')}
                }).then(function sucessCallback(response) {
                    $scope.cards = response.data;
                    console.log($scope.cards);
                });

            $scope.checkIfSelf = function(val){
                var ret = (val == window.localStorage.getItem('id'))? true : false;
                return ret;
            }

            $scope.detailedSummary = function(val){
                console.log(val);
            }
        })


        .controller('reminderSummaryDetailsCtrl', function($scope, $http, $filter){
           
        })

        .controller('reminderRecentCtrl', function ($scope, $http, $filter) {
            $scope.cards = [];
            $scope.curDate = new Date();
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.doRefresh = function () {
                $scope.$broadcast('scroll.refreshComplete');
            };
            $http({
                method: 'GET',
                url: domain + 'tracker/get-recent-reminder',
                params: {userId: window.localStorage.getItem('id'), interface: $scope.interface}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.reminder = response.data.reminder;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.addCard = function (img, name) {
                var newCard = {image: img, name: name};
                newCard.id = Math.random();
                $scope.cards.unshift(angular.extend({}, newCard));
            };
            $scope.addCards = function (count) {
                $http.get('http://api.randomuser.me/?results=' + count).then(function (value) {
                    angular.forEach(value.data.results, function (v) {
                        $scope.addCard(v.user.picture.large, v.user.name.first + " " + v.user.name.last);
                    });
                });
            };
            $scope.addFirstCards = function () {
                $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png", "Nope");
                $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
            };
            $scope.addFirstCards();
            // $scope.addCards(5);

            $scope.cardDestroyed = function (index) {
                console.log(index);
                $scope.reminder.splice(index, 1);
                //  $scope.addCards(1);
            };
            $scope.transitionOut = function (card) {
                console.log('card transition out');
            };
            $scope.transitionRight = function (card) {
                $scope.card = card;
                console.log('card removed to the right');
                console.log(card);
                $http({
                    method: 'GET',
                    url: domain + 'tracker/update-reminder',
                    params: {userId: window.localStorage.getItem('id'), interface: $scope.interface, aid: $scope.card, captured: 3}
                }).then(function sucessCallback(response) {


                }, function errorCallback(e) {
                    console.log(e);
                });
            };


            $scope.transitionLeft = function (card) {
                $scope.card = card;
                console.log('card removed to the left');
                console.log(card);
                $http({
                    method: 'GET',
                    url: domain + 'tracker/update-reminder',
                    params: {userId: window.localStorage.getItem('id'), interface: $scope.interface, aid: $scope.card, captured: 2}
                }).then(function sucessCallback(response) {


                }, function errorCallback(e) {
                    console.log(e);
                });
            };
        })

        .controller('ViewContentCtrl', function ($scope, $http, $stateParams, $ionicModal, $filter, $sce) {
            $scope.contentId = $stateParams.id;
            $http({
                method: 'GET',
                url: domain + 'contentlibrary/get-content-value',
                params: {conId: $scope.contentId, userid: window.localStorage.getItem('id'), interface: window.localStorage.getItem('interface_id')}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.cval = response.data;
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl($filter('split')(src, '?', 0));
            };
        })
        .controller('VideoChatCtrl', function ($scope, $state, $ionicModal, $ionicScrollDelegate, $sce, $ionicLoading, $http, $stateParams, $timeout, $filter) {


            $scope.$on('$destroy', function () {

                try {
                    publisher.off();
                    //alert('EXIT : publisher off try');
                    publisher.destroy();
                    //alert('publisher destroy');
                    subscriber.destroy();
                    //alert('subscriber destroy');
                    //session.unsubscribe();
                    session.off();
                    //alert('EXIT : session off');
                    session.disconnect();
                    // alert('session disconnected try');
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })

                } catch (err) {
                    //alert('err while exitvideo ' + err);
                    session.off();
                    //alert('EXIT : session off catch');
                    session.disconnect();
                    //alert('session disconnected');
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })

                }
            });
            $scope.usertype = 'patient';
            $scope.recording = 'Off';
//            $scope.timer = '00:00:00';
            var stoppedTimer;
            $scope.Timercounter = 0;
            $scope.chatId = window.localStorage.getItem('chatId');
            $scope.userId = window.localStorage.getItem('id');
            $scope.msg = '';
            var apiKey = '45121182';
            //console.log($scope.chatId);

            $scope.returnjs = function () {
                jQuery(function () {
                    var wh = jQuery('window').height();
                    jQuery('#chat').css('height', wh);
                    //  console.log(wh);
                })
            };
            $scope.returnjs();
            $scope.iframeHeight = $(window).height() - 88;
            $('#chat').css('height', $scope.iframeHeight);
            //Previous Chat 
            $scope.appendprevious = function () {
                console.log('connectioning.....');
                $ionicLoading.show({template: 'Retrieving messages...'});
                $(function () {
                    angular.forEach($scope.chatMsgs, function (value, key) {
                        //console.log(value);
                        var msgTime = $filter('date')(new Date(value.tstamp), 'd MMM, yyyy - HH:mm a');
                        if (value.sender_id == $scope.partId) {
                            $ionicLoading.hide();
                            $('#chat .ot-textchat .ot-bubbles').append('<section class="ot-bubble mine" data-sender-id=""><div><header class="ot-bubble-header"><p class="ot-message-sender"></p><time class="ot-message-timestamp">' + msgTime + '</time></header><div class="ot-message-content">' + value.message + '</div></div></section>');
                        } else {
                            $ionicLoading.hide();
                            $('#chat .ot-textchat .ot-bubbles').append('<section class="ot-bubble" data-sender-id=""><div><header class="ot-bubble-header"><p class="ot-message-sender"></p><time class="ot-message-timestamp">' + msgTime + '</time></header><div class="ot-message-content">' + value.message + '</div></div></section>');
                        }
                    });
                })
            };
            $scope.movebottom = function () {
                jQuery(function () {
                    var dh = $('.ot-bubbles').height();
                    $('.chatscroll').scrollTop(dh);
                    //  console.log(wh);

                })
            };
            $timeout(function () {
                if ($scope.chatMsgs.length > 0) {
                    $scope.appendprevious();
                    $scope.movebottom();
                } else {
                    //$('#chat').html('<p> No </p>');
                }
            }, 1000);

            jQuery('.videoscreen').hide();
            $scope.doctorId = window.localStorage.getItem('id');
            $http({
                method: 'GET',
                url: domain + 'contentlibrary/get-video-start',
                params: {doctorId: window.localStorage.getItem('id')}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                var aid = '';
                var apiKey = '45121182';
                var sessionId = response.data.sessionId;
                var token = response.data.oToken;
                $scope.sessionId = response.data.sessionId;
                $scope.token = response.data.oToken;
                $scope.opentok = response.data.opentok;
                if (OT.checkSystemRequirements() == 1) {
                    session = OT.initSession(apiKey, sessionId);
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                    alert("Your device is not compatible");
                }


                session.on({
                    streamCreated: function (event) {
                        subscriber = session.subscribe(event.stream, 'subscribersDiv', {subscribeToAudio: true, insertMode: "replace", width: "100%", height: "100%"});
                        console.log('Frame rates' + event.stream.frameRate);
                    },
                    sessionDisconnected: function (event) {
                        if (event.reason === 'networkDisconnected') {
                            alert('You lost your internet connection.'
                                    + 'Please check your connection and try connecting again.');
                        }
                    }
                });
                session.connect(token, function (error) {
                    if (error) {
                        console.log(error.message);
                    } else {
                        jQuery('.start').show();
                        publisher = OT.initPublisher('subscribersDiv', {width: "100%", height: "100%"});
                        session.publish(publisher);
//                                publisher.on('streamCreated', function (event) {
//                                    console.log('Frame rate: ' + event.stream.frameRate);
//                                });
                        var mic = 1;
                        var mute = 1;
                        jQuery(".muteMic").click(function () {
                            if (mic == 1) {
                                publisher.publishAudio(false);
                                mic = 0;
                            } else {
                                publisher.publishAudio(true);
                                mic = 1;
                            }
                        });
                        jQuery(".muteSub").click(function () {
                            if (mute == 1) {
                                subscriber.subscribeToAudio(false);
                                mute = 0;
                            } else {
                                subscriber.subscribeToAudio(true);
                                mute = 1;
                            }
                        });
                    }
                });
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.recordVideo = function () {
                //  alert('dsdg');
                $scope.Timercounter = 0;

                $scope.onTimeout = function () {
                    stoppedTimer = $timeout(function () {
                        $scope.Timercounter++;
                        $scope.seconds = $scope.Timercounter % 60;
                        $scope.minutes = Math.floor($scope.Timercounter / 60);
                        //  var mytimeout = $timeout($scope.onTimeout, 1000);
                        $scope.result = ($scope.minutes < 10 ? "0" + $scope.minutes : $scope.minutes);
                        $scope.result += ":" + ($scope.seconds < 10 ? "0" + $scope.seconds : $scope.seconds);
                        $scope.onTimeout();
                    }, 1000)
                }

                $timeout(function () {
                    $scope.onTimeout();
                }, 0);
                $scope.recording = 'On';
                jQuery('.start').hide();
                jQuery('.stop').show();
                jQuery('.videoscreen').hide();
                jQuery('.mediascreen').show();
                jQuery('.next').hide();
                jQuery('.rerecording').hide();
                $http({
                    method: 'GET',
                    url: domain + 'contentlibrary/get-recording-start',
                    params: {archive: 1, sessionId: $scope.sessionId}
                }).then(function sucessCallback(response) {
                    $scope.aid = response.data;
                }, function errorCallback(e) {
                    console.log(e);
                });
            };
            $scope.recordingStop = function () {
                //alert('stoppedTimer ' + stoppedTimer);
                // alert($scope.Timercounter);
                $timeout.cancel(stoppedTimer);
                publisher.destroy();
                $scope.recording = 'Off';
                jQuery('.stop').hide();
                jQuery('.mediascreen').hide();
                jQuery('.start').hide();
                jQuery('.videoscreen').show();
                jQuery('.next').show();
                jQuery('.rerecording').show();
                $http({
                    method: 'GET',
                    url: domain + 'contentlibrary/recording-stop',
                    params: {archiveStop: 1, archiveId: $scope.aid}
                }).then(function sucessCallback(response) {
                    console.log(response.data);
                    $scope.playVideo($scope.aid);



                }, function errorCallback(e) {
                    console.log(e);
                });
            }

            $scope.reRecording = function () {

                $scope.Timercounter = 0;
                jQuery('.videoscreen').hide();
                jQuery('.mediascreen').show();
                jQuery('.mediascreen').html('<div id="subscribersDiv" class="subscribediv">Initializing Video</div>');
                jQuery('.next').hide();
                jQuery('.rerecording').hide();
                jQuery('.stop').hide();
                $scope.doctorId = window.localStorage.getItem('id');
                $http({
                    method: 'GET',
                    url: domain + 'contentlibrary/get-video-start',
                    params: {doctorId: window.localStorage.getItem('id')}
                }).then(function sucessCallback(response) {
                    console.log(response.data);
                    var aid = '';
                    var apiKey = '45121182';
                    var sessionId = response.data.sessionId;
                    var token = response.data.oToken;
                    $scope.sessionId = response.data.sessionId;
                    $scope.token = response.data.oToken;
                    $scope.opentok = response.data.opentok;
                    if (OT.checkSystemRequirements() == 1) {
                        session = OT.initSession(apiKey, sessionId);
                        $ionicLoading.hide();
                    } else {
                        $ionicLoading.hide();
                        alert("Your device is not compatible");
                    }
                    session.on({
                        streamCreated: function (event) {
                            subscriber = session.subscribe(event.stream, 'subscribersDiv', {subscribeToAudio: true, insertMode: "replace", width: "100%", height: "100%"});
                        },
                        sessionDisconnected: function (event) {
                            if (event.reason === 'networkDisconnected') {
                                alert('You lost your internet connection.'
                                        + 'Please check your connection and try connecting again.');
                            }
                        }
                    });
                    session.connect(token, function (error) {
                        if (error) {
                            console.log(error.message);
                        } else {
                            // console.log("jhjagsdjagdhj");
                            publisher = OT.initPublisher('subscribersDiv', {width: "100%", height: "100%"});
                            session.publish(publisher);
                            jQuery('.start').show();
//                                    publisher.on('streamCreated', function (event) {
//                                        console.log('Frame rate rerecording: ' + event.stream.frameRate);
//                                    });
//                                    var mic = 1;
//                                    var mute = 1;
//                                    jQuery(".muteMic").click(function () {
//                                        if (mic == 1) {
//                                            publisher.publishAudio(false);
//                                            mic = 0;
//                                        } else {
//                                            publisher.publishAudio(true);
//                                            mic = 1;
//                                        }
//                                    });
//                                    jQuery(".muteSub").click(function () {
//                                        if (mute == 1) {
//                                            subscriber.subscribeToAudio(false);
//                                            mute = 0;
//                                        } else {
//                                            subscriber.subscribeToAudio(true);
//                                            mute = 1;
//                                        }
//                                    });
                        }
                    });
                }, function errorCallback(e) {
                    console.log(e);
                });
            }

            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl($filter('split')(src, '?', 0));
            }

            $ionicModal.fromTemplateUrl('viewvideo', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.playVideo = function (archiveid) {
                $ionicLoading.show({template: 'Preparing Video...'});
                $http({
                    method: 'GET',
                    url: domain + 'contentlibrary/play-recent-video',
                    params: {archiveId: archiveid}
                }).then(function sucessCallback(response) {
                    console.log(response.data);
                    //alert(response.data);
                    $scope.playurl = response.data;
                    if ($scope.playurl != '') {
                        $ionicLoading.hide();
                        // $scope.modal.show();
                    } else {
                        $scope.playVideo(archiveid);
                    }
                }, function errorCallback(e) {
                    console.log(e);
                });
            }

            $scope.playVideoPreview = function () {
                $scope.modal.show();
            }

            $scope.submitchatVideo = function () {
                $scope.from = get('from');
                $ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addChatVideo")[0]);
                callAjax("POST", domain + "contentlibrary/save-chat-video", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (response == '1') {
                        $scope.archiveId = window.localStorage.removeItem('archiveId');
                        alert('Chat recording added successfully.');
                        $state.go('app.save-chat-video', {'id': $scope.chatId}, {reload: true});
                    } else {
                        $state.go('app.save-chat-video', {'id': $scope.chatId}, {reload: true});
                    }
                });
            }

            $scope.getchatsharedata = function () {
                $http({
                    method: 'GET',
                    url: domain + 'contentlibrary/get-video-chat-share-data',
                    params: {userId: window.localStorage.getItem('id'), chatId: $scope.chatId}
                }).then(function sucessCallback(response) {
                    console.log(response.data);
                    $scope.videodata = response.data;
                    $state.go('app.chat-video-share', {reload: true});
                }, function errorCallback(response) {
                    console.log(response.responseText);
                });
            }

            $scope.tabclick = function (taburl) {
                jQuery('.notetab').hide();
                jQuery('#' + taburl).show();
                jQuery('.headtab span').removeClass('active');
                jQuery('.tab-buttons .tbtn').removeClass('active');
                jQuery('.headtab span[rel="' + taburl + '"]').addClass('active');
                jQuery('.tab-buttons .tbtn[rel="' + taburl + '"]').addClass('active');
            }

        })

        .controller('VideoChatShareCtrl', function ($scope, $ionicLoading, $http, $stateParams, $timeout, $filter) {
            $scope.chatId = window.localStorage.getItem('chatId');
            $scope.videoChatdata = '';
            $http({
                method: 'GET',
                url: domain + 'contentlibrary/get-video-chat-share-data',
                params: {userId: window.localStorage.getItem('id'), chatId: $scope.chatId}
            }).then(function sucessCallback(response) {
                console.log("sdfghjkl;" + response.data);
                $scope.videoChatdata = response.data;
                // $state.go('app.chat-video-share', {reload: true});
            }, function errorCallback(response) {
                console.log(response.responseText);
            });
        })

        .controller('ViewVideoChatCtrl', function ($scope, $sce, $ionicLoading, $http, $stateParams, $timeout, $filter) {
            $scope.chatId = $stateParams.id;
            $scope.videoChatdata = '';
            $http({
                method: 'GET',
                url: domain + 'contentlibrary/get-video-chat-data',
                params: {userId: window.localStorage.getItem('id'), chatId: $scope.chatId}
            }).then(function sucessCallback(response) {
                console.log("get-video-chat-share-data" + response.data);
                $scope.videoChatdata = response.data.chatvideodata;
                // $state.go('app.chat-video-share', {reload: true});
            }, function errorCallback(response) {
                console.log(response.responseText);
            });

            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };


        })

        .controller('GenericLoginCtrl', function ($scope, $state, $sce, $rootScope, $ionicLoading, $http, $stateParams, $timeout, $filter) {
            window.localStorage.setItem('interface_id', apkInterfaceId);
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userType = 'patient';
            $scope.action = 'login';
            // $scope.val = {"message":"zxczc","additionalData":{"actionButtons":[{"id":"id1","text":"ignore","icon":"1"}],"actionSelected":"id1","title":"czxczxc"},"isActive":false};
            // console.log($scope.val.additionalData.actionButtons[0].id);

            console.log("jfskdjfk");
            $scope.doLogIn = function () {
                console.log("khjfgkdjfhg");
                $ionicLoading.show({template: 'Loading...'});
                var data = new FormData(jQuery("#loginuser")[0]);
                $.ajax({
                    type: 'POST',
                    url: domain + "chk-user",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        //console.log(response);
                        if (angular.isObject(response)) {
                            $scope.loginError = '';
                            $scope.loginError.digest;
                            store(response);
                            $rootScope.userLogged = 1;
                            $rootScope.username = response.fname;
                            $ionicLoading.hide();
                            $http({
                                method: 'GET',
                                url: domain + 'get-login-logout-log',
                                params: {userId: window.localStorage.getItem('id'), interface: $scope.interface, type: $scope.userType, action: $scope.action}
                            }).then(function successCallback(response) {
                            }, function errorCallback(e) {
                                console.log(e);
                            });

                            try {
                                window.plugins.OneSignal.getIds(function (ids) {
                                    console.log('getIds: ' + JSON.stringify(ids));
                                    if (window.localStorage.getItem('id')) {
                                        $scope.userId = window.localStorage.getItem('id');
                                    } else {
                                        $scope.userId = '';
                                    }

                                    $http({
                                        method: 'GET',
                                        url: domain + 'notification/insertPlayerId',
                                        params: {userId: $scope.userId, playerId: ids.userId, pushToken: ids.pushToken}
                                    }).then(function successCallback(response) {
                                        if (response.data == 1) {
                                            // alert('Notification setting updated');
                                            //  $state.go('app.category-list');
                                        }
                                    }, function errorCallback(e) {
                                        console.log(e);
                                        // $state.go('app.category-list');
                                    });
                                });
                            } catch (err) {
                                // $state.go('app.category-list');
                            }

                            $rootScope.url = document.referrer;

                            //$state.go('app.category-list');


                        } else {
                            $rootScope.userLogged = 0;
                            $scope.loginError = response;
                            $scope.loginError.digest;
                            $ionicLoading.hide();
                            $timeout(function () {
                                $scope.loginError = response;
                                $scope.loginError.digest;
                            })
                            //console.log('else part login');
                        }
                        $rootScope.$digest;
                        $rootScope.$response;
                    },
                    error: function (e) {
                        //  console.log(e.responseText);
                    }
                });
            };


        })

        .controller('VideoBroadcastCreateCtrl', function ($scope, $http, $stateParams, $ionicModal, $ionicLoading, $state, $filter) {
            $scope.permission = 0;
            $http({
                method: 'GET',
                url: domain + 'video-broadcast-permission',
                params: {userid: window.localStorage.getItem('id')}
            }).then(function successCallback(response) {
                $scope.permission = response.data;
            });
            $scope.create = {};
            $scope.create['rate'] = 0;
            $scope.create['noOfPublishers'] = 1;
            $scope.create['duration'] = 60;
            $scope.create['registration'] = 'free';
            $scope.create['audience'] = 2;

            $scope.submit = function () {
                console.log('submission attempted');
                if ($scope.checkIfComplete()) {
                    $scope.create['id'] = window.localStorage.getItem('id');
                    $scope.create['start'] = $filter('date')(new Date($scope.create.startdt), 'yyyy-MM-dd') + " " + $filter('date')(new Date($scope.create.starttm), 'HH:mm:ss');
                    console.log($scope.create);
                    console.log(JSON.stringify($scope.create));
                    $http({
                        method: 'POST',
                        url: domain + 'video-broadcast-create',
                        data: JSON.stringify($scope.create)
                    }).then(function successCallback(response) {
                        console.log('response');
                        console.log(response);
                        $scope.create = null;
                        $scope.create = {};
                        $state.go('app.video-broadcast');
                    });
                } else {
                    alert('fill correct details');
                }
            }

            $scope.checkIfComplete = function () {
                $checklist = ['broadcastTitle', 'startdt', 'starttm', 'duration', 'registration', 'noOfPublishers'];
                for (i = 0; i < $checklist.length; i++) {
                    if ($scope.create.hasOwnProperty($checklist[i])) {
                    } else {
                        return false;
                    }
                }
                return true;
            }
        })

        .controller('VideoBroadcastCtrl', function ($scope, $http, $stateParams, $ionicModal, $ionicLoading, $state, $filter, $ionicHistory) {
            $ionicModal.fromTemplateUrl('create-library', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.allowArticle = 0;
            $scope.allowInternal = 0;
            $scope.allowExternal = 0;
            $scope.allowBroadcast = 0;
            $http({
                method: 'GET',
                url: domain + 'contentlibrary/content-permission',
                params: {userid: window.localStorage.getItem('id')}
            }).then(function sucessCallback(response) {
                $scope.allowArticle = response.data.article;
                $scope.allowInternal = response.data.internal;
                $scope.allowExternal = response.data.external;
                $scope.allowBroadcast = response.data.broadcast;
            });
            $http({
                method: 'GET',
                url: domain + 'video-broadcast-list',
                params: {userid: window.localStorage.getItem('id')}
            }).then(function successCallback(response) {
                $scope.videoBroadcastList = response.data;
            });
            $http({
                method: 'GET',
                url: domain + 'video-broadcast-lang',
                params: {userid: window.localStorage.getItem('id'), interface: window.localStorage.getItem('interface_id')}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;
            });
            $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.token = '';
            $scope.session = '';
            $scope.session_id = '';
            $scope.startbroadcast = 0;
            $scope.userid = window.localStorage.getItem('id');
            console.log(new Date(new Date() - (-15 * 60000)));

            $scope.show = function (val) {
                $valdate = new Date(val);
                $checkdate = $filter('date')(new Date($valdate - 15 * 60000), 'yyyy-MM-dd HH:mm:ss');
                if ($checkdate < $scope.date) {
                    return 1;
                } else {
                    return 0;
                }
            }

            $scope.tooEarly = function () {
                alert('you can join the broadcast 15 mins prior to the starting time');
            }


            $scope.generateToken = function (val) {
                console.log('generate token');
                $http({
                    method: 'GET',
                    url: domain + 'video-broadcast-get-token',
                    params: {id: val, user: window.localStorage.getItem('id')}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.token = (response.data.token);
                    $scope.session_id = response.data.session;
                    $scope.owner = response.data.owner;
                    window.localStorage.setItem('matchCode', response.data.code)
                    console.log("startBC: " + $scope.startbroadcast);
                    console.log('successfully generated token');
                    if (response.data.type == 1) {
                        $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                        $ionicHistory.clearHistory();
                        $state.go('app.video-broadcast-stream', {'session_id': $scope.session_id, 'token': $scope.token, 'publish': $scope.startbroadcast});
                    } else {
                        $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                        $ionicHistory.clearHistory();
                        $state.go('app.video-broadcast-interactive', {'session_id': $scope.session_id, 'token': $scope.token, 'publish': $scope.startbroadcast});
                    }
                });
            };

            $scope.joinSession = function (id, val) {
                $scope.session_id = val;
                $scope.generateToken(id);
            }
            $scope.joinAndPublish = function (vb) {
                $scope.startbroadcast = 1;
                $scope.joinSession(vb.id, vb.session_id);
            }

            $scope.createSession = function (val) {
                console.log("session create initiated");
                if (!val == "") {
                    $http({
                        method: 'GET',
                        url: domain + 'video-broadcast-start-new-session',
                        params: {id: window.localStorage.getItem('id'), topic: val}
                    }).then(function successCallback(response) {
                        console.log(response.data.session_id);
                        $scope.session_id = response.data.session_id;
                        $scope.generateToken(response.data.id);
                    })

                }
            };


        })
        .controller('VideoBroadcastStreamCtrl', function ($scope, $http, $stateParams, $ionicModal, $ionicLoading,$state,$filter,$ionicHistory) {
            $scope.exitInitiated = 0;
            $scope.exitcalled = 0;
            $scope.session = '';
            $scope.subscriber;
            $scope.publisher;
            $scope.token =  $stateParams.token;
            $scope.startbroadcast=$stateParams.publish;
            $scope.sessionID =$stateParams.session_id;
            $scope.hlsLink='';   
            $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
            $ionicHistory.clearHistory();
            $scope.token = $stateParams.token;
            $scope.startbroadcast = $stateParams.publish;
            $scope.sessionID = $stateParams.session_id;
            $scope.hlsLink = '';

            $http({
                method: 'GET',
                url: domain + 'video-broadcast-stream-lang',
                params: {id: window.localStorage.getItem('id'), interface: window.localStorage.getItem('interface_id')}
            }).then(function successCallback(response) {
                console.log(response.data.session_id);
                $scope.langtext = response.data.langtext;
                $scope.language = response.data.lang.language;

            })

            $scope.initialiseSession = function (sessionId) {
                console.log('initialiseSession started');
                $http({
                        method: 'GET',
                        url: domain + 'get-api-key', 
                        params: {sessionid: sessionId}
                    }).then(function successCallback(response) {
                                $scope.apiKey = response.data;
                                console.log(response.data);             
                
                                if (OT.checkSystemRequirements() == 1) {
                                $scope.session = OT.initSession($scope.apiKey, sessionId);
                                //$ionicLoading.hide();
                                } else {
                                //$ionicLoading.hide();
                                alert("Your device is not compatible");
                                }
                                $scope.session.on({
                                    streamDestroyed: function (event) {
                                        console.log('stream destroyed');
                                    },
                                    streamCreated: function (event) {
                                        console.log('stream created....');
                                        //$scope.subscriber = $scope.session.subscribe(event.stream, 'subscribersDiv', {subscribeToAudio: true, insertMode: "append"});
                                         $http({
                                                method: 'GET',
                                                url: domain + 'video-broadcast-get-hls', 
                                                params: {sessionid: $scope.sessionID, userid: window.localStorage.getItem('id')}
                                            }).then(function successCallback(response) {
                                                        $scope.hlsLink = response.data;
                                                        $scope.hlsLink = "http://videoplayer.vodobox.com/vodobox_player.php?vid="+$scope.hlsLink+"&img=&play=auto";
                                                         console.log("link: " + $scope.hlsLink);
                                                         jQuery('#iframe_player').attr('src',$scope.hlsLink);
                                                        
                                                    })       
                                        console.log('suscriber');
                                        //console.log($scope.subscriber);

                                        
                                    },
                                    sessionDisconnected: function (event) {
                                        console.log(event.reason);     
                                        if($scope.exitcalled == 0){
                                            $scope.exitcalled = 1;
                                            $http({
                                                    method: 'GET',
                                                    url: domain + 'video-broadcast-exit', 
                                                    params: {sessionid: $scope.sessionID, userid: window.localStorage.getItem('id'), matchcode: window.localStorage.getItem('matchCode'),exit: $scope.exitInitiated }
                                                }).then(function successCallback(response) {
                                                            console.log('user left');
                                                            
                                                        })                           
                                        }
                                    }
                                });
               
                                $scope.session.connect($scope.token, function (error) {
                                    if (error) {
                                        //$ionicLoading.hide();
                                        alert("Error connecting session patient: ", error.code, error.message);
                                    } else {
                                        if ($scope.startbroadcast == 1 ){
                                            
                                            $http({
                                                method: 'GET',
                                                url: domain + 'curl-start-broadcast', 
                                                params: {sessionid: $scope.sessionID}
                                            }).then(function successCallback(response) {
                                                        console.log('broadCastStarted');
                                                        console.log(response);
                                                        $http({
                                                                method: 'GET',
                                                                url: domain + 'video-broadcast-get-hls', 
                                                                params: {sessionid: $scope.sessionID, userid: window.localStorage.getItem('id')}
                                                            }).then(function successCallback(response) {
                                                                        $scope.hlsLink = response.data;
                                                                        $scope.hlsLink = "http://videoplayer.vodobox.com/vodobox_player.php?vid="+$scope.hlsLink+"&img=&play=auto";
                                                                         console.log("link after publish: " + $scope.hlsLink);
                                                                         // jQuery('#iframe_player').attr('src',$scope.hlsLink);
                                                                        
                                                                    })       
                                                                        
                                                        
                                                    })                           

                                            console.log('broadcast condition true');
                                            $scope.publisher = OT.initPublisher('myPublisherDiv', {width: "100%", height: "100%"});
                                            $scope.session.publish($scope.publisher, function (error) {
                                                if (error) {
                                                      console.log("publisher Error code/msg: ", error.code, error.message);
                                                } else {
                                                    $scope.publisher.on('streamCreated', function (event) {
                                                        console.log('streamCreated');
                                                        //  console.log('stream created: ' + subscribers5);
                                                    });

                                                    $scope.publisher.on('streamDestroyed', function (event) {
                                                        console.log('streamDestroyed');
                                                    });

                                                }
                                            });
                                        }
                                    }
                                });
                            });
            };
            $scope.endVideo = function(){
                $scope.exitInitiated = 1;
                $http({
                        method: 'GET',
                        url: domain + 'video-broadcast-terminate', 
                        params: {sessionid: $scope.sessionID, userid: window.localStorage.getItem('id'),exit: $scope.exitInitiated}
                    }).then(function successCallback(response) {
                                console.log('terminated session');
                                
                            })

                $scope.exitVideo();

            }
            $scope.exitVideo = function () {
                $scope.exitInitiated = 1;
                console.log('exitvideo called');
                try {                    
                    $scope.session.disconnect();                  
                    $state.go("app.video-broadcast", {reload: true});
                } catch (err) {
                   console.log(err);
                    }
                    $state.go("app.video-broadcast", {reload: true});
                }
            $scope.initialiseSession($scope.sessionID);
           
            
        })

        .controller('VideoBroadcastInteractiveCtrl', function ($scope, $http, $stateParams, $ionicModal, $ionicLoading,$state,$filter,$ionicHistory) {
            $scope.exitInitiated = 0;
            $scope.hideText = 1;
            $scope.exitcalled = 0;
            $scope.session = '';
            $scope.subscriber;
            $scope.publisher;
            $scope.token =  $stateParams.token;
            $scope.startbroadcast=$stateParams.publish;
            $scope.sessionID =$stateParams.session_id;
            $scope.hlsLink='';

            
            $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
            $ionicHistory.clearHistory();
            
            $scope.initialiseSession = function(sessionId){
                console.log('initialiseSession started');
                
                $http({
                        method: 'GET',
                        url: domain + 'get-api-key', 
                        params: {sessionid: sessionId}
                    }).then(function successCallback(response) {
                                $scope.apiKey = response.data;

                                if (OT.checkSystemRequirements() == 1) {
                                $scope.session = OT.initSession($scope.apiKey , sessionId);
                                //$ionicLoading.hide();
                                } else {
                                //$ionicLoading.hide();
                                alert("Your device is not compatible");
                                }
                                    $scope.session.on({
                                        streamDestroyed: function (event) {
                                            console.log('stream destroyed');
                                        },
                                        streamReceived: function (event){
                                            console.log('stream received....');
                                        },
                                        streamCreated: function (event) {
                                            console.log('stream created....');
                                            if($scope.startbroadcast == 1){
                                                $scope.subscriber = $scope.session.subscribe(event.stream, 'subscribersDiv', {subscribeToAudio: true, insertMode: "replace", width: "100%", height: "100%"});
                                            }else if($scope.startbroadcast == 0){
                                                $scope.subscriber = $scope.session.subscribe(event.stream, 'subscribersDiv', {subscribeToAudio: true, insertMode: "append"});
                                            }
                                            $scope.hideText = 0;
                                            //  $http({
                                            //         method: 'GET',
                                            //         url: domain + 'video-broadcast-get-hls', 
                                            //         params: {sessionid: $scope.sessionID, userid: window.localStorage.getItem('id')}
                                            //     }).then(function successCallback(response) {
                                            //                 $scope.hlsLink = response.data;
                                            //                 $scope.hlsLink = "http://videoplayer.vodobox.com/vodobox_player.php?vid="+$scope.hlsLink+"&img=&play=auto";
                                            //                  console.log("link: " + $scope.hlsLink);
                                            //                  jQuery('#iframe_player').attr('src',$scope.hlsLink);
                                                            
                                            //             })       
                                            jQuery("#hideText").hide();

                                            
                                        },
                                        sessionDisconnected: function (event) {
                                            console.log(event.reason);     
                                            if($scope.exitcalled == 0){
                                                $scope.exitcalled = 1;
                                                $http({
                                                        method: 'GET',
                                                        url: domain + 'video-broadcast-exit', 
                                                        params: {sessionid: $scope.sessionID, userid: window.localStorage.getItem('id'), matchcode: window.localStorage.getItem('matchCode'),exit: $scope.exitInitiated }
                                                    }).then(function successCallback(response) {
                                                                console.log('user left');
                                                                
                                                            })                           
                                            }
                                        }
                                    });
                       
                                    $scope.session.connect($scope.token, function (error) {
                                        if (error) {
                                            //$ionicLoading.hide();
                                            alert("Error connecting session patient: ", error.code, error.message);
                                        } else {
                                            if ($scope.startbroadcast == 1 ){
                                                
                                                $http({
                                                    method: 'GET',
                                                    url: domain + 'curl-start-broadcast', 
                                                    params: {sessionid: $scope.sessionID}
                                                }).then(function successCallback(response) {
                                                            console.log('broadCastStarted');
                                                            console.log(response);
                                                            
                                                            
                                                        })                           

                                                console.log('broadcast condition true');
                                                $scope.publisher = OT.initPublisher('myPublisherDiv', {width: "30%", height: "30%"});
                                                $scope.session.publish($scope.publisher, function (error) {
                                                    if (error) {
                                                          console.log("publisher Error code/msg: ", error.code, error.message);
                                                    } else {
                                                        $scope.publisher.on('streamCreated', function (event) {
                                                            console.log('streamCreated');
                                                            //  console.log('stream created: ' + subscribers5);
                                                        });

                                                        $scope.publisher.on('streamDestroyed', function (event) {
                                                            console.log('streamDestroyed');
                                                        });

                                                    }
                                                });
                                            }
                                        }
                                    });
                            });
            };
            $scope.endVideo = function(){
                $scope.exitInitiated = 1;
                $http({
                        method: 'GET',
                        url: domain + 'video-broadcast-terminate', 
                        params: {sessionid: $scope.sessionID, userid: window.localStorage.getItem('id'),matchcode: window.localStorage.getItem('matchCode'),exit:$scope.exitInitiated}
                    }).then(function successCallback(response) {
                                console.log('terminated session');
                                
                            })

                $scope.exitVideo();

            }
            $scope.exitVideo = function () {
                $scope.exitInitiated = 1;
                console.log('exitvideo called');
                try {
                    if($scope.publisher){
                        $scope.publisher.destroy();
                    }
                    if($scope.subscriber){
                        $scope.subscriber.destroy();
                    }
                    if($scope.session){
                        $scope.session.disconnect();                   
                    }
                                          
                   
                $state.go("app.video-broadcast", {reload: true});
                } catch (err) {
                    console.log('caught exit try: ');
                   console.log(err);
                    }
                    $state.go("app.video-broadcast", {reload: true});
            }

            $scope.initialiseSession($scope.sessionID);
           
            
        })

        .controller('VideoBroadcastScheduleCtrl', function ($scope, $http, $stateParams, $ionicModal, $ionicLoading, $state, $filter) {
            $scope.scheduleform = '';
            $scope.scheduleBroadcast = function (val) {
                val.userid = window.localStorage.getItem('id');
                console.log(val);
                var start = $filter('date')(new Date(val.startdt), 'yyyy-MM-dd') + " " + $filter('date')(new Date(val.starttm), 'HH:mm:ss');
                console.log(start);

                $http({
                    method: 'GET',
                    url: domain + 'video-broadcast-start-new-session',
                    params: {id: window.localStorage.getItem('id'), topic: val.chatTopic, start: start}
                }).then(function successCallback(response) {});



            }
        })

        .controller('ConsultationsNotesListCtrl',function($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading){
            $scope.createnew = 0 ;
            $scope.createnew = get('create');
            $scope.patientid = get('patientId');
            $scope.doctorid = window.localStorage.getItem('doctorid');
            $scope.newnote = {};
            //$scope.newnote['date'] = $filter("date")(Date.now(), 'yyyy-MM-dd');
            $scope.doRefresh = function(){
                $http({
                        method: 'GET',
                        url: domain + 'doctors/consultation-notes-list-patients',
                        params: {doctor_id: $scope.doctorid,patient_id: $scope.patientid}
                    }).then(function successCallback(response) {
                        $scope.profileid = response.data.profileid;
                        $scope.cards = {};
                        $scope.cards = response.data.existing_notes;

                        console.log($scope.cards);
                    });
                $scope.$broadcast('scroll.refreshComplete');
            }
            $scope.swipedAway = function(val){
                $scope.doRefresh();
            }

            $scope.openNotesDetails = function(val){
                console.log('goto details page for note id: ' +val);
                store({'noteId': val});
                $state.go('app.consultation-note-details',{relaod: true});
            }

            $scope.addNote = function(){
                $scope.date =  $filter('date')(new Date($scope.newnote['date']), 'yyyy-MM-dd');
                console.log($scope.profileid);
                console.log($scope.newnote['title']);
                console.log($scope.date);
                console.log({profile_id: $scope.profileid, title: $scope.newnote['title'],date: $scope.date});
                $http({
                        method: 'GET',
                        url: domain + 'doctors/add-consultation-note',
                        params: {profile_id: $scope.profileid, title: $scope.newnote['title'],date: $scope.date}
                    }).then(function successCallback(response) {
                        alert(response.data.message);
                        $scope.doRefresh();
                    });
            }

            $scope.doRefresh();            
        })

        .controller('ConsultationsNotesDetailsCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading) {
            $scope.noteid = get('noteId');
            $scope.data = {};
            $scope.tabnav = {};
            $scope.obsId = [];
            $scope.obsIds = [];
            $scope.diagIds  = [];
            $scope.catIds = [];
            $scope.sharecheckboxes = {};
            $scope.tabnav['observations'] = 1;
            console.log($scope.noteid);
            $scope.userid = window.localStorage.getItem('doctorid');
            $scope.options = {};
            $scope.i = 1;
            $scope.$watch('obsId', function() {
                console.log('obsIdChanged');
                console.log($scope.obsId);
                }, true);
            $scope.selectObservationCheckbox = function ($event) {
                console.log($event);
            }

            $scope.tabClicked= function(val){
                
                angular.forEach($scope.tabnav, function(value, key){
                    $scope.tabnav[key] = 0;
                });
                $scope.tabnav[val] = 1;
                console.log($scope.tabnav);
            }

            $http({
                        method: 'GET',
                        url: domain + 'doctors/consultation-note-details',
                        params: {userid: $scope.userid}
                    }).then(function successCallback(response) {
                        $scope.options = response.data;
                        console.log($scope.options);
                    });


            $scope.goUrl = function(val, catid, catname){
                console.log(val);
                store({'noteid': $scope.noteid,'catid' : catid, 'catname' : catname});
                $state.go(val, {}, {relaod: true});
            }

            $scope.noteShare = function(){
                if(confirm('Are you sure you want to share the entire note with the patient?')){
                    console.log('share Entire Note button clicked');
                    
                    $scope.data['noteid'] = $scope.noteid;
                    $scope.data['rowids'] = [];
                    $scope.data['rowids'].push($scope.noteid);
                    $scope.data['type'] = 1;
                    console.log(JSON.stringify($scope.data));

                    $http({
                        method: 'POST',
                        url: domain + 'doctors/share-consultation-note-details',
                        data: JSON.stringify($scope.data)
                    }).then(function successCallback(response) {
                        alert(response.data.message);
                    },function errorCallback(response){
                        alert('there was an error encountered');
                        console.log(response.data.message);
                        console.log(response.data.error);
                    });
                }

            }

            $scope.shareObservation = function (obj) {
                // jQuery('.selectObservations').css('display', 'block');
                // jQuery('#shareObs').css('display', 'none');
                // jQuery('#cancelObs').css('display', 'block');
                if(confirm('Are you sure you want to share all observations with the patient?')){
                    console.log('sharing following observations with the patient');
                    angular.forEach(obj, function(value,key){
                        $scope.obsIds.push(value['id']);
                    });
                    $scope.data['noteid'] = $scope.noteid;
                    $scope.data['rowids'] = $scope.obsIds;
                    $scope.data['type'] = 2;
                    console.log(JSON.stringify($scope.data));

                    $http({
                        method: 'POST',
                        url: domain + 'doctors/share-consultation-note-details',
                        data: JSON.stringify($scope.data)
                    }).then(function successCallback(response) {
                        alert(response.data.message);
                    },function errorCallback(response){
                        alert('there was an error encountered');
                        console.log(response.data.message);
                        console.log(response.data.error);
                    });

                }
            };

            $scope.shareDiagnosis = function(obj){
                if(confirm('Are you sure you want to share all diagnosis with the patient?')){
                    console.log('sharing following diagnosis with the patient');
                    angular.forEach(obj, function(value,key){
                        $scope.diagIds.push(value['id']);
                    });
                    $scope.data['noteid'] = $scope.noteid;
                    $scope.data['rowids'] = $scope.diagIds;
                    $scope.data['type'] = 3;
                    console.log(JSON.stringify($scope.data));

                    $http({
                        method: 'POST',
                        url: domain + 'doctors/share-consultation-note-details',
                        data: JSON.stringify($scope.data)
                    }).then(function successCallback(response) {
                        alert(response.data.message);
                    },function errorCallback(response){
                        alert('there was an error encountered');
                        console.log(response.data.message);
                        console.log(response.data.error);
                    });

                }
            };

            $scope.cancelObservation = function(){
                jQuery('.selectObservations').css('display', 'none');
                jQuery('#shareObs').css('display', 'block');
                jQuery('#cancelObs').css('display', 'none');
                $scope.obsIds = [];
            }

            $scope.shareTreatment = function(obj){
                if(confirm('Are you sure you want to share all treatments with the patient?')){
                    console.log('sharing following treatments with the patient');
                    angular.forEach(obj, function(value,key){
                        if(value['count'] > 0){
                            $scope.catIds.push(value['category']);
                        }
                    });
                    $scope.data['noteid'] = $scope.noteid;
                    $scope.data['categories'] = $scope.catIds;
                    $scope.data['type'] = 4;
                    console.log(JSON.stringify($scope.data));

                    $http({
                        method: 'POST',
                        url: domain + 'doctors/share-consultation-note-details',
                        data: JSON.stringify($scope.data)
                    }).then(function successCallback(response) {
                        alert(response.data.message);
                    },function errorCallback(response){
                        alert('there was an error encountered');
                        console.log(response.data.message);
                        console.log(response.data.error);
                    });

                }
            }

            

            $scope.getObsIds = function (id) {
                console.log(id);
                if ($scope.obsId[id]) {
                    $scope.obsIds.push(id);
                } else {
                    var index = $scope.obsIds.indexOf(id);
                    console.log('index @ remove: ', index);
                    $scope.obsIds.splice(index, 1);
                }
                console.log('observations');
                console.log($scope.obsIds);

            };

            $scope.check = function(val){
                if (val.length == 0){
                    return false;
                }
                else{
                    return true;
                }
            }            
        })
        
        .controller('ConsultationsNotesObservationViewCtrl',function($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading){
           
            $scope.noteid = get('noteId');
            $scope.data = {};
            $scope.data['noteid'] = $scope.noteid;
            $scope.doRefreshObservations = function(){
                $http({
                        method: 'GET',
                        url: domain + 'doctors/consultation-notes-observations',
                        params: {note_id: $scope.noteid}
                    }).then(function successCallback(response) {
                        $scope.cards = {};
                        $scope.cards = response.data.existing_observations;

                        console.log($scope.cards);
                        console.log(response.data.message);
                    });
                $scope.$broadcast('scroll.refreshComplete');
            }

            $scope.addObservation = function(){
                $scope.modal.show();
            }
            $ionicModal.fromTemplateUrl('create-Observation', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.saveObservation = function(){
                console.log(JSON.stringify($scope.data));
                $scope.modal.hide();
                $http({
                        method: 'POST',
                        url: domain + 'doctors/consultation-notes-add-observations',
                        data: JSON.stringify($scope.data)
                    }).then(function successCallback(response) {
                        alert(response.data.message);
                        $scope.doRefresh();
                        
                    });
            }

            $scope.doRefreshObservations();            
        })

        .controller('ConsultationsNotesDiagnosisViewCtrl',function($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading){
            $scope.noteid = get('noteId');
            $scope.data = {};
            $scope.data['noteid'] = $scope.noteid;

            $scope.addDiagnosis = function(){
                $scope.modal.show();
            }
            $ionicModal.fromTemplateUrl('create-diagnosis', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.doRefresh = function(){
                $http({
                        method: 'GET',
                        url: domain + 'doctors/consultation-notes-diagnosis',
                        params: {note_id: $scope.noteid}
                    }).then(function successCallback(response) {
                        $scope.cardsDiagnosis = {};
                        $scope.cardsDiagnosis = response.data.existing_diagnosis;

                        console.log($scope.cardsDiagnosis);
                        console.log(response.data.message);
                    });
                $scope.$broadcast('scroll.refreshComplete');
            }
            $scope.saveDiagnosis = function(){
                console.log(JSON.stringify($scope.data));
                $scope.modal.hide();
                $http({
                        method: 'POST',
                        url: domain + 'doctors/consultation-notes-add-diagnosis',
                        data: JSON.stringify($scope.data)
                    }).then(function successCallback(response) {
                        alert(response.data.message);
                        $scope.doRefresh();
                        
                    });
            }

            $scope.doRefresh();
        })
        .controller('ConsultationsNotesTreatmentViewCtrl',function($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading){
            console.log('treatmentview');

            $http({
                        method: 'GET',
                        url: domain + 'doctors/consultation-note-treatment',
                        params: {noteid: $scope.noteid}
                    }).then(function successCallback(response) {
                        $scope.allCats = response.data;
                        console.log($scope.options);
                    });
            $scope.gotopage = function(val, catid, catname){
                console.log(val);
                store({'noteid': $scope.noteid,'catid' : catid, 'catname' : catname});
                $state.go(val, {}, {relaod: true});
            }
        })

        .controller('ConsultationNoteRecordsCtrl',function($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $ionicLoading){
            console.log($scope.noteid = get('noteid'));
            console.log($scope.catid = get('catid'));
            console.log($scope.catname = get('catname'));

            $scope.data = {};
            $scope.data['noteid'] = $scope.noteid;
            $scope.doRefresh = function(){
                $http({
                        method: 'GET',
                        url: domain + 'doctors/consultation-notes-records',
                        params: {note_id: $scope.noteid,category: $scope.catid}
                    }).then(function successCallback(response) {
                        $scope.cards = {};
                        $scope.cards = response.data;

                        console.log($scope.cards);
                    
                    });
                $scope.$broadcast('scroll.refreshComplete');
            }
            $scope.doRefresh();

            $scope.addNew = function(val){
                console.log(val);
                store({'noteid': $scope.noteid});
                $state.go('app.add-category', {'id':val}, {reload: true});
            }

            $scope.getDetails = function(val){
                console.log(val);
                store({'noteid': $scope.noteid});
                $state.go('app.record-details', {'id': val}, {reload: true});
            }

            $scope.shareTreatment = function(){
                if(confirm('Are you sure you want to share all '+$scope.catname+' records with the patient?')){
                    console.log('sharing following treatments with the patient');
                    
                    $scope.data['noteid'] = $scope.noteid;
                    $scope.data['categories'] =[$scope.catid];
                    $scope.data['type'] = 4;
                    console.log(JSON.stringify($scope.data));

                    $http({
                        method: 'POST',
                        url: domain + 'doctors/share-consultation-note-details',
                        data: JSON.stringify($scope.data)
                    }).then(function successCallback(response) {
                        alert(response.data.message);
                    },function errorCallback(response){
                        alert('there was an error encountered');
                        console.log(response.data.message);
                        console.log(response.data.error);
                    });

                }
            }
        })

        .controller('RecordsViewBoxCtrl', function ($scope, $http, $stateParams, $ionicModal, $state, $ionicLoading) {
            console.log('RecordsViewBoxCtrl');
            $scope.allCats = [];
            $scope.selectedDoctorId = $stateParams.id;
            $scope.selectedDoctorName = $stateParams.name;
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.patientId = get('id');
            $scope.userId = get('doctorid');

            console.log($scope.userId);
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/get-shared-record-doctors-details',
                params: {userId: $scope.userId, patientId: $scope.patientId, interface: $scope.interface, doctorId: $scope.selectedDoctorId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.allCats = response.data;
                console.log($scope.allCats);
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.gotopage = function(goUrl,cat){
                cat = "" + cat +"";
                console.log('gotopage: ' + goUrl);
                store({'patientId': $scope.patientId,'doctorid':$scope.selectedDoctorId,shared: 0,create: 0});
                $state.go(goUrl, {'patientId': $scope.patientId,'userId' : $scope.selectedDoctorId, 'id':cat,shared: '1'}, {relaod: true});
            }
        })
        .controller('ConsultationsNotesPlainNoteCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $compile,$timeout, $filter, $ionicModal) {
            $scope.noteid = (get('noteId') == null)? get('noteid'):get('noteId');
            $scope.fileToBeUploaded = null;
            $scope.data = {};
            $scope.data['noteid'] = $scope.noteid;
            $scope.data['description']= "";
            $scope.selectedPlainNoteImg = "";
            $scope.PlainNoteIds = [];
            console.log('plain note controller called for note id ' + $scope.noteid);
            
            $scope.doRefresh = function(){
                $http({
                    method: 'GET',
                    url: domain + 'doctors/consultation-note-plain-notes',
                    params: {noteid: $scope.noteid}
                }).then(function successCallback(response) {
                    $scope.plainNoteCards = response.data;
                    console.log($scope.plainNoteCards);
                }, function errorCallback(response){
                    console.log('error');
                });
            }
            
            $ionicModal.fromTemplateUrl('plain-note-image', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });


            $scope.savePlainNote = function(){
                console.log('savePlainNote called');
                var fd = new FormData();
                fd.append("file", $scope.fileToBeUploaded);
                fd.append("noteid",$scope.noteid);
                console.log('fd created');
                console.log(fd);
                $http.post(domain + 'doctors/consultation-note-plain-notes-image-upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
                }
                ).success(function(result) {
                    console.log(result);
                    var allow = true;   
                    switch(result.status){
                        case 0:{
                            alert('error');
                            console.log(result.error);
                            break;
                        }
                        case 1:{
                            $scope.data['url'] = result.src;
                            break;
                        }
                        case 2:{
                            if(confirm(result.message)){
                                $scope.data['url'] = " ";
                            }else{
                                allow = false;
                            }

                            break;
                        }
                        default:  {
                            alert('unknown error');
                            allow = false;
                            break;
                        }
                    }
                    if(allow){
                        console.log(JSON.stringify($scope.data));
                        $http({
                            method: 'POST',
                            url: domain + 'doctors/consultation-note-add-plain-notes',
                            data: JSON.stringify($scope.data)
                        }).then(function successCallback(response) {
                           $scope.cancelPlainNoteAddPage();
                           $scope.doRefresh();
                           alert('added successfully');
                        });
                    }
                })
            }
            $scope.cancelPlainNoteAddPage = function(){
                console.log('cancelPlainNoteAddPage called');
                jQuery('.PlainNotesView').show('slow');
                jQuery('.plainNotesAdd').hide('slow');
            }
            $scope.sharePlainNotes = function(){
                console.log('sharePlainNotes called');
            }
            $scope.addPlainNotes = function(){
                console.log('addPlainNotes called');
                jQuery('.plainNotesAdd').show('slow');
                jQuery('.PlainNotesView').hide('slow');
            }

            $scope.setFile = function(element){
                console.log(element.files[0]);
                $scope.fileToBeUploaded = element.files[0];
            }

            $scope.openPlainNoteModal = function(card){
                // console.log('hi');
                console.log($scope.value = card.attachment.host + card.attachment.attachment_path + card.attachment.orginial_name);
                $scope.modal.show();
            }

            $scope.closeModal = function(){
                $scope.modal.hide();
            }

            $scope.sharePlainNotes = function (obj) {
                // jQuery('.selectObservations').css('display', 'block');
                // jQuery('#shareObs').css('display', 'none');
                // jQuery('#cancelObs').css('display', 'block');
                if(confirm('Are you sure you want to share all Plain Notes with the patient?')){
                    console.log('sharing following Plain Notes with the patient');
                    angular.forEach(obj, function(value,key){
                        $scope.PlainNoteIds.push(value['id']);
                    });
                    $scope.data['noteid'] = $scope.noteid;
                    $scope.data['rowids'] = $scope.PlainNoteIds;
                    $scope.data['type'] = 5;
                    console.log(JSON.stringify($scope.data));

                    $http({
                        method: 'POST',
                        url: domain + 'doctors/share-consultation-note-details',
                        data: JSON.stringify($scope.data)
                    }).then(function successCallback(response) {
                        alert(response.data.message);
                    },function errorCallback(response){
                        alert('there was an error encountered');
                        console.log(response.data.message);
                        console.log(response.data.error);
                    });

                }
            };

            $scope.doRefresh();
        })
        ;