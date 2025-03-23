fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const categories = {
      sale: document.getElementById("swiper_items_sale"),
      electronics: document.getElementById("swiper_elctronics"),
      appliances: document.getElementById("swiper_appliances"),
      mobiles: document.getElementById("swiper_mobiles"),
    };
    function addToCart(product) {
      if (!cart.some((item) => item.id === product.id)) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart)); // حفظ في localStorage
      }
    }

    // دالة لإنشاء منتج داخل HTML
    function createProductHTML(product, isSale) {
      const isInCart = cart.some((cartItem) => cartItem.id === product.id);
      const oldPriceHTML = product.old_price
        ? `<p class="old_price">$${product.old_price}</p>`
        : "";
      const discountHTML = product.old_price
        ? `<span class="sale_present">%${Math.floor(
            ((product.old_price - product.price) / product.old_price) * 100
          )}</span>`
        : "";

      return `
                <div class="swiper-slide product">
                    ${
                      isSale
                        ? `<span class="sale_present">%${Math.floor(
                            ((product.old_price - product.price) /
                              product.old_price) *
                              100
                          )}</span>`
                        : discountHTML
                    }
                    <div class="img_product">
                        <a href="#"><img src="${product.img}" alt=""></a>
                    </div>
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <p class="name_product"><a href="#">${product.name}</a></p>
                    <div class="price">
                        <p><span>$${product.price}</span></p>
                        ${oldPriceHTML}
                    </div>
                    <div class="icons">
                        <span  class="btn_add_cart ${
                          isInCart ? "active" : ""
                        }" data-id="${product.id}">
                            <i class="fa-solid fa-cart-shopping"></i> ${
                              isInCart ? "Item in cart" : "Add to cart"
                            }
                        </span>
                        <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                    </div>
                </div>
            `;
    }

    // إضافة المنتجات لكل قسم
    data.forEach((product) => {
      if (product.old_price) {
        categories.sale.innerHTML += createProductHTML(product, true);
      }
      if (product.catetory && categories[product.category]) {
        categories[product.catetory].innerHTML += createProductHTML(product);
      }
      if (product.catetory === "electronics") {
        categories.electronics.innerHTML += createProductHTML(product);
      }
      if (product.catetory === "appliances") {
        categories.appliances.innerHTML += createProductHTML(product);
      }
      if (product.catetory === "mobiles") {
        categories.mobiles.innerHTML += createProductHTML(product);
      }
    });
  })
  .catch((error) => console.error("Error fetching products:", error));
