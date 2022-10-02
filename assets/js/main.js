// Selcet Input
const titleInput = document.querySelector('[placeholder="Product Name"]');
const priceInput = document.querySelector('[placeholder="Price"]');
const taxInput = document.querySelector('[placeholder="Tax"]');
const adsInput = document.querySelector('[placeholder="Ads"]');
const discountInput = document.querySelector('[placeholder="Discount"]');
const countInput = document.querySelector('[placeholder="Count"]');
const categoryInput = document.querySelector('[placeholder="Category"]');
////////////////////////////////////////////////////////////////////////////
const pupop = document.querySelector(".pupop-container");
const yesBtn = document.querySelector('[value="yse"]')
const noBtn = document.querySelector('[value="no"]')
const message = document.querySelector(".message")
///////////////////////////////////////////////////////////////////////////
const searchProductName = document.querySelector('[placeholder="Search By Product Name"]');
const searchCategory = document.querySelector('[placeholder="Search By Category"]');
//////////////////////////////////////////
const totalSpan = document.querySelector(".total span");
// Select Button
const createBtn = document.querySelector('[value="Create"]');
const deleteAllBtn = document.querySelector(".delete-all");
const resetBtn = document.querySelector('[value="Reset"]');
/////////////////////////////////////////////////////////////////////////
// let localStorageData = JSON.parse(localStorage.getItem("products"));
/////////////////////////////////////////////////////////////////////////
let productId = false;
let productIdx;
/////////////////////////////////////////////////////////////////////////
let deleteFilter = true;
let searchByCategory = true;

////////////////////////////////////////////////////////
// Start Functions ////////////////////////////////////

////////////////////////////////////////////////////////
// get Data From LocalStorage in Start application
if (localStorage.getItem("products")) {
    const tableTbody = document.querySelector("tbody")
    const localStorageData = JSON.parse(localStorage.getItem("products"));
    viewProduct(localStorageData)
};
////////////////////////////////////////////////////////
// Reset Inputs and Total Price 
resetBtn.addEventListener("click", () => {
    totalSpan.innerHTML = `Total:0`
});
////////////////////////////////////////////////////////
// get Total Price Function
document.addEventListener("keyup", () => {
    totalSpan.innerHTML = `Total:${+priceInput.value + +taxInput.value + +adsInput.value - +discountInput.value}`
});
////////////////////////////////////////////////////////
// add Products Function
createBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const productData = {
        productName: titleInput.value,
        price: priceInput.value,
        tax: taxInput.value ? taxInput.value : 0,
        ads: adsInput.value ? adsInput.value : 0,
        disc: discountInput.value ? discountInput.value : 0,
        total: +priceInput.value + +taxInput.value + +adsInput.value - +discountInput.value,
        category: categoryInput.value,
    }
    if (!productId) {
        if (productData.productName === "" || productData.price === "" || productData.category === "") {
            return false
        } else {
            saveData(countInput.value ? countInput.value : 1, productData);
            countInput.value = "";
            showData()
            deleteAll()
        }
    } else {
        const localStorageData = JSON.parse(localStorage.getItem("products"));
        localStorageData[productIdx] = productData;
        localStorage.removeItem("products")
        localStorage.setItem("products", JSON.stringify(localStorageData))
        countInput.value = "";
        showData()
        productId = false;
        createBtn.setAttribute("value", "Create")
    }
    // Clear Inputs
    titleInput.value = "";
    priceInput.value = "";
    taxInput.value = "";
    adsInput.value = "";
    discountInput.value = "";
    categoryInput.value = "";
});
////////////////////////////////////////////////////////
// Save Data In Local Storage
function saveData(num, data) {
    let arrData = [];
    if (localStorage.getItem("products")) {
        const oldProducts = JSON.parse(localStorage.getItem("products"));
        arrData.push(...oldProducts)
        for (let i = 1; i <= num; i++) {
            arrData.push(data)
        }
        localStorage.removeItem("products")

    } else {
        for (let i = 1; i <= num; i++) {
            arrData.push(data)
        }
    }
    localStorage.setItem("products", JSON.stringify(arrData))

};
////////////////////////////////////////////////////////
// Show Data From LocalStorage in application
function showData() {
    const localStorageData = JSON.parse(localStorage.getItem("products"));
    viewProduct(localStorageData)
    totalSpan.innerHTML = `Total:0`
};
////////////////////////////////////////////////////////
function viewProduct(arr) {
    const tableTbody = document.querySelector("tbody")
    document.querySelectorAll("tbody tr").forEach(ele => ele.remove());
    arr.forEach((product, index) => {
        tableTbody.innerHTML += `<tr class="title-row p-15 c-fff txt-center">
                                    <td>${index + 1}</td>
                                    <td>${product.productName}</td>
                                    <td>${product.price}</td>
                                    <td>${product.tax}</td>
                                    <td>${product.ads}</td>
                                    <td>${product.disc}</td>
                                    <td>${product.total}</td>
                                    <td>${product.category}</td>
                                    <td><button onClick="updateData(${index})">update</button></td>
                                    <td><button onClick="deleteProduct(${index})">Delete</button></td>
                                </tr>`
    })
}
////////////////////////////////////////////////////////
// Update Data Function 
function updateData(idx) {
    productId = true
    productIdx = idx
    createBtn.setAttribute("value", "Update")
    const localStorageData = JSON.parse(localStorage.getItem("products"));
    const product = localStorageData.filter((ele, index) => {
        if (index == idx) {
            return ele
        }
    })
    titleInput.value = product[0].productName;
    priceInput.value = product[0].price;
    taxInput.value = product[0].tax;
    adsInput.value = product[0].ads;
    discountInput.value = product[0].disc;
    categoryInput.value = product[0].category;
}
////////////////////////////////////////////////////////
// Delete Product Function 
function deleteProduct(idx) {
    const localStorageData = JSON.parse(localStorage.getItem("products"));
    localStorageData.splice(idx, 1)
    localStorage.removeItem("products")
    localStorage.setItem("products", JSON.stringify(localStorageData))
    showData()
    deleteAll()
}
////////////////////////////////////////////////////////
// Delete All Products Function 
function deleteAll() {
    deleteAllBtn.style.display = "none"
    if (localStorage.getItem("products")) {
        const localStorageData = JSON.parse(localStorage.getItem("products"));
        if (localStorageData.length > 0) {
            deleteAllBtn.style.display = "block";
            deleteAllBtn.setAttribute("value", `DeleteAll (${localStorageData.length})`)
            deleteAllBtn.addEventListener("click", (e) => {
                e.preventDefault()
                if (!deleteFilter) {
                    pupop.style.display = "flex"
                    message.innerHTML = "Are You Sure you Want Delete All Filter Product"
                    let finalArr = []
                    if (!searchByCategory) {
                        const localStorageData = JSON.parse(localStorage.getItem("products"));
                        var arr = localStorageData.filter(ele => !ele.category.startsWith(searchCategory.value))
                        finalArr.push(...arr)
                    } else {
                        const localStorageData = JSON.parse(localStorage.getItem("products"));
                        var arr = localStorageData.filter(ele => !ele.productName.startsWith(searchProductName.value))
                        finalArr.push(...arr)
                    }
                    yesBtn.addEventListener("click", () => {
                        localStorage.removeItem("products")
                        console.log(finalArr)
                        localStorage.setItem("products", JSON.stringify(finalArr))
                        viewProduct(finalArr)
                        if (finalArr.length > 0) {

                            deleteAllBtn.setAttribute("value", `DeleteAll (${finalArr.length})`)
                        } else {
                            deleteAllBtn.style.display = "none";
                        }
                        pupop.style.display = "none"
                        deleteFilter = true;
                        searchByCategory = true;
                        searchProductName.value = ""
                        searchCategory.value = ""
                    })
                    noBtn.addEventListener("click", () => {
                        pupop.style.display = "none"
                    })
                } else {
                    pupop.style.display = "flex"
                    message.innerHTML = "Are You Sure you Want Delete All Product"
                    yesBtn.addEventListener("click", () => {
                        localStorage.removeItem("products")
                        document.querySelectorAll("tbody tr").forEach(ele => ele.remove());
                        deleteAllBtn.style.display = "none";
                        pupop.style.display = "none"
                        searchProductName.value = ""
                    })
                    noBtn.addEventListener("click", () => {
                        pupop.style.display = "none"
                    })
                }

            })
        } else {
            deleteAllBtn.style.display = "none";
        }
    }
}; deleteAll();
////////////////////////////////////////////////////////
// Search By Product Name & Category
searchProductName.addEventListener("input", () => {
    deleteFilter = false;
    const localStorageData = JSON.parse(localStorage.getItem("products"));
    const filterProducts = localStorageData.filter(ele => ele.productName.startsWith(searchProductName.value))
    deleteAllBtn.setAttribute("value", `DeleteAll (${filterProducts.length})`);
    viewProduct(filterProducts)
})
////////////////////////////////////////////////////////
searchCategory.addEventListener("input", () => {
    deleteFilter = false;
    searchByCategory = false;
    const localStorageData = JSON.parse(localStorage.getItem("products"));
    const filterProductName = localStorageData.filter(ele => ele.category.startsWith(searchCategory.value))
    deleteAllBtn.setAttribute("value", `DeleteAll (${filterProductName.length})`)
    viewProduct(filterProductName)
})
