const mainJs = (
  function(){
    'strict'
    const navBtn = document.querySelector('.top-header__left .nav-btn')
    const mainNav = document.querySelector('.top-header__left .main-nav')
    const mainNavCloseBtn = document.querySelector('.main-nav__close-btn')
    const mainNavContentContainer = document.querySelector('.main-nav__content-container')
    const btnCart = document.querySelector('.top-header__btn-cart')
    const cartSection = document.querySelector('.cart-section')
    const itemsCounter = document.querySelector('.top-header__btn-cart .items-quantity')
    const cartForm = document.querySelector('.cart-form')
    const inputProductQuantity = document.getElementById('product__quantity') 
    const cartProducts = document.querySelector('.cart-section__products')
    const emptyMsg = document.querySelector('.empty-msg')
    const cartBody = document.querySelector('.cart-section__body')
    const originalProductSlider = document.querySelector('.product__slider')
    const lightbox = document.querySelector('.lightbox')

    var modalLightbox = null
    var productIndex = 0
    inputProductQuantity.value = 0
    manageItemsCounter(cart.getCartSize())
    updateCartItems()
    adjustAriaAttributesOnBtnMenu()
    initProductSliders()
    
    navBtn.addEventListener('click', toggleMenu)
    mainNavCloseBtn.addEventListener('click',toggleMenu)
    btnCart.addEventListener('click', toggleCart)
    cartForm.addEventListener('click', manageFormClicks)
    cartSection.addEventListener('click', manageCartClicks)
    
    function initProductSliders(){
      updateLightboxContent()
      document.querySelectorAll('.product__slider').forEach( element => {
        element.addEventListener('click', manageProductClicks)
        element.addEventListener('keydown', manageProductClicks)
      })
      autoSelectFirstThumbItem()
    }
    function updateLightboxContent(){
      const clonedElement = originalProductSlider.cloneNode(true)
      clonedElement.classList.add('--lightbox-active')
      lightbox.appendChild(clonedElement)
    }
    function adjustAriaAttributesOnBtnMenu(){
      if(window.matchMedia(`(min-width: 992px)`).matches){
        navBtn.removeAttribute('aria-controls')
        navBtn.removeAttribute('aria-expanded')
      }
    }
    function autoSelectFirstThumbItem(){
      document.querySelectorAll('.product__thumbs').forEach( listThumbs => {
        let hasThumbSelected = false
        Array.from(listThumbs).forEach( element => {
          if(element.querySelector('.thumb-item__btn').classList.contains('--selected')){
            hasThumbSelected = true
          }
        })
        if(hasThumbSelected === false){
          listThumbs.children[0].querySelector('.thumb-item__btn').classList.add('--selected')
        }
      })
    }
    function toggleDocumentOverflow(){
      document.documentElement.classList.toggle('--overflow-hidden')
      document.body.classList.toggle('--overflow-hidden')
    }
    function toggleMenu(){
      toggleDocumentOverflow()
      mainNav.classList.toggle('active')
      mainNavContentContainer.classList.toggle('active')
      if(mainNav.classList.contains('active')){
        navBtn.setAttribute('aria-expanded', true)
      }
      else{
        navBtn.setAttribute('aria-expanded', false)
      }
    }
    function toggleCart() {
      // Verifica se o carrinho tem a classe 'active'
      if (cartSection.classList.contains('active')) {
          cartSection.style.display = "none";
          btnCart.setAttribute('aria-expanded', false);
  
          // Verifica se o carrinho está vazio e oculta o botão de checkout
          const btnCheckout = document.querySelector('.cart-section__btn-checkout');
          if (btnCheckout) {
              btnCheckout.style.display = "none"; // Oculta o botão de checkout quando o carrinho está fechado
          }
      } else {
          cartSection.style.display = "block";
          btnCart.setAttribute('aria-expanded', true);
  
          // Verifica o número de itens no carrinho e mostra/oculta o botão de checkout
          const btnCheckout = document.querySelector('.cart-section__btn-checkout');
          if (btnCheckout) {
              // Se o carrinho não estiver vazio, exibe o botão de checkout
              if (cart.getCartSize() > 0) {
                  btnCheckout.style.display = "block";
              } else {
                  btnCheckout.style.display = "none"; // Se estiver vazio, esconde o botão
              }
          }
      }
  
      // Alterna a classe 'active' na seção do carrinho após 100ms
      setTimeout(() => cartSection.classList.toggle('active'), 100);
  
      // Alterna a classe '--active' no botão do carrinho
      btnCart.classList.toggle('--active');
  }
    function toggleCartProducts(){
      if(cart.getCartSize() <= 0 && emptyMsg.classList.contains('--deactivate')){
        emptyMsg.classList.remove('--deactivate')
        cartProducts.classList.remove('--active')
        cartBody.classList.remove('--with-items')
      }
      else{
        emptyMsg.classList.add('--deactivate')
        cartProducts.classList.add('--active')
        cartBody.classList.add('--with-items')
      }
    }
    function toggleBtnCheckout(){
      const btnCheckout = document.querySelector('.cart-section__btn-checkout')
      btnCheckout.classList.toggle('--active')
    }
    function manageFormClicks(event){
      let element = event.target
      if(!element.matches(`.cart-form, #product__quantity, .cart-form__input-container`)){
        if(element.matches(`.icon-cart, .cart-form__add-btn`)){
          const notValidEntries = ['+', '-', 'e']
          let validFlag = true
          let quantity = inputProductQuantity.value
          notValidEntries.forEach(element => {
            if(quantity.indexOf(element) !== -1){
              validFlag = false
            }
          })
          if(validFlag){
            if(quantity === "0"){
              alert('Quantidade inválida do produto!')
              inputProductQuantity.value = 0
            }
            else{
              function cleanPrice(priceString) {
                if (!priceString) return 0; // Retorna 0 caso o valor seja inválido
                
                // Remove símbolos monetários e espaços desnecessários
                let cleanString = priceString
                    .replace(/[^\d.,-]/g, '') // Remove caracteres que não são números, vírgulas, pontos ou sinais
                    .trim();
            
                // Substitui separadores de milhar (.) e usa a vírgula como separador decimal
                cleanString = cleanString.replace(/\./g, '').replace(',', '.');
            
                return parseFloat(cleanString) || 0; // Converte para número ou retorna 0 caso inválido
            }
            
            try {
                // Obtém o ID do produto
                const productElement = originalProductSlider.querySelector('.image-box__src');
                if (!productElement) throw new Error("Elemento de ID do produto não encontrado.");
                const productId = productElement.getAttribute('data-product-id');
            
                // Constrói a URL da imagem em miniatura
                const productIdParts = productId ? productId.split('-') : [];
                if (productIdParts.length < 3) throw new Error("ID do produto inválido.");
                const thumbImageURL = `assets/images/image-product-${productIdParts[2]}-thumbnail.svg`;
            
                // Obtém o nome do produto
                const productNameElement = document.querySelector('.product__name');
                if (!productNameElement) throw new Error("Elemento do nome do produto não encontrado.");
                const productName = productNameElement.textContent.trim();
            
                // Obtém os preços e limpa os valores
                const discountPriceElement = document.querySelector('.discount-price__value');
                const totalPriceElement = document.querySelector('.full-price');
                if (!discountPriceElement || !totalPriceElement) throw new Error("Elementos de preço não encontrados.");
            
                const discountPrice = cleanPrice(discountPriceElement.textContent);
                const totalPrice = cleanPrice(totalPriceElement.textContent);
            
                // Adiciona o item ao carrinho
                const newItem = cart.addNewItem(productId, quantity, thumbImageURL, productName, discountPrice, totalPrice);
            
                // Atualiza a interface do carrinho
                manageItemsCounter(cart.getCartSize());
                updateCartItems([newItem]);
            
            } catch (error) {
                console.error("Erro ao adicionar o produto ao carrinho:", error.message);
            }
            }
          }
          else{
            alert('Quantidade inválida do produto!')
            inputProductQuantity.value = 0
          }
        }
        else{
          let newValue = 0
          if(element.matches(`.plus-item, .icon-plus`)){
            newValue = parseInt(inputProductQuantity.value) + 1
          }
          else if(inputProductQuantity.value != "0"){
            newValue = parseInt(inputProductQuantity.value) - 1
          }
          inputProductQuantity.value = newValue
        }
        
      }
    }
    
    function manageProductClicks(event){
      let element = event.target
      let key = event.key
      const actionCondition = (event.type === "keydown" && key === "Enter") || event.type === "click"
      if(element.matches(`p`)){
        element = element.parentElement
      }
      if(element.matches(`.image-box__src[tabindex='0']`) && window.matchMedia(`(min-width: 992px)`).matches && actionCondition){
        event.preventDefault()
        zoomProductImage(event)
      }
      else if(actionCondition){
        event.preventDefault()
        if(element.matches(`[data-thumb-index], .thumb-item__btn`)){
          const localProductSlider = element.closest(`.product__slider`)
          const product = localProductSlider.querySelector('.image-box__src')
          if(element.classList.contains('thumb-item__btn')){
            element = element.querySelector('[data-thumb-index]')
          }
          productIndex = parseInt(element.getAttribute('data-thumb-index'))
          slideProductImage('', product.getAttribute('data-product-id'), product)
        }
        else if(element.matches(`.icon-previous, .icon-next, .btn-previousImage, .btn-nextImage`)){
          if(element.classList.contains(`icon`)){
            element = element.closest('button')
          }
          const product = element.closest('.image-box').querySelector('.image-box__src')
          let operation = element.classList.contains('btn-nextImage') ? '+' : '-'
          slideProductImage(operation, product.getAttribute('data-product-id'), product)
        }
        else if(element.matches(`.icon-close, .product__slider___btn-close-lightbox`)){
          setTimeout(() => {
            lightbox.style.display = ''
            modalLightbox.removeEvents()
          })
        }        
      }
      
    }
    
    function zoomProductImage(){
      lightbox.classList.add('--active')
      setTimeout(() => {
        lightbox.style.display = 'flex'
        modalLightbox = new Modal(lightbox)
      }, 200)
    }
    function slideProductImage(operator, productId, image){
      let productImagesLength = products.get(productId).length - 1
      if(operator === '+'){
        productIndex = productIndex < productImagesLength ? productIndex + 1 : 0  
      }
      else if(operator === '-'){
        productIndex = productIndex > 0 ? productIndex - 1 : productImagesLength
      }
      const localProductSlider = image.closest('.product__slider')
      localProductSlider.querySelector('.thumb-item__btn.--selected').classList.remove('--selected')
      let elementToSelect = localProductSlider.querySelector(`[data-thumb-index='${productIndex}']`)
      elementToSelect.closest('button').classList.add('--selected')
      
      let {full_img_url: fullImgURL} = products.get(productId)[productIndex]
      image.classList.add('--changed')
      setTimeout(() => {
        image.classList.remove('--changed')
        image.src = fullImgURL
      }, 200)
    }
    function manageItemsCounter(quantity){
      itemsCounter.querySelector('.value').textContent = quantity
      if(!itemsCounter.classList.contains('active') && quantity > 0){
        itemsCounter.classList.add('active')
      }
      else if(quantity <= 0){
        itemsCounter.classList.remove('active')
      }
    }
    function manageCartClicks(event){
      let element = event.target 
      if(element.matches("img:not(.product__thumb)")){
        element = element.parentElement
      }
      if(element.classList.contains('btn-del-product')){
        const itemToDelete = element.closest('[data-item-id]')
        cart.deleteItem(itemToDelete.getAttribute('data-item-id'))
        itemToDelete.parentElement.remove()
        manageItemsCounter(cart.getCartSize())
        toggleCartProducts()
      }
    }
    function updateCartItems(item){
      const items = item || cart.loadAllItems()
      if(items.length > 0){
        toggleCartProducts()
        items.forEach(element => {
          //if the element is already on the cart, just update its quantity and final price
          if(element.existsInDOM){
            const elementInDOM = document.querySelector(`[data-item-id=${element.item_id}]`)
            elementInDOM.querySelector('.price-calculation__value .quantity').textContent = element.quantity
            elementInDOM.querySelector('.final-price__span').textContent = (parseInt(element.discount_price) * parseInt(element.quantity)).toFixed(2)
          }
          else{
            cartProducts.appendChild(createDOMCartElement(element))
          }
        })
      }
      
    }
    function createDOMCartElement(item){
      const li = document.createElement('li');
    
      // Verificando se os dados do item estão corretos
      if (!item || !item.item_id || !item.thumb_URL || !item.name || !item.discount_price || !item.quantity) {
        console.error("Item data is missing or incomplete");
        return null;
      }
    
      // Formatando os preços com vírgulas e utilizando o formato de moeda
      const formattedPrice = item.discount_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const formattedTotalPrice = (item.discount_price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
      const liContent = `
        <a href="#" class="list-item" data-item-id="${item.item_id}">
          <img src="${item.thumb_URL}" alt="" class="product__thumb">
          <div class="list-item__abstract">
            <h4 class="title">${item.name}</h4>
            <div class="price-calculation">
              <p class="price-calculation__value">
                <span class="value__span">${formattedPrice}</span>
                <span class="sr-only">by</span>
                <span aria-hidden="true">x</span>
                <span class="quantity">${item.quantity}</span>
              </p>
            </div>
            
            <p class="price-calculation__final-price">
              <span class="final-price__span">${formattedTotalPrice}</span>
              <span class="sr-only">dollars on total</span> 
            </p>
          </div>
          <button type="button" class="btn-del-product">
            <span class="sr-only">Delete this product</span>
            <img src="assets/images/icon-delete.svg" alt="" role="presentation">
          </button>
        </a>
      `;
    
      li.innerHTML = liContent;
      return li;
    }

    return {
      toggleDocumentOverflow
    }
  }
)()