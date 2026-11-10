const http = require('http');

const VERSION = '2.1';

const products = [
  { id: 1, name: 'Café de la Selva', category: 'Bebidas', price: 25, emoji: '☕', color: '#e9d9c4', desc: 'Aroma intenso, cultivado con dedicación.', tag: 'Más vendido' },
  { id: 2, name: 'Miel Natural', category: 'Orgánicos', price: 32, emoji: '🍯', color: '#f7e8b7', desc: 'Un toque de dulzura de origen natural.', tag: 'Natural' },
  { id: 3, name: 'Frutas Frescas', category: 'Frescos', price: 14, emoji: '🍓', color: '#f7ddd9', desc: 'Selección fresca para todos los días.', tag: 'Fresco' },
  { id: 4, name: 'Canasta Andina', category: 'Combos', price: 48, emoji: '🧺', color: '#e4e8cf', desc: 'Tus favoritos reunidos en un solo lugar.', tag: 'Especial' },
  { id: 5, name: 'Chocolate Artesanal', category: 'Orgánicos', price: 22, emoji: '🍫', color: '#ebd9cb', desc: 'Sabor profundo y elaboración artesanal.', tag: 'Artesanal' },
  { id: 6, name: 'Palta Fresca', category: 'Frescos', price: 16, emoji: '🥑', color: '#e1edcc', desc: 'Calidad seleccionada para tu mesa.', tag: 'Fresco' }
];

const cards = products.map(function (p) {
  return '<article class="product-card" data-category="' + p.category + '">' +
    '<div class="product-art" style="background:' + p.color + '">' +
    '<span class="product-tag">' + p.tag + '</span>' +
    '<span class="product-emoji" aria-hidden="true">' + p.emoji + '</span></div>' +
    '<div class="product-info"><span class="category">' + p.category + '</span>' +
    '<h3>' + p.name + '</h3><p>' + p.desc + '</p>' +
    '<div class="product-bottom"><strong>S/ ' + p.price.toFixed(2) + '</strong>' +
    '<button type="button" class="add-button" data-id="' + p.id + '" aria-label="Agregar ' + p.name + ' al carrito">+ Agregar</button></div></div></article>';
}).join('');

const page = String.raw\`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#fbf9f5">
<meta name="description" content="Andina Market: productos frescos, naturales y artesanales. Proyecto demostrativo con despliegue automatizado desde GitHub a AWS EC2.">
<title>Andina Market | Naturalmente cerca de ti</title>
<style>
:root{--ink:#26372d;--muted:#748076;--green:#377554;--dark:#214332;--cream:#fbf9f5;--line:#e8ebe4}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:Arial,Helvetica,sans-serif;background:var(--cream);color:var(--ink)}
button,a{ -webkit-tap-highlight-color:transparent }
button{font:inherit;cursor:pointer}
a{text-decoration:none;color:inherit}
.container{width:min(1160px,calc(100% - 44px));margin:auto}
.announcement{background:var(--dark);color:#f6f5e9;text-align:center;padding:10px;font-size:12px;letter-spacing:.45px}
header{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.96);border-bottom:1px solid var(--line);backdrop-filter:blur(10px)}
.nav{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.brand{font-size:23px;font-weight:800;letter-spacing:-1px;white-space:nowrap}
.brand span{color:var(--green)}
.links{display:flex;gap:32px;align-items:center;font-size:14px;font-weight:600}
.links a:hover{color:var(--green)}
.cart-button{border:1px solid #dfe7df;border-radius:50px;padding:11px 16px;background:#f3f8f2;font-weight:700;color:var(--dark);white-space:nowrap}
.cart-count{background:var(--green);color:white;border-radius:100px;padding:3px 7px;font-size:11px;margin-left:5px}
.hero{position:relative;overflow:hidden;background:linear-gradient(115deg,#edf1e7 2%,#f7f0e3 55%,#f1e5d3 100%)}
.hero-inner{min-height:480px;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:25px;padding:55px 0}
.eyebrow{display:inline-flex;align-items:center;gap:8px;color:var(--green);font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase}
.eyebrow:before{content:"";width:22px;height:2px;background:var(--green)}
.hero h1{font-size:clamp(43px,5.4vw,75px);letter-spacing:-3.8px;line-height:1.07;margin:22px 0}
.hero h1 em{color:var(--green);font-style:normal}
.hero p{color:#647369;max-width:460px;line-height:1.85;font-size:16px;margin:0 0 29px}
.hero-actions{display:flex;gap:13px;flex-wrap:wrap}
.btn{border:0;display:inline-flex;align-items:center;justify-content:center;padding:16px 24px;border-radius:12px;font-size:14px;font-weight:700;transition:transform .2s}
.btn:hover{transform:translateY(-2px)}
.btn-primary{background:var(--green);color:white}
.btn-outline{border:1px solid #c8d1c5;background:#ffffff80;color:var(--dark)}
.hero-visual{display:flex;align-items:center;justify-content:center;position:relative;min-height:330px}
.hero-circle{width:min(380px,90%);aspect-ratio:1;background:radial-gradient(circle at 40% 35%,#fff9e8,#d5e3c8);border:12px solid #ffffff6b;border-radius:50%;display:flex;justify-content:center;align-items:center;font-size:clamp(125px,17vw,220px);box-shadow:0 25px 65px #5e765a25}
.float-pill{position:absolute;background:#fff;border-radius:14px;padding:13px 18px;box-shadow:0 12px 40px #354a3020;font-size:13px;font-weight:700}
.float-pill.top{top:13%;right:0}.float-pill.bottom{bottom:9%;left:0}
.benefits{padding:27px 0;background:#fff;border-bottom:1px solid var(--line)}
.benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.benefit{display:flex;gap:13px;align-items:center;justify-content:center}
.benefit-icon{font-size:24px;background:#eef5eb;padding:12px;border-radius:13px}
.benefit strong{display:block;font-size:13px}.benefit small{display:block;color:var(--muted);font-size:12px;margin-top:5px}
.products{padding:86px 0}
.section-heading{display:flex;align-items:end;justify-content:space-between;gap:25px;margin-bottom:29px}
.section-heading h2{font-size:clamp(30px,4vw,44px);margin:12px 0 8px;letter-spacing:-1.5px}
.section-heading p{color:var(--muted);margin:0;font-size:14px}
.filters{display:flex;gap:7px;flex-wrap:wrap}
.filter{border:1px solid #e1e8df;color:#536457;background:#fff;border-radius:100px;padding:10px 15px;font-size:12px;font-weight:700}
.filter.active{background:var(--dark);color:white;border-color:var(--dark)}
.product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.product-card{background:#fff;border:1px solid #eef0e9;border-radius:18px;overflow:hidden;box-shadow:0 6px 24px #2b432807;transition:transform .2s,box-shadow .2s}
.product-card:hover{transform:translateY(-4px);box-shadow:0 14px 35px #2b432815}
.product-card.hidden{display:none}
.product-art{height:205px;display:flex;align-items:center;justify-content:center;position:relative}
.product-tag{position:absolute;top:16px;left:16px;background:#fffdf4;border-radius:100px;padding:8px 11px;font-size:11px;font-weight:700;color:#50674b}
.product-emoji{font-size:93px;filter:drop-shadow(0 16px 12px #00000018)}
.product-info{padding:23px}
.category{font-size:11px;font-weight:800;letter-spacing:1px;color:var(--green);text-transform:uppercase}
.product-info h3{font-size:19px;letter-spacing:-.4px;margin:10px 0}
.product-info p{font-size:13px;line-height:1.6;color:var(--muted);min-height:41px;margin:0 0 18px}
.product-bottom{display:flex;justify-content:space-between;align-items:center;gap:10px}
.product-bottom strong{font-size:21px;color:var(--dark)}
.add-button{border:0;background:#eaf4eb;color:var(--green);padding:11px 15px;border-radius:9px;font-size:12px;font-weight:800}
.add-button:hover{background:var(--green);color:#fff}
.story{padding:65px 0;background:#eaf1e7}
.story-inner{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}
.story-art{min-height:290px;border-radius:22px;background:linear-gradient(140deg,#d5dfc7,#f8e5ce);display:flex;align-items:center;justify-content:center;font-size:140px}
.story h2{font-size:clamp(32px,4vw,45px);line-height:1.12;letter-spacing:-1.5px;margin:13px 0 20px}
.story p{font-size:15px;color:#627565;line-height:1.9}
.story-note{font-size:12px;color:var(--green);font-weight:700}
footer{padding:42px 0 24px;background:#1f392b;color:#f3f7ed}
.footer-inner{display:flex;align-items:start;justify-content:space-between;gap:20px}
footer .brand span{color:#a5d2a8}
footer p{color:#bfcdc0;font-size:13px;line-height:1.8}
footer small{display:block;border-top:1px solid #ffffff25;margin-top:30px;padding-top:20px;color:#b8cbb9;font-size:12px;text-align:center}
.toast{position:fixed;bottom:22px;right:22px;z-index:60;background:var(--dark);color:#fff;padding:15px 21px;border-radius:12px;box-shadow:0 10px 30px #0003;font-size:13px;opacity:0;transform:translateY(20px);pointer-events:none;transition:.25s}
.toast.visible{opacity:1;transform:translateY(0)}
.cart-panel{position:fixed;inset:0;z-index:50;display:none;background:#11251980;align-items:stretch;justify-content:flex-end}
.cart-panel.open{display:flex}
.cart-drawer{width:min(430px,100%);background:white;padding:30px;overflow:auto;box-shadow:-10px 0 40px #0002}
.cart-title{display:flex;align-items:center;justify-content:space-between}
.close-btn{background:#edf3eb;border:0;border-radius:9px;padding:9px 13px;font-size:19px}
.cart-items{padding:25px 0;min-height:100px}
.cart-item{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);padding:14px 0;gap:9px;font-size:14px}
.cart-item small{color:var(--muted)}
.cart-item button{border:0;background:transparent;color:#a05448;font-size:12px}
.cart-total{display:flex;justify-content:space-between;font-weight:800;font-size:18px;padding:20px 0;border-top:1px solid var(--line)}
.demo-note{background:#f2f5ed;color:#637363;padding:15px;border-radius:12px;font-size:12px;line-height:1.6}
@media(max-width:850px){.hero-inner{grid-template-columns:1fr 0.8fr}.hero h1{letter-spacing:-2px}.product-grid{grid-template-columns:repeat(2,1fr)}.section-heading{align-items:start;flex-direction:column}.story-inner{gap:30px}}
@media(max-width:640px){.container{width:min(100% - 32px,1160px)}.announcement{font-size:10px}.nav{min-height:66px}.brand{font-size:19px}.links{display:none}.cart-button{padding:10px 12px;font-size:12px}.hero-inner{grid-template-columns:1fr;padding:52px 0 36px;gap:0}.hero h1{font-size:45px}.hero-visual{min-height:260px}.hero-circle{width:245px;font-size:120px}.float-pill{font-size:11px;padding:9px}.benefit-grid{grid-template-columns:1fr;gap:12px}.benefit{justify-content:flex-start}.benefits{padding:19px 0}.product-grid{grid-template-columns:1fr}.products{padding:58px 0}.story-inner{grid-template-columns:1fr}.story-art{min-height:180px;font-size:95px}.story{padding:48px 0}.footer-inner{flex-direction:column}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{transition:none!important}}
</style>
</head>
<body>
<div class="announcement">✦ Productos seleccionados con cariño · Bienvenido a nuestra tienda ✦</div>
<header>
  <div class="container nav">
    <a class="brand" href="#inicio" aria-label="Andina Market, inicio">✳ Andina <span>Market</span></a>
    <nav class="links" aria-label="Navegación principal">
      <a href="#inicio">Inicio</a><a href="#productos">Productos</a><a href="#nosotros">Nosotros</a>
    </nav>
    <button class="cart-button" type="button" id="openCart">🛒 Mi carrito <span class="cart-count" id="cartCount">0</span></button>
  </div>
</header>
<main>
  <section class="hero" id="inicio">
    <div class="container hero-inner">
      <div>
        <span class="eyebrow">Sabor, origen y calidad</span>
        <h1>Lo natural se<br>vive <em>mejor.</em></h1>
        <p>Una selección especial de productos frescos, artesanales y llenos de sabor. Lo mejor de nuestra tierra, más cerca de ti.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#productos">Explorar productos ↗</a>
          <a class="btn btn-outline" href="#nosotros">Conócenos</a>
        </div>
      </div>
      <div class="hero-visual" aria-label="Canasta de productos naturales">
        <div class="hero-circle" aria-hidden="true">🧺</div>
        <div class="float-pill top">🌿 100% inspiración natural</div>
        <div class="float-pill bottom">✨ Hecho con dedicación</div>
      </div>
    </div>
  </section>
  <div class="benefits">
    <div class="container benefit-grid">
      <div class="benefit"><span class="benefit-icon">🌱</span><div><strong>Selección natural</strong><small>Productos con esencia auténtica</small></div></div>
      <div class="benefit"><span class="benefit-icon">🤎</span><div><strong>Calidad en cada detalle</strong><small>Elegidos para tu día a día</small></div></div>
      <div class="benefit"><span class="benefit-icon">🛍️</span><div><strong>Compra demostrativa</strong><small>Explora nuestro catálogo interactivo</small></div></div>
    </div>
  </div>
  <section class="products container" id="productos">
    <div class="section-heading">
      <div><span class="eyebrow">Nuestra selección</span><h2>Favoritos del mercado</h2><p>Pequeños placeres que hacen grandes momentos.</p></div>
      <div class="filters" role="group" aria-label="Filtrar productos">
        <button class="filter active" type="button" data-filter="Todos" aria-pressed="true">Todos</button>
        <button class="filter" type="button" data-filter="Frescos" aria-pressed="false">Frescos</button>
        <button class="filter" type="button" data-filter="Orgánicos" aria-pressed="false">Orgánicos</button>
        <button class="filter" type="button" data-filter="Bebidas" aria-pressed="false">Bebidas</button>
        <button class="filter" type="button" data-filter="Combos" aria-pressed="false">Combos</button>
      </div>
    </div>
    <div class="product-grid" id="productGrid">__CARDS__</div>
  </section>
  <section class="story" id="nosotros">
    <div class="container story-inner">
      <div class="story-art" aria-hidden="true">🌿</div>
      <div><span class="eyebrow">Nuestra esencia</span><h2>De nuestra tierra, a tus mejores momentos.</h2>
        <p>Andina Market es una tienda de demostración creada para presentar productos seleccionados de una forma sencilla, cálida y moderna.</p>
        <p class="story-note">Proyecto académico · GitHub + Node.js + AWS EC2</p>
      </div>
    </div>
  </section>
</main>
<footer>
  <div class="container">
    <div class="footer-inner"><div><div class="brand">✳ Andina <span>Market</span></div><p>Conectando naturaleza, calidad y buenos momentos.</p></div>
      <p>Inicio · Productos · Nosotros<br>Catálogo de demostración, sin compras reales.</p></div>
    <small>© Andina Market · Versión __VERSION__ · Desplegado automáticamente desde GitHub en AWS EC2.</small>
  </div>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="cart-panel" id="cartPanel" aria-hidden="true">
  <div class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cartHeading">
    <div class="cart-title"><h2 id="cartHeading">🛒 Mi carrito</h2><button class="close-btn" type="button" id="closeCart" aria-label="Cerrar carrito">×</button></div>
    <div class="cart-items" id="cartItems"></div><div class="cart-total"><span>Total</span><span id="cartTotal">S/ 0.00</span></div>
    <p class="demo-note">Esta tienda es un proyecto académico de demostración. No se procesan pedidos ni pagos reales.</p>
    <button class="btn btn-primary" type="button" id="clearCart" style="width:100%;margin-top:14px">Vaciar carrito</button>
  </div>
</div>
<script>
var products = __PRODUCTS__;
var cart = [];
var panel = document.getElementById('cartPanel');
var toastTimer;
function money(n){return 'S/ ' + n.toFixed(2);}
function renderCart(){
  document.getElementById('cartCount').textContent = String(cart.length);
  var html = cart.map(function(id,index){
    var p = products.find(function(x){return x.id === id;});
    return '<div class="cart-item"><span>' + p.emoji + ' ' + p.name + '<br><small>' + money(p.price) + '</small></span><button type="button" data-remove="' + index + '">Quitar</button></div>';
  }).join('');
  document.getElementById('cartItems').innerHTML = html || '<p style="color:#748076">Tu carrito todavía está vacío.</p>';
  document.getElementById('cartTotal').textContent = money(cart.reduce(function(sum,id){return sum + products.find(function(p){return p.id === id;}).price;},0));
}
function toggleCart(open){
  panel.classList.toggle('open',open);
  panel.setAttribute('aria-hidden',String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
  if(open){document.getElementById('closeCart').focus();}
  else{document.getElementById('openCart').focus();}
}
function showToast(message){
  var toast = document.getElementById('toast'); toast.textContent = message;
  toast.classList.add('visible'); clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){toast.classList.remove('visible');},2200);
}
document.querySelectorAll('.add-button').forEach(function(btn){
  btn.addEventListener('click',function(){
    var id = Number(btn.getAttribute('data-id'));
    var item = products.find(function(p){return p.id === id;});
    cart.push(id); renderCart(); showToast('✓ ' + item.name + ' agregado al carrito');
  });
});
document.querySelectorAll('.filter').forEach(function(btn){
  btn.addEventListener('click',function(){
    var filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.filter').forEach(function(b){var yes=b===btn;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});
    document.querySelectorAll('.product-card').forEach(function(card){card.classList.toggle('hidden',filter !== 'Todos' && card.getAttribute('data-category') !== filter);});
  });
});
document.getElementById('openCart').addEventListener('click',function(){toggleCart(true);});
document.getElementById('closeCart').addEventListener('click',function(){toggleCart(false);});
document.getElementById('clearCart').addEventListener('click',function(){cart=[];renderCart();showToast('Carrito vaciado');});
document.getElementById('cartItems').addEventListener('click',function(event){var btn=event.target.closest('[data-remove]');if(btn){cart.splice(Number(btn.getAttribute('data-remove')),1);renderCart();}});
panel.addEventListener('click',function(event){if(event.target===panel)toggleCart(false);});
document.addEventListener('keydown',function(event){if(event.key==='Escape'&&panel.classList.contains('open'))toggleCart(false);});
renderCart();
</script>
</body>
</html>\`.replace('__CARDS__', cards).replace('__PRODUCTS__', JSON.stringify(products)).replace('__VERSION__', VERSION);

http.createServer(function(req, res) {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'});
  res.end(page);
}).listen(3000, '0.0.0.0', function() {
  console.log('Andina Market versión ' + VERSION + ' en puerto 3000');
});
