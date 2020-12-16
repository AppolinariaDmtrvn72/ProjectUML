angular.module('taskboard', []);

//task template directive
angular.module('taskboard').directive('task', function () {
  return {
    template: document.querySelector("#task-template").innerHTML,
    replace: true
  };

});

angular.module('taskboard').factory('TaskService', ['$http', function ($http) {

  var getTasks = function (boardName) {
    return $http.get('http://jsbursa.wookieelabs.com:4600/tasks', { params: { id: boardName } });
  };

  return {
    getTasks: getTasks
  }

}]);

angular
  .module('taskboard')
  .controller('TaskboardCtrl',
              ['$scope', 'TaskService',
               function ($scope, taskService) {

                 $scope.boardName = '';

                 $scope.tasks = [];
                 $scope.showSplashScreen = true;

                 var findTask = function (taskId) {
                   return $scope.tasks.filter(function (task) {
                     return task.taskId === taskId;
                   })[0];
                 };

                 var hashChanged = function () {

                   $scope.boardName = window.location.hash.substring(1);

                   $scope.showSplashScreen = $scope.boardName.length < 1;

                   if (!$scope.showSplashScreen) {
                     initTaskBoard();
                   }

                 };

                 var initTaskBoard = function () {
                   taskService.getTasks($scope.boardName).then(function (response) {
                     var tasksObj = response.data;

                     $scope.tasks = [];
                     if (tasksObj == 0) {
                       //console.warn("Empty board");
                     } else {
                       for (var taskId in tasksObj) {
                         var task = tasksObj[taskId];
                         task.taskId = taskId;
                         $scope.tasks.push(task);
                       }
                     }
                   });
                 };
                 
                 $scope.reload = function (){
                   window.location.hash = '';
                   initTaskBoard();
                 };

                
                 $scope.setRandomHash = function ($event) {
                   window.location.hash = 'demo' + Math.random().toFixed(3);
                   $event.preventDefault();
                 };

                 $scope.changeStatus = function (taskId, newStatus) {
                   var task = findTask(taskId);

                   if (task) {
                     task.status = newStatus;
                   }

                 };

                 $scope.addTask = function () {
                   $scope.tasks.push({
                     taskId: Math.random(4) * 100,
                     title: this.title,
                     description: this.description,
                     status: "todo",
                   });

                   this.title = '';
                   this.description = '';
                 };

                 window.addEventListener('hashchange', hashChanged);

                 hashChanged();

               }]);
