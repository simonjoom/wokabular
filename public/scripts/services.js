angular.module('wokabular')
//All the API access functions + CRUD operations
.factory('dataFactory',['$resource', 'baseUrl', function($resource, baseUrl){
        var datafac = {};

        //CRUD operations on Lists
        datafac.getLists = function(){
            return $resource(baseUrl+'lists/:listId',
                    {},
                    {
                        update:{
                            method:"PUT"
                        }
                    });
        };

        //CRUD operations on words
        datafac.getWords = function(){
            return $resource(baseUrl+'lists/:listId/words/:wordId',
                    {},
                    {
                        update:{
                            method:"PUT"
                        }
                    });
        };

        //All the words in a user's account
        datafac.totalWords = function(){
            return $resource(baseUrl+'lists/all/totalwords',
                    {}
                );
        };

        return datafac;

    }])

    //Servicec for handling authentication and registration
    .factory('authFactory',['$resource', 'baseUrl','$http','$rootScope','$localStorage','$location',function($resource, baseUrl, $http, $rootScope,$localStorage,$location){
        var authfac = {};

        var TOKEN_KEY = "Token";
        var isAuthenticated = false;
        var username = '';
        var fullname = '';
        var authToken = 'undefined';

        var error = false;
        var errorMsg = "";

        loadCredentials();
        //Store user credentials in browsers local storage
        function storeUserCredentials(credentials){
            $localStorage.storeObject(TOKEN_KEY,credentials);
            useCredentials(credentials);
        };

        //Set the http header for token
        function useCredentials(credentials){
            isAuthenticated=true;
            username = credentials.username;
            authToken = credentials.token;

            $http.defaults.headers.common['x-access-token'] = authToken;
        };

        //Delete user's credentials stored in the browsers local storage
        function destroyCredentials(){
            authToken = 'undefined';
            username='';
            isAuthenticated = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            $localStorage.remove(TOKEN_KEY);
        };

        //Loadd user's credentials from the browsers local storage
        function loadCredentials(){
            var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
            if(credentials.username != undefined){
                useCredentials(credentials);
            }
        };

        //Login
        authfac.login = function(loginData){
            $resource(baseUrl+'login').save(loginData, function(response){
                storeUserCredentials({username:loginData.username,token:response.token});
                fullname = response.fullname;
                $location.path('users/'+loginData.username);
                $rootScope.$broadcast('login:Successful');
            }, function(response){
                error = true;
                errorMsg = response.data.err.message;
                $rootScope.$broadcast('login:error');
                console.log("Error logging in user --->\t"+response.data.err.name+"\t"+response.data.err.message);
            });
        };

        //Registration
        authfac.register = function(registerData){
            $resource(baseUrl+'register').save(registerData,
            function(response){
                authfac.login({username:registerData.username, password:registerData.password});
                $location.path('users/'+registerData.username);
                $rootScope.$broadcast('registration:successfull');
            }, function(response){
                error = true;
                errorMsg = response.data.err.message;
                $rootScope.$broadcast('register:error');
                console.log("Error registering user --->\t"+response.data.err.name+',\t'+response.data.err.message);

            });
        };

        //Logout
        authfac.logout = function(){
            $resource(baseUrl + 'logout').get();
            //$location.path('home');
            destroyCredentials();
        };

        /*
        =============================Custom methods=============================
        */
        authfac.isAuthenticated = function(){
            return isAuthenticated;
        };

        authfac.getUsername = function(){
            return username;
        };

        authfac.getFullname = function(){
            return fullname;
        };
        authfac.isError = function(){
            return error;
        };
        authfac.getErrorMsg = function(){
            return errorMsg;
        };

        return authfac;

    }])

    //Service for handling local storage
    .factory('$localStorage', ['$window', function($window){
        return {
            store:function(key,value){
                $window.localStorage[key] = value;
            },
            get:function(key, defaultValue){
                return $window.localStorage[key] || defaultValue;
            },
            remove:function(key){
                $window.localStorage.removeItem(key);
            },
            storeObject:function(key, value){
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject:function(key,defaultValue){
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        };
    }])

    //Ajax requests and responses interceptor service
    .factory('myHttpInterceptor', function ($q, $window,$rootScope) {
        $rootScope.ActiveAjaxConectionsWithouthNotifications = 0;
        var checker = function(parameters,status){
                //YOU CAN USE parameters.url TO IGNORE SOME URL
                if(status == "request"){
                    $rootScope.ActiveAjaxConectionsWithouthNotifications+=1;
                    //$('.loading-screen').show(100);
                    TweenMax.to($('#loading-screen'),.3,{autoAlpha:1,ease:Power0.easeOut});
                }
                if(status == "response"){
                    $rootScope.ActiveAjaxConectionsWithouthNotifications-=1;

                }
                if($rootScope.ActiveAjaxConectionsWithouthNotifications<=0){
                    $rootScope.ActiveAjaxConectionsWithouthNotifications=0;
                    //$('.loading-screen').hide(100);
                    TweenMax.to($('#loading-screen'),.3,{autoAlpha:0,ease:Power0.easeOut});

                }


            };
            return {
                'request': function(config) {
                    checker(config,"request");
                    return config;
                },
               'requestError': function(rejection) {
                   checker(rejection.config,"request");
                  return $q.reject(rejection);
                },
                'response': function(response) {
                     checker(response.config,"response");
                  return response;
                },
               'responseError': function(rejection) {
                    checker(rejection.config,"response");
                  return $q.reject(rejection);
                }
              };
    })

    ;//End
