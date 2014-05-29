'use strict';

/* Header CDontroller */

function HeaderController($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}

/* Controllers */

function initTable(scope, items, sortColumn, sortDirection) {
    scope.filter = {}
    scope.items = items
    scope.sortColumn = sortColumn;
    scope.sortDirection == sortDirection
    scope.dateFormat = 'yyyy-MM-dd HH:mm:ss Z'
}

function TableCtrl($rootScope, $scope, Balances) {
    $scope.totalItems = 20;
    $scope.currentPage = 1;

    $scope.filter = {}

    $scope.setSort = function (sort) {
        setSort($rootScope, $scope, sort)
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.currentPage);
        $scope.setItems($rootScope, $scope)
    };

    $rootScope.$on('CtrlPressed', function () {
        $scope.multiselect = true;
    });
    $rootScope.$on('CtrlReleased', function () {
        $scope.multiselect = false;
    });

    $scope.filterBy = function (value, field) {
        $scope.filter[field] = value
        $scope.setItems($rootScope, $scope)
    };
    $scope.resetFilter = function () {
        $scope.filter = {}
        $scope.setItems($rootScope, $scope)
    }
    $scope.sortClass = function (column) {
        return $scope.sortColumn.contains(column) && 'sort-' + $scope.sortDirection;
    };
}
function GoogleCtrl2($rootScope, $scope, $http, Users) {
    $scope.$on('event:google-plus-signin-success', function (event, authResult) {
        gapi.auth.setToken(authResult); // Den zurückgegebenen Token speichern.
        $rootScope.profile = Users.auth({token: authResult.access_token}, function(response) {
            $http.defaults.headers.common["X-AUTH-TOKEN"] = response.googleId.toString();
        });
        console.log('success full login');
    })
};

function BalanceCtrl($rootScope, $scope, Balances) {
    initTable($scope, 10, 'date', 'desc')

    $scope.setItems = function (rootScope, scope) {
        loadBalances($rootScope, scope, Balances)
    };
    $scope.setItems($rootScope, $scope)
}

function StockCtrl($rootScope, $scope, Stocks) {
    initTable($scope, 10, 'date', 'desc')
    $scope.sortDirection="asc"

    $scope.setItems = function (rootScope, scope) {
        loadStocks($rootScope, scope, Stocks)
    };
    $scope.setItems($rootScope, $scope)
}

function DetailCtrl($scope, $routeParams, YqlQuotes) {
    var fetchQuote = (function () {
        var promiseQuote = YqlQuotes.getQuotes($routeParams.symbol);
        promiseQuote.then(function (data) {
            $scope.quote = data.quote;
        });
    });
    fetchQuote()
}

function loadStocks(rootScope, scope, Stocks) {
    scope.stocks = Stocks.get({sort: scope.sortColumn, direction: scope.sortDirection, items: scope.items, page: scope.currentPage, name_enc: scope.filter.fieldName, date: scope.filter.fieldDate}, function (response) {
        scope.totalItems = response.count;
    });
}

function loadBalances(rootScope, scope, Balances) {
    scope.balances = Balances.get({sort: scope.sortColumn, direction: scope.sortDirection, items: scope.items, page: scope.currentPage, name_enc: scope.filter.fieldName}, function (response) {
        scope.totalItems = response.count;
    });
}

function setSort(rootScope, scope, sort) {
    var oldSort = angular.copy(scope.sortColumn);
    if (scope.multiselect) scope.sortColumn = scope.sortColumn + " " + sort; else scope.sortColumn = sort;
    if (oldSort == sort) scope.sortDirection = scope.sortDirection == 'desc' ? 'asc' : 'desc'; else scope.sortDirection = 'desc';
    scope.setItems(rootScope, scope)
};
