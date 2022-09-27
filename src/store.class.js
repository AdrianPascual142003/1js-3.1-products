'use strict'

const Category = require('./category.class');
const Product = require('./product.class');

// Aquí la clase Store

class Store {

    constructor(id,name) {
        this.id = id;
        this.name = name;
        this.products = [];
        this.categories = []; 
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
        let productos = this.products.filter(product => product.category === id);
        return productos;
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
        this.getCategoryById(id);
        if (this.getProductsByCategory(id).length) {
            throw "Error! La categoría tiene productos";
        }
        let categoria = this.categories.pop(id);
        return categoria;
    }

    delProduct(id) {
        let producto = this.getProductById(id);
        if (producto.units > 0) {
            throw "Error! El producto contiene unidades";
        }
        this.products.pop(producto);
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

