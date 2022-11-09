const Store = require('../model/store.class');
const View = require('../view/view.class');

class Controller {
    constructor() {
        this.store = new Store(1, 'Almacén ACME');
        this.view = new View();
    }

   async init() {
        this.view.init();
        await this.store.loadData();
        this.view.setCategoryList(this.store.categories);
        this.view.setProductList(this.store.products);
        this.addCategoryToList(this.store.categories);
        this.addEventLists(this.store.products);
        this.getValuesFromForm()
        this.setListeners();
        this.updateProductImport();
        this.view.showById('almacen');
    }

    async addProductToStore(formData) {
        try {
            const product = await this.store.addProduct(formData);
            this.view.renderProduct(product);
            this.addEventList(product);
            this.updateProductImport();
        } catch (err) {
            this.view.renderMessage(err);
        }
    }

    async editProduct(product) {
        try {
            const productEdit = await this.store.editProduct(product);
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

    async addCategoryToStore(formData) {
        try {
            const category = await this.store.addCategory(formData.name, formData.description);
            this.view.renderCategory(category);
            this.view.addCategoryToCategoryList(category);
        } catch (err) {
            this.view.renderMessage(err);
        }
    }

    async delProductFromStore(id) {
        try {
            const product = await this.store.delProduct(id);
            this.view.removeProduct(product);
        } catch (err) {
            this.view.renderMessage(err);
        }
    }

    async delCategoryFromStore(id) {
        try {
            const category = await this.store.delCategory(id);
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
        document.getElementById('delprod-' + product.id).addEventListener('click', () => {
            this.delProductFromStore(product.id);
        })
        document.getElementById('edit-' + product.id).addEventListener('click', () => {
            this.view.showById('new-prod')
            this.view.editProductForm(product);
        });
        const botonBajar = document.getElementById('lessquantity-' + product.id)
        product.units === 0 ? botonBajar.disabled = true : botonBajar.disabled = false;
        botonBajar.addEventListener('click', () => {
            if (product.units > 0) {
                product.units -= 1;
                this.editProduct(product);
            }
            if (product.units == 0) {
                botonBajar.disabled = true;
            }
        })
        const botonSubir = document.getElementById('morequantity-' + product.id)
        botonSubir.addEventListener('click', () => {
            product.units += 1;
            if (product.units > 0) {
                botonBajar.disabled = false;
            }
            this.editProduct(product);
        })
    }

    addCategoryToList(categories) {
        categories.forEach(category => {
            this.view.renderCategory(category);
        })
    }


    getValuesFromForm() {
            document.getElementById('new-prod').addEventListener('submit', (event) => {
                event.preventDefault();
                this.setListeners();
                if (document.getElementById('new-prod').checkValidity()) {
                    const id = document.getElementById('newprod-id').value
                    const name = document.getElementById('newprod-name').value
                    const category = document.getElementById('newprod-category').value
                    const units = document.getElementById('newprod-units').value
                    const price = document.getElementById('newprod-price').value
                    if (!id) {
                        this.addProductToStore({ name, category, units, price });
                    } else {
                        this.editProduct({ id, name, category, units, price })
                    }
                    this.view.showById('almacen')
                }else {
                    this.setErrorMessage('newprod-name');
                    this.setErrorMessage('newprod-category');
                    this.setErrorMessage('newprod-units');
                    this.setErrorMessage('newprod-price');
                }
            })
            document.getElementById('add-category').addEventListener('submit', (event) => {
                event.preventDefault()
                const id = document.getElementById('newcategory-id').value
                const name = document.getElementById('newcategory-name').value
                const description = document.getElementById('newcategory-description').value
                this.addCategoryToStore({ id, name, description })
                this.view.showById('category-list');
            })

            //document.getElementById('newprod-id').addEventListener('blur', this.editProduct())
    }

    setListener(idInput) {
        const input = document.getElementById(idInput)
        input.addEventListener('blur', () => {
            input.nextElementSibling.textContent = input.validationMessage;
        })
    }

    setErrorMessage(idInput) {
        const input = document.getElementById(idInput)
        input.nextElementSibling.textContent = input.validationMessage;
    }

    setListeners() {
        const inputName = document.getElementById("newprod-name")
        inputName.addEventListener('blur', () => {
            inputName.setCustomValidity('');
            if (this.store.productNameExists(document.getElementById("newprod-id"), inputName.value)) {
                inputName.setCustomValidity('El producto ya existe');
            }
            inputName.nextElementSibling.textContent = inputName.validationMessage;
        })
        this.setListener('newprod-category');
        this.setListener('newprod-units');
        this.setListener('newprod-price');
    }
}

module.exports = Controller;