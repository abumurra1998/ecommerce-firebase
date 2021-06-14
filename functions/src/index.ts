//import libraries
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);

//initialize express server
const app = express();
const main = express();
const cors = require('cors')({origin:true});
main.use(cors);
//add the path to receive request and set json as bodyParser to process the body 
main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

//initialize the database and the collection 
const db = admin.firestore();
const customerCollection = 'customers';
const productCollection = 'products';
const warehouseCollection = 'warehouses';
const inventoryCollection = 'inventories';
const orderCollection = 'orders';
const deliveryCollection = 'deliveries';

//define google cloud function name
export const webApi = functions.https.onRequest(main);


////// Customer section
interface Customer {
    firstName: String,
    lastName: String,
    email: String,
    password: String
}

// Create new customer
app.post('/customers', async (req, res) => {
    try {
        const customer: Customer = {
            firstName: req.body['firstName'],
            lastName: req.body['lastName'],
            email: req.body['email'],
            password: req.body['password']
        }

        const newDoc = await db.collection(customerCollection).add(customer);
        res.status(201).send(`Created a new customer: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`Customer should cointain firstName, lastName, email, password!!!`)
    }
});

//get all customers
app.get('/customers', async (req, res) => {
    try {
        const customerQuerySnapshot = await db.collection(customerCollection).get();
        const customers: any[] = [];
        customerQuerySnapshot.forEach(
            (doc)=>{
                customers.push({
                    id: doc.id,
                    data:doc.data()
            });
            }
        );
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).send(error);
    }
});

//get a single contact
app.get('/customers/:customerId', (req,res) => {

    const customerId = req.params.customerId; 
    db.collection(customerCollection).doc(customerId).get()
    .then(customer => {
        if(!customer.exists) throw new Error('Customer not found');
        res.status(200).json({id:customer.id, data:customer.data()})})
    .catch(error => res.status(500).send(error));
        
});


// Delete a customer
app.delete('/customers/:customerId', (req, res) => {
    db.collection(customerCollection).doc(req.params.customerId).delete()
    .then(()=>res.status(204).send("Document successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})

// Update customer
app.put('/customers/:customerId', async (req, res) => {
    await db.collection(customerCollection).doc(req.params.customerId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.customerId}))
    .catch((error)=> res.status(500).send(error))

});

//// Product section

interface Product {
    name: String,
    brand: String,
    price: Number,
    serialNumber: String
}

// Create new product
app.post('/products', async (req, res) => {
    try {
        const product: Product = {
            name: req.body['name'],
            brand: req.body['brand'],
            price: req.body['price'],
            serialNumber: req.body['serialNumber']
        }

        const newDoc = await db.collection(productCollection).add(product);
        res.status(201).send(`Created a new product: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`Product should cointain name, brand, price, serialNumber!!!`)
    }
});

//get all products
app.get('/products', async (req, res) => {
    try {
        const productQuerySnapshot = await db.collection(productCollection).get();
        const products: any[] = [];
        productQuerySnapshot.forEach(
            (doc)=>{
                products.push({
                    id: doc.id,
                    data:doc.data()
            });
            }
        );
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

//get a single contact
app.get('/products/:productId', (req,res) => {

    const productId = req.params.productId; 
    db.collection(productCollection).doc(productId).get()
    .then(product => {
        if(!product.exists) throw new Error('Product not found');
        res.status(200).json({id:product.id, data:product.data()})})
    .catch(error => res.status(500).send(error));
        
});


// Delete a product
app.delete('/products/:productId', (req, res) => {
    db.collection(productCollection).doc(req.params.productId).delete()
    .then(()=>res.status(204).send("Document successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})

// Update product
app.put('/products/:productId', async (req, res) => {
    await db.collection(productCollection).doc(req.params.productId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.productId}))
    .catch((error)=> res.status(500).send(error))

});

//// Warehouse section

interface Warehouse {
    city: String,
    address: String
}

// Create new warehouse
app.post('/warehouses', async (req, res) => {
    try {
        const warehouse: Warehouse = {
            city: req.body['city'],
            address: req.body['address']
        }

        const newDoc = await db.collection(warehouseCollection).add(warehouse);
        res.status(201).send(`Created a new warehouse: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`Warehouse should cointain city, address!!!`)
    }
});

//get all warehouses
app.get('/warehouses', async (req, res) => {
    try {
        const warehouseQuerySnapshot = await db.collection(warehouseCollection).get();
        const warehouses: any[] = [];
        warehouseQuerySnapshot.forEach(
            (doc)=>{
                warehouses.push({
                    id: doc.id,
                    data:doc.data()
            });
            }
        );
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(500).send(error);
    }
});

//get a single contact
app.get('/warehouses/:warehouseId', (req,res) => {

    const warehouseId = req.params.warehouseId; 
    db.collection(warehouseCollection).doc(warehouseId).get()
    .then(warehouse => {
        if(!warehouse.exists) throw new Error('Warehouse not found');
        res.status(200).json({id:warehouse.id, data:warehouse.data()})})
    .catch(error => res.status(500).send(error));
        
});


// Delete a warehouse
app.delete('/warehouses/:warehouseId', (req, res) => {
    db.collection(warehouseCollection).doc(req.params.warehouseId).delete()
    .then(()=>res.status(204).send("Document successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})

// Update warehouse
app.put('/warehouses/:warehouseId', async (req, res) => {
    await db.collection(warehouseCollection).doc(req.params.warehouseId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.warehouseId}))
    .catch((error)=> res.status(500).send(error))

});


interface Inventory {
    warehouseId: String,
    productId: String,
    quantity: Number
}

// Create new inventory
app.post('/inventories', async (req, res) => {
    try {
        const inventory: Inventory = {
            warehouseId: req.body['warehouseId'],
            productId: req.body['productId'],
            quantity: req.body['quantity']
        }

        const newDoc = await db.collection(inventoryCollection).add(inventory);
        res.status(201).send(`Created a new inventory: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`Inventory should cointain warehouseId, productId, quantity!!!`)
    }
});

//get all inventories
app.get('/inventories', async (req, res) => {
    try {
        const inventoryQuerySnapshot = await db.collection(inventoryCollection).get();
        const inventories: any[] = [];
        inventoryQuerySnapshot.forEach(
            (doc)=>{
                inventories.push({
                    id: doc.id,
                    data:doc.data()
            });
            }
        );
        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).send(error);
    }
});

//get a single contact
app.get('/inventories/:inventoryId', (req,res) => {

    const inventoryId = req.params.inventoryId; 
    db.collection(inventoryCollection).doc(inventoryId).get()
    .then(inventory => {
        if(!inventory.exists) throw new Error('Inventory not found');
        res.status(200).json({id:inventory.id, data:inventory.data()})})
    .catch(error => res.status(500).send(error));
        
});


// Delete a inventory
app.delete('/inventories/:inventoryId', (req, res) => {
    db.collection(inventoryCollection).doc(req.params.inventoryId).delete()
    .then(()=>res.status(204).send("Document successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})

// Update inventory
app.put('/inventories/:inventoryId', async (req, res) => {
    await db.collection(inventoryCollection).doc(req.params.inventoryId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.inventoryId}))
    .catch((error)=> res.status(500).send(error))

});


// Order Sction

interface Order {
    customerId: String,
    productId: String,
    quantity: Number
}

// Create new order
app.post('/orders', async (req, res) => {
    try {
        const order: Order = {
            customerId: req.body['customerId'],
            productId: req.body['productId'],
            quantity: req.body['quantity']
        }

        const newDoc = await db.collection(orderCollection).add(order);
        res.status(201).send(`Created a new order: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`Order should cointain customerId, productId, quantity!!!`)
    }
});

//get all orders
app.get('/orders', async (req, res) => {
    try {
        const orderQuerySnapshot = await db.collection(orderCollection).get();
        const orders: any[] = [];
        orderQuerySnapshot.forEach(
            (doc)=>{
                orders.push({
                    id: doc.id,
                    data:doc.data()
            });
            }
        );
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).send(error);
    }
});

//get a single contact
app.get('/orders/:orderId', (req,res) => {

    const orderId = req.params.orderId; 
    db.collection(orderCollection).doc(orderId).get()
    .then(order => {
        if(!order.exists) throw new Error('Order not found');
        res.status(200).json({id:order.id, data:order.data()})})
    .catch(error => res.status(500).send(error));
        
});


// Delete a order
app.delete('/orders/:orderId', (req, res) => {
    db.collection(orderCollection).doc(req.params.orderId).delete()
    .then(()=>res.status(204).send("Document successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})

// Update order
app.put('/orders/:orderId', async (req, res) => {
    await db.collection(orderCollection).doc(req.params.orderId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.orderId}))
    .catch((error)=> res.status(500).send(error))

});

interface Delivery {
    orderId: String,
    isDeliverd: Boolean,
}

// Create new delivery
app.post('/deliveries', async (req, res) => {
    try {
        const delivery: Delivery = {
            orderId: req.body['orderId'],
            isDeliverd: req.body['isDeliverd']
        }

        const newDoc = await db.collection(deliveryCollection).add(delivery);
        res.status(201).send(`Created a new delivery: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`Delivery should cointain orderId, isDeliverd !!`)
    }
});

//get all deliveries
app.get('/deliveries', async (req, res) => {
    try {
        const deliveryQuerySnapshot = await db.collection(deliveryCollection).get();
        const deliveries: any[] = [];
        deliveryQuerySnapshot.forEach(
            (doc)=>{
                deliveries.push({
                    id: doc.id,
                    data:doc.data()
            });
            }
        );
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).send(error);
    }
});

//get a single contact
app.get('/deliveries/:deliveryId', (req,res) => {

    const deliveryId = req.params.deliveryId; 
    db.collection(deliveryCollection).doc(deliveryId).get()
    .then(delivery => {
        if(!delivery.exists) throw new Error('Delivery not found');
        res.status(200).json({id:delivery.id, data:delivery.data()})})
    .catch(error => res.status(500).send(error));
        
});


// Delete a delivery
app.delete('/deliveries/:deliveryId', (req, res) => {
    db.collection(deliveryCollection).doc(req.params.deliveryId).delete()
    .then(()=>res.status(204).send("Document successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})

// Update delivery
app.put('/deliveries/:deliveryId', async (req, res) => {
    await db.collection(deliveryCollection).doc(req.params.deliveryId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.deliveryId}))
    .catch((error)=> res.status(500).send(error))

});
