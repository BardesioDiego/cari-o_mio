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
document.addEventListener('DOMContentLoaded', () => {
      function initSwiper() {
        document.querySelectorAll('.init-swiper').forEach((swiperElement) => {
          let config = {
            loop: true,
            speed: 600,
            autoplay: { delay: 5000 },
            slidesPerView: "auto",
            pagination: {
              el: ".swiper-pagination",
              type: "bullets",
              clickable: true
            }
          };

          const configScript = swiperElement.querySelector('.swiper-config');
          if (configScript) {
            try {
              config = JSON.parse(configScript.innerHTML.trim());
            } catch (error) {
              console.error("Error al parsear el JSON de Swiper:", error);
            }
          }

          new Swiper(swiperElement, config);
        });
      }

      window.addEventListener('load', initSwiper);
    });

    jQuery(function($) {
      // billboard anchors (keep inert)
      var billboardItems = $('#billboard .main-gallery-item');
      // service images will open the gallery
      var serviceImages = $('#service .product-image');
      var currentIndex = 0;
      var urls = serviceImages.map(function() {
        return $(this).attr('src');
      }).get();
      var titles = serviceImages.map(function() {
        var $item = $(this).closest('.product-item');
        var title = $item.find('.product-content h5 p').first().text().trim();
        if (!title) {
          // fallback to alt or filename
          title = $(this).attr('alt') || ($(this).attr('src') || '').split('/').pop();
        }
        return title;
      }).get();

      function updateGallery() {
        if (!urls || urls.length === 0) {
          $('.main-gallery-image').attr('src', '');
          $('.main-gallery-counter').text('Imagen no disponible');
          $('.main-gallery-prev, .main-gallery-next').hide();
          return;
        }
        // ensure currentIndex is integer within range
        currentIndex = ((currentIndex % urls.length) + urls.length) % urls.length;
        var src = urls[currentIndex] || '';
        $('.main-gallery-image').attr('src', src);
        var label = titles[currentIndex] || ('Imagen ' + (currentIndex + 1) + ' de ' + urls.length);
        $('.main-gallery-counter').text(label);
        // show/hide nav depending on number of items
        if (urls.length > 1) {
          $('.main-gallery-prev, .main-gallery-next').show();
        } else {
          $('.main-gallery-prev, .main-gallery-next').hide();
        }
      }

      function showGallery(index) {
        if (!urls || urls.length === 0) return;
        currentIndex = index >= 0 ? index : 0;
        updateGallery();
        $('#main-gallery-overlay').addClass('open').attr('aria-hidden', 'false');
      }

      function hideGallery() {
        $('#main-gallery-overlay').removeClass('open').attr('aria-hidden', 'true');
      }

      function initMainGallery() {
        // disable default behavior on billboard anchors (no zoom)
        billboardItems.off('click.mainGallery').on('click.mainGallery', function(e) {
          e.preventDefault();
        });

        // bind clicks on service images to open the overlay
        serviceImages.off('click.mainGallery').on('click.mainGallery', function(e) {
          e.preventDefault && e.preventDefault();
          var src = $(this).attr('src');
          currentIndex = urls.indexOf(src);
          if (currentIndex === -1) currentIndex = 0;
          showGallery(currentIndex);
        });

        // touch swipe support for overlay
        var touchStartX = 0;
        var touchEndX = 0;
        var swipeThreshold = 40;

        $('#main-gallery-overlay .main-gallery-frame').off('touchstart.mainGallery touchend.mainGallery').on('touchstart.mainGallery', function(e) {
          touchStartX = e.originalEvent.touches[0].clientX;
        }).on('touchend.mainGallery', function(e) {
          touchEndX = e.originalEvent.changedTouches[0].clientX;
          var diff = touchEndX - touchStartX;
          if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
              // swipe right -> previous
              currentIndex = (currentIndex - 1 + urls.length) % urls.length;
              updateGallery();
            } else {
              // swipe left -> next
              currentIndex = (currentIndex + 1) % urls.length;
              updateGallery();
            }
          }
        });
      }

      $('.main-gallery-close').on('click', hideGallery);
      $('.main-gallery-prev').on('click', function() {
        if (!urls || urls.length <= 1) return;
        currentIndex = (currentIndex - 1 + urls.length) % urls.length;
        updateGallery();
      });
      $('.main-gallery-next').on('click', function() {
        if (!urls || urls.length <= 1) return;
        currentIndex = (currentIndex + 1) % urls.length;
        updateGallery();
      });
      // image load error fallback to avoid blank screen
      $('.main-gallery-image').on('error', function() {
        $(this).attr('src', '');
        $('.main-gallery-counter').text('Imagen no disponible');
      });
      $('#main-gallery-overlay').on('click', function(e) {
        if (e.target.id === 'main-gallery-overlay') {
          hideGallery();
        }
      });
      $(document).on('keydown', function(e) {
        if ($('#main-gallery-overlay').hasClass('open')) {
          if (e.key === 'Escape') {
            hideGallery();
          }
          if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % urls.length;
            updateGallery();
          }
          if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + urls.length) % urls.length;
            updateGallery();
          }
        }
      });

      initMainGallery();
      $(window).on('resize', function() {
        clearTimeout(window._mainGalleryResizeTimer);
        window._mainGalleryResizeTimer = setTimeout(initMainGallery, 250);
      });
    });

     (function() {
      var offcanvasEl = document.getElementById('offcanvasNavbar');
      if (!offcanvasEl) return;
      var links = offcanvasEl.querySelectorAll('.nav-link');
      links.forEach(function(link) {
        link.addEventListener('click', function(e) {
          var href = link.getAttribute('href') || '';
          var hashIndex = href.indexOf('#');
          if (hashIndex === -1) return; // not an anchor
          var hash = href.substring(hashIndex);
          var target = document.querySelector(hash);
          if (!target) return; // allow default if target not on page
          e.preventDefault();
          var bsOff = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
          var onHidden = function() {
            offcanvasEl.removeEventListener('hidden.bs.offcanvas', onHidden);
            if (history && history.replaceState) {
              history.replaceState(null, '', hash);
            } else {
              location.hash = hash;
            }
            // Scroll so the navbar remains visible at top
            var navEl = document.querySelector('.navbar');
            var navHeight = navEl ? Math.ceil(navEl.getBoundingClientRect().height) : 0;
            var targetTop = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8);
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
          };
          offcanvasEl.addEventListener('hidden.bs.offcanvas', onHidden);
          bsOff.hide();
        });
      });
    })();

    