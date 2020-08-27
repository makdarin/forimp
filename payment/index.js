const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const restify = require('restify');
const Connection = require('tedious').Connection;
const server = restify.createServer();
const mysql = require('mysql');
const uuid = require('uuid');
const dateFormat = require('dateformat');
const shortid = require('shortid');
const orderid = require('order-id')('mysecret')


const stripe = require('stripe')('sk_test_51GsJEqALCR9ctSLfdYOmdYYjp1ELZljfwA1ZDOIbovzJYYMKNgiwvTDOhapJDQlqFHJ01Xu5C6Ca0AJ1jM1NlnHm00fM0ZxL0L');
// const con = mysql.createConnection({host: '127.0.0.1', user: 'root', password: 'root', database: 'antshop'});
const con = mysql.createConnection({host: '127.0.0.1', user: 'sync', password: 'Test1234!', database: 'antey'});


const port = 3001

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors({ origin: '*' }));

app.post('/pay', async (req, res) => {
    // const {email, amount, cartItems} = req.body;
    const { amount, email, phone,  name1, notCall, notice, surname, deliveryMethod,items, city, department, payMethod, payOption} = req.body;
    console.log(req.body)
    const amnt = parseInt(amount) * 100;
    // const amount_ = parseInt(amount);
    // const amountN = Math.round(amount_ * 100)

    console.log(amnt)
    try {
        const paymentCharge = await stripe.charges.create({
            amount: amnt,
            currency: 'UAH',
            source: req.body.token,
            description: "Akvamarket",
            receipt_email: email,
        });
        console.log('resdata ', paymentCharge);

        const date_ = Date.now();
        const date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
        const orderDate = dateFormat(date_, "yyyy-mm-dd");
        console.log('changing order info')
        const id = orderid.generate()
        console.log(id)

        var sql = "INSERT INTO Orders (OrderNumber, Amount, Name, Surname, Email, Phone, City, Department, ShipperID, Paid, PaymentID, PaymentMethod, Currency, Notice, NotCall,  OrderDate, Created, createdAt) VALUES ?";
        var sql1 = "INSERT INTO OrderDetails (OrderNumber, IDSKU, Quantity, Price, Title, Vendor, Created) VALUES ?";
        var values = [
            [id, amount, name1, surname, email, phone, city, department, deliveryMethod.id, true, payMethod, payOption.name, 'UAH', notice, notCall, orderDate, date, date]
        ];

        let valueItems = [];

        for(var i = 0; i < items.length; i++) {
            const item =  [id, items[i].id, items[i].quantity, items[i].price,items[i].title, items[i].vendor, orderDate]
            valueItems.push(item)
        }
        console.log(valueItems)


        con.query(sql1, [valueItems], function(err) {
            if (err) throw err;
        })

        con.query(sql, [values], function(err) {
            if (err) throw err;
            // res.json({'payment_result': 'succeeded'});
            res.json({'payment_result': paymentCharge, 'orderId': id, 'email': email});
            // con.end();
            // console.log(res)
            /*            res.status(200).json({
                            payment_result: 'succeeded'
                        });*/
        });

    } catch (err) {
        console.log('resdata', err);
        res.json({'payment_result': err});

    }


    // const paymentIntent = await stripe.paymentIntents.create({
    //     amount: amnt,
    //     currency: 'USD',
    //     // Verify your integration in this guide by including this parameter
    //     metadata: {integration_check: 'accept_a_payment'},
    //     receipt_email: email,
    // });

    // res.json({'client_secret': paymentIntent['client_secret']})

})

app.post('/paymentLater', async (req, res) => {
    // const {email, amount, cartItems} = req.body;
    const { amount, email, phone,  name1, surname, deliveryMethod,items, city, notCall, notice,  department, payMethod, payOption} = req.body;
    console.log(req.body)
    const amnt = parseInt(amount) * 100;
    console.log(amnt)
    try {
        const date_ = Date.now();
        const date = dateFormat(date_, "yyyy-mm-dd hh:MM:ss");
        const orderDate = dateFormat(date_, "yyyy-mm-dd");
        console.log('changing order info')
        const id = orderid.generate()
        console.log(id)
        var sql = "INSERT INTO Orders (OrderNumber, Amount, Name, Surname, Email, Phone, City, Department, ShipperID, Paid, PaymentID, PaymentMethod, Currency, Notice, NotCall,  OrderDate, Created, createdAt) VALUES ?";
        var sql1 = "INSERT INTO OrderDetails (OrderNumber, IDSKU, Quantity, Price, Title, Vendor, Created) VALUES ?";

        var values = [
            [id, amount, name1, surname, email, phone, city, department, deliveryMethod.id, false, payMethod, payOption.name, 'UAH', notice, notCall, orderDate, date, date]
        ];
        let valueItems = [];

        for(var i = 0; i < items.length; i++) {
            const item =  [id, items[i].id, items[i].quantity, items[i].price,items[i].title, items[i].vendor, orderDate]
            valueItems.push(item)
        }
        console.log(valueItems)


        con.query(sql1, [valueItems], function(err) {
                    if (err) throw err;
        })

        con.query(sql, [values], function(err) {
            if (err) throw err;
            res.json({'payment_result': 'succeeded', 'orderId': id, 'email': email});
            // con.end();
            // console.log(res)
/*            res.status(200).json({
                payment_result: 'succeeded'
            });*/
        });

    } catch (err) {
        console.log('resdata', err);
        res.json({'payment_result': 'failed'});

    }


    // const paymentIntent = await stripe.paymentIntents.create({
    //     amount: amnt,
    //     currency: 'USD',
    //     // Verify your integration in this guide by including this parameter
    //     metadata: {integration_check: 'accept_a_payment'},
    //     receipt_email: email,
    // });

    // res.json({'client_secret': paymentIntent['client_secret']})

})

app.listen(port, () => console.log(`listening on port ${port}!`))