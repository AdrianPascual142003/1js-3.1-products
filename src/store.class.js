'use strict'

const Category = require('./category.class');
const Product = require('./product.class');
const data = require('./datosIni.json');

// Aquí la clase Store

class Store {

    constructor(id,name) {
        this.id = id;
        this.name = name;
        this.products = [];
        this.categories = []; 
    }

    loadData() {
        data.categories.forEach(category => this.categories.push(new Category(category.id,category.name,category.description)));
        data.products.forEach(product => this.products.push(new Product(product.id,product.name,product.category,product.price,product.units)));
    }

    getCategoryById(id){
        let categoria = this.categories.find(category => category.id === id);
        if (!categoria) {
            throw Error("No hay ninguna categoria con el id " + id);
        }
        return categoria;
    }

    getCategoryByName(name) {
        let categoria = this.categories.find(category => category.name.toLocaleLowerCase() === name.toLocaleLowerCase());
        if (!categoria) {
            throw "No se ha encontrado ninguna categoría con el nombre " + name;
        }
        return categoria;
    }

    getProductById(id) {
        let producto = this.products.find(product => product.id === id);
        if (!producto) {
            throw "No se ha encontrado ningún producto con el id " + id;
        }
        return producto;
    }

    getProductsByCategory(id) {
        return this.products.filter(product => product.category === id);
    }

    addCategory(nombre, descripcion) {
        if (!nombre) {
            throw "Error! Has de introducir un nombre";
        }
        try {
            this.getCategoryByName(nombre);
        } catch {
            let categoriaNueva = new Category(this.getNextId(this.categories),nombre,descripcion);
            this.categories.push(categoriaNueva);
            return categoriaNueva;
        }
        throw "La categoría con nombre " + nombre + " ya existe";
    }

    getNextId(array) {
        return array.reduce((max,item) => item.id > max ? item.id : max,0) + 1;
    }

    addProduct(payload) {
        if (!payload.name) {
            throw "Error! El objeto ha de tener un nombre";
        }
        if (!payload.category) {
            throw "Error! El producto no tiene una categoria o no existe";
        }
        if (!payload.price || payload.price < 0 || isNaN(payload.price)) {
            throw "Error! El producto no tiene precio o este es negativo";
        }
        if (payload.units) {
            if (!Number.isInteger(payload.units) || payload.units < 0) {
                throw "Error! Las unidades no pueden ser negativas";
            }
        }
        this.getCategoryById(payload.category);
        let productoNuevo = new Product(this.getNextId(this.products),payload.name,payload.category,payload.price,payload.units);
        this.products.push(productoNuevo);
        return productoNuevo;
    }

    delCategory(id) {
        let category = this.getCategoryById(id);
        if (this.getProductsByCategory(id).length) {
            throw "Error! La categoría tiene productos";
        }
        let categoryIndex = this.categories.findIndex(category => category.id === id);
        this.categories.splice(categoryIndex,1);
        return category;
    }

    delProduct(id) {
        let producto = this.getProductById(id);
        if (producto.units > 0) {
            throw "Error! El producto contiene unidades";
        }
        let productIndex = this.products.findIndex(producto => producto.id === id);
        this.products.splice(productIndex,1);
        return producto;
    }

    totalImport() {
        return this.products.reduce((total,product) => total += product.productImport(),0);
    }

    orderByUnitsDesc() {
        return this.products.sort((product1, product2) => product2.units - product1.units);
    }

    orderByName() {
        return this.products.sort((product1,product2) => product1.name.localeCompare(product2.name));
    }

    underStock(units) {
        return this.products.filter((product) => product.units < units);
    }

    toString() {
        let cabecera = "Almacen" + this.id + " => " + this.products.length + " productos: " + this.totalImport().toFixed(2) + " €" + "\n"; 
        let productos = this.products.map(product => "- " + product + "\n").join('');
        return cabecera + productos;
    }

}

module.exports = Store

