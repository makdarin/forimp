/*Sync - backend - API version 1.0

 */
var restify = require('restify');
var Connection = require('tedious').Connection;
var server = restify.createServer();
const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql');
var uuid = require('uuid');
var dateFormat = require('dateformat');
var connection = mysql.createConnection({server: '127.0.0.1:3306', user: 'sync', password: 'Test1234!', database: 'antey'});
// var connection = mysql.createConnection({server: '127.0.0.1:3306', user: 'root', password: 'root', database: 'antshop'});

server.listen(7085, function () {
    console.log('listening at %s', server.url);
});

//get order info
server.get('/order/:id', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var orderId = req.params.id;
    console.log(orderId);

    connection.query("SELECT o.OrderID, o.OrderNumber, o.PaymentID, o.Amount, o.Currency, o.OrderDate, o.Created, o.Modified, o.TrackingNumber, o.ShipDate, o.ShipperID, o.Status, o.CustomerID, o.Email, o.Notice, o.NotCall, o.Phone, o.Name, o.Surname, o.City, o.Department, o.PaymentID, o.PaymentMethod, o.Paid, sh.CompanyName, od.ProductID, od.IDSKU,od.Quantity, od.Title, od.Vendor, od.Price FROM Orders o, OrderDetails od, shippers sh WHERE o.OrderNumber = od.OrderNumber AND o.ShipperID = sh.ShipperID AND o.OrderNumber = ?", [orderId], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.orderId + err);
            return;
        }
        var orderDetails = [];
        tmpres.forEach(function (a) {
            orderDetails.push({
                sku: a.IDSKU,
                title: a.Title,
                brand: a.Vendor,
                quantity: a.Quantity,
                price: a.Price
                // orderNumber: a.OrderNumber,
                // paymentID: a.PaymentID,
                // paymentMethod: a.PaymentMethod,
                // paid: a.Paid,
                // amount: a.Amount,
                // currency: a.Currency,
                // orderDate: dateFormat(a.OrderDate, "yyyy-mm-dd"),
                // shipperID: a.ShipperID,
                // created: a.Created,
                // modified: a.Modified,
                // status: a.Status,
                // trackingNumber: a.TrackingNumber,
                // shipperCompany: a.CompanyName,
                // shipperID: a.ShipperID,
                // customerID: a.CustomerID,
                // customerEmail: a.Email,
                // customerPhone: a.Phone,
                // customerName: a.Name + ' ' + a.Surname,
                // shipAddress: a.City + ',' + a.Department + ' ( ' + a.CompanyName + ') ',
                // orderDetails: [{
                //         sku: a.IDSKU,
                //         quantity: a.Quantity,
                //         price: a.Price
                // }]
            });
        });
        res.json([{orderNumber: tmpres[0].OrderNumber,
            paymentID: tmpres[0].PaymentID,
            paymentMethod: tmpres[0].PaymentMethod,
            paid: tmpres[0].Paid,
            amount: tmpres[0].Amount,
            currency: tmpres[0].Currency,
            orderDate: dateFormat(tmpres[0].OrderDate, "yyyy-mm-dd"),
            created: tmpres[0].Created,
            modified: tmpres[0].Modified,
            status: tmpres[0].Status,
            trackingNumber: tmpres[0].TrackingNumber,
            shipperCompany: tmpres[0].CompanyName,
            shipperID: tmpres[0].ShipperID,
            customerID: tmpres[0].CustomerID,
            customerEmail: tmpres[0].Email,
            notice: tmpres[0].Notice,
            notCall: tmpres[0].NotCall,
            customerPhone: tmpres[0].Phone,
            customerName: tmpres[0].Name + ' ' + tmpres[0].Surname,
            shipAddress: tmpres[0].City + ',' + tmpres[0].Department + ' ( ' + tmpres[0].CompanyName + ') ',
            orderDetails}]);
        console.log('Get order information: ' + orderId);
    });
});

//get list of orders by day
server.get('/orders/:date', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var date1 = req.params.date;
    // var date = stringToDate(number,"yyyy-mm-dd","-")
    console.log(date1);
    connection.query("SELECT o.OrderID, o.OrderNumber, o.PaymentID, o.Amount, o.Currency, o.OrderDate, o.Created, o.Modified, o.TrackingNumber, o.ShipDate, o.ShipperID, o.Status, o.CustomerID, o.Email, o.Notice, o.NotCall, o.Phone, o.Name, o.Surname, o.City, o.Department, o.PaymentID, o.PaymentMethod, o.Paid, sh.CompanyName FROM Orders o, shippers sh WHERE o.ShipperID = sh.ShipperID  AND o.Created LIKE ?", ['%' + date1 + '%'], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.id + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                orderNumber: a.OrderNumber,
                paymentID: a.PaymentID,
                paymentMethod: a.PaymentMethod,
                paid: a.Paid,
                amount: a.Amount,
                currency: a.Currency,
                orderDate: dateFormat(a.OrderDate, "yyyy-mm-dd"),
                shipperID: a.ShipperID,
                created: a.Created,
                modified: a.Modified,
                status: a.Status,
                trackingNumber: a.TrackingNumber,
                shipperCompany: a.CompanyName,
                shipperID: a.ShipperID,
                customerID: a.CustomerID,
                customerEmail: a.Email,
                notice: a.Notice,
                notCall: a.NotCall,
                customerPhone: a.Phone,
                customerName: a.Name + ' ' + a.Surname,
                shipAddress: a.City + ',' + a.Department + ' ( ' + a.CompanyName + ') ',
            });
        });
        res.json(out);
        console.log('Get orders by date: ' + date1);
    });
});

//change data for order
server.put('/order/:id', bodyParser(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var orderId = req.params.id;
    var status = req.body.status;
    var trackingNumber = req.body.trackingNumber;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    console.log('changing order info')
    connection.query("UPDATE Orders SET Status = ?, TrackingNumber = ?, Modified = ? WHERE OrderNumber = ?", [
        status, trackingNumber, date, orderId
    ], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.id + err);
            return res.json({success: false});
        }
        console.log('Data have been changed successfully for order: ' + orderId);
        return res.json({
            success: !!tmpres
        });
    });
});

//get product info
server.get('/product/:id/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var productId = req.params.id;
    console.log(productId);

    connection.query("SELECT * FROM Products WHERE sku  = ?", [productId], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.id + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                sku: a.sku,
                id_sku: a.id_sku,
                vendor: a.vendor,
                name: a.title,
                description: a.description_1,
                inventory: a.inventory,
                status: a.status,
                series: a.series,
                price: a.price,
                currency: a.currency,
                available: a.is_active,
                img: a.img
            });
        });
        res.json(out);
        console.log('Get information for product: ' + productId);
    });
});

//get product info webpage
server.get('/products/:id/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var productId = req.params.id;
    console.log(productId);
    connection.query("SELECT p.id, p.sku, p.title, p.is_hot, p.is_featured, p.price, p.vendor, p.is_out_of_stock, p.depot, p.inventory, p.is_active, p.is_sale, p.createdAt, p.updatedAt, p.variants, p.img, p.sub_category_id, c.SubCategoryName, b.BrandID FROM Products p, Brands b, sub_category c WHERE p.sub_category_id = c.Tag AND p.vendor = b.BrandName AND p.id = ?", [productId], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.id + err);
            return res.json(500, err);
        }
        if (tmpres.length === 0) res.json(404, {success: false, error: 'Could not get an object' });
        if (tmpres.length > 0) res.json({
            id: tmpres[0].id,
            title: tmpres[0].title,
            is_featured: tmpres[0].is_featured,
            is_hot: tmpres[0].is_hot,
            price: tmpres[0].price,
            sale_price: tmpres[0].price,
            vendor: tmpres[0].vendor,
            review: null,
            is_out_of_stock: tmpres[0].is_out_of_stock,
            depot: tmpres[0].depot,
            inventory: tmpres[0].inventory,
            is_active: tmpres[0].is_active,
            is_sale: tmpres[0].is_sale,
            created_at: tmpres[0].createdAt,
            updated_at: tmpres[0].updatedAt,
            variants: [],
            images: [{
                id: tmpres[0].id,
                name: tmpres[0].id,
                alternativeText: null,
                caption: null,
                width: null,
                height: null,
                formats: null,
                hash: null,
                ext: ".jpg",
                mime: "image/jpeg",
                size: 158,
                url: tmpres[0].img,
                previewUrl: null,
                provider: null,
                provider_metadata: null,
                created_at: tmpres[0].createdAt,
                updated_at: tmpres[0].updatedAt
            }],
            thumbnail: [{
                id: tmpres[0].id,
                name: tmpres[0].id,
                alternativeText: null,
                caption: null,
                width: null,
                height: null,
                formats: null,
                hash: null,
                ext: ".jpg",
                mime: "image/jpeg",
                size: 15.15,
                url: tmpres[0].img,
                previewUrl: null,
                provider: null,
                provider_metadata: null,
                created_at: tmpres[0].createdAt,
                updated_at: tmpres[0].updatedAt
            }],
            product_categories: [{
                id: tmpres[0].sub_category_id,
                name: tmpres[0].SubCategoryName,
                slug: tmpres[0].SubCategoryName,
                description: null,
                created_at: tmpres[0].created_At,
                updated_at: tmpres[0].updatedAt
            }],
            brands: [{
                id: tmpres[0].BrandID,
                name: tmpres[0].BrandName,
                slug: tmpres[0].BrandName,
                description: null,
                created_at: tmpres[0].createdAt,
                updated_at: tmpres[0].updatedAt
            }],
            collections: []

        })
        console.log('Get information for product portal: ' + productId);
    });
});

//get all product
server.get('/productsall/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT p.id, p.sku, p.title, p.is_hot, p.is_featured, p.price, p.vendor, p.is_out_of_stock, p.depot, p.inventory, p.is_active, p.is_sale, p.createdAt, p.updatedAt, p.variants, p.img, p.sub_category_id, c.SubCategoryName, b.BrandID FROM Products p, Brands b, sub_category c WHERE p.sub_category_id = c.Tag AND p.vendor = b.BrandName", function (err, tmpres) {
        if (err) {
            console.log("query failed!" +  err);
            return res.json(500, err);
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.id,
                title: a.title,
                is_featured: a.is_featured,
                is_hot: a.is_hot,
                price: a.price,
                sale_price: a.price,
                vendor: a.vendor,
                review: null,
                is_out_of_stock: a.is_out_of_stock,
                depot: a.depot,
                inventory: a.inventory,
                is_active: a.is_active,
                is_sale: a.is_sale,
                created_at: a.createdAt,
                updated_at: a.updatedAt,
                variants: [],
                images: [{
                    id: a.id,
                    name: a.id,
                    alternativeText: null,
                    caption: null,
                    width: null,
                    height: null,
                    formats: null,
                    hash: null,
                    ext: ".jpg",
                    mime: "image/jpeg",
                    size: 158,
                    url: a.img,
                    previewUrl: null,
                    provider: null,
                    provider_metadata: null,
                    created_at: a.created_at,
                    updated_at: a.updated_at
                }],
                thumbnail: [{
                    id: a.id,
                    name: a.id,
                    alternativeText: null,
                    caption: null,
                    width: null,
                    height: null,
                    formats: null,
                    hash: null,
                    ext: ".jpg",
                    mime: "image/jpeg",
                    size: 15.15,
                    url: a.img,
                    previewUrl: null,
                    provider: null,
                    provider_metadata: null,
                    created_at: a.created_at,
                    updated_at: a.updated_at
                }],
                product_categories: [{
                    id: a.sub_category_id,
                    name: a.SubCategoryName,
                    slug: a.SubCategoryName,
                    description: null,
                    created_at: a.created_at,
                    updated_at: a.updated_at
                }],
                brands: [{
                    id: a.BrandID,
                    name: a.BrandName,
                    slug: a.BrandName,
                    description: null,
                    created_at: a.created_at,
                    updated_at: a.updated_at
                }],
                collections: []
            });
        });
        if (tmpres.length === 0) res.json(404, {success: false, error: 'Could not get an object' })
        res.json(out);
        console.log('Get all products');
    });
});

//count products
server.get('/products/get/count', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT count(*) as num FROM Products", function (err, tmpres) {
        if (err) {
            console.log("query failed!"  + err);
            return res.json(500, err);
        }
        res.json(tmpres[0]);
        console.log('Count products' + tmpres[0].num);
    });
});

//get product info
server.get('/brand/products/:brand/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var brand = req.params.brand;
    console.log(brand);

    connection.query("SELECT * FROM Products WHERE vendor  LIKE ?", ['%'+brand+'%'], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.brand + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                sku: a.sku,
                id_sku: a.id_sku,
                vendor: a.vendor,
                name: a.title,
                description: a.description_1,
                inventory: a.inventory,
                status: a.status,
                series: a.series,
                price: a.price,
                currency: a.currency,
                available: a.is_active,
                img: a.img
            });
        });
        res.json(out);
        console.log('Get products information for brand: ' + brand);
    });
});

//get product info
server.get('/group/products/:group/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var group = req.params.group;
    console.log(group);

    connection.query("SELECT * FROM Products WHERE sub_category_id LIKE ?", [''+group+'%'], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.group + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                sku: a.sku,
                id_sku: a.id_sku,
                categoryId: a.sub_category_id,
                vendor: a.vendor,
                name: a.title,
                description: a.description_1,
                inventory: a.inventory,
                status: a.status,
                series: a.series,
                price: a.price,
                currency: a.currency,
                available: a.is_active,
                img: a.img
            });
        });
        res.json(out);
        console.log('Get products information for group: ' + group);
    });
});

//change product information
server.put('/products/:id', bodyParser(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var sku = req.params.id;
    var id_sku = req.body.id_sku;
    var vendor = req.body.vendor;
    var name = req.body.name;
    var description = req.body.description;
    var inventory = req.body.inventory;
    var status = req.body.status;
    var series = req.body.series;
    var price = req.body.price;
    var currency = req.body.currency;
    var available = req.body.available;
    var img = req.body.img;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    console.log('changing order info')
    connection.query("UPDATE Products SET id_sku = ?, vendor = ?, title = ?, description_1 = ?, inventory = ?, status = ?, series = ?, price = ?, currency = ?, is_active = ?, img = ?,  updatedAt = ? WHERE sku= ?", [
        id_sku, vendor, name, description, inventory, status, series, price, currency, available, img, date, sku
    ], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.id + err);
            return res.json({success: false});
        }
        console.log('Data have been changed successfully for product: ' + sku);
        return res.json({
            success: !!tmpres
        });
    });
});

server.post('/products/:id', bodyParser(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Content-Type", "application/json; charset=utf-8");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Acc' +
        'ess-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,A' +
        'uthorization');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var sku = req.params.id;
    var id_sku = req.body.id_sku;
    var category_id = req.body.categoryId;
    var vendor = req.body.vendor;
    var name = req.body.name;
    var description = req.body.description;
    var inventory = req.body.inventory;
    var status = req.body.status;
    var series = req.body.series;
    var price = req.body.price;
    var currency = req.body.currency;
    var available = req.body.available;
    var img = req.body.img;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    console.log('adding new product to store');
    console.log(req.body)
    connection.query("INSERT INTO Products (sku, id_sku, category_id, vendor, title,  description_1, inventory, status, series, price, currency, is_active, img, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        sku, id_sku, category_id, vendor, name, description, inventory, status, series, price, currency, available, img, date, date
    ], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.id + err);
            return res.json({success: false});
        }
        console.log('Product data has been added successfully ->' + sku);
        return res.json({
            success: !!tmpres
        });
    });
});

//delete product
server.del('/products/:id', bodyParser(), function(req, res) {
    var sku = req.params.id;
    connection.query('DELETE FROM PRODUCTS1 WHERE sku = ?', [sku], function(err, myres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: true});
    });
});

//get brands
server.get('/brands', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Brands", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                brandId: a.id,
                name: a.BrandName,
                slug: a.Slug,
                description: a.Description,
                created: a.Created,
                modified: a.Modified
            });
        });
        res.json(out);
        console.log('Get list of brands');
    });
});


//get series
server.get('/series', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Series", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                serieId: a.SerieID,
                name: a.SerieName,
                description: a.Description,
                created: a.Created,
                modified: a.Modified
            });
        });
        res.json(out);
        console.log('Get list of series');
    });
});

//get categories
server.get('/categories', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Categories", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                categoryId: a.CategoryID,
                name: a.CategoryName,
                description: a.Description,
                created: a.Created,
                modified: a.Modified
            });
        });
        res.json(out);
        console.log('Get list of categories');
    });
});

//get subcategories
server.get('/subcategories', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM sub_category", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.Tag,
                categoryId: a.CategoryID,
                name: a.SubCategoryName,
                description: a.Description,
                created: a.Created,
                modified: a.Modified
            });
        });
        res.json(out);
        console.log('Get list of sub-categories');
    });
});

//get subcategories
server.get('/shippers', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM shippers", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                shipperId: a.ShipperID,
                name: a.CompanyName,
                description: a.Description
            });
        });
        res.json(out);
        console.log('Get list of shippers');
    });
});

//get customers
server.get('/customers', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Customers", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                customerId: a.CustomerID,
                firstname: a.FirstName,
                lastname: a.LastName,
                email: a.Email,
                phone: a.Phone,
                // shipAddress: a.ShipAddress + ',' + a.ShipPostalCode + ',' + a.ShipCity,
                shipStreet: a.ShipAddress,
                shipPostalCode: a.ShipPostalCode,
                shipCity: a.ShipCity,
                billStreet: a.BillingAddress,
                billPostalCode: a.BillingPostalCode,
                billCity: a.BillingCity,
                created: a.Created
            });
        });
        res.json(out);
        console.log('Get list of customers');
    });
});

//get Products
server.get('/products', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Products", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                sku: a.sku,
                id_sku: a.id_sku,
                vendor: a.vendor,
                name: a.title,
                description: a.description_1,
                inventory: a.inventory,
                status: a.status,
                series: a.series,
                price: a.price,
                currency: a.currency,
                available: a.is_active,
                img: a.img,
                created: a.createdAt,
                modified: a.updatedAt
            });
        });
        res.json(out);
        console.log('Get list of products');
    });
});

//get first list of categories
server.get('/category', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    connection.query("SELECT id, name FROM categories ORDER BY id + 0 ASC", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.tagId + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({id: a.id, name: a.name});
        });
        res.json(out);
        console.log('Get list of categories');
    });
});
