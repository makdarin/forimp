/*Sync - Application app - backend - API version 1.1*/

var restify = require('restify');
var Connection = require('tedious').Connection;
var corsMiddleware = require('restify-cors-middleware');
var server = restify.createServer();
const express = require('express');
var path = require("path");

var cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders:['X-App-Version'],
    exposeHeaders:[]
});

server.pre(cors.preflight);
server.use(cors.actual);

const bodyParser = require('body-parser');
var mysql = require('mysql');
var uuid = require('uuid');
var dateFormat = require('dateformat');
const bcrypt = require('bcrypt')

const multer = require('multer');

var connection = mysql.createConnection({server: '127.0.0.1:3306', user: 'sync', password: 'Test1234!', database: 'antey'});
//var connection = mysql.createConnection({server: '127.0.0.1:3306', user: 'root', password: 'root', database: 'antshopp'});
// var connection = mysql.createConnection({server: '127.0.0.1:3306', user: 'root', password: '', database: 'antshop'});

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fieldSize: 2 * 1024 * 1024 } });

// upload designer picture and save to db
server.post('/designer', bodyParser(), upload.single('image_file'), function(req, res, next){

    let { image_file, tag, discount, items} = req.body;
    var base64Data1 = image_file.replace('data:image/jpeg;base64', "");
    var base64Data = base64Data1.replace('data:image/png;base64', "");

    const ext =  image_file.includes('data:image/jpeg;base64') ? '.jpeg': '.png';
    const date = new Date();
    const timestamp = date.getTime();
    // const fileURL = "./uploads/" + "desinger_" + timestamp.toString() + ext;
    // const filePath = server.url + "/uploads/" + "desinger_" + timestamp.toString() +ext;
    const fileURL = "./opt/out/uploads/" + "desinger_" + timestamp.toString() + ext;
    const filePath = "/uploads/" + "desinger_" + timestamp.toString() +ext;
    var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");
    const detail = JSON.parse(items);

    require("fs").writeFile(fileURL, base64Data, 'base64', function(err) {
        if(err === null ){
            connection.query("SELECT * FROM Designers WHERE tag=?", [tag], function (err, tmpres) {
                if( err ){
                    res.json({success: false});
                    return;
                }
                if( tmpres.length !== 0 ){
                    try{
                        const filename = path.basename(tmpres[0].url);
                        // if( require("fs").existsSync('./uploads/'+filename) )
                        //     require("fs").unlinkSync('./uploads/'+filename);
                        if( require("fs").existsSync('./opt/out/uploads/'+filename) )
                            require("fs").unlinkSync('./opt/out/uploads/'+filename);
                    } catch(e){console.log(e)};

                    connection.query("UPDATE Designers SET discount=?, url=?, updatedAt=? WHERE tag=?", [discount, filePath, _date, tag], function(err2, tpres){
                        if( err2 ){
                            res.json({success:false});
                            return;
                        }
                        connection.query("DELETE FROM DesignerDetails WHERE designerId = ?", [tmpres[0].id], function (err3, tres) {
                            if( err3 ){
                                res.json({success:false});
                                return;
                            }
                            detail.map((item)=>{
                                connection.query("INSERT INTO DesignerDetails (designerId, sku, posX, posY, createdAt, updatedAt) VALUES (?)",
                                    [[tmpres[0].id, item.sku, item.posX, item.posY, _date, _date]],
                                    function(err4, detailres){
                                        if( err4 ) {
                                            res.json({success:false})
                                            return;
                                        }
                                    })
                            })
                            res.json({success: true}) ;
                        })
                    })

                }else{
                    connection.query("INSERT INTO Designers (tag, discount, url, createdAt, updatedAt) VALUES (?)", [[tag, discount, filePath, _date, _date]], function(err2, tpres){
                        if(err2){
                            res.json({success: false});
                            return;
                        }
                        detail.map((item)=>{
                            connection.query("INSERT INTO DesignerDetails (designerId, sku, posX, posY, createdAt, updatedAt) VALUES (?)",
                                [[tpres.insertId, item.sku, item.posX, item.posY, _date, _date]],
                                function(err3, detailres){
                                    if( err3 ) {
                                        res.json({success:false})
                                        return;
                                    }
                                })
                        })
                        res.json({success: true}) ;
                    })
                }
            })
        }
    });
    // res.json({success: true}) ;
})

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash;
}
// admin register
server.post('/adminregister', bodyParser(), async function(req, res, next){
    const { fullname, email, password } = req.body;
    const hashpass = await hashPassword(password.toLowerCase());
    const date = new Date();
    var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");
    connection.query("SELECT * FROM adminusers WHERE email  = ?", [email], function(err, tmpres){
        if( err) {
            res.json({success: false, message:"Database error!"});
            return;
        }
        if( tmpres && tmpres.length !== 0 ){
            res.json({success: false, message:"This user already exists!"});
            return;
        } else {
            connection.query("INSERT INTO adminusers (fullname, email, password, createdAt, updatedAt) VALUES (?)", [[fullname, email, hashpass, _date, _date]],
                function(err2, tmpres2) {
                    if( err2 ){
                        res.json({success:false, message: "Register failed!"});
                        return;
                    }
                    res.json({success: true, message:"New admin user registered successfully!"});
                })
        }
    })
})

server.post('/adminlogin', bodyParser(), async function(req, res, next){
    const { email, password } = req.body;
    connection.query("SELECT * FROM adminusers WHERE email = ?", [email], function(err, tmpres){
        if( err) {
            console.log(err)
            res.json({success: false, message:"Database error!"});
            return;
        }
        if( tmpres !== undefined && tmpres.length !== 0){
            bcrypt.compare(password, tmpres[0].password).then((equal)=>{
                if( equal)
                    res.json({success: true, message:"Login success!", data: tmpres});
                else
                    res.json({success:false, message: "User not found!", data: null});
            }).catch(()=>{
                res.json({success:false, message: "User not found!", data: null});
            })
        } else {
            res.json({success:false, message: "User not found!", data: null});
        }
    })
})

//get order info
server.get('/order/:id', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var orderId = req.params.id;
    console.log(orderId);

    connection.query("SELECT o.OrderID, o.OrderNumber, o.PaymentID, o.Amount, o.Currency, o.OrderDate, o.createdAt, o.updatedAt, o.TrackingNumber, o.ShipDate, o.ShipperID, o.Status, o.CustomerID, o.Email, o.Notice, o.NotCall, o.Phone, o.Name, o.Surname, o.City, o.Department, o.PaymentID, o.PaymentMethod, o.Paid, sh.CompanyName, od.ProductID, od.IDSKU, od.mpn, od.Quantity, od.Title, od.Vendor, od.Price, od.OrderDetailID, od.Status as StatusItem, od.TrackingNumber, od.updatedAt FROM Orders o, OrderDetails od, Shippers sh WHERE o.OrderNumber = od.OrderNumber AND o.ShipperID = sh.ShipperID AND o.OrderNumber = ?", [orderId], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.orderId + err);
            return;
        }
        var orderDetails = [];
        tmpres.forEach(function (a) {
            orderDetails.push({
                id: a.OrderDetailID,
                sku: a.IDSKU,
                mpn: a.mpn,
                title: a.Title,
                brand: a.Vendor,
                quantity: a.Quantity,
                status: a.StatusItem,
                price: a.Price,
                discount: a.Discount,
                trackingId: a.TrackingNumber,
                updated: a.updatedAt
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
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var date1 = req.params.date;
    // var date = stringToDate(number,"yyyy-mm-dd","-")
    console.log(date1);
    connection.query("SELECT o.OrderID, o.OrderNumber, o.PaymentID, o.Amount, o.Currency, o.OrderDate, o.createdAt, o.updatedAt, o.TrackingNumber, o.ShipDate, o.ShipperID, o.Status, o.CustomerID, o.Email, o.Notice, o.NotCall, o.Phone, o.Name, o.Surname, o.City, o.Department, o.PaymentID, o.PaymentMethod, o.Paid, sh.CompanyName FROM Orders o, Shippers sh WHERE o.ShipperID = sh.ShipperID  AND o.createdAt LIKE ?", ['%' + date1 + '%'], function (err, tmpres) {
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
                created: a.createdAt,
                modified: a.updatedAt,
                status: a.Status,
                trackingNumber: a.TrackingNumber,
                shipperCompany: a.CompanyName,
                customerID: a.CustomerID,
                customerEmail: a.Email,
                notice: a.Notice,
                notCall: a.NotCall,
                customerPhone: a.Phone,
                customerName: a.Name + ' ' + a.Surname,
                name: a.Name,
                surname: a.Surname,
                city: a.City,
                department: a.Department,
                shipAddress: a.City + ',' + a.Department + ' ( ' + a.CompanyName + ') ',
            });
        });
        res.json(out);
        console.log('Get orders by date: ' + date1);
    });
});

//get list of all orders
server.get('/ordersAll', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var date1 = req.params.date;
    // var date = stringToDate(number,"yyyy-mm-dd","-")
    connection.query("SELECT o.OrderID, o.OrderNumber, o.PaymentID, o.Amount, o.Currency, o.OrderDate, o.createdAt, o.updatedAt, o.TrackingNumber, o.ShipDate, o.ShipperID, o.Status, o.CustomerID, o.Email, o.Notice, o.NotCall, o.Phone, o.Name, o.Surname, o.City, o.Department, o.PaymentID, o.PaymentMethod, o.Paid, sh.CompanyName FROM Orders o, Shippers sh WHERE o.ShipperID = sh.ShipperID", [], function (err, tmpres) {
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
                created: a.createdAt,
                modified: a.updatedAt,
                status: a.Status,
                trackingNumber: a.TrackingNumber,
                shipperCompany: a.CompanyName,
                customerID: a.CustomerID,
                customerEmail: a.Email,
                notice: a.Notice,
                notCall: a.NotCall,
                customerPhone: a.Phone,
                customerName: a.Name + ' ' + a.Surname,
                name: a.Name,
                surname: a.Surname,
                city: a.City,
                department: a.Department,
                shipAddress: a.City + ',' + a.Department + ' ( ' + a.CompanyName + ') ',
            });
        });
        res.json(out);
        console.log('Get all orders');
    });
});

//get list of orders by interval
server.get('/ordersRange/:date1/:date2', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var date1 = req.params.date1;
    var date2 = req.params.date2;
    // var date = stringToDate(number,"yyyy-mm-dd","-")
    console.log(date1);
    console.log(date2);
    var dateFrom = date1 + '00:00:00'
    var dateTo = date2 + '00:00:00'

    connection.query("SELECT o.OrderID, o.OrderNumber, o.PaymentID, o.Amount, o.Currency, o.OrderDate, o.createdAt, o.updatedAt, o.TrackingNumber, o.ShipDate, o.ShipperID, o.Status, o.CustomerID, o.Email, o.Notice, o.NotCall, o.Phone, o.Name, o.Surname, o.City, o.Department, o.PaymentID, o.PaymentMethod, o.Paid, sh.CompanyName FROM Orders o, Shippers sh WHERE o.ShipperID = sh.ShipperID  AND o.createdAt >= ? AND createdAt <= ?", [dateFrom, dateTo], function (err, tmpres) {
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
                created: a.createdAt,
                modified: a.updatedAt,
                status: a.Status,
                trackingNumber: a.TrackingNumber,
                shipperCompany: a.CompanyName,
                customerID: a.CustomerID,
                customerEmail: a.Email,
                notice: a.Notice,
                notCall: a.NotCall,
                customerPhone: a.Phone,
                customerName: a.Name + ' ' + a.Surname,
                name: a.Name,
                surname: a.Surname,
                city: a.City,
                department: a.Department,
                shipAddress: a.City + ',' + a.Department + ' ( ' + a.CompanyName + ') ',
            });
        });
        res.json(out);
        console.log('Get orders by interval from: ' + date1 +' to: ' + date2);
    });
});


//change data for order
server.post('/order/:id', bodyParser(), function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var orderId = req.params.id;
    var status = req.body.status;
    var trackingNumber = req.body.trackingNumber;
    var customerPhone = req.body.customerPhone;
    var name = req.body.name;
    var surname = req.body.surname;
    var city = req.body.city;
    var department = req.body.department;
    var shipperId = req.body.shipperId;
    var paymentId = req.body.paymentId;
    var paymentMethod = req.body.paymentMethod;
    var paid = req.body.paid;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    console.log('changing order info')
    connection.query("UPDATE Orders SET Status = ?, TrackingNumber = ?, Phone = ?, Name = ?, Surname = ?, City = ?, Department = ?, ShipperID = ?, PaymentID = ?, PaymentMethod = ?, Paid = ?,  updatedAt = ? WHERE OrderNumber = ?", [
        status, trackingNumber, customerPhone, name, surname, city, department, shipperId, paymentId, paymentMethod, paid, date, orderId
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

//change data for order detail
server.post('/orderDetail/:id', bodyParser(), function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var id = req.params.id;
    var orderId = req.params.orderId;
    var status = req.body.status;
    var trackingId = req.body.trackingId;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    console.log('changing order info')
    connection.query("UPDATE OrderDetails SET Status = ?, TrackingNumber = ?, updatedAt = ? WHERE OrderDetailID = ?", [
        status, trackingId, date, id
    ], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.id + err);
            return res.json({success: false});
        }
        console.log('Data have been changed successfully for orderDetail: ' + id + ' / Order: ' + orderId);
        return res.json({
            success: !!tmpres
        });
    });
});


//get product info
server.get('/product/:id', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
        console.log('Get information for product: ' + out);
    });
});

//get product info
server.get('/brand/products/:brand', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
server.get('/productsBySubgroup/:group', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

//get product info
server.get('/productsByGroup/:group', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var group = req.params.group;
    console.log(group);

    connection.query("SELECT * FROM Products WHERE category_id LIKE ?", [''+group+'%'], function (err, tmpres) {
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

// post start products by sku id
server.post('/products/:id', bodyParser(), async function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const upsertbody = req.body;
    const sku = req.params.id;
    if( upsertbody.sku === undefined ) res.json({success: false})
    console.log('starting update/add product info for:' + upsertbody.sku)

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
    const insertbody = [upsertbody.sku, upsertbody.mpn, upsertbody.sectionId, upsertbody.vendorId, upsertbody.categoryId, upsertbody.subCategoryId, upsertbody.pictures[0].img, brand_id, upsertbody.collectionId, upsertbody.vendor,
        upsertbody.name, upsertbody.description1, upsertbody.inventory, upsertbody.currency, upsertbody.status, upsertbody.series, upsertbody.productPrice, upsertbody.discountPrice, upsertbody.discountPercent,
        upsertbody.is_sale, upsertbody.is_new, upsertbody.is_hit, upsertbody.is_trend,  upsertbody.is_active, upsertbody.available, upsertbody.weight, buyWith, alterPro, date, date ];

    if( sku )
        await upsert(insertbody, { sku: sku }, res, upsertbody)
    else
        res.json({success: false});
})
//new
async function insertImages(data, id, date) {
    console.log('adding images')
    var url ='';
    var ext = '';
    await data.map((item, index) => {
        const image = item.img == undefined ? '': item.img;
        ext = image.split(".")[image.split(".").length-1];
        const temp = url === '' ? image : ','+image;
        url += temp;
    });
    const insertData = [id, "1"+cst[0], ext, "image/jpeg", url,date, date];
    const result = await upsertImages(insertData, { product_id: id });
    return result;
}

//old
// async function insertImages(data, id) {
//     await data.map((item, index) => {
//         const image = item.img == undefined ? '': item.img;
//         const ext = image.split(".")[image.split(".").length-1];
//         const insertData = [id, ""+index+cst[index], ext, "image/jpeg", image];
//         upsertImages(insertData, { product_id: id });
//     });
// }
// middle function for thumbnails
async function insertThumbnail(data, id, date) {
    const image = data.img == undefined ? '':data.img;
    const ext = image.length === 0 ? "" : '.'+image.split(".")[image.split(".").length-1];
    const name =image.length === 0 ? '' : image.split("/")[image.split("/").length-1];
    const url = image.length === 0 ? null : image;
    const insertData = [id, name, ext, "image/jpeg", url, date, date];
    const result = await upsertThumbnail(insertData, { product_id: id });
    return result;
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
    const insertData = [field, value];
    // setTimeout(()=>{
    const result = await upsertFilter(insertData, { product_id: id });
    console.log('--resFilter---')
    console.log(result)
    return result;
    // }, 40)
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
            connection.query("UPDATE Products SET sku=?, id_sku=?, sectionID=?, vendor_id=?, category_id=?, sub_category_id=?, img=?, Brand_id=?, collection_id=?, vendor=?, title=?, description_1=?, inventory=?, currency=?, status=?, series=?, price=?, discount=?, discount_percent=?, is_sale=?, is_new=?, is_hot=?, is_featured=?, is_active=?, available=?, weight=?, buy_with=?, alter_product=?, updatedAt=?, updatedAt=? WHERE sku=?", val,
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
                        const imageId = await insertImages(upsertbody.pictures, tmpres[0].id, values.date);
                        const thumbnailId = await insertThumbnail(upsertbody.pictures[0], tmpres[0].id, values.date);
                        const filterId = await insertFilter(upsertbody.parameters, tmpres[0].id, tmpres[0].price, values.date);
                        connection.query("UPDATE Products SET productImageId=?, thumbnailId=?, filterId=? WHERE id=?", [imageId, thumbnailId, filterId, tmpres[0].id],
                            function(lerr, lres){
                                if (err) {
                                    console.log("query failed!" + lerr);
                                    return mainres.json({success: false});
                                }
                                return mainres.json({success: true});
                            })
                    })
                })
        } else {
            connection.query("INSERT INTO Products (sku, id_sku, sectionID, vendor_id, category_id, sub_category_id, img, Brand_id, collection_id, vendor, title, description_1, inventory, currency, status, series, price, discount, discount_percent, is_sale, is_new, is_hot, is_featured, is_active, available, weight, buy_with, alter_product, createdAt, updatedAt) VALUES (?)", [values],
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
                        const imageId = await insertImages(upsertbody.pictures, tmpres[0].id, values.date);
                        const thumbnailId = await insertThumbnail(upsertbody.pictures[0], tmpres[0].id, values.date);
                        const filterId = await insertFilter(upsertbody.parameters, tmpres[0].id, tmpres[0].price, values.date);
                        connection.query("UPDATE Products SET productImageId=?, thumbnailId=?, filterId=? WHERE id=?", [imageId, thumbnailId, filterId, tmpres[0].id],
                            function(lerr, lres){
                                if (err) {
                                    console.log("query failed!" + lerr);
                                    return mainres.json({success: false});
                                }
                                return mainres.json({success: true});
                            })
                    })
                })
        }
    });
}
// update or insert product images
function upsertImages(values, condition) {
    return new Promise ((resolve, reject) => {
        connection.query("DELETE FROM ProductImages WHERE product_id = ?", [condition.product_id], function (err, tmpres) {
            if (err) {
                console.log("query failed!" + err);
            }
            connection.query("INSERT INTO ProductImages (product_id, name, ext, mime, url, createdAt, updatedAt) VALUES (?)", [values],
                function (err, res) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        let ret = res.insertId;
                        resolve(ret);
                    }
                });
        })
    });
}
// update or insert thumbnail images
function upsertThumbnail(values, condition) {
    return new Promise ((resolve, reject) => {
        connection.query("DELETE FROM ProductThumbnails WHERE product_id = ?", [condition.product_id], function (err, tmpres) {
            if (err) {
                console.log("query failed!" + err);
            }
            connection.query("INSERT INTO ProductThumbnails (product_id, name, ext, mime, url, createdAt, updatedAt) VALUES (?)", [values],
                function(err, res){
                    if( err ){
                        console.log(err);
                        reject(err)
                    } else{
                        let ret = res.insertId;
                        resolve(ret);
                    }
                })

        })
    });
}
// update or insert filter options
function upsertFilter(values, condition) {
    return new Promise ((resolve, reject) => {
        const date_ = Date.now();
        const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
        connection.query("DELETE FROM Filter_Options WHERE product_id = ?", [condition.product_id], function (err, tmpres) {
            if (err) {
                console.log("query failed!" + err);
            }
            connection.query("INSERT INTO Filter_Options ("+ values[0] + ", createdAt, updatedAt) VALUES (?, ?, ?)", [values[1], date, date], function(err, res){
                if( err ){
                    console.log(err);
                    reject(err)
                } else {
                    let ret = res.insertId;
                    resolve(ret);
                }
            })
        });
    })
}

//delete product
server.del('/products/:id', bodyParser(), function(req, res) {
    var sku = req.params.id;
    connection.query('DELETE FROM Products WHERE sku = ?', [sku], function(err, myres) {
        if (err) return res.json(500, err);
        console.log('Delete Product -> ' + sku);
        return res.json(200, { success: true});
    });
});

//delete category
server.del('/categories/:id', bodyParser(), function(req, res) {
    var categoryID = req.params.id;
    connection.query('DELETE FROM Categories WHERE categoryID = ?', [categoryID], function(err, myres) {
        if (err) return res.json(500, err);
        console.log('Delete category -> ' + categoryID);
        return res.json(200, { success: true});
    });
});

//delete subcategory
server.del('/subcategories/:id', bodyParser(), function(req, res) {
    var Tag = req.params.id;
    connection.query('DELETE FROM SubCategories WHERE Tag = ?', [Tag], function(err, myres) {
        if (err) return res.json(500, err);
        console.log('Delete Sub Category -> ' + Tag);
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


//delete all products
server.del('/deleteAllProducts', bodyParser(), function(req, res) {
    connection.query('DELETE FROM Products;', [], function(err, myres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: true});
    });
});

//delete all brands
server.del('/deleteAllBrands', bodyParser(), function(req, res) {
    connection.query('DELETE FROM Brands;', [], function(err, myres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: true});
    });
});

//delete all categories
server.del('/deleteAllCategories', bodyParser(), function(req, res) {
    connection.query('DELETE FROM Categories;', [], function(err, myres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: true});
    });
});

//delete all sub-categories
server.del('/deleteAllSubCategories', bodyParser(), function(req, res) {
    connection.query('DELETE FROM Subcategories;', [], function(err, myres) {
        if (err) return res.json(500, err);
        return res.json(200, { success: true});
    });
});

//add Brands
server.post('/brands/:id', bodyParser(), function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const id = req.params.id;
    const reqbody = req.body;
    console.log(id)

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    // const insertbody = [reqbody.name, reqbody.desc, reqbody.tag, reqbody.note, reqbody.country, reqbody.url, reqbody.logo, reqbody.img];
    // const updatebody = [reqbody.name, reqbody.desc, reqbody.tag, reqbody.note, reqbody.country, reqbody.url, reqbody.logo, reqbody.img, id];

    const insertbody = [id, reqbody.name, reqbody.desc, null, reqbody.note, reqbody.country, reqbody.url, reqbody.logo, reqbody.img, date, date];
    const updatebody = [reqbody.name, reqbody.desc, null, reqbody.note, reqbody.country, reqbody.url, reqbody.logo, reqbody.img, date, id];
    connection.query("SELECT * FROM Brands WHERE BrandID = ?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err)
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE Brands SET BrandName=?, Description=?, Tag=?, Notes=?, Country=?, URL=?, Logo=?, Img=?, updatedAt=? WHERE BrandID=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        } else {
            connection.query("INSERT INTO Brands (BrandID, BrandName, Description, Tag, Notes, Country, URL, Logo, Img, createdAt, updatedAt) VALUES (?)", [insertbody],
                function(err, r){
                    if( err ){
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }
    });
})

//add Category
server.post('/categories/:id', bodyParser(), async function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const id = req.params.id;
    const reqbody = req.body;

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    // const insertbody = [reqbody.name, reqbody.slug, reqbody.desc, reqbody.tag, reqbody.picture, reqbody.active];
    // const updatebody = [reqbody.name, reqbody.slug, reqbody.desc, reqbody.tag, reqbody.picture, reqbody.active, id];

    const insertbody = [id, reqbody.sectionId, reqbody.name, reqbody.localeName, null, reqbody.description, null, null, null, date, date];
    const updatebody = [reqbody.name, reqbody.slug, reqbody.description, null, null, null, date, id];
    const insertLocale = [reqbody.localeName, reqbody.ru, reqbody.en, reqbody.ua, null, null, null, date, date];

    await insertLocaleName(insertLocale, reqbody.localeName);

    connection.query("SELECT * FROM Categories WHERE CategoryID = ?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE Categories SET CategoryName=?, Slug=?, Description=?, Tag=?, Picture=?, Active=?, updatedAt=? WHERE CategoryID=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        } else {
            connection.query("INSERT INTO Categories (CategoryID, sectionID, CategoryName, LocaleName, Slug, Description, Tag, Picture, Active, createdAt, updatedAt) VALUES (?)", [insertbody],
                function(err, r){
                    if( err ){
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }

        console.log("add category" + id);
    });
})

//add SubCategory
server.post('/subCategories/:id', bodyParser(), async function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const id = req.params.id;
    const locale = req.body.localeName;
    const reqbody = req.body;

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");


    const insertbody = [reqbody.categoryId, reqbody.name, reqbody.localeName, reqbody.description, reqbody.tag, reqbody.picture, null, date, date];
    const updatebody = [reqbody.name, reqbody.description, reqbody.categoryId, reqbody.subCategoryId, reqbody.picture, null, date, id];
    const insertLocale = [reqbody.localeName, reqbody.ru, reqbody.en, reqbody.ua, null, null, null, date, date];

    await insertLocaleName(insertLocale, reqbody.localeName);

    connection.query("SELECT * FROM Subcategories WHERE Tag = ?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE Subcategories SET SubCategoryName=?, Description=?, CategoryID=?, Tag=?, Picture=?, Active=?, updatedAt=? WHERE Tag=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        } else {
            connection.query("INSERT INTO Subcategories (CategoryID, SubCategoryName, LocaleName, Description, Tag, Picture, Active, createdAt, updatedAt) VALUES (?)", [insertbody],
                function(err, r){
                    if( err ){
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }
        console.log("add sub category" + id);

    });
})

//adding locale key
function insertLocaleName(values, locale) {
    console.log(values)
    return new Promise ((resolve, reject) => {
        connection.query("DELETE FROM Locales WHERE name = ?", [locale], function (err, tmpres) {
            if (err) {
                console.log("query failed!" + err);
            }
            connection.query("INSERT INTO Locales (name, ru, en, ua, de, fr, pl, createdAt, updatedAt) VALUES (?)", [values],
                function(err, res){
                    if( err ){
                        console.log(err);
                        reject(err)
                    } else{
                        let ret = res.insertId;
                        resolve(ret);
                    }
                })

        })
    });
}


//get one click orders
server.get('/oneClickOrders', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM OneClickOrders", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.id,
                productId: a.product_id,
                title: a.product_title,
                sku: a.product_sku,
                phone: a.phonenumber,
                active: a.active,
                created: a.createdAt,
                modified: a.updatedAt
            });
        });
        res.json(out);
        console.log('Get list of one click orders');
    });
});

//change one Click order State
server.post('/changeOneClickOrder/:id', bodyParser(), function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const id = req.params.id;
    const reqbody = req.body;

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    const updatebody = [reqbody.active, date, id];

    connection.query("SELECT * FROM OneClickOrders WHERE id = ?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE OneClickOrders SET active=?, updatedAt=? WHERE id=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }
        console.log('Update one click order state for -> ' + id);
    });
})

//get reviews
server.get('/reviews', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Reviews", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.id,
                productId: a.pid,
                star: a.star,
                review: a.review,
                username: a.username,
                email: a.email,
                active: a.visible,
                created: a.createdAt,
                modified: a.updatedAt
            });
        });
        res.json(out);
        console.log('Get list of reviews');
    });
});


//change review State
server.post('/enableReview/:id', bodyParser(), function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const id = req.params.id;
    const reqbody = req.body;

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    const updatebody = [reqbody.visible, date, id];

    connection.query("SELECT * FROM Reviews WHERE id = ?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE Reviews SET visible=?, updatedAt=? WHERE id=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }
        console.log('Update review state for -> ' + id);
    });
})

//get brands
server.get('/brands', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Brands", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                brandId: a.BrandID,
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
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Categories", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                categoryId: a.CategoryID,
                sectionId: a.sectionID,
                localKey: a.LocaleName,
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
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Subcategories", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.SubCategoryID,
                tag: a.Tag,
                localKey: a.LocaleName,
                img: a.Picture,
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

//get comments
server.get('/activeComments', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT r.pid, r.star, r.review, r.username, r.email, r.createdAt, r. updatedAt, p.sku, p.title FROM Reviews r, Products p WHERE r.pid = p.id and r.visible = true", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.pid,
                star: a.star,
                review: a.review,
                user: a.username,
                email: a.email,
                sku: a.sku,
                product_title: a.title,
                created: a.createdAt,
                modified: a.updatedAt
            });
        });
        res.json(out);
        console.log('Get list of active comments');
    });
});

//get comments
server.get('/unvisibleComments', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT r.pid, r.star, r.review, r.username, r.email, r.createdAt, r.updatedAt, p.sku, p.title FROM Reviews r, Products p WHERE r.pid = p.id and r.visible != true", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.pid,
                star: a.star,
                review: a.review,
                user: a.username,
                email: a.email,
                sku: a.sku,
                product_title: a.title,
                created: a.createdAt,
                modified: a.updatedAt
            });
        });
        res.json(out);
        console.log('Get list of unvisible comments');
    });
});


//get shippment Methods
server.get('/shippers', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Shippers", function (err, tmpres) {
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

//get status list
server.get('/status', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Status", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.id,
                status: a.status
            });
        });
        res.json(out);
        console.log('Get list of status');
    });
});

//get payment Methods
server.get('/payments', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM PaymentMethods", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                paymentId: a.PaymentMethodID,
                payMethod: a.PaymentMethod,
            });
        });
        res.json(out);
        console.log('Get list of paymentMethods');
    });
});



//get customers
server.get('/customers', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Products", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.id,
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
                is_sale: a.is_sale,
                categoryId: a.category_id,
                subCategoryId: a.sub_category_id,
                weight: a.weight,
                brandId: a.Brand_id,
                collectionId: a.collection_id,
                discount_price: a.discount,
                img: a.img,
                hit: a.is_hot,
                trend: a.is_featured,
                new: a.is_new,
                sale: a.is_sale,
                created: a.createdAt,
                modified: a.updatedAt
            });
        });
        res.json(out);
        console.log('Get list of products');
    });
});

//change product info
server.post('/productChangeInfo/:id', bodyParser(), function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const id = req.params.id;
    const reqbody = req.body;
    // const collectionId = parseInt(reqbody.collectionId);


    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    const updatebody = [reqbody.description, null, date, id];

    connection.query("SELECT * FROM Products WHERE id = ?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE Products SET description_1=?, collection_id = ?, updatedAt=? WHERE id=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }
        console.log('Update product info for -> ' + id);
    });
})

//change trend State for product
server.post('/enableTrendProduct/:id', bodyParser(), function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const id = req.params.id;
    const reqbody = req.body;

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    const updatebody = [reqbody.visible, date, id];

    connection.query("SELECT * FROM Products WHERE id = ?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE Products SET is_featured=?, updatedAt=? WHERE id=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }
        console.log('Update trend state for product-> ' + id);
    });
})

//change hit State for product
server.post('/enableHitProduct/:id', bodyParser(), function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const id = req.params.id;
    const reqbody = req.body;

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    const updatebody = [reqbody.visible, date, id];

    connection.query("SELECT * FROM Products WHERE id = ?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE Products SET is_hot=?, updatedAt=? WHERE id=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }
        console.log('Update hit state for product-> ' + id);
    });
})

//change new State for product
server.post('/enableNewProduct/:id', bodyParser(), function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const id = req.params.id;
    const reqbody = req.body;

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    const updatebody = [reqbody.visible, date, id];

    connection.query("SELECT * FROM Products WHERE id = ?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE Products SET is_new=?, updatedAt=? WHERE id=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }
        console.log('Update new state for product-> ' + id);
    });
})

//change sale State for product
server.post('/enableSaleProduct/:id', bodyParser(), function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const id = req.params.id;
    const reqbody = req.body;

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    const updatebody = [reqbody.visible, date, id];

    connection.query("SELECT * FROM Products WHERE id = ?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE Products SET is_sale=?, updatedAt=? WHERE id=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }
        console.log('Update sale state for product-> ' + id);
    });
})


//get first list of categories
server.get('/category', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    connection.query("SELECT id, name FROM Categories ORDER BY id + 0 ASC", function (err, tmpres) {
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

//get first list of sections
server.get('/sections', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    connection.query("SELECT s.id, s.name, s.url, l.ru, l.en, l.ua, s.createdAt FROM Sections s,Locales l WHERE s.name = l.name and s.mega = 1", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params + err);
            return;
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({id: a.id, name: a.name, url: a.url, ru: a.ru, en: a.en, ua: a.ua, created: a.createdAt});
        });
        res.json(out);
        console.log('Get list of sections');
    });
});

//get all discounts
server.get('/discounts', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM Vouchers", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.id,
                code: a.code,
                discount: a.discount,
                created: a.createdAt,
                modified: a.updatedAt,
            });
        });
        res.json(out);
        console.log('Get list of discounts');
    });
});

//add discount
server.post('/discount/:code', bodyParser(), function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    const code = req.params.code;
    const reqbody = req.body;

    const date_ = Date.now();
    const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");

    const insertbody = [reqbody.voucher, reqbody.discount, date, date];
    const updatebody = [reqbody.discount, date, reqbody.voucher];

    connection.query("SELECT * FROM Vouchers WHERE code = ?", [code], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false});
        }
        if( tmpres.length !== 0 ){
            connection.query("UPDATE Vouchers SET discount=?, updatedAt=? WHERE code=?", updatebody,
                function(err, r){
                    if( err ) {
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        } else {
            connection.query("INSERT INTO Vouchers (code, discount, createdAt, updatedAt) VALUES (?)", [insertbody],
                function(err, r){
                    if( err ){
                        console.log(err);
                        res.json({success: false});
                    }
                    res.json({success: true});
                })
        }
        console.log('Add discount code -> ' + code);
    });
});

//delete discount
server.del('/discount/:code', bodyParser(), function(req, res) {
    var code = req.params.code;
    connection.query('DELETE FROM Vouchers WHERE code = ?', [code], function(err, myres) {
        if (err) return res.json(500, err);
        console.log('Delete voucher -> ' + code);
        return res.json(200, { success: true});
    });
});

//get all news
server.get('/news', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.query("SELECT * FROM News", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        var out = [];
        tmpres.forEach(function (a) {
            out.push({
                id: a.id,
                title: a.title,
                description: a.content,
                thumbnail: a.url,
                date: a.createdAt,
            });
        });
        res.json(out);
        console.log('Get list of news');
    });
});

// store news to table
server.post('/news', bodyParser(), function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const title = req.body.title;
    const content = req.body.description;
    const url = req.body.thumbnail;
    var date_ = Date.now();
    var date = dateFormat(date_, "mm.dd.yyyy");
    connection.query("INSERT INTO News (title, content, url, createdAt) VALUES (?, ?, ?, ?)", [title, content, url, date], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        res.json({success: true});
        console.log('insert news');
    });
});

// update news
server.post('/newsUpdate/:id', bodyParser(), function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const id = req.body.id;
    const title = req.body.title;
    const content = req.body.description;
    const url = req.body.thumbnail;
    var date_ = Date.now();
    var date = dateFormat(date_, "mm.dd.yyyy");
    connection.query("UPDATE News SET title=?, content=?, url=?, updatedAt=? WHERE id=?", [title, content, null, date, id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        res.json({success: true});
        console.log('update news');
    });
});

// delete news
server.del('/news/:id', bodyParser(), function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const id = req.params.id;
    connection.query("DELETE FROM News WHERE id=?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        res.json({success: true});
    });
});


//get all main banner data
server.get('/banner/mainbanner', function (req, res, next) {
    connection.query("SELECT * FROM MainBanners", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        res.json(tmpres);
        console.log('Get list of main banners');
    });
});

// store main banner to table
server.post('/banner/mainbanner', bodyParser(), upload.single('image_file'), function (req, res, next) {
    let { image_file, active, titleRu, titleEn, titleUa, titleDe, titleFr, titlePl, subtitleRu, subtitleEn, subtitleUa, subtitleDe, subtitleFr, subtitlePl, btnTextRu, btnTextEn, btnTextUa, btnTextDe, btnTextFr, btnTextPl, btnurl } = req.body;
    var base64Data1 = image_file.replace('data:image/jpeg;base64', "");
    var base64Data = base64Data1.replace('data:image/png;base64', "");

    const ext =  image_file.includes('data:image/jpeg;base64') ? '.jpeg': '.png';
    const date = new Date();
    const timestamp = date.getTime();
    // const fileURL = "./uploads/" + "mainbanner_" + timestamp.toString() + ext;
    // const filePath = "/uploads/" + "mainbanner_" + timestamp.toString() + ext;

    const fileURL = "./opt/out/uploads/" + "mainbanner_" + timestamp.toString() + ext;
    const filePath = "/uploads/" + "mainbanner_" + timestamp.toString() +ext;

    var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");

    require("fs").writeFile(fileURL, base64Data, 'base64', function(err) {
        if(err === null ){
            connection.query("INSERT INTO MainBanners (img, active, titleRu, titleEn, titleUa, titleDe, titleFr, titlePl, subtitleRu, subtitleEn, subtitleUa, subtitleDe, subtitleFr, subtitlePl, btnTextRu, btnTextEn, btnTextUa, btnTextDe, btnTextFr, btnTextPl, btnurl, createdAt, updatedAt) VALUES (?)", [[filePath, active? 1: 0, titleRu, titleEn, titleUa, titleDe, titleFr, titlePl, subtitleRu, subtitleEn, subtitleUa, subtitleDe, subtitleFr, subtitlePl, btnTextRu, btnTextEn, btnTextUa, btnTextDe, btnTextFr, btnTextPl, btnurl, _date, _date]], function(err2, tpres){
                if(err2){
                    res.json({success: false});
                    return;
                } else {
                    res.json({success: true, data:{
                            id: tpres.insertId,
                            active, titleRu, titleEn, titleUa, titleDe, titleFr, titlePl, subtitleRu, subtitleEn, subtitleUa, subtitleDe, subtitleFr, subtitlePl, btnTextRu, btnTextEn, btnTextUa, btnTextDe, btnTextFr, btnTextPl, btnurl,
                            img: filePath
                        } }) ;
                }
            })
        }
    });
});

// update main banner
server.put('/banner/mainbanner', bodyParser(), upload.single('image_file'), function (req, res, next) {
    let { id, image_file, active, titleRu, titleEn, titleUa, titleDe, titleFr, titlePl, subtitleRu, subtitleEn, subtitleUa, subtitleDe, subtitleFr, subtitlePl, btnTextRu, btnTextEn, btnTextUa, btnTextDe, btnTextFr, btnTextPl, btnurl, img } = req.body;
    
    if( image_file.length < 1000 ) {
        connection.query("UPDATE MainBanners SET active=?, titleRu=?, titleEn=?, titleUa=?, titleDe=?, titleFr=?, titlePl=?, subtitleRu=?, subtitleEn=?, subtitleUa=?, subtitleDe=?, subtitleFr=?, subtitlePl=?, btnTextRu=?, btnTextEn=?, btnTextUa=?, btnTextDe=?, btnTextFr=?, btnTextPl=?, btnurl=?, updatedAt=? WHERE id=?", [active? 1: 0, titleRu, titleEn, titleUa, titleDe, titleFr, titlePl, subtitleRu, subtitleEn, subtitleUa, subtitleDe, subtitleFr, subtitlePl, btnTextRu, btnTextEn, btnTextUa, btnTextDe, btnTextFr, btnTextPl, btnurl, _date, id], function(err2, tpres){
            if(err2){
                res.json({success: false});
                return;
            } else {
                res.json({success: true}) ;
            }
        })
    } else {
        var base64Data1 = image_file.replace('data:image/jpeg;base64', "");
        var base64Data = base64Data1.replace('data:image/png;base64', "");

        const ext =  image_file.includes('data:image/jpeg;base64') ? '.jpeg': '.png';
        const date = new Date();
        const timestamp = date.getTime();
        // const fileURL = "./uploads/" + "mainbanner_" + timestamp.toString() + ext;
        // const filePath = "/uploads/" + "mainbanner_" + timestamp.toString() + ext;

        const fileURL = "./opt/out/uploads/" + "mainbanner_" + timestamp.toString() + ext;
        const filePath = "/uploads/" + "mainbanner_" + timestamp.toString() +ext;
        var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");

        require("fs").writeFile(fileURL, base64Data, 'base64', function(err) {
            if(err === null ){
                try{
                    const filename = path.basename(img);
                    // if( require("fs").existsSync('./uploads/'+filename) )
                    //     require("fs").unlinkSync('./uploads/'+filename);
                    if( require("fs").existsSync('./opt/out/uploads/'+filename) )
                        require("fs").unlinkSync('./opt/out/uploads/'+filename);
                } catch(e){console.log(e)}

                connection.query("UPDATE MainBanners SET img=?, active=?, titleRu=?, titleEn=?, titleUa=?, titleDe=?, titleFr=?, titlePl=?, subtitleRu=?, subtitleEn=?, subtitleUa=?, subtitleDe=?, subtitleFr=?, subtitlePl=?, btnTextRu=?, btnTextEn=?, btnTextUa=?, btnTextDe=?, btnTextFr=?, btnTextPl=?, btnurl=?, updatedAt=? WHERE id=?", [filePath, active? 1: 0, titleRu, titleEn, titleUa, titleDe, titleFr, titlePl, subtitleRu, subtitleEn, subtitleUa, subtitleDe, subtitleFr, subtitlePl, btnTextRu, btnTextEn, btnTextUa, btnTextDe, btnTextFr, btnTextPl, btnurl, _date, id], function(err2, tpres){
                    console.log(err2)
                    if(err2){
                        res.json({success: false});
                    } else {
                        res.json({success: true}) ;
                    }
                })
            }
        });
    }
});

// delete a main banner
server.del('/banner/mainbanner/:id', bodyParser(), function (req, res, next) {
    const id = req.params.id;
    connection.query("SELECT * FROM MainBanners WHERE id=?", [id], function (err, tmpres) {
        try{
            const filename = path.basename(tmpres[0].img);
            // if( require("fs").existsSync('./uploads/'+filename) )
            //     require("fs").unlinkSync('./uploads/'+filename);
            if( require("fs").existsSync('./opt/out/uploads/'+filename) )
                require("fs").unlinkSync('./opt/out/uploads/'+filename);
            setTimeout(() => {
                connection.query("DELETE FROM MainBanners WHERE id=?", [id], function (err1, tmpres1) {
                    if (err1) {
                        res.json({success: false, err1});
                    }
                    res.json({success: true});
                });
            }, 500);
        } catch(e){console.log(e)}
    })
});



//get all shop banner data
server.get('/banner/shopbanner', function (req, res, next) {
    connection.query("SELECT * FROM ShopBanners", function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        res.json(tmpres);
        console.log('Get list of shop banners');
    });
});

// store shop banner to table
server.post('/banner/shopbanner', bodyParser(), upload.single('image_file'), function (req, res, next) {
    let { image_file, titleRu, title, titleUa, titleDe, titleFr, titlePl, contentRu, content, contentUa, contentDe, contentFr, contentPl, url, type } = req.body;

    const date = new Date();
    var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");
    if( type === "text"){
        connection.query("INSERT INTO ShopBanners (type, img, title, titleRu, titleUa, titleDe, titleFr, titlePl, contentRu, content, contentUa, contentDe, contentFr, contentPl, url, createdAt, updatedAt) VALUES (?)", [[type, "", title, titleRu, titleUa, titleDe, titleFr, titlePl, contentRu, content, contentUa, contentDe, contentFr, contentPl, url, _date, _date]], function(err2, tpres){
            if(err2){
                res.json({success: false});
                return;
            } else {
                res.json({success: true, data:{
                        id: tpres.insertId,
                        type, img: "", title, titleRu, titleUa, titleDe, titleFr, titlePl, contentRu, content, contentUa, contentDe, contentFr, contentPl, url
                    } }) ;
            }
        })
    } else {
        var base64Data1 = image_file.replace('data:image/jpeg;base64', "");
        var base64Data = base64Data1.replace('data:image/png;base64', "");

        const ext =  image_file.includes('data:image/jpeg;base64') ? '.jpeg': '.png';
        const timestamp = date.getTime();
        // const fileURL = "./uploads/" + "shopbanner_" + timestamp.toString() + ext;
        // const filePath = "/uploads/" + "shopbanner_" + timestamp.toString() + ext;

        const fileURL = "./opt/out/uploads/" + "shopbanner_" + timestamp.toString() + ext;
        const filePath = "/uploads/" + "shopbanner_" + timestamp.toString() +ext;


        require("fs").writeFile(fileURL, base64Data, 'base64', function(err) {
            if(err === null ){
                connection.query("INSERT INTO ShopBanners (type, img, title, titleRu, titleUa, titleDe, titleFr, titlePl, contentRu, content, contentUa, contentDe, contentFr, contentPl, url, createdAt, updatedAt) VALUES (?)", [[type, filePath, title, titleRu, titleUa, titleDe, titleFr, titlePl, contentRu, content, contentUa, contentDe, contentFr, contentPl, url, _date, _date]], function(err2, tpres){
                    if(err2){
                        res.json({success: false});
                        return;
                    } else {
                        res.json({success: true, data:{
                                id: tpres.insertId,
                                type, img: filePath, title, titleRu, titleUa, titleDe, titleFr, titlePl, contentRu, content, contentUa, contentDe, contentFr, contentPl, url
                            } }) ;
                    }
                })
            }
        });
    }

});

// update shop banner
server.put('/banner/shopbanner', bodyParser(), upload.single('image_file'), function (req, res, next) {
    let {id, image_file, titleRu, title, titleUa, titleDe, titleFr, titlePl, contentRu, content, contentUa, contentDe, contentFr, contentPl, url, type } = req.body;

    const date = new Date();
    var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");
    if( type === "text" ) {
        connection.query("UPDATE ShopBanners SET type=?, img=?, titleRu=?, title=?, titleUa=?, titleDe=?, titleFr=?, titlePl=?, contentRu=?, content=?, contentUa=?, contentDe=?, contentFr=?, contentPl=?, url=?, updatedAt=? WHERE id=?", [type, "", titleRu, title, titleUa, titleDe, titleFr, titlePl,  contentRu, content, contentUa, contentDe, contentFr, contentPl, url, _date, id], function(err2, tpres){
            if(err2){
                res.json({success: false});
                return;
            } else {
                res.json({success: true}) ;
            }
        })
    } else {
        var base64Data1 = image_file.replace('data:image/jpeg;base64', "");
        var base64Data = base64Data1.replace('data:image/png;base64', "");

        const ext =  image_file.includes('data:image/jpeg;base64') ? '.jpeg': '.png';
        const timestamp = date.getTime();
        // const fileURL = "./uploads/" + "shopbanner_" + timestamp.toString() + ext;
        // const filePath = "/uploads/" + "shopbanner_" + timestamp.toString() + ext;

        const fileURL = "./opt/out/uploads/" + "shopbanner_" + timestamp.toString() + ext;
        const filePath = "/uploads/" + "shopbanner_" + timestamp.toString() +ext;

        require("fs").writeFile(fileURL, base64Data, 'base64', function(err) {
            if(err === null ){
                try{
                    const filename = path.basename(img);
                    if( require("fs").existsSync('./opt/out/uploads/'+filename) )
                        require("fs").unlinkSync('./opt/out/uploads/'+filename);
                } catch(e){console.log(e)}

                connection.query("UPDATE ShopBanners SET img=?, active=?, titleRu=?, titleEn=?, titleUa=?, titleDe=?, titleFr=?, titlePl=?, subtitleRu=?, subtitleEn=?, subtitleUa=?, subtitleDe=?, subtitleFr=?, subtitlePl=?, btnTextRu=?, btnTextEn=?, btnTextUa=?, btnTextDe=?, btnTextFr=?, btnTextPl=?, btnurl=?, updatedAt=? WHERE id=?", [filePath, active? 1: 0, titleRu, titleEn, titleUa, titleDe, titleFr, titlePl, subtitleRu, subtitleEn, subtitleUa, subtitleDe, subtitleFr, subtitlePl, btnTextRu, btnTextEn, btnTextUa, btnTextDe, btnTextFr, btnTextPl, btnurl, _date, id], function(err2, tpres){
                    if(err2){
                        res.json({success: false});
                    } else {
                        res.json({success: true}) ;
                    }
                })
            }
        });
    }
});

// delete a shop banner
server.del('/banner/shopbanner/:id', bodyParser(), function (req, res, next) {
    const id = req.params.id;
    console.log('delete shopbanner', id)
    connection.query("SELECT * FROM ShopBanners WHERE id=?", [id], function (err, tmpres) {
        try{
            const filename = path.basename(tmpres[0].img);
            if( filename !== "" ){
                if( require("fs").existsSync('./opt/out/uploads/'+filename) )
                    require("fs").unlinkSync('./opt/out/uploads/'+filename);    
            }

            setTimeout(() => {
                connection.query("DELETE FROM ShopBanners WHERE id=?", [id], function (err1, tmpres1) {
                    if (err1) {
                        res.json({success: false, err1});
                    }
                    res.json({success: true});
                });
            }, 500);
        } catch(e){console.log(e)}
    })
});

//get section data   SELECT r.pid, r.star, r.review, r.username, r.email, r.createdAt, r.updatedAt, p.sku, p.title FROM Reviews r, Products p WHERE r.pid = p.id and r.visible != true
server.get('/section', function(req, res, next){
    connection.query("SELECT s.id, s.name, s.url, l.ru, l.en, l.ua, l.de, l.fr, l.pl FROM Sections s, Locales l WHERE s.name = l.name and s.mega = ?", [1], function(err, tmpres){
        if( err ) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        res.json({success: true, data: tmpres});
    })
})


//get all section banner data
server.get('/banner/sectionbanner/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query("SELECT * FROM SectionBanners WHERE sectionid=?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        let categories = [], images = [];
        connection.query("SELECT * FROM SectionBanCategories WHERE sectionbannerid=?", [tmpres[0].id], function(err1, tmpres1){
            if( err1 ){
                console.log("error " + err1);
            }
            categories = tmpres1;
        })
        connection.query("SELECT * FROM SectionBanImages WHERE sectionbannerid=?", [tmpres[0].id], function(err2, tmpres2){
            if( err2 ){
                console.log("error " + err2);
            }
            if(tmpres2.length > 2 ){
                images = tmpres2;
            }
            else{
                for( let i = 0 ; i< 3 ; i++){
                    tmpres2[i].id ?
                        images.push(tmpres2[i]):
                        images.push({
                            sectionbannerid: id,
                            url: "",
                        });
                }
            }
        });
        setTimeout(() => {
            res.json({ success: true, data:{
                    ...tmpres[0],
                    description: (tmpres[0].description).split(','),
                    images,
                    categories,
                }});
        }, 1000);
    });
});

//get all section banner category data by id
server.get('/banner/sectionbancategory/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query("SELECT * FROM SectionBanCategories WHERE id=?", [id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        let categories = [], images = [];
        connection.query("SELECT * FROM Subcategories WHERE CategoryId=?", [tmpres[0].cateogryId], function(err1, tmpres1){
            if( err1 ){
                console.log("error " + err1);
                res.json({success: false, err: err1});
            } else {
                tmpres1.forEach(element => {
                    categories.push({
                        id: element.SubCategoryID,
                        imgurl: element.Picture,
                    })
                });
            }
        });
        setTimeout(() => {
            const tempdesc = (tmpres[0].description).split(',');
            tempdesc.push("");
            res.json({ success: true, data:{
                    ...tmpres[0],
                    description: tempdesc,
                    images: [{
                        id: id,
                        sectionbannerid: tmpres[0].sectionbannerid,
                        url: tmpres[0].picUrl,
                    }],
                    categories,
                }});
        }, 1000);
    });
});

// store section banner to table
server.post('/banner/sectionbannerimage', bodyParser(), upload.single('image_file'), function (req, res, next) {
    let { image_file, id, sectionbannerid } = req.body;
    const date = new Date();
    var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");
    var base64Data1 = image_file.replace('data:image/jpeg;base64', "");
    var base64Data = base64Data1.replace('data:image/png;base64', "");

    const ext =  image_file.includes('data:image/jpeg;base64') ? '.jpeg': '.png';
    const timestamp = date.getTime();
    // const fileURL = "./uploads/" + "sectionbannerimage_" + timestamp.toString() + ext;
    // const filePath = "/uploads/" + "sectionbannerimage_" + timestamp.toString() + ext;

    const fileURL = "./opt/out/uploads/" + "sectionbannerimage_" + timestamp.toString() + ext;
    const filePath = "/uploads/" + "sectionbannerimage_" + timestamp.toString() +ext;

    require("fs").writeFile(fileURL, base64Data, 'base64', function(err) {
        if(err === null ){
            console.log(id, sectionbannerid, filePath)
            if( id === ""){
                connection.query("INSERT INTO SectionBanImages (sectionbannerid, url, createdAt, updatedAt) VALUES (?)", [[parseInt(sectionbannerid), filePath, _date, _date]], function(err2, tpres){
                    if(err2){
                        res.json({success: false});
                        return;
                    } else {
                        res.json({success: true, data: {id: tpres[0].id, url: filePath}});
                    }
                })
            } else {
                connection.query("UPDATE SectionBanImages SET url=?, updatedAt=? WHERE id=?", [filePath, _date, id], function(err2, tpres){
                    if(err2){
                        res.json({success: false});
                        return;
                    } else {
                        res.json({success: true, data: {url: filePath, id: id}}) ;
                    }
                })

            }
        } else {
            res.json({success: false});
        }
    });

});

// store section banner to table
server.post('/banner/sectionbancategoryimage', bodyParser(), upload.single('image_file'), function (req, res, next) {
    let { image_file, id, sectionbannerid } = req.body;
    const date = new Date();
    var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");
    var base64Data1 = image_file.replace('data:image/jpeg;base64', "");
    var base64Data = base64Data1.replace('data:image/png;base64', "");

    const ext =  image_file.includes('data:image/jpeg;base64') ? '.jpeg': '.png';
    const timestamp = date.getTime();
    // const fileURL = "./uploads/" + "sectionbancategoryimage_" + timestamp.toString() + ext;
    // const filePath = "/uploads/" + "sectionbancategoryimage_" + timestamp.toString() + ext;

    const fileURL = "./opt/out/uploads/" + "sectionbancategoryimage_" + timestamp.toString() + ext;
    const filePath = "/uploads/" + "sectionbancategoryimage_" + timestamp.toString() +ext;

    require("fs").writeFile(fileURL, base64Data, 'base64', function(err) {
        if(err === null ){
            if( id === ""){

                // connection.query("INSERT INTO SectionBancategories (, url, createdAt, updatedAt) VALUES (?)", [[parseInt(sectionbannerid), filePath, _date, _date]], function(err2, tpres){
                //     if(err2){
                //         res.json({success: false});
                //         return;
                //     } else {
                //         res.json({success: true, data: {id: tpres[0].id, url: filePath}});
                //     }
                // })https://img.reuter.de/content/kategorie/bad/banner/full/premium-badarmaturen-500-small-de-01.jpg
            } else {
                connection.query("UPDATE SectionBanCategories SET picUrl=?, updatedAt=? WHERE id=?", [filePath, _date, id], function(err2, tpres){
                    if(err2){
                        res.json({success: false});
                        return;
                    } else {
                        res.json({success: true, data: {url: filePath, id: id}}) ;
                    }
                })

            }
        } else {
            res.json({success: false});
        }
    });

});

server.post('/banner/sectionbannerimageforcategory', bodyParser(), upload.single('image_file'), function (req, res, next) {
    let { image_file, id, sectionbannerid } = req.body;
    const date = new Date();
    var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");
    var base64Data1 = image_file.replace('data:image/jpeg;base64', "");
    var base64Data = base64Data1.replace('data:image/png;base64', "");

    const ext =  image_file.includes('data:image/jpeg;base64') ? '.jpeg': '.png';
    const timestamp = date.getTime();
    // const fileURL = "./uploads/" + "sectionbannercategoryimage_" + timestamp.toString() + ext;
    // const filePath = "/uploads/" + "sectionbannercategoryimage_" + timestamp.toString() + ext;

    const fileURL = "./opt/out/uploads/" + "sectionbannercategoryimage_" + timestamp.toString() + ext;
    const filePath = "/uploads/" + "sectionbannercategoryimage_" + timestamp.toString() +ext;


    require("fs").writeFile(fileURL, base64Data, 'base64', function(err) {
        if(err === null ){
            if( id === ""){
                connection.query("INSERT INTO SectionBanCategories (sectionbannerid, url, name, imgurl, createdAt, updatedAt) VALUES (?)", [[parseInt(sectionbannerid), "", "", filePath, _date, _date]], function(err2, tpres){
                    if(err2){
                        res.json({success: false});
                        return;
                    } else {
                        res.json({success: true, data: {id: tpres[0].id, url: filePath}});
                    }
                })
            } else {
                connection.query("UPDATE SectionBanCategories SET imgurl=?, updatedAt=? WHERE id=?", [filePath, _date, id], function(err2, tpres){
                    if(err2){
                        res.json({success: false});
                        return;
                    } else {
                        res.json({success: true, data: {url: filePath, id: id}}) ;
                    }
                })

            }
        } else {
            res.json({success: false});
        }
    });

});


server.post('/banner/sectionbancategoryimageforcategory', bodyParser(), upload.single('image_file'), function (req, res, next) {
    let { image_file, id, sectionbannerid } = req.body;
    const date = new Date();
    var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");
    var base64Data1 = image_file.replace('data:image/jpeg;base64', "");
    var base64Data = base64Data1.replace('data:image/png;base64', "");

    const ext =  image_file.includes('data:image/jpeg;base64') ? '.jpeg': '.png';
    const timestamp = date.getTime();
    // const fileURL = "./uploads/" + "sectionbannersubcategoryimage_" + timestamp.toString() + ext;
    // const filePath = "/uploads/" + "sectionbannersubcategoryimage_" + timestamp.toString() + ext;

    const fileURL = "./opt/out/uploads/" + "sectionbannersubcategoryimage_" + timestamp.toString() + ext;
    const filePath = "/uploads/" + "sectionbannersubcategoryimage_" + timestamp.toString() +ext;
console.log(id, "<=============")

    require("fs").writeFile(fileURL, base64Data, 'base64', function(err) {
        if(err === null ){
            if( id === ""){
                // connection.query("INSERT INTO SectionBanCategories (sectionbannerid, url, name, imgurl, createdAt, updatedAt) VALUES (?)", [[parseInt(sectionbannerid), "", "", filePath, _date, _date]], function(err2, tpres){
                //     if(err2){
                //         res.json({success: false});
                //         return;
                //     } else {
                //         res.json({success: true, data: {id: tpres[0].id, url: filePath}});
                //     }
                // })https://b2bdev.antey.com.ua/media/product_sku_042618_0.jpg
            } else {
                connection.query("UPDATE SubCategories SET Picture=?, updatedAt=? WHERE SubCategoryID=?", [filePath, _date, id], function(err2, tpres){
                    if(err2){
                        res.json({success: false});
                        console.log(id, "<=============fail")
                        return;
                    } else {
                        console.log(id, "<=============succeed")

                        res.json({success: true, data: {url: filePath, id: id}}) ;
                    }
                })

            }
        } else {
            res.json({success: false});
        }
    });

});
// update section banner
// https://img.reuter.de/promo/german/kategorieseite-teaser/bad/kategorien/320x9999/badarmaturen-02.jpg

server.put('/banner/sectionbannerimage', bodyParser(), upload.single('image_file'), function (req, res, next) {
    let { image_file, id, sectionbannerid } = req.body;

    const date = new Date();
    var _date = dateFormat(date, "yyyy-mm-dd h:MM:ss");
    var base64Data1 = image_file.replace('data:image/jpeg;base64', "");
    var base64Data = base64Data1.replace('data:image/png;base64', "");

    const ext =  image_file.includes('data:image/jpeg;base64') ? '.jpeg': '.png';
    const timestamp = date.getTime();
    // const fileURL = "./uploads/" + "sectionbannerimage_" + timestamp.toString() + ext;
    // const filePath = "/uploads/" + "sectionbannerimage_" + timestamp.toString() + ext;

    const fileURL = "./opt/out/uploads/" + "sectionbannerimage_" + timestamp.toString() + ext;
    const filePath = "/uploads/" + "sectionbannerimage_" + timestamp.toString() +ext;

    if( type === "text" ) {
        connection.query("UPDATE SectionBanners SET url=?, updatedAt=? WHERE id=?", [filePath, _date, id], function(err2, tpres){
            if(err2){
                res.json({success: false});
                return;
            } else {
                res.json({success: true}) ;
            }
        })
    } else {

        require("fs").writeFile(fileURL, base64Data, 'base64', function(err) {
            if(err === null ){
                try{
                    const filename = path.basename(img);
                    // if( require("fs").existsSync('./uploads/'+filename) )
                    //     require("fs").unlinkSync('./uploads/'+filename);
                    if( require("fs").existsSync('./opt/out/uploads/'+filename) )
                        require("fs").unlinkSync('./opt/out/uploads/'+filename);
                } catch(e){console.log(e)}

                connection.query("UPDATE SectionBanners SET img=?, active=?, titleRu=?, titleEn=?, titleUa=?, titleDe=?, titleFr=?, titlePl=?, subtitleRu=?, subtitleEn=?, subtitleUa=?, subtitleDe=?, subtitleFr=?, subtitlePl=?, btnTextRu=?, btnTextEn=?, btnTextUa=?, btnTextDe=?, btnTextFr=?, btnTextPl=?, btnurl=?, updatedAt=? WHERE id=?", [filePath, active? 1: 0, titleRu, titleEn, titleUa, titleDe, titleFr, titlePl, subtitleRu, subtitleEn, subtitleUa, subtitleDe, subtitleFr, subtitlePl, btnTextRu, btnTextEn, btnTextUa, btnTextDe, btnTextFr, btnTextPl, btnurl, _date, id], function(err2, tpres){
                    if(err2){
                        res.json({success: false});
                    } else {
                        res.json({success: true}) ;
                    }
                })
            }
        });
    }
});

server.put('/sectionbannerprice', bodyParser(), function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const { id, price, discount, active } = req.body;
    // const is_active = active === 0? false: true;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    connection.query("UPDATE SectionBanners SET price=?, discount=?, active=?, updatedAt=? WHERE id=?", [price, discount, active, date, id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        res.json({success: true});
    });
});

server.put('/sectionbancategory', bodyParser(), function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const { id, price, discount, active } = req.body;
    const is_active = active === 0? false: true;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    connection.query("UPDATE SectionBanCategories SET price=?, discount=?, active=?, updatedAt=? WHERE id=?", [price, discount, is_active, date, id], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        res.json({success: true});
    });
});
// delete a section banner
server.del('/banner/sectionbanner/:id', bodyParser(), function (req, res, next) {
    const id = req.params.id;
    connection.query("SELECT * FROM SectionBanners WHERE id=?", [id], function (err, tmpres) {
        try{
            const filename = path.basename(tmpres[0].img);
            // if( require("fs").existsSync('./uploads/'+filename) )
            //     require("fs").unlinkSync('./uploads/'+filename);
            if( require("fs").existsSync('./opt/out/uploads/'+filename) )
                require("fs").unlinkSync('./opt/out/uploads/'+filename);
            setTimeout(() => {
                connection.query("DELETE FROM SectionBanners WHERE id=?", [id], function (err1, tmpres1) {
                    if (err1) {
                        res.json({success: false, err1});
                    }
                    res.json({success: true});
                });
            }, 500);
        } catch(e){console.log(e)}
    })
});


server.get("/locale", function(req, res, next) {
    connection.query("SELECT * FROM Locales",function(err, tmpres) {
        if( err ) {
            console.log("err", err);
        }else {
            const retRu = {};
            const retEn = {};
            const retUa = {};
            const retDe = {};
            const retFr = {};
            const retPl = {};
            tmpres.forEach(item => {
                retRu[`${item.name}`] = item[`ru`];
                retEn[`${item.name}`] = item[`en`];
                retUa[`${item.name}`] = item[`ua`];
                retDe[`${item.name}`] = item[`de`];
                retFr[`${item.name}`] = item[`fr`];
                retPl[`${item.name}`] = item[`pl`];
            });
            res.json({success: true, data: {
                    ru: retRu,
                    en: retEn,
                    ua: retUa,
                    de: retDe,
                    fr: retFr,
                    pl: retPl,
                }})
        }
    })
});

server.get("/localeForUpdate", function(req, res, next) {
    connection.query("SELECT * FROM Locales",function(err, tmpres) {
        if( err ) {
            console.log("err", err);
        }else {
            res.json(tmpres)
        }
    })
});

server.put('/locale', bodyParser(), function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const { name, ru, en, ua, de, fr, pl } = req.body;
    console.log(name, ru, en, ua, de, fr, pl);
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    connection.query("UPDATE Locales SET ru=?, en=?, ua=?, de=?, fr=?, pl=?, updatedAt=? WHERE name=?", [ru, en, ua, de, fr, pl, date, name], function (err, tmpres) {
        if (err) {
            console.log("query failed!" + err);
            res.json({success: false, err});
        }
        res.json({success: true});
        console.log('update locale');
    });
});
