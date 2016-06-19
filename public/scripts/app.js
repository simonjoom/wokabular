angular.module('wokabular', ['ngResource','ui.router','ngAnimate'])

    //Base Api URL
    .constant("baseUrl", "http://localhost:3000/")

    //UI Router Config
    .config(['$stateProvider','$urlRouterProvider','$locationProvider','$httpProvider',function($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider){
        $stateProvider
            //Base Starting State
            .state('app',{
                url:'/',
                views:{
                    'menu':{
                        templateUrl:'views/menu.html',
                        controller:'MenuController'
                    },
                    'content':{
                        templateUrl:'views/home.html',
                        controller:'HomeController'
                    },
                    'footer':{
                        templateUrl:'views/footer.html',
                        controller:'FooterController'
                    }
                },

            })

            //Register User
            .state('app.register',{
                url:'register',
                views:{
                    'content@':{
                        templateUrl:'views/register.html',
                        controller:'RegisterController'
                    }
                }
            })

            //Login User
            .state('app.login',{
                url:'login',
                views:{
                    'content@':{
                        templateUrl:'views/login.html',
                        controller:'LoginController'
                    }
                }

            })

            //User Account
            .state('app.account',{
                url:'users/:user',
                views:{
                    'content@':{
                    templateUrl:'views/account.html',
                    controller:'AccountController'
                    }
                }
            })

            //A particular list
            .state('app.list',{
                url:'lists/:listId',
                views:{
                    'content@':{
                        templateUrl:'views/list.html',
                        controller:'ListController'
                    }
                }
            })

            //Default state
            $urlRouterProvider.otherwise('/');
            $httpProvider.interceptors.push('myHttpInterceptor');
            //$locationProvider.html5Mode(true);

    }])

    // .run(function($rootScope){
    //
    //     $rootScope.$on('$stateChangeStart', function(){
    //         $rootScope.$broadcast('show loading');
    //     })
    //
    //     $rootScope.$on('$stateChangeSuccess', function(){
    //         $rootScope.$broadcast('hide loading');
    //     })
    // })
    ;
