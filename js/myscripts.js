var privateKey ="";
var publicKey = "";
$(document).ready(function () {
    var elem = angular.element(document.querySelector('[ng-app]'));
    var injector = elem.injector();
    var $rootScope = injector.get('$rootScope');
    if (get('id') != null) {
        $rootScope.$apply(function () {
            $rootScope.userLogged = 1;
            $rootScope.username = window.localStorage.getItem('fname');
            //if (document.location.hash == "#/auth/login" || document.location.hash == "#/auth/walkthrough")
              //  window.location.href = "#/app/category-listing";
        });
    } else {
        $rootScope.$apply(function () {
            $rootScope.userLogged = 0;
            window.location.href = "#/app/category-listing";
        });
    }
});