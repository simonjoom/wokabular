angular.module('wokabular')
    //Controls ths navigation bar and  nav-links
    .controller("MenuController", ['$scope','authFactory','$location','$rootScope','$state',function($scope,authFactory,$location,$rootScope,$state){
        loadingScreenAnimation();
        checkMenu();
        //Loading Screen
        $scope.loading = false;

        //Get user Details
        $scope.loggedIn = authFactory.isAuthenticated();
        $scope.username = authFactory.getUsername();
        $scope.fullname = authFactory.getFullname();



        $scope.logoutUser = function(){
            authFactory.logout();
            $scope.loggedIn=false;
            $state.go('app');
        };

        $rootScope.$on('$stateChangeSuccess', function() {
            if(authFactory.isAuthenticated()){
                $location.path('users/'+$scope.username);
            }
            checkMenu();
        });

        $rootScope.$on('registration:Successful',function(){
            $scope.loggedIn=authFactory.isAuthenticated();
            $scope.username=authFactory.getUsername();
        });
        $rootScope.$on('login:Successful',function(){
            $scope.loggedIn=authFactory.isAuthenticated();
            $scope.username=authFactory.getUsername();
        });


        //Check for if it is a login or Register state
        function checkMenu(){
            if($state.is('app.login') || $state.is('app.register')){
                $scope.isHomePage=false;
            }else{
                $scope.isHomePage=true;
            }
        };


        function loadingScreenAnimation(){
            var dot = $('.dot'),
            dotsSection = $('#loading-dots');
            var tldot = new TimelineMax({repeat:-1});

            tldot.staggerFromTo(dot, .6,
                {y:0, autoAlpha:0},
                {y:20, autoAlpha:1,ease:Back.easeInOut},
                .05
            )
            .fromTo(dotsSection, .6,
                {autoAlpha:1, scale:1.1},
                {autoAlpha:0, scale:1, ease:Power0.easseNone},
                .9
            );

        };


    }])//MenuCtrl End

    //Controller for homepage and its animation
    .controller('HomeController', ['$scope','authFactory','$location',function($scope,authFactory,$location){

        if(authFactory.isAuthenticated()){
            $location.path('users/'+authFactory.getUsername());
        }

        var controller = new ScrollMagic.Controller();

        parallax();
        animateDevices();
        animateFeatures();

        function parallax(){
            if($(window).height()<667){
                var duration = '300%';
            }
            else{
                var duration = '160%';
            }
            var tl = new TimelineMax();
            tl.to($('#header-bcg'),1, {y:'-50%', ease:Power0.easeNone})
            var scene = new ScrollMagic.Scene({
                triggerElement:'header',
                triggerHook:.1,
                duration:duration
            })
            .setTween(tl)
            .addTo(controller);
        }

        function animateDevices(){
            if($(window).width()<650){
                var hook = .5;
            }
            else{
                var hook = .27;
            }
            var scene = new ScrollMagic.Scene({
                triggerElement:'#mac',
                reverse:false,
                triggerHook:hook
            })
            .setClassToggle('#mac, #iphone, #heading-wrapper','fade-in')
            .addTo(controller);
        }

        function animateFeatures(){
            var scene = new ScrollMagic.Scene({
                triggerElement:'#features',
                reverse:false,
                triggerHook:.3
            })
            .setClassToggle('#features h1,#features section','fade-in')
            .addTo(controller);
        }
    }])//HomeCtrl End

    //Conrtroller for User Registeration
    .controller('RegisterController', ['$scope','authFactory','$location','$rootScope',function($scope,authFactory,$location,$rootScope){

        //Data received from the registration form
        $scope.registerData={};

        //Registration Error Message
        $scope.errorMsg = "Error";
        $scope.errorResponse = false;


        if(authFactory.isAuthenticated()){
            $location.path('users/'+authFactory.getUsername());
        }

        //Main register fn
        $scope.registerUser = function(){
            authFactory.register($scope.registerData);
        };

        //If there is a registration error, show the error msg
        $rootScope.$on('register:error', function(){
            $scope.errorResponse = authFactory.isError();
            $scope.errorMsg = authFactory.getErrorMsg();
            console.log("Register Error");
        });

    }])//RegisterCtrl End

    //Controller for the User Login
    .controller('LoginController', ['$scope','authFactory','$location','$rootScope',function($scope,authFactory,$location,$rootScope){

        //Data received from the login form
        $scope.loginData={};

        //Login Error Message
        $scope.errorMsg = "Error";
        $scope.errorResponse = false;

        if(authFactory.isAuthenticated()){
            $location.path('users/'+authFactory.getUsername());
        }

        $scope.loginUser = function(){
             authFactory.login($scope.loginData);
        };

        $scope.logoutUser = function(){
            authFactory.logout();
        };

        //If there is a login error, show the error msg
        $rootScope.$on('login:error', function(){
            $scope.errorResponse = authFactory.isError();
            $scope.errorMsg = authFactory.getErrorMsg();
            console.log("Login Error");
        });

    }])//LoginCtrl End

    //controller for the User's Account
    .controller("AccountController", ['$scope','$rootScope','dataFactory', 'authFactory','$location','$state',function($scope,$rootScope, dataFactory,authFactory,$location,$state){
        //Data received from the add new list Dialog
        $scope.newList={};
        //Existing Lists of a user
        $scope.lists = [];

        var dialog    = $('.dialog-wrapper'),
            dialogBox = $('.dialog-box');

        $scope.fullname = authFactory.getFullname();

        if(authFactory.isAuthenticated()){
            $scope.totalWords =  dataFactory.totalWords().query();
            $scope.username = authFactory.getUsername();
            $scope.fullname = authFactory.getFullname();
            $scope.lists = dataFactory.getLists().query();
            $location.path('users/'+authFactory.getUsername());
        }else{
                $location.path('/');
        }

        //Add a new List
        $scope.addList = function(){
            if($scope.newList.name.trim()===""){
                return;
            }
            var data = {
                name:$scope.newList.name.trim(),
                author:$scope.newList.author.trim(),
            };
            dataFactory.getLists().save(data).$promise.then(function(result){
                        $scope.lists = dataFactory.getLists().query();
                        $scope.closeDialog();
                        $scope.newList={};
                }, function(err){

                });
            $scope.addNewListForm.$setPristine();
        };

        //Delete all the Lists
        $scope.deleteAllLists = function(){
            dataFactory.getLists().remove({}).$promise.then(function(result){

                $scope.posts = dataFactory.getLists().query();
            },function(err){

            });
        };

        //Delete a particular list
        $scope.deleteList = function(id){
                dataFactory.getLists().remove({id:id}).$promise.then(function(result){

                $scope.posts = dataFactory.getLists().query();
            }, function(err){

            });
        };

        //Handles opening and closing of Add new List Dialog
        $scope.$on('open-dialog', function(){
            TweenMax.to(dialog,.3,{autoAlpha:1,ease:Power0.easeOut});
            TweenMax.from(dialogBox,.6,{y:'-70%',autoAlpha:0,ease:Power2.easeInOut},0.3);
        });
        $scope.$on('close-dialog', function(){
            TweenMax.to(dialog,.3,{autoAlpha:0,ease:Power0.easeOut},0.3);
            TweenMax.from(dialogBox,.6,{autoAlpha:1,ease:Power2.easeInOut},0.3);
        });
        $scope.openDialog = function(){
            $rootScope.$broadcast('open-dialog');
        };
        $scope.closeDialog = function(){
            //Set the form fields to empty on cloasing the dialog
            $scope.newList={};
            $rootScope.$broadcast('close-dialog');
        };

    }])

    //controller for a List
    .controller('ListController',['$scope','$rootScope','dataFactory', 'authFactory','$location','$state','$stateParams',function($scope,$rootScope, dataFactory,authFactory,$location,$state,$stateParams){
        //Data received from the add new list Dialog
        $scope.newWord={};
        //On editing a word, get the existing values of the fields
        $scope.oldWord={};

        //Dialog box handling
        var addWrapper    = $('#add-wrapper'),
            editWrapper   = $('#edit-wrapper'),
            dialogBoxAdd  = $('#add-word'),
            dialogBoxEdit = $('#edit-word');

        var wordIndex =0;

        $scope.listInfo = dataFactory.getLists().get({listId:$stateParams.listId});
        $scope.words = dataFactory.getWords().query({listId:$stateParams.listId});

        //Add a new Word
        $scope.addWord = function(){
            if($scope.newWord.word.trim()===""){
                return;
            }
            var data = {
                word:$scope.newWord.word.trim(),
                description:$scope.newWord.description.trim(),
                mneumonic:$scope.newWord.mneumonic.trim(),
            };

            dataFactory.getWords().save({listId:$stateParams.listId},data).$promise.then(function(result){
                        $scope.words = dataFactory.getWords().query({listId:$stateParams.listId});
                        $scope.listInfo = dataFactory.getLists().get({listId:$stateParams.listId});
                        $scope.closeDialog();
                        $scope.newWord={};
                }, function(err){

                });
            $scope.addNewWordForm.$setPristine();
        };

        //Delete a particular word
        $scope.deleteWord = function(id){
            dataFactory.getWords().remove({listId:$stateParams.listId, wordId:id}).$promise.then(function(result){
                        $scope.words = dataFactory.getWords().query({listId:$stateParams.listId});
                        $scope.listInfo = dataFactory.getLists().get({listId:$stateParams.listId});
                }, function(err){

                });
        };

        //Open the edit word Dialog box
        $scope.editWord = function(index){
            $scope.oldWord = $scope.words[index];
            $scope.openEditDialog();
            wordIndex=index;
        };

        //Update the existing word's info
        $scope.updateWord = function(){
            var data = {
                word:$scope.oldWord.word.trim(),
                description:$scope.oldWord.description.trim(),
                mneumonic:$scope.oldWord.mneumonic.trim(),
            };
            var id = $scope.words[wordIndex]._id;
            dataFactory.getWords().update({listId:$stateParams.listId, wordId:id},data).$promise.then(function(result){
                        $scope.words = dataFactory.getWords().query({listId:$stateParams.listId});
                        $scope.closeEditDialog();
                }, function(err){

                });
            $scope.editWordForm.$setPristine();
        };

        //Handles opening and closing of Add new word Dialog box
        $scope.$on('open-dialog', function(){
            TweenMax.to(addWrapper,.3,{autoAlpha:1,ease:Power0.easeOut});
            TweenMax.from(dialogBoxAdd,.6,{y:'-70%',autoAlpha:0,ease:Power2.easeInOut},0.3);
        });
        $scope.$on('close-dialog', function(){
            TweenMax.to(addWrapper,.3,{autoAlpha:0,ease:Power0.easeOut},0.3);
            TweenMax.from(dialogBoxAdd,.6,{autoAlpha:1,ease:Power2.easeInOut},0.3);
        });
        $scope.openDialog = function(){
            $rootScope.$broadcast('open-dialog');
        };
        $scope.closeDialog = function(){
            $rootScope.$broadcast('close-dialog');
        };

        //Handles opening and closing of Editing word, Dialog box
        $scope.$on('open-edit-dialog', function(){
            TweenMax.to(editWrapper,.3,{autoAlpha:1,ease:Power0.easeOut});
            TweenMax.from(dialogBoxEdit,.6,{y:'-70%',autoAlpha:0,ease:Power2.easeInOut},0.3);
        });
        $scope.$on('close-edit-dialog', function(){
            TweenMax.to(editWrapper,.3,{autoAlpha:0,ease:Power0.easeOut},0.3);
            TweenMax.to(dialogBoxEdit,.6,{autoAlpha:1,ease:Power2.easeInOut},0.3);
        });
        $scope.openEditDialog = function(){
            $rootScope.$broadcast('open-edit-dialog');
        };
        $scope.closeEditDialog = function(){
            $rootScope.$broadcast('close-edit-dialog');
        };
    }])//ListCtrl End

    //Controller for the footer
    .controller("FooterController", ['$scope','$state','$rootScope',function($scope,$state,$rootScope){
        checkFooter();

        function checkFooter(){
            if($state.is('app')){
                $scope.isHomePage=true;
            }else{
                $scope.isHomePage=false;
            }
        }

        $rootScope.$on('$stateChangeSuccess', function() {
            checkFooter();
        });

    }])

;//Method chaining ends here
