const mongoose = require('mongoose');
const Schema = mongoose.Schema; //class or constructor func if starting with capital letter
const menuSchema = new Schema({
    name: { type: String, require:true},
    image: { type: String, require:true},
    price: { type: Number, require:true}
}); //blueprint of things in database

//creating model and exporting
const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;