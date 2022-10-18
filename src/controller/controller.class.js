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
        this.addEventLists(this.store.products);
        this.updateProductImport();
    }

    addProductToStore(formData) {
        try {
            const product = this.store.addProduct(formData);
            this.view.renderProduct(product);
            this.addEventList(product);
            this.updateProductImport();
        } catch (err) {
            this.view.renderMessage(err);
        }
    }

    editProduct(product) {
        try {
            const productEdit = this.store.editProduct(product);
            this.view.renderEditProduct(productEdit);
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

    addEventLists(products) {
        products.forEach(product => {
            this.addEventList(product);
        });
    }

    addEventList(product) {
        document.getElementById('delprod-' + product.id).addEventListener('click',() => {
            this.delProductFromStore(product.id);
        })
        document.getElementById('edit-' + product.id).addEventListener('click', () => {
            this.view.editProductForm(product);
        });
        const botonBajar = document.getElementById('lessquantity-' + product.id)
        product.units === 0 ? botonBajar.disabled = true : botonBajar.disabled = false;
        botonBajar.addEventListener('click',() => {
            if (product.units > 0) {
                product.units -= 1;
                this.editProduct(product); 
            }
           if (product.units == 0) {
            botonBajar.disabled = true;
           }
        })
        const botonSubir = document.getElementById('morequantity-' + product.id)
        botonSubir.addEventListener('click',() => {
            product.units += 1;
            if (product.units > 0) {
                botonBajar.disabled = false;
            }
            this.editProduct(product); 
        })
    }

    

}

module.exports=Controller;