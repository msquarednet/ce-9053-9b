var app = angular.module("myWorld", ['ngRoute']);
app.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when("/", {
            controller: "HomeCtrl",
            templateUrl: "/templates/index.html"
        })
        .when("/people", {
            controller: "PeopleCtrl",
            templateUrl: "/templates/people/list.html"
        })
        .when("/things", {
            controller: "ThingsCtrl",
            templateUrl: "/templates/things/list.html"
        });
        
        $locationProvider.html5Mode(true);
});

app.factory("PeopleSvc", function($q, $http){
    return {
        getPeople: function(){
           var dfd = $q.defer();
           $http.get("/api/people").then(function(result){
                dfd.resolve(result.data);    
           });
           return dfd.promise;
        },
        deletePerson: function(person){
            var dfd = $q.defer();
            $http.delete("/api/people/" + person._id).then(function(){
                dfd.resolve(); 
            });
            return dfd.promise;
        },
        insertPerson: function(person){
            var dfd = $q.defer();
            $http.post("/api/people", person).then(function(){
               dfd.resolve(); 
            });
            return dfd.promise;
        }
    };
});

app.factory("HeaderSvc", function(){
    var _tabs = [
        { title: "Home", path: "/" },
        { title: "People", path: "/people" },
        { title: "Things", path: "/things" }
    ];
    return {
        tabs: _tabs,
        setTab: function(title){
            for(var i = 0 ; i < _tabs.length; i++){
                if(title == _tabs[i].title){
                    _tabs[i].active = true;
                }
                else{
                    _tabs[i].active = false;
                }
            }
        }
    }; 
});

app.controller("HomeCtrl", function($scope, HeaderSvc){
    HeaderSvc.setTab("Home");
    $scope.foo = Math.random();
});

app.controller("PeopleCtrl", function($scope, HeaderSvc, PeopleSvc){
    HeaderSvc.setTab("People");
    $scope.inserting = {
        name: "Foo"
    };
    
    function activate(){
        PeopleSvc.getPeople().then(function(people){
            $scope.people = people;
        });
    }
    activate();
    
    $scope.delete = function(person){
        PeopleSvc.deletePerson(person).then(function(){
            activate();
        });
    };
    
    $scope.insert = function(){
        PeopleSvc.insertPerson($scope.inserting).then(function(){
            activate();
        });
    };
    $scope.edit = function(person){
       $scope.editing = person; 
    };
});

app.controller("ThingsCtrl", function(HeaderSvc){
    HeaderSvc.setTab("Things");
});


app.controller("HeaderCtrl", function($scope, HeaderSvc){
    $scope.tabs = HeaderSvc.tabs;
});

