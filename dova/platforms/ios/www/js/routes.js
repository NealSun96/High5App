angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('signUpComplete', {
    url: '/signUpComplete',
    templateUrl: 'templates/signUpComplete.html',
    controller: 'signUpCompleteCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('courseOne', {
    url: '/CourseOne',
    templateUrl: 'templates/courseOne.html',
    controller: 'courseOneCtrl'
  })

  .state('quizPage', {
    url: '/quizPage',
    templateUrl: 'templates/quizPage.html',
    controller: 'quizPageCtrl'
  })

  .state('taskPage', {
    url: '/taskPage',
    templateUrl: 'templates/taskPage.html',
    controller: 'taskPageCtrl'
  })

  .state('dashboard', {
    url: '/dash',
    templateUrl: 'templates/dashboard.html',
    controller: 'dashboardCtrl'
  })

$urlRouterProvider.otherwise('/login')

  

});