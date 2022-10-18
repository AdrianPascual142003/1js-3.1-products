
class View {

    init() {
        document.getElementById('showProductList').addEventListener('click', (event) => {
            event.preventDefault();
            this.showById('almacen');
        })
        document.getElementById('showCategoryList').addEventListener('click', (event) => {
            event.preventDefault();
            this.showById();
        })
        document.getElementById('showAddProduct').addEventListener('click', (event) => {
            event.preventDefault();
            this.showById('new-prod');
        })
        document.getElementById("showAddCategory").addEventListener('click', (event) => {
            event.preventDefault();
            this.showById('add-category');
        })
        document.getElementById('showSobreNosotros').addEventListener('click', (event) => {
            event.preventDefault();
            this.showById('sobre-nosotros');
        })
    }

    renderProduct(product) {
        const productUI  = document.createElement('tr');
        productUI.id = "product-" + product.id;
        productUI.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.units}</td>
            <td>${product.price} €/u</td>
            <td>${product.productImport().toFixed(2)}</td>
            <td>
            <button class="btn btn-secondary" id="morequantity-${product.id}" value="morequantity-${product.id}">
                <span class="material-icons">expand_less</span>
            </button>
            <button class="btn btn-secondary" id="lessquantity-${product.id}" value="lessquantity-${product.id}">
                <span class="material-icons">expand_more</span>
            </button>
            <button class="btn btn-secondary" id="delprod-${product.id}" value="delprod-${product.id}">
                <span class="material-icons">delete</span>
            </button>
            <button class="btn btn-secondary" id="edit-${product.id}" value="edit-${product.id}">
                <span class="material-icons">edit</span>
            </button>
            </td>
        `;
    const tbodyUI = document.querySelector('#almacen tbody');
    tbodyUI.appendChild(productUI);
    }

    editProductForm(product) {
        const addProductUI = document.getElementById('tablaProd').textContent = "Modificar Producto";
        document.getElementById('newprod-id').value = product.id;
        document.getElementById('newprod-name').value = product.name;
        document.getElementById('newprod-category').value = product.category;
        document.getElementById('newprod-units').value = product.units;
        document.getElementById('newprod-price').value = product.price;
        document.getElementById('botonProd').innerHTML = "Cambiar";
    }

    removeProduct(product) {
        const productUI = document.getElementById("product-" + product.id);
        productUI.remove();
    }
    
    renderMessage(message) {
        const messageUI = document.getElementById('messages');
        const alerta = document.createElement('div');
        alerta.className = "alert alert-danger alert-dismissible";
        alerta.role = "alert";
        alerta.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="this.parentElement.remove()"></button>    
        `
        messageUI.appendChild(alerta);
        
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

    setCategoryList(categories) {
        const categoryList = document.getElementById("newprod-category");
        categories.forEach(category => {
            let newOption = document.createElement("option");
            newOption.label = category.name;
            newOption.id = "cat-" + category.id;
            newOption.value = category.id;
            categoryList.add(this.mapCategory(category));
        });
    }

    addCategoryToCategoryList(category) {
        const categoryList = document.getElementById("newprod-category");
        categoryList.add(this.mapCategory(category));
    }

    mapCategory(category) {
        let newOption = document.createElement("option");
        newOption.label = category.name;
        newOption.id = "cat-" + category.id;
        newOption.value = category.id;
        return newOption;
    }

    updateProductImport(totalImport) {
        const totalImportUI = document.getElementById('total-import')
        totalImportUI.innerHTML = totalImport.toFixed(2);
    }

    setProductList(products) {
        products.forEach(product => {
            this.renderProduct(product);
        });
    }
    
    removeCategory(category) {
        const categoryOption = document.getElementById("cat-" + category.id);
        categoryOption.remove();
    }

    renderEditProduct(product) {
        const productTr = document.getElementById('product-' + product.id);
        productTr.children[1].innerHTML = product.name;
        productTr.children[2].innerHTML = product.category;
        productTr.children[3].innerHTML = product.units;
        productTr.children[4].innerHTML = product.price + " €/u";
        productTr.children[5].innerHTML = product.productImport().toFixed(2);
    }

    hideAll() {
        document.getElementById('almacen').classList.add('oculto');
        document.getElementById('new-prod').classList.add('oculto');
        document.getElementById('add-category').classList.add('oculto');
        document.getElementById('del-prod').classList.add('oculto');
        document.getElementById('del-category').classList.add('oculto');
        document.getElementById('sobre-nosotros').classList.add('oculto');
    }

    showById(id) {
        this.hideAll();
        document.getElementById(`${id}`).classList.remove('oculto');
    }

}

module.exports=View;