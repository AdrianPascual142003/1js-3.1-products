
class View {

    renderProduct(product) {
        const productUI  = document.createElement('tr');
        productUI.id = "product-" + product.id;
        productUI.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.units}</td>
            <td>${product.price} €/u</td>
            <td>${product.productImport()}</td>
            <td></td>
        `

    const tbodyUI = document.querySelector('#almacen tbody');
    tbodyUI.appendChild(productUI);
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
        totalImportUI.innerHTML = totalImport;
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

}

module.exports=View;