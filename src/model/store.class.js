'use strict'

const Category = require('./category.class');
const Product = require('./product.class');
//const data = require('./datosIni.json');

const SERVER = 'http://localhost:3000';

// Aquí la clase Store

class Store {

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.products = [];
        this.categories = [];
    }

    productNameExists(id, name) {
        name = name.toLocaleLowerCase();
        if (this.products.find(product => product.id != id && product.name.toLocaleLowerCase() === name)) {
            return true;
        }
    }

    /*
    loadData() {
        data.categories.forEach(category => this.categories.push(new Category(category.id,category.name,category.description)));
        data.products.forEach(product => this.products.push(new Product(product.id,product.name,product.category,product.price,product.units)));
    }
    */


    async loadData() {
        const categories = await this.getTable('categories');
        categories.forEach(category => this.categories.push(new Category(category.id, category.name, category.description)));

        const products = await this.getTable('products');
        products.forEach(product => this.products.push(new Product(product.id, product.name, product.category, product.price, product.units)));
    }

    async getTable(table) {
        try {
            var response = await fetch(SERVER + '/' + table)
        } catch (error) {
            alert("Error en la conexión del servidor, asegurate de que esta conectado")
        }
        if (!response.ok) {
            throw ("Error " + response.statusText + " en la base de dades");
        }
        const objects = await response.json()
        return objects;
    }

    async deleteItem(table, item) {
        try {
            const response = await fetch(SERVER + '/' + table + '/' + item, {
                method: 'DELETE'
            })
        } catch (error) {
            throw "Error en la conexión del servidor, asegurate de que esta conectado"
        }
    }


    async saveItem(table, item) {
        try {
            var response = await fetch(SERVER + '/' + table, {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            throw "Error en la conexión del servidor, asegurate de que esta conectado"
        }
        if (!response.ok) {
            throw "Error " + response.status + " de la BBDD: " + response.statusText;
        }
        return await response.json();
    }

    async editProductInDB(product) {
        try {
            var response = await fetch(SERVER + '/products/' + product.id, {
                method: 'PUT',
                body: JSON.stringify(product),
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            throw "Error en la conexión del servidor, asegurate de que esta conectado"
        }
        if (!response.ok) {
            throw "Error " + response.status + " de la BBDD: " + response.statusText;
        }
        return await response.json();
    }

    getCategoryById(id) {
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

    async addCategory(nombre, descripcion) {
        if (!nombre) {
            throw "Error! Has de introducir un nombre";
        }
        try {
            this.getCategoryByName(nombre);
        } catch {
            let payload = {
                name: nombre,
                description: descripcion.length ? descripcion : "No hay descripción"
            }
            let categoryFromBD = await this.saveItem('categories', payload)
            let categoriaNueva = new Category(categoryFromBD.id, categoryFromBD.name, categoryFromBD.description.len7);
            this.categories.push(categoriaNueva);
            return categoriaNueva;
        }
        throw "La categoría con nombre " + nombre + " ya existe";
    }

    getNextId(array) {
        return array.reduce((max, item) => item.id > max ? item.id : max, 0) + 1;
    }

    async addProduct(payload) {
        payload.units = Number(payload.units);
        payload.category = Number(payload.category);
        payload.price = Number(payload.price);
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
        let productFromDB = await this.saveItem('products', payload)
        let productoNuevo = new Product(productFromDB.id, productFromDB.name, productFromDB.category, productFromDB.price, productFromDB.units);
        this.products.push(productoNuevo);
        return productoNuevo;
    }

    async editProduct(payload) {
        payload.id = Number(payload.id);
        payload.units = Number(payload.units);
        payload.category = Number(payload.category);
        payload.price = Number(payload.price);
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


        let productFormBD = await this.editProductInDB(payload)
        let productoEditado = this.getProductById(productFormBD.id);
        productoEditado.name = productFormBD.name;
        productoEditado.units = productFormBD.units;
        productoEditado.category = productFormBD.category;
        productoEditado.price = productFormBD.price;
        return productoEditado;
    }

    delCategory(id) {
        id = Number(id);
        let category = this.getCategoryById(id);
        if (this.getProductsByCategory(id).length) {
            throw "Error! La categoría tiene productos";
        }
        let categoryIndex = this.categories.findIndex(category => category.id === id);
        return this.categories.splice(categoryIndex, 1)[0];
    }

    async delProduct(id) {
        id = Number(id)
        let producto = this.getProductById(id);
        if (producto.units > 0) {
            throw "Error! El producto contiene unidades";
        }
        await this.deleteItem('products', producto.id);
        let productIndex = this.products.findIndex(producto => producto.id === id);
        return this.products.splice(productIndex, 1)[0];
    }

    totalImport() {
        return this.products.reduce((total, product) => total += product.productImport(), 0);
    }

    orderByUnitsDesc() {
        return this.products.sort((product1, product2) => product2.units - product1.units);
    }

    orderByName() {
        return this.products.sort((product1, product2) => product1.name.localeCompare(product2.name));
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

