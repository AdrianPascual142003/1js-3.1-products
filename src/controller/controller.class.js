const Store = require('../model/store.class');
const View = require('../view/view.class');

class Controller {
    constructor() {
        this.store = new Store(1, 'Almacén ACME');
        this.view = new View();
    }

    init() {
        this.store.loadData();
        this.view.setCategoryList(this.store.categories);
        this.view.setProductList(this.store.products);
        this.updateProductImport();
    }

    addProductToStore(formData) {
        try {
            const prod = this.store.addProduct(formData);
            this.view.renderProduct(prod);
            this.updateProductImport();
        } catch (err) {
            this.view.renderMessage(err);
        }

    }

    updateProductImport() {
        const totalImport = this.store.totalImport();
        this.view.updateProductImport(totalImport);
    }

    addCategoryToStore(formData) {
        try {
            const category = this.store.addCategory(formData.name,formData.description);
            this.view.addCategoryToCategoryList(category);
        } catch (err) {
            this.view.renderMessage(err);
        }
    }

    delProductFromStore(id) {
        try {
            const product = this.store.delProduct(id);
            this.view.removeProduct(product);
        } catch (err) {
            this.view.renderMessage(err);
        }
    }

    delCategoryFromStore(id) {
        try {
            const category = this.store.delCategory(id);
            this.view.removeCategory(category);
        } catch (err) {
            this.view.renderMessage(err);
        }
    }

}

module.exports=Controller;