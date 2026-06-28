const storageKey = "paperBlessingCart";
let cart = JSON.parse(localStorage.getItem(storageKey) || "[]");
const drawer = document.querySelector("[data-cart-drawer]");
const cartItems = document.querySelector("[data-cart-items]");
const countEls = document.querySelectorAll("[data-cart-count]");
const orderForm = document.querySelector("[data-order-form]");
const orderOutput = document.querySelector("[data-order-output]");
const orderText = document.querySelector("[data-order-text]");
function saveCart(){ localStorage.setItem(storageKey, JSON.stringify(cart)); }
function totalCount(){ return cart.reduce(function(sum,item){ return sum + item.qty; }, 0); }
function showToast(message){ const toast=document.createElement("div"); toast.className="toast"; toast.textContent=message; document.body.appendChild(toast); setTimeout(function(){ toast.remove(); },1800); }
function renderCart(){ countEls.forEach(function(el){ el.textContent = totalCount(); }); if(!cartItems)return; if(cart.length===0){ cartItems.innerHTML='<div class="cart-empty">購物車目前是空的，請先到商品展示加入想詢問的品項。</div>'; return; } cartItems.innerHTML = cart.map(function(item){ return '<div class="cart-item"><div><strong>'+item.name+'</strong><span>數量：'+item.qty+'</span></div><div class="qty"><button type="button" data-qty="minus" data-name="'+item.name+'" aria-label="減少數量">-</button><button type="button" data-qty="plus" data-name="'+item.name+'" aria-label="增加數量">+</button></div><button class="remove" type="button" data-remove="'+item.name+'">移除</button></div>'; }).join(''); }
function openCart(){ if(drawer){ drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden","false"); document.body.classList.add("cart-open"); } }
function closeCart(){ if(drawer){ drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden","true"); document.body.classList.remove("cart-open"); } }
function addItem(name){ const existing=cart.find(function(item){return item.name===name;}); if(existing){ existing.qty += 1; } else { cart.push({name:name, qty:1}); } saveCart(); renderCart(); showToast(name + " 已加入購物車"); }
document.querySelectorAll('a[href^="#"]').forEach(function(link){ link.addEventListener('click',function(event){ const target=document.querySelector(link.getAttribute('href')); if(target){ event.preventDefault(); target.scrollIntoView({behavior:'smooth'}); } }); });
document.querySelectorAll("[data-add-cart]").forEach(function(button){ button.addEventListener("click", function(){ addItem(button.dataset.name); }); });
document.querySelectorAll("[data-cart-open]").forEach(function(button){ button.addEventListener("click", openCart); });
document.querySelector("[data-cart-close]")?.addEventListener("click", closeCart);
drawer?.addEventListener("click", function(event){ if(event.target === drawer) closeCart(); });
cartItems?.addEventListener("click", function(event){ const target=event.target; if(!(target instanceof HTMLElement))return; const qtyAction=target.dataset.qty; const name=target.dataset.name; if(qtyAction && name){ const item=cart.find(function(entry){return entry.name===name;}); if(!item)return; item.qty += qtyAction === "plus" ? 1 : -1; if(item.qty <= 0){ cart = cart.filter(function(entry){return entry.name!==name;}); } saveCart(); renderCart(); } if(target.dataset.remove){ cart = cart.filter(function(entry){return entry.name!==target.dataset.remove;}); saveCart(); renderCart(); } });
orderForm?.addEventListener("submit", function(event){ event.preventDefault(); if(cart.length===0){ showToast("請先加入商品"); return; } const form=new FormData(orderForm); const lines=["紙語紙境訂單詢問","姓名："+(form.get("name")||""),"電話："+(form.get("phone")||""),"需求日期："+(form.get("date")||"未填"),"","商品："].concat(cart.map(function(item){return "- "+item.name+" x "+item.qty;})).concat(["","備註："+(form.get("note")||"無")]); orderText.value=lines.join("
"); orderOutput.hidden=false; });
document.querySelector("[data-copy-order]")?.addEventListener("click", async function(){ if(!orderText?.value)return; await navigator.clipboard.writeText(orderText.value); showToast("訂單內容已複製"); });
renderCart();

// 商品系列分頁切換
const productTabs = document.querySelectorAll('[data-product-tab]');
const productPanels = document.querySelectorAll('[data-product-panel]');
productTabs.forEach(function(tab){
  tab.addEventListener('click', function(){
    const target = tab.dataset.productTab;
    productTabs.forEach(function(item){
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    productPanels.forEach(function(panel){
      const active = panel.dataset.productPanel === target;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  });
});

const backTopButton = document.querySelector("[data-back-top]");
function updateBackTop(){ if(!backTopButton)return; backTopButton.classList.toggle("is-visible", window.scrollY > 360); }
window.addEventListener("scroll", updateBackTop, { passive: true });
backTopButton?.addEventListener("click", function(){ window.scrollTo({ top: 0, behavior: "smooth" }); });
updateBackTop();

// 基本內容保護：降低反白、右鍵另存、拖曳圖片的機率。
document.addEventListener("contextmenu", function(event){ event.preventDefault(); });
document.addEventListener("dragstart", function(event){ if(event.target instanceof HTMLImageElement){ event.preventDefault(); } });
document.addEventListener("selectstart", function(event){ const target = event.target; if(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement){ return; } event.preventDefault(); });
