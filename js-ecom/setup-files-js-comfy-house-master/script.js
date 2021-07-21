// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

//empty cart to fill from local storage
let cart = [];

//buttons now is an empty array but it will fill as soon as i executed getBagButtons and fill with the buttons from the method
let buttonsDom = [];

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
//so they return an array,after we cycle the array with a foreach that return inside id all the id of the array then we use the find method
// inside the cart and if the item id is equal to the id of the btn the innerText of the button will change to in cart and the button will be disable, after that when we click we will do the same to the event.target
class UI{
    displayProducts(products){
        let result = '';
        products.forEach(product => {
            result += `
            <article class="product">
            <div class="img-container">
            <img src=${product.image} alt="" class="product-img">
            <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart">Add to cart</i>
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
        buttonsDom = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart){
                button.innerText = "In Cart";
                button.disabled = true;
            } 
        button.addEventListener('click',(event)=>{
            event.target.innerText = "In Cart";
            event.target.disabled = true;
            //7-get product from products inside storage we create a getProduct function where we pass the id as a parameter with the json parse we store the products inside the localStorage and we return the product.id 
            //with the same id, then i set cartitem to be equal to the methodgetproduct inside storage and i pass the id to it
            // we use the spread the operator so it return an object with the data and the amount of 1
            let cartItem = {...Storage.getProduct(id),amount:1};

            //8-add product to the cart, we add the cartItem to the cart with a spread operator
            cart = [...cart,cartItem];
            //9-save cart in local storage we save the item in the localstorage with the saveCart function insdide Storage class
            Storage.saveCart(cart);
            //10-set cart value, we use this to acess the setcartValue we define , we pass the cart as a parameter, then we
            // define the itemstotal and temptotal at 0, we create an array from cart that define the value of the 2 total
            //we set the innerhtml of the 2 value to show them in html 
            this.setCartValues(cart);
            //11-display cart item, with the addCartItem we pass the item to this new function,we create a div,we add the css class with classlist , we create the timplete literal and we pull some data from the item
            // we display the content inside cartContent with the appendChild
            this.addCartItem(cartItem)
            //12-show cart we create showcart that add 2 class when we add item in the shopping cart
            this.showCart();
            });
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        //parseFloat because tofixed return a string
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="">
        <div>
            <h4>${item.title}</h4>
            <h5>$ ${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>Remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
        `;
        cartContent.appendChild(div);
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    // 14-,inside SetupApp we define that the cart is equal to this method,we reuse setcartvalues and populatecart passing cart to them
    // we reuse showcart to open the cart if we click on the cart icon and we close the cart if we click on it after define the hide method,
    // we create the populate cart function where we loop though the addcartitem and use it to populate the cart
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click',this.hideCart);
    }
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    cartLogic(){
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart></i> add to cart`
    }
    getSingleButton(id){
        return buttonsDom.find(button => button.dataset.id === id);
    }
}

//local storage
//4-we create a static method that take the products as an argument and store the inside the localStorage with localStorage.setItem
// inside the parethesis we pass the keyname products and the keyvalue products but we need to Json.stringify to convert the object to a jsons string
//13- with the function getcart we verify if there is the cart stored inside the localstorage,if there is we will save inside the localstorage
//otherwise the cart will be empty
class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];  
    }
}

// 2- we add a eventlistener that wait for a content to be load into the dom, we initialize 2 new object products and ui and with prodcuts we get all the products from the getProducts function from step 1
//and we display the products inside the dom thanks to the displayproducts function inside ui 
//5-we call the Storage.saveProducts and padd it the products from the getProducts ,method
document.addEventListener("DOMContentLoaded",()=>{
    const ui = new UI();
    const products = new Products();
    //setup app
    ui.setupAPP();
    //get all products
    products.getProducts().then(products => {
        ui.displayProducts(products)
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
        ui.cartLogic();
    });
});