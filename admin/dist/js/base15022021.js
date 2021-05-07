var app = angular.module('akva', ['ngRoute', 'date-picker', 'flow', 'google-maps', 'ngStorage']);

var connString = 'http://localhost:7085/';
// var tmpPath = '/antey-admin/';
//var tmpPath = '/ecom-admin/admin/';

var connString = 'http://95.217.134.152/api/v1/sync';
var connString1 = 'http://95.217.134.152/api/v1/sync';
var tmpPath = '/monitoring/';

app.run(function($rootScope, $location, $localStorage) {
    if(localStorage.getItem('loggedin')){
        $rootScope.login = true;
    } else {
        $rootScope.login = false;
        $location.url('/login');
    }
})


app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: tmpPath + 'tpl/items.tpl.html',
        controller: 'ItemsController'
    });


    $routeProvider.when('/items', {
        templateUrl: tmpPath + 'tpl/items.tpl.html',
        controller: 'ItemsController'
    });

    $routeProvider.when('/locales', {
        templateUrl: tmpPath + 'tpl/locales.tpl.html',
        controller: 'LocalesController'
    });

    $routeProvider.when('/brands', {
        templateUrl: tmpPath + 'tpl/brands.tpl.html',
        controller: 'BrandsController'
    });

    $routeProvider.when('/categories', {
        templateUrl: tmpPath + 'tpl/categories.tpl.html',
        controller: 'CategoriesController'
    });

    $routeProvider.when('/subcategories', {
        templateUrl: tmpPath + 'tpl/subcategories.tpl.html',
        controller: 'SubCategoriesController'
    });

    $routeProvider.when('/banners', {
        templateUrl: tmpPath + 'tpl/banners.tpl.html',
        controller: 'BannersController',
    })
    $routeProvider.when('/:brand/items', {
        templateUrl: tmpPath + 'tpl/items-by-brand.tpl.html',
        controller: 'ItemsBrandController'
    });

    $routeProvider.when('/group/:group/items', {
        templateUrl: tmpPath + 'tpl/items-by-categories.tpl.html',
        controller: 'ItemsGroupsController'
    });

    $routeProvider.when('/subgroup/:group/items', {
        templateUrl: tmpPath + 'tpl/items-by-subcategories.tpl.html',
        controller: 'ItemsSubGroupsController'
    });

    $routeProvider.when('/orders', {
        templateUrl: tmpPath + 'tpl/orders.tpl.html',
        controller: 'OrdersController'
    });

    $routeProvider.when('/orders-range', {
        templateUrl: tmpPath + 'tpl/ordersRange.tpl.html',
        controller: 'OrdersRangeController'
    });

    $routeProvider.when('/orders-all', {
        templateUrl: tmpPath + 'tpl/ordersAll.tpl.html',
        controller: 'OrdersAllController'
    });

    $routeProvider.when('/order-details/:id', {
        templateUrl: tmpPath + 'tpl/order-details.tpl.html',
        controller: 'OrderDetailsController'
    });

    $routeProvider.when('/customers', {
        templateUrl: tmpPath + 'tpl/customers.tpl.html',
        controller: 'CustomersController'
    });

    $routeProvider.when('/reviews', {
        templateUrl: tmpPath + 'tpl/reviews.tpl.html',
        controller: 'ReviewsController'
    });

    $routeProvider.when('/designer', {
        templateUrl: tmpPath + 'tpl/desinger.tpl.html',
        controller: 'DesignerController'
    });

    $routeProvider.when('/discounts', {
        templateUrl: tmpPath + 'tpl/discounts.tpl.html',
        controller: 'DiscountController'
    });

    $routeProvider.when('/news', {
        templateUrl: tmpPath + 'tpl/news.tpl.html',
        controller: 'NewsController'
    });

    $routeProvider.when('/login', {
        templateUrl: tmpPath + 'tpl/login.tpl.html',
        controller: 'LoginController',
        division: 'login'
    });

    $routeProvider.when('/logout', {
        templateUrl: tmpPath + 'tpl/login.tpl.html',
        controller: 'LoginController',
        division: 'logout'
    });

    $routeProvider.when('/register', {
        templateUrl: tmpPath + 'tpl/register.tpl.html',
        controller: 'RegisterController'
    });

    $routeProvider.when('/one-click', {
        templateUrl: tmpPath + 'tpl/oneclick-order.tpl.html',
        controller: 'OneClickController'
    });


    $routeProvider.when('/dashboard', {
        templateUrl: '/admin/tpl/dashboard.tpl.html',
        controller: 'TemplatesDashboard'
    });

    $routeProvider.when('/propmocodes', {
        templateUrl: '/static/tpl/promo-codes.tpl.html',
        controller: 'promoCodeController'
    });


    $routeProvider.when('/tpl/product', {
        templateUrl: '/static/tpl/productCodes.tpl.html',
        controller: 'ProductController'
    });
}])


    .controller('ItemsController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        //$scope.name = $routeParams.name;
        $scope.raw = {};
        $http({ url: connString + 'products', method: 'GET' }).success(function(data) {
            $scope.products = data;


            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.products.length; //Initially for no filter
            $scope.totalItems = $scope.products.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');
            }
            // for (var i = 0; i < data.length; i++) {
            //     if (data[i].available == 1) data[i].available = "Доступен";
            //     if (data[i].status == 0) data[i].available = "Недоступен";
            // }

            $scope.editingData = {};

            for (var i = 0; i < data.length; i++) {
                $scope.editingData[$scope.products[i].id] = false;
            }


            /*for (var i = 0; i < data.templates.state; i++) {
                 if (data.templates[i].lastChanged) data.templates[i].lastChanged = moment.utc(data.templates[i].lastChanged).local().format('DD.MM.YY HH:mm:ss');
                 //if (data[i].apCreated) data[i].apCreated = moment.utc(data[i].apCreated).local().format('DD.MM.YY HH:mm:ss');
             }*/
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.modify = function(tableData){
            console.log(tableData)
            $scope.editingData[tableData.id] = true;
            $scope.collection = tableData.collectionId;
        };

        $scope.handleCollectionChange = function(collection) {
            $scope.collection = collection;
        }


        $scope.update = function(tableData){
            $http({
                url: connString + 'productChangeInfo/' + tableData.id,
                method: 'POST',
                json: true,
                data: {
                    description: tableData.description,
                    collectionId: $scope.collection,
                }
            }).success(function() {
                console.log('changed description for item -> ' + tableData.id)
                $scope.editingData[tableData.id] = false;
            });

        };

        $scope.enableTrend = function(id, state) {
            console.log(id);
            console.log(state)
            $http({
                url: connString + 'enableTrendProduct/' + id,
                method: 'POST',
                json: true,
                data: {
                    visible: state
                }
            }).success(function() {
                console.log('changed trend state for id ' + id)
            });
        };

        $scope.enableHit= function(id, state) {
            console.log(id);
            console.log(state)
            $http({
                url: connString + 'enableHitProduct/' + id,
                method: 'POST',
                json: true,
                data: {
                    visible: state
                }
            }).success(function() {
                console.log('changed hit state for id ' + id)
            });
        };

        $scope.enableNew = function(id, state) {
            console.log(id);
            console.log(state)
            $http({
                url: connString + 'enableNewProduct/' + id,
                method: 'POST',
                json: true,
                data: {
                    visible: state
                }
            }).success(function() {
                console.log('changed new state for id ' + id)
            });
        };

        $scope.enableSale = function(id, state) {
            console.log(id);
            console.log(state)
            $http({
                url: connString + 'enableSaleProduct/' + id,
                method: 'POST',
                json: true,
                data: {
                    visible: state
                }
            }).success(function() {
                console.log('changed sale state for id ' + id)
            });
        };

    }])


    .controller('LocalesController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        //$scope.name = $routeParams.name;
        $scope.raw = {};
        $http({ url: connString + 'localeForUpdate', method: 'GET' }).success(function(data) {
            $scope.products = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.products.length; //Initially for no filter
            $scope.totalItems = $scope.products.length;
            $scope.editingData = {};
            for (var i = 0; i < data.length; i++) {
                $scope.editingData[$scope.products[i].id] = false;
            }
        });

        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.modify = function(tableData){
            $scope.editingData[tableData.id] = true;
        };

        $scope.update = function(tableData){
            $http({
                url: connString + 'locale',
                method: 'PUT',
                json: true,
                data: {
                    name: tableData.name,
                    ru: tableData.ru,
                    en: tableData.en,
                    ua: tableData.ua,
                    de: tableData.de,
                    fr: tableData.fr,
                    pl: tableData.pl,
                }
            }).success(function() {
                $scope.editingData[tableData.id] = false;
            });
        };
    }])

    .controller('LocalesController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        //$scope.name = $routeParams.name;
        $scope.raw = {};
        $http({ url: connString + 'localeForUpdate', method: 'GET' }).success(function(data) {
            $scope.products = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.products.length; //Initially for no filter
            $scope.totalItems = $scope.products.length;
            $scope.editingData = {};
            for (var i = 0; i < data.length; i++) {
                $scope.editingData[$scope.products[i].id] = false;
            }
        });

        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.modify = function(tableData){
            $scope.editingData[tableData.id] = true;
        };

        $scope.update = function(tableData){
            $http({
                url: connString + 'locale',
                method: 'PUT',
                json: true,
                data: {
                    name: tableData.name,
                    ru: tableData.ru,
                    en: tableData.en,
                    ua: tableData.ua,
                    de: tableData.de,
                    fr: tableData.fr,
                    pl: tableData.pl,
                }
            }).success(function() {
                $scope.editingData[tableData.id] = false;
            });
        };
    }])

    .controller('DiscountController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.raw = {};
        $http({ url: connString + 'discounts', method: 'GET' }).success(function(data) {
            $scope.discounts = data;


            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.discounts.length; //Initially for no filter
            $scope.totalItems = $scope.discounts.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');
            }
            $scope.editingData = {};
            for (var i = 0; i < data.length; i++) {
                $scope.editingData[$scope.discounts[i].id] = false;
            }
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.modify = function(tableData){
            console.log(tableData)
            $scope.editingData[tableData.id] = true;
        };

        $scope.update = function(tableData){
            $http({
                url: connString + 'discounts/' + tableData.id,
                method: 'POST',
                json: true,
                data: {
                    id: tableData.id,
                    discount: tableData.discount,
                    code: tableData.code,
                }
            }).success(function() {
                console.log('changed discount info for promocode -> ' + tableData.id)
                $scope.editingData[tableData.id] = false;
            });

        };

        $scope.delete = function(tableData){
            $http({
                url: connString + 'discounts/' + tableData.id,
                method: 'DELETE',
                json: true,
            }).success(function() {
                console.log('delete discount-> ' + tableData.id)
            });
        };

    }])


    .controller('NewsController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.raw = {};
        $http({ url: connString + 'news', method: 'GET' }).success(function(data) {
            $scope.news = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.news.length; //Initially for no filter
            $scope.totalItems = $scope.news.length;
/*            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');
            }*/
            $scope.editingData = {};
            for (var i = 0; i < data.length; i++) {
                $scope.editingData[$scope.news[i].id] = false;
            }
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
        };
        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.modify = function(tableData){
            console.log(tableData)
            $scope.editingData[tableData.id] = true;
        };

        $scope.update = function(tableData){
            $http({
                url: connString + 'news/' + tableData.id,
                method: 'POST',
                json: true,
                data: {
                    id: tableData.id,
                    title: tableData.title,
                    description: tableData.description
                }
            }).success(function() {
                console.log('changed news for item -> ' + tableData.id)
                $scope.editingData[tableData.id] = false;
            });
        };

        $scope.delete = function(tableData){
            $http({
                url: connString + 'news/' + tableData.id,
                method: 'DELETE',
                json: true,
            }).success(function() {
                console.log('deleted news Info-> ' + tableData.id)
            });
        };
    }])


    .controller('BrandsController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        //$scope.name = $routeParams.name;
        $scope.raw = {};
        $http({ url: connString + 'brands', method: 'GET' }).success(function(data) {
            $scope.brands = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.brands.length; //Initially for no filter
            $scope.totalItems = $scope.brands.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');
            }
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
    }])

    .controller('CategoriesController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        //$scope.name = $routeParams.name;
        $scope.raw = {};
        $http({ url: connString + 'categories', method: 'GET' }).success(function(data) {
            $scope.brands = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.brands.length; //Initially for no filter
            $scope.totalItems = $scope.brands.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');
            }
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
        $scope.tplEdit = function(id) {
            $location.url('/category/edit/' + id);
        };

    }])

    .controller('SubCategoriesController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        //$scope.name = $routeParams.name;
        $scope.raw = {};
        $http({ url: connString + 'subcategories', method: 'GET' }).success(function(data) {
            $scope.groups = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.groups.length; //Initially for no filter
            $scope.totalItems = $scope.groups.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');
            }
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
        $scope.tplEdit = function(id) {
            $location.url('/category/edit/' + id);
        };

    }])

    .controller('BannersController',  ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.url = "";
        $scope.baddnew = false;

        $scope.shopurl = "";
        $scope.baddnewshop = false;

        $http({ url: connString + 'banner/mainbanner', method: 'GET' }).success(function(data) {
            $scope.data = data;
            $scope.editingData = {};
            $scope.selectedItem = null;
            for (var i = 0; i < data.length; i++) {
                $scope.editingData[$scope.data[i].id] = false;
            }
        });

        $scope.modify = function(tableData){
            $scope.data.map((item) => {
                $scope.editingData[item.id] = false;
            });
            $scope.editingData[tableData.id] = true;
            $scope.selectedItem = tableData;
            $scope.url = tableData.img;
            $scope.baddnew = false;
        };

        $scope.update = function(tableData){

            let formData = new FormData();
            formData.append('id', tableData.id);
            formData.append('image_file', $scope.url);
            formData.append('active', tableData.active);
            formData.append('titleRu', tableData.titleRu);
            formData.append('titleEn', tableData.titleEn);
            formData.append('titleUa', tableData.titleUa);
            formData.append('titleDe', tableData.titleDe);
            formData.append('titleFr', tableData.titleFr);
            formData.append('titlePl', tableData.titlePl);

            formData.append('subtitleRu', tableData.subtitleRu);
            formData.append('subtitleEn', tableData.subtitleEn);
            formData.append('subtitleUa', tableData.subtitleUa);
            formData.append('subtitleDe', tableData.subtitleDe);
            formData.append('subtitleFr', tableData.subtitleFr);
            formData.append('subtitlePl', tableData.subtitlePl);

            formData.append('btnTextRu', tableData.btnTextRu);
            formData.append('btnTextEn', tableData.btnTextEn);
            formData.append('btnTextUa', tableData.btnTextUa);
            formData.append('btnTextDe', tableData.btnTextDe);
            formData.append('btnTextFr', tableData.btnTextFr);
            formData.append('btnTextPl', tableData.btnTextPl);

            formData.append('btnurl', tableData.btnurl);
            formData.append('img', tableData.img);

            var request = new XMLHttpRequest();
            request.open("PUT", connString + 'banner/mainbanner');
            request.onload = function () {
                if (request.readyState === request.DONE) {
                    if (request.status === 200) {
                        var response = JSON.parse(request.responseText);
                        console.log("success", response);
                        if( response.success){
                            console.log("success", response);
                            $scope.$evalAsync( function(){
                                $scope.selectedItem = null;
                                $scope.editingData[tableData.id] = false;
                                $scope.url = "";
                                // window.document.getElementById('background_image').src = '';
                                // window.document.getElementById('upload_photo').value = '';
                            })
                        }
                    }
                }
            }
            request.send(formData);
        };
        
        $scope.addNew = function(){
            $scope.url = "";
            $scope.selectedItem = {};
            $scope.baddnew = true;
        }

        $scope.addNewItemToServer = function() {
            if( $scope.url === "" ) {
                alert("Please select a new image");
                return;
            }
            let formData = new FormData();
            formData.append('image_file', $scope.url);
            formData.append('active', $scope.selectedItem.active);
            formData.append('titleRu', $scope.selectedItem.titleRu === undefined? "" : $scope.selectedItem.titleRu);
            formData.append('titleEn', $scope.selectedItem.titleEn === undefined? "" : $scope.selectedItem.titleEn);
            formData.append('titleUa', $scope.selectedItem.titleUa === undefined? "" : $scope.selectedItem.titleUa);
            formData.append('titleDe', $scope.selectedItem.titleDe === undefined? "" : $scope.selectedItem.titleDe);
            formData.append('titleFr', $scope.selectedItem.titleFr === undefined? "" : $scope.selectedItem.titleFr);
            formData.append('titlePl', $scope.selectedItem.titlePl === undefined? "" : $scope.selectedItem.titlePl);

            formData.append('subtitleRu', $scope.selectedItem.subtitleRu === undefined? "" : $scope.selectedItem.subtitleRu);
            formData.append('subtitleEn', $scope.selectedItem.subtitleEn === undefined? "" : $scope.selectedItem.subtitleEn);
            formData.append('subtitleUa', $scope.selectedItem.subtitleUa === undefined? "" : $scope.selectedItem.subtitleUa);
            formData.append('subtitleDe', $scope.selectedItem.subtitleDe === undefined? "" : $scope.selectedItem.subtitleDe);
            formData.append('subtitleFr', $scope.selectedItem.subtitleFr === undefined? "" : $scope.selectedItem.subtitleFr);
            formData.append('subtitlePl', $scope.selectedItem.subtitlePl === undefined? "" : $scope.selectedItem.subtitlePl);

            formData.append('btnTextRu', $scope.selectedItem.btnTextRu === undefined? "" : $scope.selectedItem.btnTextRu);
            formData.append('btnTextEn', $scope.selectedItem.btnTextEn === undefined? "" : $scope.selectedItem.btnTextEn);
            formData.append('btnTextUa', $scope.selectedItem.btnTextUa === undefined? "" : $scope.selectedItem.btnTextUa);
            formData.append('btnTextDe', $scope.selectedItem.btnTextDe === undefined? "" : $scope.selectedItem.btnTextDe);
            formData.append('btnTextFr', $scope.selectedItem.btnTextFr === undefined? "" : $scope.selectedItem.btnTextFr);
            formData.append('btnTextPl', $scope.selectedItem.btnTextPl === undefined? "" : $scope.selectedItem.btnTextPl);

            formData.append('btnurl', $scope.selectedItem.btnurl === undefined? "" : $scope.selectedItem.btnurl);

            console.log("formData :: ", formData);

            var request = new XMLHttpRequest();
            request.open("POST", connString + 'banner/mainbanner');
            request.onload = function () {
                if (request.readyState === request.DONE) {
                    if (request.status === 200) {
                        var response = JSON.parse(request.responseText);
                        console.log("success", response);
                        if( response.success){
                            console.log("success", response);
                            $scope.$evalAsync( function(){
                                $scope.data.push(response.data);
                                $scope.baddnew = false;
                                $scope.selectedItem = null;
                                $scope.url = "";
                                // window.document.getElementById('background_image').src = '';
                                // window.document.getElementById('upload_photo').value = '';
                            })
                        }
                    }
                }
            }
            request.send(formData);
        }

        $scope.photofileChanged = function(element){
            getPromise(element.files[0]);
        }

        function getPromise(file){
            return new Promise(function(resolve, reject){
                var reader = new FileReader();
                reader.onload = function(evt){
                    $scope.$apply(() => {
                        $scope.url = evt.target.result;
                    });
                };
                reader.onerror = function(error) {
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        }

        $scope.handleDelete = function(id){
            $http({
                url: connString + 'banner/mainbanner/' + $scope.data[id].id,
                method: 'DELETE',
                json: true,
            }).success(function() {
                $scope.position.splice(id, 1);
                $scope.data.splice(id, 1);
            });
        }

   // starts the actions for shop banner     
        $http({ url: connString + 'banner/shopbanner', method: 'GET' }).success(function(res) {
            $scope.selectedType = "text";
            $scope.shopdata = [];
            $scope.editingShopData = {};
            $scope.shopselectedItem = null;
            const empty = ["service1", "service2", "service3", "service4", "service5", "service6", "service7", "service8", "service9", "service10"];

            for (var i = 0; i < res.length; i++) {
                $scope.editingShopData[res[i].id] = false;
                $scope.shopdata.push({
                    ...res[i],
                    content: res[i].content === null || res[i].content === ""? empty : res[i].content.split(";"),
                    contentRu: res[i].contentRu === null || res[i].contentRu === ""? empty : res[i].contentRu.split(";"),
                    contentUa: res[i].contentUa === null || res[i].contentUa === ""? empty : res[i].contentUa.split(";"),
                    contentDe: res[i].contentDe === null || res[i].contentDe === ""? empty : res[i].contentDe.split(";"),
                    contentFr: res[i].contentFr === null || res[i].contentFr === ""? empty : res[i].contentFr.split(";"),
                    contentPl: res[i].contentPl === null || res[i].contentPl === ""? empty : res[i].contentPl.split(";"),
                });
            }
        });
        
        $scope.modifyshop = function(tableData){
            $scope.shopdata.map((item) => {
                $scope.editingShopData[item.id] = false;
            });
            $scope.editingShopData[tableData.id] = true;
            $scope.shopselectedItem = tableData;
            $scope.shopurl = tableData.img;
            $scope.baddnewshop = true;
            $scope.selectedType = tableData.type;
            console.log($scope.editingShopData, tableData)
        };

        $scope.updateshop = function(tableData){
            console.log(tableData);

            let formData = new FormData();
            formData.append('id', $scope.shopselectedItem.id);
            formData.append('image_file', $scope.shopurl);
            formData.append('titleRu', $scope.shopselectedItem.titleRu === undefined? "" : $scope.shopselectedItem.titleRu);
            formData.append('title', $scope.shopselectedItem.title === undefined? "" : $scope.shopselectedItem.title);
            formData.append('titleUa', $scope.shopselectedItem.titleUa === undefined? "" : $scope.shopselectedItem.titleUa);
            formData.append('titleDe', $scope.shopselectedItem.titleDe === undefined? "" : $scope.shopselectedItem.titleDe);
            formData.append('titleFr', $scope.shopselectedItem.titleFr === undefined? "" : $scope.shopselectedItem.titleFr);
            formData.append('titlePl', $scope.shopselectedItem.titlePl === undefined? "" : $scope.shopselectedItem.titlePl);

            formData.append('contentRu', $scope.shopselectedItem.contentRu === undefined? "" : getStringFromArray($scope.shopselectedItem.contentRu));
            formData.append('content', $scope.shopselectedItem.content === undefined? "" : getStringFromArray($scope.shopselectedItem.content));
            formData.append('contentUa', $scope.shopselectedItem.contentUa === undefined? "" : getStringFromArray($scope.shopselectedItem.contentUa));
            formData.append('contentDe', $scope.shopselectedItem.contentDe === undefined? "" : getStringFromArray($scope.shopselectedItem.contentDe));
            formData.append('contentFr', $scope.shopselectedItem.contentFr === undefined? "" : getStringFromArray($scope.shopselectedItem.contentFr));
            formData.append('contentPl', $scope.shopselectedItem.contentPl === undefined? "" : getStringFromArray($scope.shopselectedItem.contentPl));

            formData.append('url', $scope.shopselectedItem.url === undefined? "" : $scope.shopselectedItem.url);
            formData.append('type', $scope.selectedType);

            var request = new XMLHttpRequest();
            request.open("PUT", connString + 'banner/shopbanner');
            request.onload = function () {
                if (request.readyState === request.DONE) {
                    if (request.status === 200) {
                        var response = JSON.parse(request.responseText);
                        if( response.success){
                            console.log("success", response);
                            $scope.$evalAsync( function(){
                                let curIdx = 0;
                                $scope.shopdata.map((item, index) => {
                                    if(item.id === shopselectedItem.id )
                                        curIdx = index;
                                })
                                $scope.shopdata.splice(curIdx, 1, shopselectedItem);
                                $scope.baddnewshop = false;
                                $scope.shopselectedItem = null;
                                $scope.shopurl = "";
                            })
                        }
                    }
                }
            }
            request.send(formData);
        };
        
        $scope.addNewShop = function(){
            $scope.shopurl = "";
            const empty = ["service1", "service2", "service3", "service4", "service5", "service6", "service7", "service8", "service9", "service10"];
            $scope.shopselectedItem = {
                content: empty,
                contentRu: empty,
                contentUa: empty,
                contentDe: empty,
                contentFr: empty,
                contentPl: empty,
            };
            $scope.baddnewshop = true;
        }

        $scope.addNewShopItemToServer = function() {
            if( $scope.shopurl === "" && $scope.selectedType === "image" ) {
                alert("Please select a new image");
                return;
            }
            let formData = new FormData();
            formData.append('image_file', $scope.shopurl);
            formData.append('titleRu', $scope.shopselectedItem.titleRu === undefined? "" : $scope.shopselectedItem.titleRu);
            formData.append('title', $scope.shopselectedItem.title === undefined? "" : $scope.shopselectedItem.title);
            formData.append('titleUa', $scope.shopselectedItem.titleUa === undefined? "" : $scope.shopselectedItem.titleUa);
            formData.append('titleDe', $scope.shopselectedItem.titleDe === undefined? "" : $scope.shopselectedItem.titleDe);
            formData.append('titleFr', $scope.shopselectedItem.titleFr === undefined? "" : $scope.shopselectedItem.titleFr);
            formData.append('titlePl', $scope.shopselectedItem.titlePl === undefined? "" : $scope.shopselectedItem.titlePl);

            formData.append('contentRu', $scope.shopselectedItem.contentRu === undefined? "" : getStringFromArray($scope.shopselectedItem.contentRu));
            formData.append('content', $scope.shopselectedItem.content === undefined? "" : getStringFromArray($scope.shopselectedItem.content));
            formData.append('contentUa', $scope.shopselectedItem.contentUa === undefined? "" : getStringFromArray($scope.shopselectedItem.contentUa));
            formData.append('contentDe', $scope.shopselectedItem.contentDe === undefined? "" : getStringFromArray($scope.shopselectedItem.contentDe));
            formData.append('contentFr', $scope.shopselectedItem.contentFr === undefined? "" : getStringFromArray($scope.shopselectedItem.contentFr));
            formData.append('contentPl', $scope.shopselectedItem.contentPl === undefined? "" : getStringFromArray($scope.shopselectedItem.contentPl));

            formData.append('url', $scope.shopselectedItem.url === undefined? "" : $scope.shopselectedItem.url);
            formData.append('type', $scope.selectedType);

            var request = new XMLHttpRequest();
            request.open("POST", connString + 'banner/shopbanner');
            request.onload = function () {
                if (request.readyState === request.DONE) {
                    if (request.status === 200) {
                        var response = JSON.parse(request.responseText);
                        if( response.success){
                            console.log("success", response);
                            const empty = ["service1", "service2", "service3", "service4", "service5", "service6", "service7", "service8", "service9", "service10"];

                            $scope.$evalAsync( function(){
                                $scope.shopdata.push({
                                    ...response.data,
                                    content: response.data.content === null || response.data.content === ""? empty : response.data.content.split(";"),
                                    contentRu: response.data.contentRu === null || response.data.contentRu === ""? empty : response.data.contentRu.split(";"),
                                    contentUa: response.data.contentUa === null || response.data.contentUa === ""? empty : response.data.contentUa.split(";"),
                                    contentDe: response.data.contentDe === null || response.data.contentDe === ""? empty : response.data.contentDe.split(";"),
                                    contentFr: response.data.contentFr === null || response.data.contentFr === ""? empty : response.data.contentFr.split(";"),
                                    contentPl: response.data.contentPl === null || response.data.contentPl === ""? empty : response.data.contentPl.split(";"),
                                });
                                $scope.baddnewshop = false;
                                $scope.shopselectedItem = null;
                                $scope.shopurl = "";
                            })
                        }
                    }
                }
            }
            request.send(formData);
        }

        function getStringFromArray(arr){
            let retStr = "";
            arr.map((item)=>{
                if(!item.includes("service"))
                    retStr += item + ";";
            });
            return retStr;
        }

        $scope.addNewShopCancel = function() {
            $scope.shopselectedItem = null;
            $scope.shopurl = "";
            $scope.selectedType = "";
            $scope.baddnewshop = false;
        }

        $scope.shopPhotofileChanged = function(element){
            getPromiseForShop(element.files[0]);
        }

        function getPromiseForShop(file){
            return new Promise(function(resolve, reject){
                var reader = new FileReader();
                reader.onload = function(evt){
                    $scope.$apply(() => {
                        $scope.shopurl = evt.target.result;
                    });
                };
                reader.onerror = function(error) {
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        }

        $scope.handleShopDelete = function(id){
            $http({
                url: connString + 'banner/shopbanner/' + $scope.shopdata[id].id,
                method: 'DELETE',
                json: true,
            }).success(function() {
                $scope.shopdata.splice(id, 1);
            });
        }

        //get locale data
        $http({ url: connString + 'locale', method: 'GET' }).success(function(res) {
            if( res.success ){
                $scope.locale = res.data;
            }
        });

        // start section banner
        $http({ url: connString + 'section', method: 'GET' }).success(function(res) {
            if( res.success ){
                $scope.section = res.data;
                $scope.selectedSection = $scope.section[0].ru;
                handleChangeSection($scope.section[0].id);
            }
        });

        function handleChangeSection(id) {
            $http({ url: connString + 'banner/sectionbanner/' + id, method: 'GET' }).success(function(res) {
                if( res.success ){
                    $scope.sectiondata = res.data;
                    console.log($scope.sectiondata);
                    $scope.bsectionEdit = false;
                    $scope.bbannerImage = false;
                }
            });
        }

        $scope.handleSectionChange = function() {
            const temp = $scope.section.filter((item) => item.ru === $scope.selectedSection);
            handleChangeSection(temp[0].id);
        }

        $scope.handleSectionEdit = function(){
            $scope.bsectionEdit = true;
        }

        $scope.handleSectionUpdate = function() {
            console.log($scope.sectiondata)
            localeUpdate($scope.sectiondata.title);
            localeUpdate($scope.sectiondata.header);
            localeUpdate($scope.sectiondata.footer);
            $scope.sectiondata.description.map((item) => {
                localeUpdate(item);
            });
            
            $http({
                url: connString + 'sectionbannerprice',
                method: 'PUT',
                json: true,
                data: {
                    id: $scope.sectiondata.id,
                    price: $scope.sectiondata.price,
                    discount: $scope.sectiondata.discount,
                    active: $scope.sectiondata.active,
                }
            }).success(function() {
                $scope.bsectionEdit = false;
            });
        }

        $scope.addNewSectionCancel = function(){
            $scope.bsectionEdit = false;
        }

        $scope.imageBtnClick = function(index){
            $scope.curBanImageIndex = parseInt(index);
        }
        $scope.sectionPhotofileChanged = function(element){
            getPromiseForSection(element.files[0]);
        }

        $scope.handleSectionImageUpdate = function() {
            $scope.sectiondata.images.map((item, index)=>{
                if( item.url.length > 500 ){
                    uploadImageOne(item, index);
                }
            })
        }

        $scope.handleSectionImageAdd=function(){
            $scope.bbannerImage = true;
        }

        function uploadImageOne(item, curIdx) {
            if( item.url === "" ) {
                return;
            }
            let formData = new FormData();
            formData.append('image_file', item.url);
            formData.append('id', item.id === undefined? "": item.id);
            formData.append('sectionbannerid', item.sectionbannerid);

            var request = new XMLHttpRequest();
            request.open("POST", connString + 'banner/sectionbannerimage');
            request.onload = function () {
                if (request.readyState === request.DONE) {
                    if (request.status === 200) {
                        var response = JSON.parse(request.responseText);
                        if( response.success){
                            $scope.$evalAsync( function(){
                                $scope.sectiondata.images[curIdx].url = response.data.url;
                                $scope.sectiondata.images[curIdx].id = response.data.id;
                                $scope.bbannerImage = false;
                            })
                        }
                    }
                }
            }
            request.send(formData);
        }
        
        function getPromiseForSection(file){
            return new Promise(function(resolve, reject){
                var reader = new FileReader();
                reader.onload = function(evt){
                    $scope.$apply(() => {
                        $scope.sectiondata.images[$scope.curBanImageIndex].url = evt.target.result;
                    });
                };
                reader.onerror = function(error) {
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        }
        function localeUpdate(key){
            const insertItem = {
                name: key,
                ru: $scope.locale.ru[key],
                en: $scope.locale.en[key],
                ua: $scope.locale.ua[key],
                de: $scope.locale.de[key],
                fr: $scope.locale.fr[key],
                pl: $scope.locale.pl[key],
            };
            
            $http({
                url: connString + 'locale',
                method: 'PUT',
                json: true,
                data: insertItem
            }).success(function() {
                console.log('locale data updated -> ');
            });
        }

        $scope.cateImageBtnClick = function(index) {
            $scope.curCateImageIndex = parseInt(index);
        }

        $scope.handleCategoryImageUpdate = function() {
            $scope.sectiondata.categories.map((item, index)=>{
                if( item.imgurl.length > 500 ){
                    uploadImageOneForCategory(item, index);
                }
            })
        }

        function uploadImageOneForCategory(item, curIdx) {
            if( item.imgurl === "" ) {
                return;
            }
            let formData = new FormData();
            formData.append('image_file', item.imgurl);
            formData.append('id', item.id === undefined? "": item.id);
            formData.append('sectionbannerid', item.sectionbannerid);

            var request = new XMLHttpRequest();
            request.open("POST", connString + 'banner/sectionbannerimageforcategory');
            request.onload = function () {
                if (request.readyState === request.DONE) {
                    if (request.status === 200) {
                        var response = JSON.parse(request.responseText);
                        if( response.success){
                            $scope.$evalAsync( function(){
                                $scope.sectiondata.categories[curIdx].imgurl = response.data.url;
                                $scope.sectiondata.categories[curIdx].id = parseInt(response.data.id);
                            })
                        }
                    }
                }
            }
            request.send(formData);
        }

        $scope.sectionCatePhotofileChanged = function(element){
            getPromiseForSectionCate(element.files[0]);
        }

        function getPromiseForSectionCate(file){
            return new Promise(function(resolve, reject){
                var reader = new FileReader();
                reader.onload = function(evt){
                    $scope.$apply(() => {
                        $scope.sectiondata.categories[$scope.curCateImageIndex].imgurl = evt.target.result;
                    });
                };
                reader.onerror = function(error) {
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        }

    }])

    .controller('ItemsBrandController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.brand = $routeParams.brand;
        $scope.raw = {};
        $http({ url: connString + '/brand/products/' + $scope.brand, method: 'GET' }).success(function(data) {
            $scope.products = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.products.length; //Initially for no filter
            $scope.totalItems = $scope.products.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');
            }

            for (var i = 0; i < data.length; i++) {
                if (data[i].available == 1) data[i].available = "Доступен";
                if (data[i].status == 0) data[i].available = "Недоступен";
            }

        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
        $scope.tplEdit = function(id) {
            $location.url('/template/edit/' + id);
        };

        $scope.tplBackImage = function(id) {
            $location.url('/template/image/' + id);
        };


        $scope.tplInfo = function(mac) {
            $location.url('/templateInfo/' + mac);
        };
    }])

    .controller('ItemsGroupsController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.group = $routeParams.group;
        $scope.raw = {};
        $http({ url: connString + 'productsByGroup/' + $scope.group, method: 'GET' }).success(function(data) {
            $scope.products = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.products.length; //Initially for no filter
            $scope.totalItems = $scope.products.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].available == 1) data[i].available = "Доступен";
                if (data[i].status == 0) data[i].available = "Недоступен";
            }
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
        $scope.tplEdit = function(id) {
            $location.url('/template/edit/' + id);
        };

        $scope.tplBackImage = function(id) {
            $location.url('/template/image/' + id);
        };

        $scope.tplInfo = function(mac) {
            $location.url('/templateInfo/' + mac);
        };

    }])

    .controller('ItemsSubGroupsController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.group = $routeParams.group;
        $scope.raw = {};
        $http({ url: connString + 'productsBySubgroup/' + $scope.group, method: 'GET' }).success(function(data) {
            $scope.products = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.products.length; //Initially for no filter
            $scope.totalItems = $scope.products.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].available == 1) data[i].available = "Доступен";
                if (data[i].status == 0) data[i].available = "Недоступен";
            }
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
        $scope.tplEdit = function(id) {
            $location.url('/template/edit/' + id);
        };

        $scope.tplBackImage = function(id) {
            $location.url('/template/image/' + id);
        };

        $scope.tplInfo = function(mac) {
            $location.url('/templateInfo/' + mac);
        };

    }])

    .controller('OrdersController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.raw = {};

        $scope.searchOrders = function() {
            var date = $scope.datepicker;
            var date1 = moment.utc(date).local().format('YYYY-MM-DD')
            if (date != undefined) {
                $scope.getOrders(date1);
            } else {
                alert("Выберите дату!")
            }
        };

        $scope.getOrders = function(date) {
            $http({
                url: connString + 'orders/' + date,
                method: 'GET'
            }).success(function(data) {
                $scope.orders = data;
                $scope.currentPage = 1; //current page
                $scope.entryLimit = 20; //max no of items to display in a page
                $scope.filteredItems = data.length; //Initially for no filter
                $scope.totalItems = data.length;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].created) data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY HH:mm:ss');
                    if (data[i].modified) data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY HH:mm:ss');
                    if (data[i].paid == 1) data[i].paid = "Да";
                    if (data[i].paid == 0) data[i].paid = "Нет";
                }
                $scope.editingData = {};
            });
        };

        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.modify = function(tableData){
            $http({
                url: connString + 'shippers',
                method: 'GET'
            }).success(function(data) {
                $scope.shippers = data;
            });

            $http({
                url: connString + 'status',
                method: 'GET'
            }).success(function(data) {
                $scope.status = data;
            });

            $http({
                url: connString + 'payments',
                method: 'GET'
            }).success(function(data) {
                $scope.payments = data;
            });
            console.log(tableData)
            $scope.shippId = tableData.shipperID;
            $scope.payId = tableData.paymentID;
            $scope.payMeth= tableData.paymentMethod;
            $scope.editingData[tableData.orderNumber] = true;
            $scope.paid = tableData.paid;
            $scope.stat = tableData.status;
        };

        $scope.handlePaymentChange = function(payment) {
            const temp = $scope.payments.filter((item) => item.payMethod === payment);
            $scope.payId = temp[0].paymentId;
            $scope.payMeth = payment;
        }

        $scope.handleShipperChange = function(shipper) {
            console.log(shipper)
            const temp = $scope.shippers.filter((item) => item.name === shipper);
            $scope.shippId = temp[0].shipperId;
            // handleChangeSection(temp[0].id);
        }

        $scope.handlePayChange = function(test) {
            $scope.paid = test;
        }

        $scope.handleStatusChange = function(status) {
            $scope.stat = status;
        }


        $scope.update = function(tableData){
            if ($scope.paid == "Да") $scope.paid = 1;
            if ($scope.paid == "Нет") $scope.paid= 0;
            $http({
                url: connString + 'order/' + tableData.orderNumber,
                method: 'POST',
                json: true,
                data: {
                    id: tableData.orderNumber,
                    status: $scope.stat,
                    trackingNumber: tableData.trackingNumber,
                    // customerName: tableData.customerName,
                    customerPhone: tableData.customerPhone,
                    name: tableData.name,
                    surname: tableData.surname,
                    city: tableData.city,
                    department: tableData.department,
                    shipperId: $scope.shippId,
                    paymentId: $scope.payId,
                    paymentMethod: $scope.payMeth,
                    // paid: $scope.paid,
                    paid: tableData.paid,
                    // shipperCompany: shipper.name,
                    // email: tableData.customerEmail
                }
            }).success(function() {
                console.log('changed description for order-> ' + tableData.orderNumber)
                $scope.editingData[tableData.orderNumber] = false;
            });

        };

        $scope.OrderInfo = function(name) {
            $location.url('/order/' + id);

        };
        $scope.CustomerInfo = function(id) {
            $location.url('/customer/' + id);
        };

    }])

    .controller('OrderDetailsController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.order = $routeParams.id;

        $http({
            url: connString + 'order/' + $scope.order,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            $scope.items = data[0].orderDetails;
            $scope.order = data[0];
            $scope.totalItems = $scope.items.length;
            $scope.currentPage = 1;
            $scope.entryLimit = 20;
            $scope.filteredItems = $scope.items.length;
            if(data[0].notCall == 1) data[0].notCall = "Да";
            if(data[0].notCall == 0) data[0].notCall = "Нет";
            for (var i = 0; i < $scope.items.length; i++) {
                if ($scope.items[i].updated) $scope.items[i].updated = moment.utc($scope.items[i].updated).local().format('DD.MM.YY HH:mm:ss');
            }
            $scope.orderId = data[0].orderNumber;
            var vm = this;
            $scope.editingData = {};


            vm.shop = data[0];

            vm.showDetail = function(e, shop) {
                vm.shop = shop;
                vm.map.showInfoWindow('foo-iw', shop.orderID);
            };

            vm.hideDetail = function() {
                vm.map.hideInfoWindow('foo-iw');
            };

        });

        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };
        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.modify = function(tableData){
            $http({
                url: connString + 'status',
                method: 'GET'
            }).success(function(data) {
                $scope.status = data;
            });
            console.log(tableData)
            $scope.editingData[tableData.id] = true;
            $scope.stat = tableData.status;
        };

        $scope.handleStatusChange = function(status) {
            $scope.stat = status;
        }


        $scope.update = function(tableData){
            $http({
                url: connString + 'orderDetail/' + tableData.id,
                method: 'POST',
                json: true,
                data: {
                    id: tableData.id,
                    trackingId: tableData.trackingId,
                    orderId: $scope.orderId,
                    status: $scope.stat,
                }
            }).success(function() {
                console.log('changed status for orderDetail-> ' + tableData.id)
                $scope.editingData[tableData.id] = false;
            });

        };


    }])

    .controller('OrdersRangeController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.raw = {};

        $scope.searchOrders = function() {
            var dateFrom = $scope.datepicker;
            var date1 = moment.utc(dateFrom).local().format('YYYY-MM-DD')

            var dateTo = $scope.datepicker1;
            var date2 = moment.utc(dateTo).local().format('YYYY-MM-DD')

            if (dateFrom != undefined && dateTo != undefined) {
                $scope.getRangeOrders(date1, date2);
            } else {
                alert("Выберите дату!")
            }
        };


        $scope.dateChange = function() {
            var dateFrom = $scope.datepicker;
            var date1 = moment.utc(dateFrom).local().format('YYYY-MM-DD')

            var dateTo = $scope.datepicker1;
            var date2 = moment.utc(dateTo).local().format('YYYY-MM-DD')

        };


        $scope.getRangeOrders = function(date1, date2) {
            $scope.test = {date1, date2}
            $http({
                url: connString + 'ordersRange/'+ date1+ '/'+date2,
                method: 'GET',
                // data: {
                //     date1: date1,
                //     date2: date2
                // }
            }).success(function(data) {
                $scope.orders = data;
                $scope.currentPage = 1; //current page
                $scope.entryLimit = 20; //max no of items to display in a page
                $scope.filteredItems = data.length; //Initially for no filter
                $scope.totalItems = data.length;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].created) data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY HH:mm:ss');
                    if (data[i].modified) data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY HH:mm:ss');
                    if (data[i].paid == 1) data[i].paid = "Да";
                    if (data[i].paid == 0) data[i].paid = "Нет";
                }
                $scope.editingData = {};
            });
        };

        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.modify = function(tableData){
            $http({
                url: connString + 'shippers',
                method: 'GET'
            }).success(function(data) {
                $scope.shippers = data;
            });

            $http({
                url: connString + 'status',
                method: 'GET'
            }).success(function(data) {
                $scope.status = data;
            });

            $http({
                url: connString + 'payments',
                method: 'GET'
            }).success(function(data) {
                $scope.payments = data;
            });
            console.log(tableData)
            $scope.shippId = tableData.shipperID;
            $scope.payId = tableData.paymentID;
            $scope.payMeth= tableData.paymentMethod;
            $scope.editingData[tableData.orderNumber] = true;
            $scope.paid = tableData.paid;
            $scope.stat = tableData.status;
        };

        $scope.handlePaymentChange = function(payment) {
            const temp = $scope.payments.filter((item) => item.payMethod === payment);
            $scope.payId = temp[0].paymentId;
            $scope.payMeth = payment;
        }

        $scope.handleShipperChange = function(shipper) {
            console.log(shipper)
            const temp = $scope.shippers.filter((item) => item.name === shipper);
            $scope.shippId = temp[0].shipperId;
            // handleChangeSection(temp[0].id);
        }

        $scope.handlePayChange = function(test) {
            $scope.paid = test;
        }

        $scope.handleStatusChange = function(status) {
            $scope.stat = status;
        }


        $scope.update = function(tableData){
            if ($scope.paid == "Да") $scope.paid = 1;
            if ($scope.paid == "Нет") $scope.paid= 0;
            $http({
                url: connString + 'order/' + tableData.orderNumber,
                method: 'POST',
                json: true,
                data: {
                    id: tableData.orderNumber,
                    status: $scope.stat,
                    trackingNumber: tableData.trackingNumber,
                    // customerName: tableData.customerName,
                    customerPhone: tableData.customerPhone,
                    name: tableData.name,
                    surname: tableData.surname,
                    city: tableData.city,
                    department: tableData.department,
                    shipperId: $scope.shippId,
                    paymentId: $scope.payId,
                    paymentMethod: $scope.payMeth,
                    // paid: $scope.paid,
                    paid: tableData.paid,
                    // shipperCompany: shipper.name,
                    // email: tableData.customerEmail
                }
            }).success(function() {
                console.log('changed description for order-> ' + tableData.orderNumber)
                $scope.editingData[tableData.orderNumber] = false;
            });

        };

        $scope.OrderInfo = function(name) {
            $location.url('/order/' + id);

        };
        $scope.CustomerInfo = function(id) {
            $location.url('/customer/' + id);
        };

    }])

    .controller('OrdersAllController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.raw = {};

        $http({
            url: connString + 'ordersAll',
            method: 'GET'
        }).success(function(data) {
            $scope.orders = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 20; //max no of items to display in a page
            $scope.filteredItems = data.length; //Initially for no filter
            $scope.totalItems = data.length;
            for (var i = 0; i < data.length; i++) {
                if (data[i].created) data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY HH:mm:ss');
                if (data[i].modified) data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY HH:mm:ss');
                if (data[i].paid == 1) data[i].paid = "Да";
                if (data[i].paid == 0) data[i].paid = "Нет";
            }
            $scope.editingData = {};
        });


        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.modify = function(tableData){
            $http({
                url: connString + 'shippers',
                method: 'GET'
            }).success(function(data) {
                $scope.shippers = data;
            });

            $http({
                url: connString + 'status',
                method: 'GET'
            }).success(function(data) {
                $scope.status = data;
            });

            $http({
                url: connString + 'payments',
                method: 'GET'
            }).success(function(data) {
                $scope.payments = data;
            });
            console.log(tableData)
            $scope.shippId = tableData.shipperID;
            $scope.payId = tableData.paymentID;
            $scope.payMeth= tableData.paymentMethod;
            $scope.editingData[tableData.orderNumber] = true;
            $scope.paid = tableData.paid;
            $scope.stat = tableData.status;
        };

        $scope.handlePaymentChange = function(payment) {
            const temp = $scope.payments.filter((item) => item.payMethod === payment);
            $scope.payId = temp[0].paymentId;
            $scope.payMeth = payment;
        }

        $scope.handleShipperChange = function(shipper) {
            console.log(shipper)
            const temp = $scope.shippers.filter((item) => item.name === shipper);
            $scope.shippId = temp[0].shipperId;
            // handleChangeSection(temp[0].id);
        }

        $scope.handlePayChange = function(test) {
            $scope.paid = test;
        }

        $scope.handleStatusChange = function(status) {
            $scope.stat = status;
        }


        $scope.update = function(tableData){
            if ($scope.paid == "Да") $scope.paid = 1;
            if ($scope.paid == "Нет") $scope.paid= 0;
            $http({
                url: connString + 'order/' + tableData.orderNumber,
                method: 'POST',
                json: true,
                data: {
                    id: tableData.orderNumber,
                    status: $scope.stat,
                    trackingNumber: tableData.trackingNumber,
                    // customerName: tableData.customerName,
                    customerPhone: tableData.customerPhone,
                    name: tableData.name,
                    surname: tableData.surname,
                    city: tableData.city,
                    department: tableData.department,
                    shipperId: $scope.shippId,
                    paymentId: $scope.payId,
                    paymentMethod: $scope.payMeth,
                    // paid: $scope.paid,
                    paid: tableData.paid,
                    // shipperCompany: shipper.name,
                    // email: tableData.customerEmail
                }
            }).success(function() {
                console.log('changed description for order-> ' + tableData.orderNumber)
                $scope.editingData[tableData.orderNumber] = false;
            });

        };

        $scope.OrderInfo = function(name) {
            $location.url('/order/' + id);

        };
        $scope.CustomerInfo = function(id) {
            $location.url('/customer/' + id);
        };

    }])

    .controller('CustomersController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.group = $routeParams.group;
        $scope.raw = {};
        $http({ url: connString + 'customers', method: 'GET' }).success(function(data) {
            $scope.customers = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.customers.length; //Initially for no filter
            $scope.totalItems = $scope.customers.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
            }
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

    }])

    .controller('ReviewsController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.group = $routeParams.group;
        $scope.raw = {};

        $http({ url: connString + 'reviews', method: 'GET' }).success(function(data) {
            $scope.reviews = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.reviews.length; //Initially for no filter
            $scope.totalItems = $scope.reviews.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');

            }
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.enableReview = function(id, state) {
            console.log(id);
            console.log(state)
            $http({
                url: connString + 'enableReview/' + id,
                method: 'POST',
                json: true,
                data: {
                    visible: state
                }
            }).success(function() {
                console.log('changed review state for id ' + id)
            });
        };

    }])

    .controller('DesignerController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.solutionType = "designer_solutions";
        $scope.discount = 10;
        $scope.data = [];
        $scope.position = [];
        $scope.group = $routeParams.group;
        $scope.raw = {};

        $scope.url = "";

        $scope.photofileChanged = function(element){
            getPromise(element.files[0]);
            $scope.data = [];
            $scope.position = [];
        }

        function getPromise(file){
            return new Promise(function(resolve, reject){
                var reader = new FileReader();
                reader.onload = function(evt){
                    $scope.$apply(() => {
                        $scope.url = evt.target.result;
                    });
                };
                reader.onerror = function(error) {
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        }

        $scope.handleDelete = function(id){
            $scope.position.splice(id, 1);
            $scope.data.splice(id, 1);
        }

        $scope.handleSkuChange= function(sku, index){
            $http({ url: connString + 'product/' + sku,
                method: 'GET' }).success(function(res) {
                if( res.length !== 0 ){
                    $scope.data[index].checked = true;
                    $scope.data[index].price = res[0].price;
                } else {
                    $scope.data[index].checked = false;
                    $scope.data[index].price = '';
                }
            });
        }

        $scope.handleImagePos= function(e){
            let hh = document.getElementById('header').offsetHeight;
            let parentWidth = document.getElementById('parent-img').offsetWidth;
            let parentHeight = document.getElementById('parent-img').offsetHeight;
            const insertItem = {
                posX: parentWidth === 0? 0 : Math.round((e.offsetX - 12)* 100 / parentWidth),
                posY: parentHeight === 0? 0 : Math.round((e.offsetY - 12)* 100 / parentHeight),
                sku: '',
                price: '',
                checked: false
            };
            $scope.position.push({X: e.offsetX, Y: e.offsetY+hh});
            $scope.data.push(insertItem);
        }
        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.fileUpload = function(){
            if( $scope.url === "" ) {
                alert("Please select a new image");
                return;
            }
            const reqProd = $scope.data.filter((item)=>item.checked);
            let formData = new FormData();
            formData.append('image_file', $scope.url);
            formData.append('tag', $scope.solutionType);
            formData.append('discount', $scope.discount);
            formData.append('items', JSON.stringify(reqProd));

            var request = new XMLHttpRequest();
            request.open("POST", connString + 'designer');
            request.onload = function () {
                if (request.readyState === request.DONE) {
                    if (request.status === 200) {
                        var response = JSON.parse(request.responseText);
                        if( response.success){
                            console.log("success")
                            $scope.$evalAsync( function(){
                                $scope.data = [];
                                $scope.position = [];
                                $scope.url = "";
                                window.document.getElementById('background_image').src = '';
                                window.document.getElementById('upload_photo').value = '';
                            })
                        }
                    }
                }
            }
            request.send(formData);
        }
    }])

    .controller('LoginController', ['$rootScope', '$route', '$scope', '$http', '$location', '$routeParams', '$timeout', function($rootScope, $route, $scope, $http, $location, $routeParams, $timeout) {
                
        $scope.email = '';
        $scope.password = '';
        var division = $route.current.$$route.division;

        if (division == 'logout') {
            $rootScope.login = false;
            localStorage.removeItem('loggedin')
        }

        $scope.login = () => {
            const reqData = {
                email: $scope.email,
                password: $scope.password
            };
            $http({
                url: connString + 'adminlogin',
                method: 'POST',
                data:reqData
            }).success(function(response) {
                if( response.success ){
                    $rootScope.login = true;
                    localStorage.setItem('loggedin', true);
                    $location.url('/');
                } else {
                    alert(response.message);
                    return;
                }
            });
        }
        $scope.facebook_login = () => {
            console.log("facebook login :: ")
        }

        $scope.google_login = () => {
            console.log("google login :: ")
        }

    }])


    .controller('RegisterController', ['$rootScope', '$scope', '$http', '$location', '$routeParams', '$timeout', function($rootScope, $scope, $http, $location, $routeParams, $timeout) {
        $scope.fullname = '';
        $scope.regemail = '';
        $scope.regpassword = '';
        $scope.repeatpassword = '';
        $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
        $scope.signup = () => {
            console.log('email, password :: ',$scope.fullname, $scope.regemail, '=>', $scope.regpassword, $scope.repeatpassword);
            if( $scope.fullname === "" ){
                alert("Please input the full name");
                return;
            }
            if( !$scope.emailFormat.test($scope.regemail) ){
                alert("Email is incorrect");
                return;
            }
            if($scope.regpassword !== $scope.repeatpassword ){
                alert("Password is incorrect");
                return;
            }
            if( $scope.regpassword.length < 6 ){
                alert("Password must be at least 6 digits");
                return;
            }
            const reqData = {
                fullname : $scope.fullname,
                email : $scope.regemail,
                password: $scope.regpassword
            }

            $http({
                url: connString + 'adminregister',
                method: 'POST',
                data: reqData
            }).success(function(response) {
                if( response.success ){
                    $location.url('/login');
                } else {
                    alert(response.message);
                    return;
                }
            });
        }
        $scope.facebook_signup = () => {
            console.log("facebook login :: ")
        }

        $scope.google_signup = () => {
            console.log("google login :: ")
        }

    }])

    .controller('OneClickController', ['$scope', '$http', '$location', '$routeParams', '$timeout', function($scope, $http, $location, $routeParams, $timeout) {
        $scope.group = $routeParams.group;
        $scope.raw = {};
        $http({ url: connString + 'oneClickOrders', method: 'GET' }).success(function(data) {
            $scope.orders = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 50; //max no of items to display in a page
            $scope.filteredItems = $scope.orders.length; //Initially for no filter
            $scope.totalItems = $scope.orders.length;
            for (var i = 0; i < data.length; i++) {
                data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY hh:mm:ss');
                data[i].modified = moment.utc(data[i].modified).local().format('DD.MM.YY hh:mm:ss');

            }
        });
        $scope.setPage = function(pageN) {
            console.log(pageN);
            $scope.currentPage = pageN;
            //$scope.reload();
        };

        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };

        $scope.contactedOrder = function(id, state) {
            console.log(id);
            console.log(state)
            $http({
                url: connString + 'changeOneClickOrder/' + id,
                method: 'POST',
                json: true,
                data: {
                    active: state
                }
            }).success(function() {
                console.log('changed one click order state for review ' + id)
            });
        };

    }])

    .controller('MainController', ['$scope', '$location', function($scope, $location) {
        $scope.searchInput = '';
        $scope.doSearch = function() {
            $location.url('/search/?query=' + $scope.searchInput);
        };
    }])

    .filter('startFrom', function() {
        return function(input, start) {
            //if (!input || !input.length) { return; }
            if (input) {
                start = +start; //parse to int
                return input.slice(start);
            }
            return [];
        }
    })