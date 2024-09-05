/*const path = require('path');
const homeController = require('../app/http/controllers/homeController');
const orderController = require('../app/http/controllers/orderController');
const menuController = require('../app/http/controllers/menuController');


//const guest = require('../app/http/middlewares/guest');
//const auth = require('../app/http/middlewares/auth');
function initRoutes(app){
    //storing routes
    app.get('/',homeController().index1);
    app.get('/featured', menuController().index1);
    app.get('/acc', menuController().index2);
    app.get('/art', menuController().index3);
    app.get('/apparel', menuController().index4);
    app.get('/coll', menuController().index5);
    app.get('/sale', menuController().index6);

   
    
    app.get('/chat', (req, res) => {
        res.render('chat');
    });
    app.get('/indexchat', (req, res) => {
        res.render('indexchat');
    });
    app.get('/media', (req, res) => {
        res.render('media');
    });
    app.get('/news', (req, res) => {
        res.render('news');
    });
    app.get('/cart', cartController().index1);
    app.post('/update-cart', cartController().update);

    app.get('/orders', orderController().index1);
    app.post('/orders', orderController().store);
}
//in node project every file is a module and modules can be exported
module.exports = initRoutes; //exporting this function
*/