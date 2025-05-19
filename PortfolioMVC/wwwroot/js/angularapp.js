//if(!app) app = angular.module('myApp', ['ngSanitize', 'ngTable', 'smart-table', 'angular.filter', 'ngMaterial', 'ngAnimate']);
//if(!window.app) window.app = angular.module('MyApp', ['ngSanitize', 'ngTable', 'daterangepicker', 'angular.filter', 'ngAnimate'])
	
if(window.angApp){
	window.angApp = {
		controller: function() {},
		factory: function(){},
		module: function() {},
		config: function() {},
		directive: function() {},
		filter: function() {},
		service: function() {},
		run: function(){}
	}
}
if(!window.angApp) window.angApp = angular.module('MyApp', ['ngSanitize', 'ngTable', 'angular.filter', 'ngAnimate', 'ngMessages', 'elif'])

angApp.run(function($rootScope, $location) {

});

angApp.config(
	  function ($controllerProvider, $provide, $compileProvider) {
		var app = angApp;
		app._controller = app.controller;
		app._service = app.service;
		app._factory = app.factory;
		app._value = app.value;
		app._directive = app.directive;
		app._component = app.component;

		app.controller = function (name, constructor) {
			$controllerProvider.register(name, constructor);
			return ( this );
		};
		app.service = function (name, constructor) {
			$provide.service(name, constructor);
			return ( this );
		};
		app.factory = function (name, factory) {
			$provide.factory(name, factory);
			return ( this );
		};
		app.value = function (name, value) {
			$provide.value(name, value);
			return ( this );
		};
		app.directive = function (name, factory) {
			$compileProvider.directive(name, factory);
			return ( this );
		};
		app.component = function (name, options) {
			$compileProvider.component(name, options);
			return ( this );
		};
});



if(!$.fn.scope)
	$.fn.extend({
		scope: function() {
			return angular.element(this).scope();
		}
	});
	

angApp.factory('httpInterceptor', function () {
  return {};
  /*return {
	'response': function(response) {

        return response;
      },
  };*/
});

angApp.config(['$httpProvider',function($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
}]);
angApp.config(['$provide', '$controllerProvider',function($provide, $controllerProvider) {
	window["$controllerProvider"] = $controllerProvider;
	$provide.value('$controllerProvider', $controllerProvider);
}]);
class NgTableBuilder
{
	constructor(NgTableParams)
	{
		this.params = {}
		this.options = {};
		this.NgTableParams = NgTableParams;
	}
	withParams(params){
		this.params = params;
		return this;
	}
	withOptions(options)
	{
		this.options = options;
		return this;
	}
	withCounts(counts)
	{
		this.options.counts = counts;
		return this;
	}
	withGetData(getData)
	{
		this.options.getData = getData;
		return this;
	}
	withTotal(total)
	{
		this.options.total = total;
		return this;
	}
	withData(data)
	{
		this.options.dataset = data;
	}
	build()
	{
		return new this.NgTableParams(this.params, this.options);
	}
}

function applyAngularExtends()
{
	let NgTableParams = angular.injector(['ng', 'ngTable']).get("NgTableParams")
	NgTableParams.builder = function()
	{
		return new NgTableBuilder(NgTableParams);
	}
	angApp.directiveMulti = function(arr, obj)
	{
		arr.forEach(function(e) {
			angApp.directive(e, obj);
		});
	}
	let $rootScope = angular.injector(["ng"]).get("$rootScope")
	let $http = angular.injector(["ng"]).get("$http");
	let httpProto = $http.constructor.prototype;
	httpProto.legacy = function(obj) {
		let successCb;
		let errorCb;
		let returnObject = {
			success: function(cb) {
				successCb = cb;
			},
			error: function(cb) {
				errorCb = cb;
			}
		}
		
		this(obj).then(function sc(result){
			successCb.apply(this, [result.data]);
		}, function er(result){
			errorCb.apply(this, [result.data]);
		});
		return returnObject;
	}
	
	$.fn.extend({
		angCompile: function(controller)
		{
			AngularUtils.CompileElement(this, controller);
			return this;
		}
	});	
	
	
}
applyAngularExtends();

var AngularUtils = {
	GetScope: function(name)
	{
		return $(".ng-scope[ng-controller='" + name + "']").scope();
	},
	CompileElement: function(element, options){
		let opt = {
			controller: undefined,
			onScopeFound: undefined,
			newScope: false,
			scope: undefined,
			compile: undefined
		}
		Object.assign(opt, options);
		let callback = opt.controller;
		let $scope = opt.scope || angular.element(element).scope() || AngularUtils.GetScope("Main");
		if(!$scope)
		{
			return{
				element: element
			};
		}
		if(opt.newScope)
			$scope = $scope.$new();
		opt.onScopeFound && opt.onScopeFound($scope);
		let $compile = opt.compile || $scope.$compile || angular.injector(["ng"]).get("$compile")
		let controllerAttr = $(element).attr("ng-controller")
		let provider = window.$controllerProvider;
		let isTemp = false;
		if(!controllerAttr && callback)
		{
			let tempName = "tcnt_" + Math.floor(Math.random() * (10000000 - 0 + 1) + 0);
			$(element).attr("ng-controller", tempName)
			controllerAttr = tempName;
			isTemp = true;
		}

		if(controllerAttr && provider)
		{
			if(!provider.has(controllerAttr) && !$scope[controllerAttr])
			{
				$scope[controllerAttr] = callback ? callback : function(){}
			}
		}
		$compile($(element))($scope);
		$scope.$$digest();
			return{
				scope: $scope,
				element: element
			};
	}
}