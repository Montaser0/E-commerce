// فتح وإغلاق قائمة التصنيفات
let category_nav_list = document.querySelector(".category_nav_list");
function Open_Categ_list() {
  category_nav_list.classList.toggle("active");
}
let nav_links = document.querySelector(".nav_links");
function Open_close_menu() {
    nav_links.classList.toggle("active");
}

// فتح وإغلاق السلة
let cartElement = document.querySelector(".cart");
function open_close_cart() {
  cartElement.classList.toggle("active");
}

// استيراد بيانات المنتجات
fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn_add_cart")) {
        const productId = Number(event.target.getAttribute("data-id")); // تحويل إلى رقم
        const selectedProduct = data.find(
          (product) => product.id === productId
        );
        if (selectedProduct) {
          addToCart(selectedProduct, event.target);
        }
      }
    });

    // تحديث حالة الأزرار عند تحميل الصفحة
    updateCart();
  })
  .catch((error) => console.error("Error fetching products:", error));

// إضافة المنتج إلى السلة مع تحديث الكمية والسعر الإجمالي
function addToCart(product, button) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity++;
    existingProduct.totalPrice =
      existingProduct.quantity * existingProduct.price; // تحديث السعر الإجمالي
  } else {
    cart.push({ ...product, quantity: 1, totalPrice: product.price });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
    const cartItemContainer = document.getElementById("cart_items");
    const totalPriceContainer = document.querySelector(".price_cart_total"); // العنصر الصحيح لإجمالي السعر
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemContainer.innerHTML = "";

    let totalCartPrice = 0; // إجمالي السعر الكلي

    cart.forEach((item, index) => {
        item.totalPrice = item.price * item.quantity; // تحديث السعر الإجمالي لكل منتج
        totalCartPrice += item.totalPrice; // حساب الإجمالي الكلي

        cartItemContainer.innerHTML += `
        <div class="item_cart" data-id="${item.id}">
            <img src="${item.img}" alt="Product Image">
            <div class="content">
                <h4>${item.name}</h4>
                <p class="price_cart">$<span class="item_price">${item.totalPrice}</span></p> <!-- السعر الديناميكي -->
                <div class="quantity_control">
                    <button class="decrease_quantity" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase_quantity" data-index="${index}">+</button>
                </div>
            </div>
            <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;
    });

    // تحديث إجمالي السعر الكلي
    totalPriceContainer.innerHTML = `$${totalCartPrice}`;

    // **إضافة أحداث النقر للأزرار بعد التحديث**
    document.querySelectorAll('.increase_quantity').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            cart[index].quantity++;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });

    document.querySelectorAll('.decrease_quantity').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1); // حذف المنتج إذا أصبحت الكمية صفر
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });

    document.querySelectorAll('.delete_item').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            cart.splice(index, 1); // حذف المنتج
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });
    document.querySelectorAll('.btn_add_cart').forEach(button => {
        const productId = Number(button.getAttribute('data-id'));
        button.classList.toggle('active', cart.some(item => item.id === productId));
        button.innerHTML = cart.some(item => item.id === productId)
            ? `<i class="fa-solid fa-cart-shopping"></i> Item in cart`
            : `<i class="fa-solid fa-cart-shopping"></i> Add to cart`;
    });
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let count = document.querySelector(".count_item_header");
        count.innerText = cart.length; // تعيين عدد العناصر في السلة
        let countInCart = document.querySelector(".Count_item_cart");
        countInCart.innerText = cart.length; 
    }
  
    
    // استدعاء الدالة عند تحميل الصفحة لضمان تحديث العدد
    updateCartCount();
    
}

document.getElementById("send_to_whatsapp").addEventListener("click", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  if (cart.length === 0) {
      alert("السلة فارغة، أضف بعض المنتجات أولًا!");
      return;
  }

  let message = `🛒 *طلب جديد من المتجر*\n\n`; // عنوان الرسالة

  cart.forEach((item, index) => {
      message += `📌 *${index + 1} - ${item.name}*\n`;
      message += `📦 الكمية: ${item.quantity}\n`;
      message += `💰 السعر: ${item.price} × ${item.quantity} = ${item.price * item.quantity} $\n\n`;
  });

  let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `----------------------\n`;
  message += `📢 *المجموع الكلي:* ${totalPrice} $\n\n`;
  message += `🚀 *يرجى تأكيد الطلب*`;

  // تحويل النص إلى رابط واتساب
  let phoneNumber = "905316924944"; // رقم المبيعات (يجب استبداله برقمك)
  let whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // فتح رابط واتساب
  window.open(whatsappUrl, "_blank");

  // بعد الإرسال، حذف السلة من localStorage
  localStorage.removeItem("cart");
  updateCart(); // تحديث واجهة السلة بعد الحذف
});

