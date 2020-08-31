/*Sync - Application app - backend - API version 1.0*/

var restify = require('restify');
var Connection = require('tedious').Connection;
var server = restify.createServer();
const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql');
var uuid = require('uuid');
var dateFormat = require('dateformat');
var connection = mysql.createConnection({server: '127.0.0.1:3306', user: 'sync', password: 'Test1234!', database: 'antey'});
// var connection = mysql.createConnection({server: '127.0.0.1:3306', user: 'root', password: 'root', database: 'antshop3'});

const cst = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m","n","o","p"];
const enFilters = [
    "width", "width", "width", "width", "width", "width", "width", "width", "equipment", "equipment", "equipment", "color", "material", "depth", "length",
    "installation_type", "installation_type", "form", "form", "type", "type", "control_type", "installation_type", "installation_type", "color",
    "country_vendor", "type", "type", "type", "type", "type", "type", "type", "type", "type", "type", "type", "type", "type", "type", "length", "width", "height",
    "installation_type", "installation_type", "installation_type", "form", "type", "color", "equipment",
    "type", "type", "type", "material", "material", "material", "material", "width", "depth", "height", "installation_type", "form", "form", "color", "equipment", "material",
    "material", "material", "material", "material", "length", "width", "height", "material", "color", "form", "form", "installation_type", "installation_type",
    "installation_type", "installation_type", "installation_type", "installation_type", "installation_type", "control_type", "control_type", "control_type", "height", "color",
    "control_type", "control_type", "control_type", "control_type", "installation_type", "color", "equipment", "control_type", "type", "type", "type", "color", "equipment",
    "control_type","control_type","control_type","control_type","control_type","control_type", "installation_type", "color", "control_type","control_type","control_type","control_type",
    "equipment", "equipment", "equipment", "equipment", "equipment", "installation_type", "color", "equipment", "control_type", "control_type", "control_type", "control_type",
    "control_type", "control_type", "installation_type", "installation_type", "length", "width", "height", "height", "height", "height", "height", "color", "height", "height",
    "height", "height", "height", "height", "material", "material", "installation_type", "color", "color", "height", "height", "color","color","color","color","color","color","color",
    "color","color","color","color", "installation_type", "color", "control_type", "control_type", "control_type", "control_type", "control_type", "control_type", "control_type",
    "color","color","color","color","color","color","color","color","color","color","color","color","color", "control_type", "control_type", "control_type", "control_type", "control_type",
    "brand", "series"
];

server.listen(7085, function () {
    console.log('listening at %s', server.url);
});

console.log(server.url, "server url")

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
server.post('/order/:id', bodyParser(), function (req, res, next) {
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
// server.put('/products/:id', bodyParser(), function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     var sku = req.params.id;
//     var id_sku = req.body.id_sku;
//     var vendor = req.body.vendor;
//     var name = req.body.name;
//     var description = req.body.description;
//     var inventory = req.body.inventory;
//     var status = req.body.status;
//     var series = req.body.series;
//     var price = req.body.price;
//     var currency = req.body.currency;
//     var available = req.body.available;
//     var img = req.body.img;
//     var date_ = Date.now();
//     var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
//     console.log('changing order info')
//     connection.query("UPDATE Products SET id_sku = ?, vendor = ?, title = ?, description_1 = ?, inventory = ?, status = ?, series = ?, price = ?, currency = ?, is_active = ?, img = ?,  updatedAt = ? WHERE sku= ?", [
//         id_sku, vendor, name, description, inventory, status, series, price, currency, available, img, date, sku
//     ], function (err, tmpres) {
//         if (err) {
//             console.log("query failed!" + req.params.id + err);
//             return res.json({success: false});
//         }
//         console.log('Data have been changed successfully for product: ' + sku);
//         return res.json({
//             success: !!tmpres
//         });
//     });
// });

// post start products by sku id
server.post('/products/:id', bodyParser(), async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const upsertbody = req.body;
    const sku = req.params.id;
    if( upsertbody.sku === undefined ) res.json({success: false})
    console.log('starting update/add product info for:' + upsertbody.sku)
    console.log(req.body)

    let buyWith = '';
    let alterPro = '';
    if( upsertbody.buyWith !== undefined )
        upsertbody.buyWith.map((item) => {
            let prefix = buyWith.length === 0 ? "" : "-" ;
            buyWith += prefix;
            buyWith += item.product_sku;
        });
    if( upsertbody.alternativeProducts !== undefined )
        upsertbody.alternativeProducts.map((item) => {
            let prefix = alterPro.length === 0 ? "" : "-" ;
            alterPro += prefix;
            alterPro += item.product_sku;
        });

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    const brand_id = upsertbody.brandId === undefined || upsertbody.brandId === null ? 0 : upsertbody.brandId;
    const insertbody = [upsertbody.sku, upsertbody.mpn, upsertbody.vendorId, upsertbody.categoryId, upsertbody.subCategoryId, upsertbody.pictures[0].img, brand_id, upsertbody.collectionId, upsertbody.vendor,
        upsertbody.name, upsertbody.description1, upsertbody.inventory, upsertbody.currency, upsertbody.status, upsertbody.series, upsertbody.productPrice, upsertbody.discountPrice, upsertbody.discountPercent,
        upsertbody.is_sale, upsertbody.is_active, upsertbody.available, upsertbody.weight, buyWith, alterPro, date, date ];

    if( sku )
        await upsert(insertbody, { sku: sku }, res, upsertbody)
    else
        res.json({success: false});
})
// middle function for product images
async function insertImages(data, id, date) {
    await data.map((item, index) => {
        const image = item.img == undefined ? '': item.img;
        const ext = image.split(".")[image.split(".").length-1];
        const insertData = [id, ""+index+cst[index], ext, "image/jpeg", image, date, date];
        upsertImages(insertData, { product_id: id });
    });
}
// middle function for thumbnails
function insertThumbnail(data, id, date) {
    const image = data.img == undefined ? '':data.img;
    const ext = image.length === 0 ? "" : '.'+image.split(".")[image.split(".").length-1];
    const name =image.length === 0 ? '' : image.split("/")[image.split("/").length-1];
    const url = image.length === 0 ? null : image;
    const insertData = [id, name, ext, "image/jpeg", url, date, date];
    upsertThumbnail(insertData, { product_id: id });
}
// middle function for filter option
async function insertFilter(data, id, price, date) {
    var field = 'product_id, '+'price';
    var value = [id, price];
    await data.map((item) => {
        const name = item.parameter_value;
        const strID = item.parameter_id.split("_")[1].toLowerCase();
        let id = -1;
        if( strID === "brand")
            id = 189;
        else if( strID === "series" )
            id = 190;
        else id = parseInt(strID) - 1;
        if( id !== -1 ) {
            field += `, ${enFilters[id]}`;
            value.push(name);
        }
    })
    const insertData = [field, value, date, date];
    setTimeout(()=>{
        upsertFilter(insertData, { product_id: id }, date);
    }, 40)
}
// update or insert product
// update or insert product
async function upsert(values, condition, mainres, upsertbody) {
    await connection.query("SELECT * FROM Products WHERE sku = ?", [condition.sku], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return mainres.json({success: false});
        }
        if( tmpres.length !== 0 ){
            let val = values;
            val.push(condition.sku)
            console.log('update data for product:'+condition.sku)
            connection.query("UPDATE Products SET sku=?, id_sku=?, vendor_id=?, category_id=?, sub_category_id=?, img=?, Brand_id=?, collection_id=?, vendor=?, title=?, description_1=?, inventory=?, currency=?, status=?, series=?, price=?, discount=?, discount_percent=?, is_sale=?, is_active=?, available=?, weight=?, buy_with=?, alter_product=?, updatedAt=?, updatedAt=? WHERE sku=?", val,
                function(err, res){
                    if( err ) {
                        console.log(err);
                        return mainres.json({success: false});
                    }
                    connection.query("SELECT * FROM Products WHERE sku = ?", [condition.sku], async function (err, tmpres) {
                        if (err) {
                            console.log("query failed!" + err);
                            return mainres.json({success: false});
                        }
                        await insertImages(upsertbody.pictures, tmpres[0].id, values.date);
                        await insertThumbnail(upsertbody.pictures[0], tmpres[0].id, values.date);
                        await insertFilter(upsertbody.parameters, tmpres[0].id, tmpres[0].price, values.date);
                        return mainres.json({success: true});
                    })
                })
        } else {
            connection.query("INSERT INTO Products (sku, id_sku, vendor_id, category_id, sub_category_id, img, Brand_id, collection_id, vendor, title, description_1, inventory, currency, status, series, price, discount, discount_percent, is_sale, is_active, available, weight, buy_with, alter_product, createdAt, updatedAt) VALUES (?)", [values],
                function(err, res){
                    if( err ){
                        console.log(err);
                        return mainres.json({success: false});
                    }
                    connection.query("SELECT * FROM Products WHERE sku = ?", [condition.sku], async function (err, tmpres) {
                        if (err) {
                            console.log("query failed!" + err);
                            return mainres.json({success: false});
                        }
                        await insertImages(upsertbody.pictures, tmpres[0].id, values.date);
                        await insertThumbnail(upsertbody.pictures[0], tmpres[0].id, values.date);
                        await insertFilter(upsertbody.parameters, tmpres[0].id, tmpres[0].price, values.date);
                        return mainres.json({success: true});
                    })
                })
        }
    });
}
// update or insert product images
function upsertImages(values, condition) {
    connection.query("DELETE FROM ProductImages WHERE product_id = ?", [condition.product_id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
        }
        connection.query("INSERT INTO ProductImages (product_id, name, ext, mime, url, createdAt, updatedAt) VALUES (?)", [values],
            function(err, res){
                if( err ){
                    console.log(err);
                }
            })
    });
}
// update or insert thumbnail images
function upsertThumbnail(values, condition) {
    connection.query("DELETE FROM ProductThumbnails WHERE product_id = ?", [condition.product_id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
        }
        connection.query("INSERT INTO ProductThumbnails (product_id, name, ext, mime, url, createdAt, updatedAt) VALUES (?)", [values],
            function(err, res){
                if( err ){
                    console.log(err);
                }
            })
    });
}
// update or insert filter options
function upsertFilter(values, condition) {
    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    connection.query("DELETE FROM Filter_Options WHERE product_id = ?", [condition.product_id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
        }
        connection.query("INSERT INTO Filter_Options ("+ values[0] + ", createdAt, updatedAt) VALUES (?, ?, ?)", [values[1], date, date], function(err, res){
            if( err ){
                console.log(err);
            }
        })
    });
}

//delete product
server.del('/products/:id', bodyParser(), function(req, res) {
    var sku = req.params.id;
    connection.query('DELETE FROM Products WHERE sku = ?', [sku], function(err, myres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: true});
    });
});

//delete brand
server.del('/brands/:id', bodyParser(), function(req, res) {
    var id = req.params.id;
    connection.query('DELETE FROM Brands WHERE BrandID = ?', [id], function(err, myres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: true});
    });
});

//delete category
server.del('/categories/:id', bodyParser(), function(req, res) {
    var id = req.params.id;
    connection.query('DELETE FROM Categories WHERE CategoryID = ?', [id], function(err, myres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: true});
    });
});

//delete sub-category
server.del('/subCategories/:id', bodyParser(), function(req, res) {
    var id = req.params.id;
    connection.query('DELETE FROM sub_category WHERE SubCategoryID = ?', [id], function(err, myres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: true});
    });
});

//delete all products
server.del('/deleteAllProducts', bodyParser(), function(req, res) {
    connection.query('DELETE FROM Products;', [], function(err, myres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: true});
    });
});

//change data for order
server.post('/brands/:id', bodyParser(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var brandId = req.params.id;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    console.log('update/add brand:' + brandId)
    console.log(req.body)
    connection.query("Select * From Brands", [], function (err, tmpres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: false});
    })

});

//change data for order
server.post('/categories/:id', bodyParser(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var categoryId = req.params.id;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    console.log('update/add category:' + categoryId)
    console.log(req.body)
    connection.query("Select * From Categories", [], function (err, tmpres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: false});
    })

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
