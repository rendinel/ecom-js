// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-btn');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');



//empty cart to fill from local storage
let cart = [];
//1- we create the class products where we create the asyncronous function getProducts, with this function we take the data (fetch) 
// from products.json with the await method so the page don't crush if something don't come back, then inside data we convert the into a json (always with await so we don't have problem if something don't come back)
// then we store the data in a json format inside products an convert them into a more readable array with the map method, where we define what fields from the json are equal to our new const(title price id and image)
// and we return them , we put everything inside try and catch so we can throw an error if something wrong appen
//getting the products
class Products{
 async getProducts(){
    try{
        let result = await fetch("products.json");
        let data = await result.json();
        let products = data.items;
        products = products.map(item =>{
            const {title,price} = item.fields;
            const {id} = item.sys;
            const image = item.fields.image.fields.file.url;
            return {title,price,id,image}
        })
        return products
    } catch{
        console.log(error);
    }
 }
}

//3-display products, we define a method displayProducts to whom we pass the products from getProducts,we define an empy let result, we loop the array with a foreach cycle and then with a template literal we print the
//products pulling some data from the product array , then we select the div that contain this with productsDom and we way is innerHtml is equal to our template literal
//6-we create a getBagbuttons method where we access all the buttons with class .bag-btn (we can't access them outside of the class) and put them inside [...]
//so they return an array
class UI{
    displayProducts(products){
        let result = '';
        products.forEach(product => {
            result += `
            <article class="product">
            <div class="img-container">
            <img src=${product.image} alt="" class="product-img">
            <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart">Add to bag</i>
            </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
            </article>
            `;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        console.log(buttons);
    }
}

//local storage
//4-we create a static method that take the products as an argument and store the inside the localStorage with localStorage.setItem
 // inside the parethesis we pass the keyname products and the keyvalue products but we need to Json.stringify to convert the object to a jsons string
class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
}

// 2- we add a eventlistener that wait for a content to be load into the dom, we initialize 2 new object products and ui and with prodcuts we get all the products from the getProducts function from step 1
//and we display the products inside the dom thanks to the displayproducts function inside ui 
//5-we call the Storage.saveProducts and padd it the products from the getProducts ,method
document.addEventListener("DOMContentLoaded",()=>{
    const ui = new UI();
    const products = new Products();
    //get all products
    products.getProducts().then(products => {
        ui.displayProducts(products)
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
    });
});