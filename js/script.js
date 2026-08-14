const propuestaSwiper = new Swiper('.propuesta-swiper .product-swiper', {
  // Parámetros básicos
  slidesPerView: 1,      // 1 slide en móviles pequeños
  spaceBetween: 20,
  loop: false,           // Evita saltos en blanco al final si son pocos ítems
  
  // OBLIGATORIO: Fuerza a Swiper a recalcular dimensiones si el DOM cambia o carga tarde
  observer: true,
  observeParents: true,
  resizeObserver: true,

  // Paginación y navegación
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.icon-arrow-right',
    prevEl: '.icon-arrow-left',
  },

  // Breakpoints responsive
  breakpoints: {
    576: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 30,
    }
  }
});