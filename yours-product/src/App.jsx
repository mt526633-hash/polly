import { useState, useEffect, useRef } from 'react';
import { Menu, Search, UserRound, ShoppingBag, Heart, X, ArrowRight, Truck, RefreshCcw, ShieldCheck, Star, ChevronRight, Ruler, ChevronDown, ChevronLeft, Flame, Info, Pause, Play } from 'lucide-react';
import './styles.css';
import './overrides.css';
import './premium-fixes.css';
import './motion.css';
import './luxury-polish.css';
import './product-switch.css';
import './size-guide-fix.css';
import './matrix-guide.css';
import './touch-gallery.css';

// Scroll-reveal: adds .is-visible when element enters viewport
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -100px 0px', threshold: 0 }
    );
    // Observe the container itself and all .reveal-up / .reveal-scale children
    const items = el.querySelectorAll('.reveal-up, .reveal-scale');
    items.forEach((item) => observer.observe(item));
    if (el.classList.contains('reveal-up') || el.classList.contains('reveal-scale')) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const sizes = ['Small','Medium','Large','X-Large','XX-Large'];
const products = [
  {name:'Sleek Corset Burkini - Baby Blue', price:'LE 1,899.00 EGP', image:'/assets/baby-blue.jpg',reviews:0,colors:['#6dbfd1','#222','#d7d4c9']},
  {name:'Rouge Burkini', price:'LE 2,499.00 EGP', image:'/assets/rouge.jpg',reviews:0,colors:['#8e1d27','#1d1d1d']},
  {name:'Barbie Burkini', price:'LE 2,499.00 EGP', image:'/assets/barbie.jpg',reviews:0,colors:['#d4a7b4','#2d2d2d']},
  {name:'Aqua Burkini', price:'LE 2,499.00 EGP', image:'/assets/aqua.jpg',reviews:0,colors:['#42bccc','#111']},
  {name:'Sleek Corset Burkini - Olive', price:'LE 1,899.00 EGP', image:'/assets/olive.jpg',reviews:0,colors:['#6e7455','#111','#ded9c9']},
  {name:'Sleek Corset Burkini - Burgundy', price:'LE 1,899.00 EGP', image:'/assets/burgundy.jpg',reviews:0,colors:['#692f39','#111','#a9a49d']},
];

function Header({onMenu,onSearch,onWishlist,onCart,wishlistCount,cartCount}) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => t > 0 ? t - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const messages = [
    `Discount ends in ${formatTime(timeLeft)} — 15% OFF everything`,
    "Get 10% off when you sign up for emails",
    "Get $10 off when you refer a friend",
    "Free standard shipping on orders over LE 2,500"
  ];

  useEffect(() => {
    if (isPaused) return;
    const currentDelay = msgIndex === 0 ? 8000 : 3000;
    const interval = setTimeout(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, currentDelay);
    return () => clearTimeout(interval);
  }, [isPaused, msgIndex, messages.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky-header-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className={`announcement ${isScrolled ? 'announcement-hidden' : ''}`}>
        <div className="announcement-msg-wrapper">
          <a href="#" key={msgIndex} className="announcement-link fade-in-msg" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            {msgIndex === 0 && <span className="discount-pulse"></span>}
            {messages[msgIndex]}
          </a>
        </div>
        <button 
          className="announcement-pause-btn" 
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? "Play announcements" : "Pause announcements"}
        >
          {isPaused ? <Play size={11}/> : <Pause size={11}/>} 
        </button>
      </div>
      <header>
        <button aria-label="Open menu" onClick={onMenu}><Menu/></button>
        <button aria-label="Search" onClick={onSearch}><Search/></button>
        <img className="logo" src="/assets/logo.png" alt="Yours" />
        <button aria-label="Love list" className="love" onClick={onWishlist}><Heart/><b>{wishlistCount}</b></button>
        <button aria-label="Bag" className="bag" onClick={onCart}><ShoppingBag/><b>{cartCount}</b></button>
      </header>
    </div>
  );
}

function Stars({count=0}) { return <div className={`stars ${count===0?'empty-stars':''}`}><span>{[0,1,2,3,4].map(i=><Star key={i}/>)}</span><small>{count===0?'No reviews yet':`(${count})`}</small></div> }

function ProductRail({title, items, wishlist, toggleWishlist, animClass = "reveal-up"}) {
  const ref = useScrollReveal();
  const [swiped, setSwiped] = useState(false);
  return <section className={`rail-section ${animClass}`} ref={ref}>
    <div className="section-title">
      <h2>{title}</h2>
      <div className={`swipe-hint-container ${swiped ? 'hint-hidden' : ''}`}>
        <span className="swipe-text-hint">Swipe left</span>
        <button aria-label={`View all ${title}`} className="swipe-arrow-btn">
          <ArrowRight className="swipe-arrow-anim"/>
        </button>
      </div>
    </div>
    <div className="rail" onScroll={() => { if(!swiped) setSwiped(true); }}>
      {items.map((p,i)=><article className="card" key={`${title}-${i}`}>
        <div className="card-image"><img src={p.image} alt={p.name}/><button className={wishlist.includes(p.name)?'saved':''} onClick={()=>toggleWishlist(p)} aria-label={`Save ${p.name}`}><Heart/></button></div>
        <div className="card-copy"><div><p className="brand">YOURS</p><h3>{p.name}</h3></div><button className="quick-bag" aria-label={`Quick add ${p.name}`}><ShoppingBag/></button></div>
        <p className="card-price">{p.price}</p><div className="swatches">{p.colors.map(c=><i style={{background:c}} key={c}></i>)}{p.colors.length>2&&<small>+{p.colors.length-2}</small>}</div><Stars count={p.reviews}/>
      </article>)}
    </div>
  </section>
}

function SizeGuide({close}) {
  const [guideSize,setGuideSize]=useState('Small');
  const [unit,setUnit]=useState('kg');
  const rows=[['Small','S',50,55],['Medium','M',55,60],['Large','L',60,65],['X-Large','XL',65,70],['XX-large','XXL',70,75]];
  const range=(r)=>unit==='kg'?`${r[2]}–${r[3]}`:`${Math.round(r[2]*2.20462)}–${Math.round(r[3]*2.20462)}`;
  const selected=rows.find(r=>r[0]===guideSize);
  return <div className="overlay" onClick={close}><div className="sheet matrix-guide" onClick={e=>e.stopPropagation()}>
    <div className="matrix-close"><button aria-label="Close size guide" onClick={close}><X/></button></div>
    <div className="matrix-intro"><p>YOURS BURKINI FIT</p><h2>Find your size</h2><span>Choose using the exact weight guide published for this product.</span></div>
    <div className="unit-toggle" aria-label="Weight unit"><button className={unit==='kg'?'active':''} onClick={()=>setUnit('kg')}>KG</button><button className={unit==='lb'?'active':''} onClick={()=>setUnit('lb')}>LB</button></div>
    <div className="matrix-label">RECOMMENDED WEIGHT</div>
    <div className="size-matrix"><div className="matrix-corner">SIZE</div><div className="matrix-heading">RANGE <small>{unit.toUpperCase()}</small></div><div className="matrix-heading">SELECT</div>{rows.map(r=><button className={`matrix-row ${guideSize===r[0]?'active':''}`} onClick={()=>setGuideSize(r[0])} key={r[0]}><strong>{r[1]}</strong><span>{range(r)} {unit}</span><i>{guideSize===r[0]?'SELECTED':'CHOOSE'}</i></button>)}</div>
    <div className="matrix-product"><img src="/assets/grey-2.jpg" alt="Sleek Corset Burkini fit reference"/><div><p>SLEEK CORSET BURKINI</p><h3>Three-piece coverage</h3><span>Bodysuit, wrap skirt and leggings. Model wears size Small.</span></div></div>
    <div className="matrix-result"><span>YOUR SELECTION</span><strong>{selected[1]}</strong><p>{range(selected)} {unit}</p></div>
    <button className="close-sheet matrix-use" onClick={close}>USE SIZE {selected[1]}</button>
  </div></div>
}

function RatingScale({label,left='Runs Small',right='Runs Large',value=50,onChange}) { return <label className="rating-scale"><span>{label}</span><input aria-label={label} type="range" min="0" max="100" value={value} onChange={e=>onChange?.(+e.target.value)}/><small><i>{left}</i><i>True to Size</i><i>{right}</i></small></label> }

function ReviewScale({label, left, right, value}) {
  return (
    <div className="custom-review-scale">
      <div className="scale-label">{label}</div>
      <div className="scale-track-wrapper">
        <div className="scale-track">
          <div className="scale-fill" style={{ width: `${value}%` }}></div>
          <div className="scale-thumb" style={{ left: `${value}%` }}></div>
        </div>
        <div className="scale-markers">
          <span>{left}</span>
          <span>True to Size</span>
          <span>{right}</span>
        </div>
      </div>
    </div>
  );
}

function ReviewForm({close}) {
  const [fit,setFit]=useState(50); const [quality,setQuality]=useState(85); const [design,setDesign]=useState(85); const [rating,setRating]=useState(0);
  return <div className="overlay review-overlay" onClick={close}><form className="review-form" onClick={e=>e.stopPropagation()} onSubmit={e=>{e.preventDefault();close()}}>
    <div className="sheet-head review-form-head"><div><p>CUSTOMER REVIEW</p><h2>Share your experience</h2></div><button type="button" aria-label="Close review form" onClick={close}><X/></button></div>
    <section className="rating-block"><p>YOUR RATING</p><div className="review-stars" aria-label="Choose rating">{[1,2,3,4,5].map(n=><button className={n<=rating?'active':''} onClick={()=>setRating(n)} type="button" aria-label={`${n} stars`} key={n}><Star/></button>)}</div></section>
    <div className="review-fields"><label>Review title<input required placeholder="Sum up your experience"/></label><label>Your review<textarea required placeholder="Tell us about the fit, quality and design"/></label></div>
    <section className="fit-block"><p>FIT & FINISH</p><RatingScale label="Overall Fit" value={fit} onChange={setFit}/><RatingScale label="Quality" left="Poor" right="Excellent" value={quality} onChange={setQuality}/><RatingScale label="Design" left="Poor" right="Excellent" value={design} onChange={setDesign}/></section>
    <label className="review-name">Your name<input required placeholder="First name and initial"/></label><p className="review-privacy">Your email will not be published. Reviews are checked before appearing.</p><button className="submit-review" disabled={!rating}>SUBMIT REVIEW</button>
  </form></div>
}

export function App() {
  const [size,setSize]=useState('Small'); const [slide,setSlide]=useState(0); const [guide,setGuide]=useState(false); const [menu,setMenu]=useState(false); const [detail,setDetail]=useState('Description'); const [added,setAdded]=useState(false); const [wishlist,setWishlist]=useState([]); const [wishlistOpen,setWishlistOpen]=useState(false); const [reviewForm,setReviewForm]=useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [swipeStart, setSwipeStart] = useState(null);
  const [footerInView, setFooterInView] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterJoined, setNewsletterJoined] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [expertOpen, setExpertOpen] = useState(false);
  const [menuTab, setMenuTab] = useState('Women');
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartQty, setCartQty] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [cartTab, setCartTab] = useState('bag');

  useEffect(() => {
    const handleScroll = () => {
      const newsletter = document.querySelector('.newsletter');
      const newsletterNear = newsletter ? newsletter.getBoundingClientRect().top < window.innerHeight * 0.88 : false;
      setFooterInView(newsletterNear);
      setShowSticky(window.scrollY > 756 && !newsletterNear);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleWishlist=(p)=>setWishlist(w=>w.some(x=>x.name===p.name)?w.filter(x=>x.name!==p.name):[...w,p]);
  return <div className="page">
    <Header onMenu={()=>setMenu(true)} onSearch={() => setSearchOpen(true)} onWishlist={()=>{setCartTab('wishlist');setCartOpen(true);}} onCart={() => {setCartTab('bag');setCartOpen(true);}} wishlistCount={wishlist.length} cartCount={added ? cartQty : 0}/>
    <main>
      <div className="breadcrumbs">Home / Swim / Burkinis</div>
      <div className="gallery" onPointerDown={e=>setSwipeStart(e.clientX)} onPointerUp={e=>{if(swipeStart===null)return;const delta=e.clientX-swipeStart;if(Math.abs(delta)>42)setSlide(current=>delta<0?Math.min(1,current+1):Math.max(0,current-1));setSwipeStart(null)}} onPointerCancel={()=>setSwipeStart(null)}>
        <div className="gallery-track" style={{transform:`translateX(-${slide*100}%)`}}>{[1,2].map(n=><img key={n} src={`/assets/grey-${n}.jpg`} alt={`Sleek Corset Burkini - Grey view ${n}`} onClick={()=>setLightboxImg(`/assets/grey-${n}.jpg`)} style={{cursor:'zoom-in'}}/>)}</div>
        <div className="gallery-ui"><span>{slide+1} / 2</span><div>{[0,1].map(n=><button key={n} aria-label={`Image ${n+1}`} onClick={()=>setSlide(n)} className={slide===n?'active':''}></button>)}</div></div>
      </div>
      <section className="product-info">
        <p className="eyebrow product-badge">DESIGNED FOR CONFIDENT COVERAGE</p><h1>Sleek Corset Burkini - Grey</h1><p className="price">LE 1,899.00 EGP</p><p className="preorder">PRE-ORDER · 10–15 WORKING DAYS</p>
        <div className="size-head-ref">
          <span>Select a size</span>
          <button className="size-guide-btn" onClick={()=>setGuide(true)}>
            <Ruler size={16} />
            <span>Size Guide</span>
          </button>
        </div>
        <div className="size-selector-card">
          {['Small','Medium','Large','X-Large','XX-large'].map(s=><button className={size===s?'selected':''} onClick={()=>setSize(s)} key={s}>{s === 'Small' ? 'S' : s === 'Medium' ? 'M' : s === 'Large' ? 'L' : s === 'X-Large' ? 'XL' : 'XXL'}</button>)}
        </div>
        <button className={`add ${added?'added':''}`} onClick={()=>{setAdded(true); setCartQty(1); setCartOpen(true);}}>{added?'ADDED TO BAG':'PRE-ORDER — LE 1,899.00 EGP'}</button>
        <div className="product-urgency-msg urgency-glow" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <Flame size={14} className="urgency-icon urgency-flame-anim" />
          <span><b className="urgency-text-glow">Selling fast!</b> 8 people have this in their cart right now.</span>
        </div>
        
        {/* Gymshark-style highlights grid */}
        <div className="gymshark-highlights reveal-scale" ref={useScrollReveal()}>
          <div className="highlight-item">
            <div className="highlight-icon"><Star size={18} /></div>
            <div className="highlight-text">
              <h4>Complete 3-Piece Set</h4>
              <p>Bodysuit, wrap skirt and leggings, exactly as listed by Yours.</p>
            </div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon"><ShieldCheck size={18} /></div>
            <div className="highlight-text">
              <h4>Model Wears Small</h4>
              <p>Use the product-specific weight guide to choose your size.</p>
            </div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon"><RefreshCcw size={18} /></div>
            <div className="highlight-text">
              <h4>Pre-Order Timing</h4>
              <p>Pre-orders take 10–15 working days.</p>
            </div>
          </div>
        </div>

        {/* Gymshark-style collapsible accordion sections */}
        <div className="accordion-group">
          <details className="gym-accordion" open>
            <summary>
              <span>Description & Features</span>
              <ChevronDown className="gym-accordion-arrow" size={16} />
            </summary>
            <div className="gym-accordion-content">
              <p>Burkini Set of 3 pieces {'{'}Bodysuit - Wrap Skirt - Leggings{'}'}</p>
              <p>Model is Wearing size SMALL</p>
            </div>
          </details>

          <details className="gym-accordion">
            <summary>
              <span>Size & Fit</span>
              <ChevronDown className="gym-accordion-arrow" size={16} />
            </summary>
            <div className="gym-accordion-content">
              <p>Burkinis Size Chart</p>
              <ul>
                <li><strong>S:</strong> 50–55 kg</li><li><strong>M:</strong> 55–60 kg</li><li><strong>L:</strong> 60–65 kg</li><li><strong>XL:</strong> 65–70 kg</li><li><strong>XXL:</strong> 70–75 kg</li>
              </ul>
            </div>
          </details>

          <details className="gym-accordion">
            <summary>
              <span>Shipping</span>
              <ChevronDown className="gym-accordion-arrow" size={16} />
            </summary>
            <div className="gym-accordion-content">
              <ul>
                <li><strong>Orders:</strong> 2–6 working days</li><li><strong>Pre-orders:</strong> 10–15 working days</li>
              </ul>
            </div>
          </details>

          <details className="gym-accordion">
            <summary>
              <span>Policy</span>
              <ChevronDown className="gym-accordion-arrow" size={16} />
            </summary>
            <div className="gym-accordion-content">
              <p>Check if the order suits you before paying. If not, return it with the courier on the spot and only pay shipping fees.</p>
              <ul>
                <li>No returns after paying; exchanges within 14 days.</li><li>Customers cover additional costs.</li><li><strong>Burkinis:</strong> once the courier leaves, no exchange or refund.</li><li>No returns or exchanges on sale items.</li>
              </ul>
            </div>
          </details>
        </div>
      </section>
      <ProductRail title="Shop the Look" items={products.slice(4,6)} wishlist={wishlist.map(x=>x.name)} toggleWishlist={toggleWishlist} animClass="reveal-up"/>
      <ProductRail title="More You'll Love" items={products.slice(0,4)} wishlist={wishlist.map(x=>x.name)} toggleWishlist={toggleWishlist} animClass="reveal-up"/>
      <ProductRail title="Recently Viewed" items={[products[1],products[3],products[0]]} wishlist={wishlist.map(x=>x.name)} toggleWishlist={toggleWishlist} animClass="reveal-up"/>
      <section className="reviews reveal-scale" ref={useScrollReveal()}>
        <p className="reviews-kicker">REAL RESULTS</p>
        <h2>Loved by 10k+ Women</h2>
        <div className="review-score">
          <strong>4.9</strong>
          <div>
            <div className="stars"><Star/><Star/><Star/><Star/><Star/></div>
            <p>Based on 1,248 reviews</p>
          </div>
        </div>
        <div className="review-card">
          <div className="review-top">
            <div className="stars"><Star/><Star/><Star/><Star/><Star/></div>
            <span>2 DAYS AGO</span>
          </div>
          <h3>Obsessed with the fit!</h3>
          <p>"This is officially my new favorite set. The compression is perfect without digging in, and it stays perfectly in place during my HIIT workouts."</p>
          <small>— Sarah M. (Verified Buyer)</small>
        </div>
        <div className="review-card">
          <div className="review-top">
            <div className="stars"><Star/><Star/><Star/><Star/><Star/></div>
            <span>1 WEEK AGO</span>
          </div>
          <h3>So flattering</h3>
          <p>"The seamless design really contours nicely. I was worried about the lighter color being see-through but it is 100% squat proof. Buying in black next!"</p>
          <small>— Jessica T. (Verified Buyer)</small>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button className="all-reviews" style={{ flex: 1 }}>READ ALL REVIEWS <ArrowRight/></button>
          <button className="all-reviews" style={{ flex: 1, background: '#111', color: '#fff', border: 'none' }} onClick={() => setReviewForm(true)}>WRITE A REVIEW <ArrowRight color="#fff"/></button>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="newsletter reveal-scale" ref={useScrollReveal()}>
        <h2>{newsletterJoined?'Welcome to the edit.':'New drops, first.'}</h2>
        <p style={{ margin: '12px auto' }}>{newsletterJoined?'You are on the list. Watch your inbox for new collections and private releases.':'Receive considered updates about new pieces, private releases and styling notes.'}</p>
        {!newsletterJoined&&<form className="newsletter-form" onSubmit={e=>{e.preventDefault();setNewsletterJoined(true)}} style={{ margin: '0 auto', textAlign: 'left' }}><label htmlFor="newsletter-email">Email address</label><div><input id="newsletter-email" type="email" required value={newsletterEmail} onChange={e=>setNewsletterEmail(e.target.value)} placeholder="you@example.com"/><button type="submit">JOIN THE LIST <ArrowRight/></button></div></form>}
      </section>
    </main>
    {guide&&<SizeGuide close={()=>setGuide(false)}/>} 
    {reviewForm&&<ReviewForm close={()=>setReviewForm(false)}/>} 
    {menu && (
      <div className="overlay menu-overlay" onClick={() => setMenu(false)}>
        <nav className="gymshark-menu" onClick={e => e.stopPropagation()}>
          {/* 1. Header Control */}
          <div className="menu-header">
            <button aria-label="Close menu" onClick={() => setMenu(false)}>
              <X size={20} />
            </button>
            <button aria-label="Wishlist" className="menu-wishlist-btn" onClick={() => { setMenu(false); setWishlistOpen(true); }}>
              <Heart size={20} />
              {wishlist.length > 0 && <b>{wishlist.length}</b>}
            </button>
          </div>

          {/* 2. Search Bar */}
          <section className="menu-search-wrapper">
            <div className="menu-search-box" onClick={() => { setMenu(false); setSearchOpen(true); }} style={{ cursor: 'pointer' }}>
              <Search size={16} />
              <input type="text" placeholder="What are you looking for today?" readOnly style={{ pointerEvents: 'none' }} />
            </div>
          </section>

          {/* 3. Interactive Tabs */}
          <div className="menu-tabs">
            {['Women', 'Men', 'Accessories'].map(tab => (
              <button 
                key={tab} 
                className={menuTab === tab ? 'active' : ''} 
                onClick={() => setMenuTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <section className="menu-scrollable-content">
            {/* 4. Banner Cards Category Row */}
            <div className="menu-banners-row">
              {menuTab === 'Women' && (
                <>
                  <div className="menu-banner-card">
                    <img src="/assets/grey-1.jpg" alt="Sleek Corset Burkini - Grey" />
                    <div className="banner-overlay"><h4>NEW IN</h4></div>
                  </div>
                  <div className="menu-banner-card">
                    <img src="/assets/grey-2.jpg" alt="Sleek Corset Burkini - Grey second view" />
                    <div className="banner-overlay"><h4>SUMMER</h4></div>
                  </div>
                </>
              )}
              {menuTab === 'Men' && (
                <>
                  <div className="menu-banner-card">
                    <img src="/assets/olive.jpg" alt="Men's New In" />
                    <div className="banner-overlay"><h4>NEW IN</h4></div>
                  </div>
                  <div className="menu-banner-card">
                    <img src="/assets/burgundy.jpg" alt="Athletic" />
                    <div className="banner-overlay"><h4>TRAINING</h4></div>
                  </div>
                </>
              )}
              {menuTab === 'Accessories' && (
                <>
                  <div className="menu-banner-card">
                    <img src="/assets/barbie.jpg" alt="Bags" />
                    <div className="banner-overlay"><h4>BAGS</h4></div>
                  </div>
                  <div className="menu-banner-card">
                    <img src="/assets/aqua.jpg" alt="Headwear" />
                    <div className="banner-overlay"><h4>HEADWEAR</h4></div>
                  </div>
                </>
              )}
            </div>

            {/* 5. Navigation Link List */}
            <div className="menu-nav-links">
              {menuTab === 'Women' && [
                'Trending', 'Clothing', 'Explore', 'Explore Collections', 'Accessories', 'Shop By Activity', 'Shop By Colour', 'Last Chance'
              ].map(item => (
                <button key={item} onClick={() => setMenu(false)}>
                  <span>{item}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
              {menuTab === 'Men' && [
                'New In', 'T-Shirts & Tops', 'Hoodies & Sweats', 'Shorts', 'Pants', 'Accessories', 'Sale'
              ].map(item => (
                <button key={item} onClick={() => setMenu(false)}>
                  <span>{item}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
              {menuTab === 'Accessories' && [
                'All Accessories', 'Headwear', 'Bags', 'Socks', 'Equipment', 'New Releases'
              ].map(item => (
                <button key={item} onClick={() => setMenu(false)}>
                  <span>{item}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </section>
        </nav>
      </div>
    )}

    {/* Full-Screen Search overlay */}
    {searchOpen && (
      <div className="overlay search-overlay" onClick={() => setSearchOpen(false)}>
        <div className="search-page-content" onClick={(e) => e.stopPropagation()}>
          {/* Search Header */}
          <div className="search-header">
            <button className="search-back-btn" onClick={() => setSearchOpen(false)} aria-label="Back">
              <ChevronLeft size={24} />
            </button>
            <div className="search-input-box">
              <Search size={16} />
              <input type="text" placeholder="What are you looking for today?" autoFocus />
            </div>
          </div>

          <div className="search-scrollable">
            {/* Trending Searches */}
            <div className="trending-searches-section">
              <h3>TRENDING SEARCHES</h3>
              <div className="trending-list">
                {['Bratz', 'Mens Shorts', 'Womens Shorts', 'Sports Bra', 'Running'].map(term => (
                  <button key={term} className="trending-item" onClick={() => alert(`Searching for ${term}...`)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="recently-viewed-section">
              <h3>RECENTLY VIEWED</h3>
              <div className="search-rail">
                {products.slice(0, 4).map((p, i) => (
                  <article className="search-card" key={`search-rv-${i}`}>
                    <div className="search-card-image">
                      <img src={p.image} alt={p.name} />
                      <button className="search-card-quick-bag" onClick={() => setAdded(true)} aria-label="Quick Add">
                        <ShoppingBag size={14} />
                      </button>
                      <button className={`search-card-wish ${wishlist.some(x => x.name === p.name) ? 'saved' : ''}`} onClick={() => toggleWishlist(p)} aria-label="Save">
                        <Heart size={14} />
                      </button>
                      {i === 0 && <span className="search-card-badge">NEW & IMPROVED</span>}
                    </div>
                    <div className="search-card-info">
                      <h4>{p.name}</h4>
                      <p className="search-card-category">{i === 0 ? 'Light Support' : 'Jumpsuit fit'}</p>
                      <p className="search-card-color">{i === 0 ? 'Butter Yellow' : 'Blue wash'}</p>
                      <p className="search-card-price">{p.price}</p>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
         {/* Cart/Wishlist Drawer overlay */}
    {cartOpen && (
      <div className="overlay cart-overlay" onClick={() => setCartOpen(false)}>
        <aside className="gymshark-cart" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="cart-header">
            <h2>YOUR BAG</h2>
            <button className="cart-close-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">
              <X size={22} />
            </button>
          </div>

          {/* Switch Tabs */}
          <div className="cart-tabs-switch-wrapper">
            <div className="cart-tabs-switch">
              <button 
                className={`cart-tab-btn ${cartTab === 'bag' ? 'active' : ''}`} 
                onClick={() => setCartTab('bag')}
                aria-label="Shopping Bag"
              >
                <ShoppingBag size={18} />
              </button>
              <button 
                className={`cart-tab-btn ${cartTab === 'wishlist' ? 'active' : ''}`} 
                onClick={() => setCartTab('wishlist')}
                aria-label="Wishlist"
              >
                <Heart size={18} />
              </button>
            </div>
          </div>

          {/* Tab 1: Bag Content */}
          {cartTab === 'bag' && (
            <>
              {/* Free Shipping Progress */}
              <div className={`cart-shipping-progress-wrapper ${added && 1899 * cartQty >= 2500 ? 'shipping-unlocked' : ''}`}>
                {added && 1899 * cartQty >= 2500 ? (
                  <p className="shipping-progress-text">🎉 You've unlocked <b>Free Standard Shipping</b>!</p>
                ) : (
                  <p className="shipping-progress-text">
                    You're <b>LE {added ? Math.max(0,2500 - 1899 * cartQty) : 2500}.00 EGP</b> away from Free Standard Shipping <Info size={12} className="info-inline" />
                  </p>
                )}
                <div className="shipping-progress-bar-track">
                  <div 
                    className="shipping-progress-bar-fill" 
                    style={{ width: `${added ? Math.min(100, (1899 * cartQty / 2500) * 100) : 0}%` }}
                  ></div>
                </div>
                <div className="shipping-progress-labels">
                  <span>LE 0.00</span>
                  <span>LE 2,500.00</span>
                </div>
              </div>

              {/* Urgency Stock callout */}
              <div className="cart-urgency-callout">
                <Info size={16} className="callout-icon" />
                <p>Your items aren't reserved, checkout quickly to make sure you don't miss out.</p>
              </div>

              {/* Cart Scrollable Items */}
              <div className="cart-scroll-content">
                {added && cartQty > 0 ? (
                  <article className="cart-item-card">
                    <div className="cart-item-img">
                      <img src="/assets/grey-1.jpg" alt="Sleek Corset Burkini - Grey" />
                    </div>
                    <div className="cart-item-info">
                      <span className="cart-item-badge">NEW & IMPROVED</span>
                      <h3>Sleek Corset Burkini - Grey</h3>
                      <p className="cart-item-specs">Grey - {size} - 3-piece set</p>
                      <p className="cart-item-price">LE 1,899.00 EGP</p>
                      
                      <button className="cart-item-wish-btn" onClick={() => toggleWishlist({name:'Sleek Corset Burkini - Grey', price:'LE 1,899.00 EGP', image:'/assets/grey-1.jpg'})} aria-label="Save to Love List">
                        <Heart size={16} />
                      </button>

                      <div className="cart-item-qty-selector">
                        <button onClick={() => {
                          if (cartQty <= 1) {
                            setAdded(false);
                            setCartQty(0);
                          } else {
                            setCartQty(q => q - 1);
                          }
                        }} aria-label="Decrease quantity">—</button>
                        <span>{cartQty}</span>
                        <button onClick={() => setCartQty(q => q + 1)} aria-label="Increase quantity">+</button>
                      </div>
                    </div>
                  </article>
                ) : (
                  <div className="empty-cart-state">
                    <ShoppingBag size={48} />
                    <h3>Your bag is empty</h3>
                    <p>Add items to your bag to see them here.</p>
                    <button className="keep-browsing-btn" onClick={() => setCartOpen(false)}>KEEP BROWSING</button>
                  </div>
                )}

                {/* Add a Little Extra Cross Sell */}
                {added && (
                  <div className="cart-cross-sell">
                    <h4>ADD A LITTLE EXTRA</h4>
                    <p className="cross-sell-subtitle">Add one or more of these items to get free delivery</p>
                    <div className="cross-sell-rail">
                      <article className="cross-sell-card">
                        <img src="/assets/burgundy.jpg" alt="Sleek Burgundy Corset Burkini" />
                        <div className="cross-sell-info">
                          <span className="cross-sell-badge">SALE | SAVE LE 300</span>
                          <h5>Sleek Corset Burkini</h5>
                          <p className="cross-sell-price">
                            LE 1,599.00 <span className="strike-price">LE 1,899.00</span>
                          </p>
                          <button className="cross-sell-add-btn" onClick={() => { setAdded(true); setCartQty(q => q + 1); alert("Added Burgundy Corset Burkini to bag!"); }}>
                            + ADD
                          </button>
                        </div>
                      </article>
                      <article className="cross-sell-card">
                        <img src="/assets/barbie.jpg" alt="Barbie Burkini" />
                        <div className="cross-sell-info">
                          <h5>Barbie Burkini</h5>
                          <p className="cross-sell-price">LE 2,499.00</p>
                          <button className="cross-sell-add-btn" onClick={() => { setAdded(true); setCartQty(q => q + 1); alert("Added Barbie Burkini to bag!"); }}>
                            + ADD
                          </button>
                        </div>
                      </article>
                    </div>
                  </div>
                )}

                {/* Discount Code Form */}
                {added && (
                  <div className="cart-discount-section">
                    <h4>DISCOUNT CODE</h4>
                    <form className="cart-discount-form" onSubmit={(e) => {
                      e.preventDefault();
                      setDiscountApplied(true);
                      alert("Discount code applied! LE 150.00 off subtotal.");
                    }}>
                      <input 
                        type="text" 
                        placeholder="Enter code" 
                        value={discountCode} 
                        onChange={e => setDiscountCode(e.target.value)} 
                        required 
                      />
                      <button type="submit" className="discount-apply-btn">APPLY</button>
                    </form>
                    <p className="discount-notice">
                      <Info size={12} className="info-inline" /> Gift Card codes can be applied at checkout.
                    </p>
                  </div>
                )}

                {/* Order Summary */}
                {added && (
                  <div className="cart-summary-section">
                    <h4>ORDER SUMMARY</h4>
                    <div className="summary-row">
                      <span>Sub Total</span>
                      <span>LE {1899 * cartQty - (discountApplied ? 150 : 0)}.00 EGP</span>
                    </div>
                    <div className="summary-row">
                      <span>Estimated Shipping</span>
                      <span>{1899 * cartQty >= 2500 ? 'FREE' : 'LE 50.00 EGP'}</span>
                    </div>
                    <div className="summary-row total-row">
                      <span>Total</span>
                      <span>LE {1899 * cartQty - (discountApplied ? 150 : 0) + (1899 * cartQty >= 2500 ? 0 : 50)}.00 EGP</span>
                    </div>
                    
                    <button className="checkout-btn" onClick={() => alert("Redirecting to checkout page...")}>
                      PROCEED TO CHECKOUT
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tab 2: Wishlist Content */}
          {cartTab === 'wishlist' && (
            <div className="cart-scroll-content">
              <div className="wishlist-head-inside">
                <h3>Saved pieces ({wishlist.length})</h3>
              </div>
              {wishlist.length === 0 ? (
                <div className="empty-love">
                  <Heart size={40} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
                  <h3>Your love list is empty</h3>
                  <p>Tap the heart on any piece to save it here.</p>
                  <button className="keep-browsing-btn" onClick={() => setCartOpen(false)}>KEEP BROWSING</button>
                </div>
              ) : (
                <div className="wish-items-drawer" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {wishlist.map(p => (
                    <article className="wish-item-card-row" key={p.name} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', position: 'relative' }}>
                      <img src={p.image} alt={p.name} style={{ width: '70px', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '4px' }} />
                      <div className="wish-item-info" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>{p.name}</h3>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 10px 0' }}>{p.price}</p>
                        <div className="wish-item-actions" style={{ display: 'flex', gap: '10px' }}>
                          <button className="wish-move-to-bag" onClick={() => { toggleWishlist(p); setAdded(true); setCartQty(1); setCartTab('bag'); }} style={{ border: '1px solid #000000', background: '#000000', color: '#ffffff', fontSize: '9px', fontWeight: '700', padding: '4px 8px', borderRadius: '12px', cursor: 'pointer' }}>
                            MOVE TO BAG
                          </button>
                          <button className="wish-remove-btn" onClick={() => toggleWishlist(p)} style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#64748b', fontSize: '9px', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', cursor: 'pointer' }}>
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    )}
    {/* Sticky bottom buy bar */}
    {showSticky && (
      <div className="sticky-buy-bar">
        <div className="sticky-buy-content">
          <img src="/assets/grey-1.jpg" alt="Sleek Corset Burkini - Grey thumbnail" />
          <div className="sticky-buy-info">
            <h4>Sleek Corset Burkini - Grey</h4>
            <p>LE 1,899.00 EGP</p>
          </div>
        </div>
        <button className={`sticky-buy-btn ${added ? 'added' : ''}`} onClick={() => {setAdded(true); setCartQty(1); setCartOpen(true);}}>
          {added ? 'ADDED' : 'ADD TO BAG'}
        </button>
      </div>
    )}

    {/* Fullscreen Photo Lightbox Viewer */}
    {lightboxImg && (
      <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
        <button className="lightbox-close-btn" onClick={() => setLightboxImg(null)} aria-label="Close image viewer">
          <X size={24} />
        </button>
        <img className="lightbox-image" src={lightboxImg} alt="Fullscreen preview" onClick={(e) => e.stopPropagation()} />
      </div>
    )}

    {/* Floating "Ask an Expert" Capsule FAB */}
    {!footerInView && <button 
      className={`ask-expert-fab ${showSticky ? 'has-sticky-bar' : ''}`} 
      onClick={(e) => { e.preventDefault(); setExpertOpen(true); }}
      aria-label="Ask an expert"
    >
      <div className="online-indicator"></div>
      <span>Ask an Expert</span>
    </button>}

    {/* Stylist Expert consultation drawer */}
    {expertOpen && (
      <div className="overlay expert-overlay" onClick={() => setExpertOpen(false)}>
        <div className="sheet expert-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sheet-head">
            <button aria-label="Close styling consultation" onClick={() => setExpertOpen(false)} style={{marginLeft: 'auto'}}>
              <X />
            </button>
          </div>
          <div className="expert-header-section">
            <h2 className="expert-title">ASK THE FASHION EXPERT FROM YOURS</h2>
            <p className="expert-subtitle">We will follow up with you via email within 24-36 hours</p>
          </div>
          <form className="expert-form" onSubmit={(e) => { e.preventDefault(); setExpertOpen(false); alert("Thank you! We will follow up with you via email within 24-36 hours."); }}>
            <input type="text" placeholder="Your Name" required className="expert-input" />
            <input type="email" placeholder="Your Mail" required className="expert-input" />
            <input type="tel" placeholder="Your Phone" required className="expert-input" />
            <button className="submit-expert" type="submit">SUBMIT</button>
          </form>
        </div>
      </div>
    )}
  </div>
}
