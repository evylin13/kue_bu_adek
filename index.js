let navbar = document.querySelector('.navbar');
document.querySelector('#menu-bar').onclick = () => {
  navbar.classList.toggle('active');
};

let search = document.querySelector('.search');
document.querySelector('#search').onclick = () => {
  search.classList.toggle('active');
};

var swiper = new Swiper('.product-row', {
  spaceBetween: 30,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});
var swiper = new Swiper('.blogs-row', {
  spaceBetween: 30,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextE1: '.swiper-button-next',
    prevE1: '.swiper-button-prev',
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 1,
    },
    1024: {
      slidesPerView: 1,
    },
  },
});

var swiper = new Swiper('.review-row', {
  spaceBetween: 30,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Fungsi untuk mengambil data produk dari API
function fetchProducts() {
  fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((products) => {
      const productContainer = document.querySelector('.swiper-wrapper');
      productContainer.innerHTML = ''; // Kosongkan kontainer produk

      // Logika untuk menampilkan produk
      products.forEach((product) => {
        const productHTML = `
          <div class="swiper-slide product-box">
            <div class="img">
              <img src="http://localhost:3000${product.image}" alt="${product.nama}" />
            </div>
            <div class="product-content">
              <h3>${product.nama}</h3>
              <p>${product.deskripsi}</p>
              <p>Rp ${new Intl.NumberFormat('id-ID').format(product.harga)}</p>
              <div class="orderNow">
                <button data-id="${product.id}" data-price="${product.harga}" data-name="${product.nama}">Order Now</button>
              </div>
            </div>
          </div>
        `;
        productContainer.innerHTML += productHTML;
      });

      document.querySelectorAll('.orderNow button').forEach((button) => {
        button.addEventListener('click', (e) => {
          const selectedProduct = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: button.dataset.price,
          };

          showModal(selectedProduct);
        });
      });

      // Inisialisasi ulang Swiper
      new Swiper('.product-row', {
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        autoplay: {
          delay: 9500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
    })
    .catch((error) => console.error('Error fetching products:', error));
}

// Panggil fungsi fetchProducts saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();

  // Event listener untuk tombol close
  const closeModalButton = document.querySelector('.close');
  const modal = document.getElementById('orderModal');
  if (modal && closeModalButton) {
    closeModalButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
});

// Menampilkan Modal dan Mengirim Data
function showModal(product) {
  const modal = new bootstrap.Modal(document.getElementById('orderModal'));

  document.getElementById('productName').value = product.name;
  document.getElementById('quantity').value = 1;
  document.getElementById('totalPrice').value = product.price;

  document.getElementById('quantity').addEventListener('input', (e) => {
    const quantity = parseInt(e.target.value) || 1;
    document.getElementById('totalPrice').value = quantity * product.price;
  });

  modal.show();

  document.getElementById('orderForm').onsubmit = (e) => {
    e.preventDefault();
    const orderData = {
      nama: document.getElementById('customerName').value,
      product_id: product.id,
      quantity: parseInt(document.getElementById('quantity').value),
      total_price: parseFloat(document.getElementById('totalPrice').value),
    };

    fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        modal.style.display = 'none';
        document.getElementById('orderForm').reset();
      })
      .catch((error) => console.error('Error:', error));
  };
}
