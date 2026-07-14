import { useState, useEffect, useRef } from 'react';
import { Menu, Search, UserRound, ShoppingBag, Heart, X, ArrowRight, Truck, RefreshCcw, Star, ChevronRight, Ruler, ChevronDown, ChevronLeft, Flame, Info, Trash2, Plus} from 'lucide-react';
import './styles.css';
import './overrides.css';
import './touch-gallery.css';

// Custom Smooth Accordion
const CustomAccordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`custom-accordion ${isOpen ? 'is-open' : ''}`}>
      <button className="custom-accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <div className="accordion-icon">{isOpen ? '-' : '+'}</div>
      </button>
      <div className="custom-accordion-content-wrapper">
        <div className="custom-accordion-content">
          <div className="custom-accordion-content-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Scroll-reveal: adds .is-visible when element enters viewpor
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
    // Observe the container itself and all reveal children
    const items = el.querySelectorAll('.reveal-up, .reveal-scale, .reveal-shimmer, .highlight-text');
    items.forEach((item) => observer.observe(item));
    if (el.classList.contains('reveal-up') || el.classList.contains('reveal-scale') || el.classList.contains('reveal-shimmer') || el.classList.contains('highlight-text')) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const sizes = ['Small','Medium','Large','X-Large','XX-Large'];
const products = [
  {name:'Belted Cotton Shirt', price:'LE 750.00 EGP', image:'https://oodstore.com/cdn/shop/files/photo_2026-04-27_07-43-35.jpg?v=1777265216',reviews:0,colors:['#6dbfd1','#222','#d7d4c9']},
  {name:'Rouge Shirt', price:'LE 2,499.00 EGP', image:'https://oodstore.com/cdn/shop/files/photo_2026-04-27_07-43-35.jpg?v=1777265216',reviews:0,colors:['#8e1d27','#1d1d1d']},
  {name:'Barbie Shirt', price:'LE 2,499.00 EGP', image:'https://oodstore.com/cdn/shop/files/photo_2026-04-27_07-43-35.jpg?v=1777265216',reviews:0,colors:['#d4a7b4','#2d2d2d']},
  {name:'Aqua Shirt', price:'LE 2,499.00 EGP', image:'https://oodstore.com/cdn/shop/files/photo_2026-04-27_07-43-35.jpg?v=1777265216',reviews:0,colors:['#42bccc','#111']},
  {name:'Belted Cotton Shirt', price:'LE 750.00 EGP', image:'https://oodstore.com/cdn/shop/files/photo_2026-04-27_07-43-35.jpg?v=1777265216',reviews:0,colors:['#6e7455','#111','#ded9c9']},
  {name:'Belted Cotton Shirt', price:'LE 750.00 EGP', image:'https://oodstore.com/cdn/shop/files/photo_2026-04-27_07-43-35.jpg?v=1777265216',reviews:0,colors:['#692f39','#111','#a9a49d']},
];

const menuCollections = {
  Women: {
    eyebrow: 'THE WOMEN\'S EDIT',
    title: 'Quiet confidence, cut with intention.',
    feature: 'The shirt collection',
    links: [
      ['New arrivals', 'The latest pieces'],
      ['Shirts & layers', 'Considered everyday dressing'],
      ['Complete the look', 'Curated pairings'],
      ['Shop by colour', 'Find your shade'],
      ['Last pieces', 'Limited availability']
    ]
  },
  Men: {
    eyebrow: 'THE MEN\'S EDIT',
    title: 'Relaxed essentials, refined for every day.',
    feature: 'Modern foundations',
    links: [
      ['New arrivals', 'The latest pieces'],
      ['Shirts & tops', 'Everyday foundations'],
      ['Relaxed layers', 'Built for versatility'],
      ['Accessories', 'The finishing details'],
      ['Last pieces', 'Limited availability']
    ]
  },
  Accessories: {
    eyebrow: 'THE DETAILS EDIT',
    title: 'Small details that finish the story.',
    feature: 'The finishing touch',
    links: [
      ['View all', 'The full accessories edit'],
      ['Bags', 'Made to move with you'],
      ['Headwear', 'A considered finish'],
      ['Everyday details', 'Small pieces, lasting use'],
      ['New releases', 'Just arrived']
    ]
  }
};

function Header({onMenu,onSearch,onWishlist,onCart,onPlaceholder,wishlistCount,cartCount}) {
  const [timeLeft, setTimeLeft] = useState(10800);

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
    "Get 10 EGP off when you refer a friend",
    "Free standard shipping on orders over LE 2,500"
  ];

  const timeParts = [
    { label: 'Day', value: Math.floor(timeLeft / 86400) },
    { label: 'Hour', value: Math.floor((timeLeft % 86400) / 3600) },
    { label: 'Min', value: Math.floor((timeLeft % 3600) / 60) },
    { label: 'Sec', value: timeLeft % 60 }
  ];

  const [chromeState, setChromeState] = useState({
    announcementHidden: false,
    headerHidden: false
  });
  const chromeStateRef = useRef(chromeState);
  const lastScrollY = useRef(0);
  const announcementHiddenAtY = useRef(null);
  const ticking = useRef(false);

  useEffect(() => {
    chromeStateRef.current = chromeState;
  }, [chromeState]);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY.current;
        const atTop = currentScrollY <= 18;
        const movedEnough = Math.abs(delta) > 7;
        const scrollingDown = delta > 0;
        const scrollingUp = delta < 0;
        const shouldHideAnnouncement = !atTop && (
          chromeStateRef.current.announcementHidden || currentScrollY > 170
        );

        if (atTop) {
          announcementHiddenAtY.current = null;
        } else if (!chromeStateRef.current.announcementHidden && shouldHideAnnouncement) {
          announcementHiddenAtY.current = currentScrollY;
        }

        const distanceAfterAnnouncement = announcementHiddenAtY.current === null
          ? 0
          : currentScrollY - announcementHiddenAtY.current;
        const canHideHeader = chromeStateRef.current.announcementHidden && distanceAfterAnnouncement >= 300;
        const shouldHideHeader = !atTop && (
          (chromeStateRef.current.headerHidden && !scrollingUp) ||
          (movedEnough && scrollingDown && canHideHeader)
        );

        const nextChromeState = {
          announcementHidden: atTop ? false : shouldHideAnnouncement,
          headerHidden: atTop ? false : shouldHideHeader
        };

        if (
          nextChromeState.announcementHidden !== chromeStateRef.current.announcementHidden ||
          nextChromeState.headerHidden !== chromeStateRef.current.headerHidden
        ) {
          chromeStateRef.current = nextChromeState;
          setChromeState(nextChromeState);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky-header-container ${chromeState.announcementHidden ? 'announcement-gone' : ''} ${chromeState.headerHidden ? 'header-hidden' : ''}`}>
      <div className={`announcement ${chromeState.announcementHidden ? 'announcement-hidden' : ''}`}>
        <div className="announcement-content">
          <a href="#" className="announcement-offer" onClick={(e) => { e.preventDefault(); onPlaceholder(); }}>
            <span className="announcement-kicker">SPECIAL OFFER</span>
            <span className="announcement-copy">Free delivery for 48 hours only + 50% off</span>
          </a>
          <div className="announcement-countdown" aria-label="Offer countdown">
            {timeParts.map((part, index) => (
              <div className="announcement-time-block" key={part.label}>
                {index > 0 && <span className="announcement-separator">:</span>}
                <span className="announcement-number">{part.value.toString().padStart(2, '0')}</span>
                <span className="announcement-label">{part.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <header>
        <div className="header-left">
          <button aria-label="Open menu" onClick={onMenu}><Menu/></button>
          <button aria-label="Search" onClick={onSearch}><Search/></button>
        </div>
        <h1 className="logo" style={{margin:0, fontSize: "20px", fontWeight: "bold", letterSpacing: "1px", textAlign: "center"}}>OODSTORE</h1>
        <div className="header-right">
          <button aria-label="Love list" className="love" onClick={onWishlist}><Heart/><b>{wishlistCount}</b></button>
          <button aria-label="Bag" className="bag" onClick={onCart}><ShoppingBag/><b>{cartCount}</b></button>
        </div>
      </header>
    </div>
  );
}

function Stars({count=0}) { return <div className={`stars ${count===0?'empty-stars':''}`}><span>{[0,1,2,3,4].map(i=><Star key={i}/>)}</span><small>{count===0?'No reviews yet':`(${count})`}</small></div> }

function GetTheLook({ product, onPlaceholder }) {
  const ref = useScrollReveal();
  return (
    <section className="get-the-look-section reveal-up" ref={ref}>
      <div className="gtl-card" role="button" tabIndex={0} aria-label="View curated look" onClick={onPlaceholder} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onPlaceholder(); } }}>
        <div className="gtl-header">
          <div className="gtl-title">
            <span className="gtl-kicker">Curated edit</span>
            <strong>Get the look</strong>
            <span className="gtl-count">1 piece selected</span>
          </div>
          <span className="gtl-arrow" aria-hidden="true"><ChevronRight size={16} /></span>
        </div>
        <div className="gtl-body">
          <div className="gtl-image-frame">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="gtl-copy">
            <p className="gtl-product-name">{product.name}</p>
            <p className="gtl-product-note">Styled for refined everyday coverage</p>
            <p className="gtl-product-price">{product.price}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductRail({title, subtitle, items, wishlist, toggleWishlist, onRestrictedClick, animClass = "reveal-up"}) {
  const ref = useScrollReveal();
  const [swiped, setSwiped] = useState(false);
  const [glideDirection, setGlideDirection] = useState('');
  const railRef = useRef(null);
  const glideTimer = useRef(null);
  const glideFrame = useRef(null);
  const scrollRail = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    window.clearTimeout(glideTimer.current);
    window.cancelAnimationFrame(glideFrame.current);
    setGlideDirection(direction > 0 ? 'is-gliding-next' : 'is-gliding-prev');
    const start = rail.scrollLeft;
    const max = rail.scrollWidth - rail.clientWidth;
    const cards = Array.from(rail.querySelectorAll('.gymshark-card'));
    const cardPositions = cards.map(card => card.offsetLeft - rail.offsetLeft);
    const currentIndex = cardPositions.reduce((closestIndex, position, index) => (
      Math.abs(position - start) < Math.abs(cardPositions[closestIndex] - start) ? index : closestIndex
    ), 0);
    const targetIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + direction));
    const target = Math.max(0, Math.min(max, cardPositions[targetIndex] ?? start));
    const duration = 760;
    const startedAt = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      rail.scrollLeft = start + (target - start) * easeOutCubic(progress);
      if (progress < 1) {
        glideFrame.current = window.requestAnimationFrame(step);
      } else {
        glideTimer.current = window.setTimeout(() => setGlideDirection(''), 140);
      }
    };

    glideFrame.current = window.requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(glideTimer.current);
      window.cancelAnimationFrame(glideFrame.current);
    };
  }, []);

  return <section className={`rail-section premium-recommendations ${animClass}`} ref={ref} style={{ width: '100%', overflow: 'visible' }}>
    <div className="premium-rail-shell" style={{ paddingLeft: '16px', boxSizing: 'border-box' }}>
      <div className="section-title" style={{ padding: 0, marginBottom: '16px' }}>
        <div className="section-title-left">
          <span className="premium-rail-kicker">Selected for you</span>
          <h2 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#000' }}>{title}</h2>
          {subtitle && <p className="section-subtitle" style={{ fontSize: '12px', color: '#666', margin: 0 }}>{subtitle}</p>}
        </div>
        <div className="premium-rail-controls" aria-label="Scroll recommendations">
          <button type="button" onClick={() => scrollRail(-1)} aria-label="Previous recommendations"><ChevronLeft size={16} /></button>
          <button type="button" onClick={() => scrollRail(1)} aria-label="Next recommendations"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className={`rail ${glideDirection}`} ref={railRef} onScroll={() => { if(!swiped) setSwiped(true); }} style={{ display: 'flex', overflowX: 'auto', gap: '12px', padding: 0, width: '100%', boxSizing: 'border-box' }}>
        {items.map((p,i)=><article className="card gymshark-card" key={`${title}-${i}`} style={{ flex: '0 0 calc(50% - 6px)', minWidth: '140px', maxWidth: '220px', padding: 0 }}>
          <div className="card-image" style={{ position: 'relative', width: '100%', height: 'auto', aspectRatio: '3/4', marginBottom: '8px', background: '#f4f4f4', borderRadius: '4px', overflow: 'hidden' }}>
            <img src={p.image} alt={p.name} onClick={onRestrictedClick} style={{cursor:'pointer', width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} draggable={false} />
            {i === 0 && <span className="gymshark-new-badge">NEW</span>}
            <button className={`gymshark-heart ${wishlist.includes(p.name)?'saved':''}`} onClick={()=>toggleWishlist(p)} aria-label={`Save ${p.name}`}><Heart size={16}/></button>
          </div>
          <div className="card-copy gymshark-copy" style={{ display: 'flex', flexDirection: 'column', padding: '0 4px', margin: 0 }}>
            <h3 onClick={onRestrictedClick} style={{cursor:'pointer', fontSize: '13px', fontWeight: 500, margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', color: '#111'}}>{p.name}</h3>
            <p className="gymshark-color" style={{ fontSize: '12px', color: '#666', margin: '0 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{i===0?'Black':'Super-Set Pink/Focus Pink'}</p>
            <p className="card-price gymshark-price" style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: '#111' }}>{p.price}</p>
          </div>
        </article>)}
      </div>
    </div>
  </section>
}

function SizeGuide({close, currentSize, setSize}) {
  const [guideSize,setGuideSize]=useState(currentSize || 'Small');
  const [unit,setUnit]=useState('CM');

  const rows = [
    ['Small', 'S', 89, 92],
    ['Medium', 'M', 94, 97],
    ['Large', 'L', 99, 102],
    ['X-Large', 'XL', 104, 107],
    ['XX-Large', 'XXL', 109, 112]
  ];

  const range = (r) => {
    if (unit === 'CM') return `${r[2]}-${r[3]}`;
    return `${Math.round(r[2]*0.393701)}-${Math.round(r[3]*0.393701)}`;
  };

  const selected = rows.find(r => r[0] === guideSize) || rows[0];

  return <div className="overlay sg-overlay" onClick={close}>
    <div className="sg-drawer" onClick={e=>e.stopPropagation()}>
      <div className="sg-header">
        <h2>SIZE GUIDE</h2>
        <button className="sg-close" onClick={close}><X size={24} strokeWidth={1} /></button>
      </div>

      <div className="sg-content">
        <p className="sg-subtitle">Belted Cotton Shirt</p>

        <div className="sg-toggle-wrap">
          <div className="sg-toggle">
            <div className="sg-toggle-bg" style={{ transform: unit === 'CM' ? 'translateX(100%)' : 'translateX(0)' }}></div>
            <button className={unit === 'IN' ? 'active' : ''} onClick={() => setUnit('IN')}>INCHES</button>
            <button className={unit === 'CM' ? 'active' : ''} onClick={() => setUnit('CM')}>CENTIMETERS</button>
          </div>
        </div>

        <div className="sg-table">
          <div className="sg-table-head">
            <span>SIZE</span>
            <span>BUST</span>
            <span></span>
          </div>
          <div className="sg-table-body">
            {rows.map(r => (
              <div
                key={r[0]}
                className={`sg-row ${selected[0]===r[0] ? 'active' : ''}`}
                onClick={() => setGuideSize(r[0])}
              >
                <strong>{r[1]}</strong>
                <span>{range(r)} {unit}</span>
                <div className="sg-radio">
                  <div className="sg-radio-inner"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sg-footer-info">
          <img src="https://oodstore.com/cdn/shop/files/photo_2026-04-27_07-43-35.jpg?v=1777265216" alt="Fit ref" />
          <div className="sg-fit-text">
            <h3>FIT NOTES</h3>
            <p>Regular fit. Model is 175cm/5'9" and wears size S.</p>
          </div>
        </div>
      </div>

      <div className="sg-sticky-footer">
        <div className="sg-selection-text">
          <span>SELECTED</span>
          <strong>{selected[1]} ({range(selected)} {unit})</strong>
        </div>
        <button className="sg-use-btn" onClick={() => { setSize?.(selected[0]); close(); }}>
          CONFIRM SIZE
        </button>
      </div>
    </div>
  </div>
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

function ReviewForm({close, onPlaceholder}) {
  const [fit,setFit]=useState(50); const [quality,setQuality]=useState(85); const [design,setDesign]=useState(85); const [rating,setRating]=useState(0);
  return <div className="overlay review-overlay" onClick={close}><form className="review-form" onClick={e=>e.stopPropagation()} onSubmit={e=>{e.preventDefault();close();onPlaceholder?.()}}>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartQty, setCartQty] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [restrictedMsg, setRestrictedMsg] = useState(false);
  const [isStickySmall, setIsStickySmall] = useState(false);

  const clothingReviews = [
    { name: "Sarah M.", text: "\"This is officially my new favorite set. The compression is perfect without digging in, and it stays perfectly in place during my HIIT workouts.\"", title: "Obsessed with the fit!", time: "2 DAYS AGO", rating: 5 },
    { name: "Jessica T.", text: "\"The seamless design really contours nicely. I was worried about the lighter color being see-through but it is 100% squat proof. Buying in black next!\"", title: "So flattering", time: "1 WEEK AGO", rating: 5 },
    { name: "Amanda K.", text: "\"Finally found leggings that don't roll down at the waist! The material is incredibly soft and breathable. Worth every penny.\"", title: "Doesn't roll down", time: "2 WEEKS AGO", rating: 5 },
    { name: "Rachel L.", text: "\"I get compliments every time I wear this set to the gym. The color is exactly as pictured and it holds up great in the wash.\"", title: "Amazing color and quality", time: "1 MONTH AGO", rating: 4 },
    { name: "Michelle B.", text: "\"The sports bra offers amazing support without being too restrictive. Perfect for both weightlifting and running.\"", title: "Great support", time: "1 MONTH AGO", rating: 5 },
    { name: "Nicole W.", text: "\"Best activewear purchase this year. The fabric feels premium and it really wicks away sweat during intense sessions.\"", title: "Premium feel", time: "2 MONTHS AGO", rating: 5 },
    { name: "Lauren C.", text: "\"Love the subtle branding and the overall aesthetic. It's comfortable enough to wear all day, not just for workouts.\"", title: "Versatile and cute", time: "2 MONTHS AGO", rating: 4 },
    { name: "Emily S.", text: "\"The fit is incredibly true to size. It hugs all the right places and gives me so much confidence in the gym!\"", title: "True to size", time: "3 MONTHS AGO", rating: 5 }
  ];
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    const reviewInterval = setInterval(() => {
      setActiveReview(prev => (prev + 1) % clothingReviews.length);
    }, 5000);
    return () => clearInterval(reviewInterval);
  }, [clothingReviews.length]);

  useEffect(() => {
    const handleScroll = () => {
      const newsletter = document.querySelector('.newsletter');
      const newsletterNear = newsletter ? newsletter.getBoundingClientRect().top < window.innerHeight * 0.88 : false;
      const scrollY = window.scrollY;
      setFooterInView(newsletterNear);
      setShowSticky(scrollY > 720);
      setIsStickySmall(scrollY > 880);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when overlays are open
  useEffect(() => {
    if (menu || guide || searchOpen || cartOpen || expertOpen || reviewForm || lightboxImg || wishlistOpen || restrictedMsg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menu, guide, searchOpen, cartOpen, expertOpen, reviewForm, lightboxImg, wishlistOpen, restrictedMsg]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const closeSearch = (event) => {
      if (event.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', closeSearch);
    return () => window.removeEventListener('keydown', closeSearch);
  }, [searchOpen]);

  useEffect(() => {
    if (!menu) return undefined;
    const closeMenu = (event) => {
      if (event.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', closeMenu);
    return () => window.removeEventListener('keydown', closeMenu);
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    const frame = window.requestAnimationFrame(() => {
      document.querySelector('.editorial-menu-scroll')?.scrollTo({ top: 0, behavior: 'auto' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [menu, menuTab]);

  // Global drag-to-scroll for all horizontally scrollable elements
  useEffect(() => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let activeElem = null;

    const onMouseDown = (e) => {
      const elem = e.target.closest('.rail, .menu-banners-row, .search-rail, .cart-tabs-switch-wrapper, .cart-cross-sell-rail, .size-selector-card');
      if (!elem) return;
      isDown = true;
      activeElem = elem;
      startX = e.pageX - elem.offsetLeft;
      scrollLeft = elem.scrollLeft;
    };
    const onMouseLeave = () => { isDown = false; activeElem = null; };
    const onMouseUp = () => { isDown = false; activeElem = null; };
    const onMouseMove = (e) => {
      if (!isDown || !activeElem) return;
      e.preventDefault();
      const x = e.pageX - activeElem.offsetLeft;
      const walk = (x - startX) * 1.5;
      activeElem.scrollLeft = scrollLeft - walk;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const toggleWishlist=(p)=>setWishlist(w=>w.some(x=>x.name===p.name)?w.filter(x=>x.name!==p.name):[...w,p]);
  const searchMatches = searchQuery.trim()
    ? products.filter(product => product.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : products.slice(0, 4);
  return <div className="page">
    <Header onMenu={()=>setMenu(true)} onSearch={() => setSearchOpen(true)} onWishlist={()=>setWishlistOpen(true)} onCart={() => setCartOpen(true)} onPlaceholder={() => setRestrictedMsg(true)} wishlistCount={wishlist.length} cartCount={added ? cartQty : 0}/>
    <main>
      <div className="breadcrumbs">Home / Swim / Shirts</div>
      <div className="gallery" onPointerDown={e=>setSwipeStart(e.clientX)} onPointerUp={e=>{if(swipeStart===null)return;const delta=e.clientX-swipeStart;if(Math.abs(delta)>42)setSlide(current=>delta<0?Math.min(2,current+1):Math.max(0,current-1));setSwipeStart(null)}} onPointerCancel={()=>setSwipeStart(null)}>
        <div className="gallery-track" style={{transform:`translateX(-${slide*100}%)`}}>
          {["https://cdn.shopify.com/s/files/1/0722/0166/6721/files/photo_2026-04-27_07-43-35.jpg?v=1777265216","https://cdn.shopify.com/s/files/1/0722/0166/6721/files/photo_2026-04-27_07-43-27.jpg?v=1777265222","https://cdn.shopify.com/s/files/1/0722/0166/6721/files/photo_2026-04-27_07-43-48.jpg?v=1777265180"].map((url, i) => (
            <img
              key={i}
              className="skeleton-pulse"
              onLoad={(e)=>e.target.classList.remove('skeleton-pulse')}
              src={url}
              alt={`Product view ${i}`}
              onClick={()=>setLightboxImg(url)}
              style={{cursor:'zoom-in'}}
              draggable={false}
            />
          ))}
        </div>
        <div className="gallery-thumbnails-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '4px 12px', justifyContent: 'center' }}>
          <button
            onClick={() => setSlide(s => Math.max(0, s - 1))}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', background: '#fff', color: '#111', cursor: 'pointer', flexShrink: 0, opacity: slide === 0 ? 0.2 : 1, transition: 'opacity 0.3s ease', zIndex: 2 }}
            disabled={slide === 0}
            aria-label="Previous image"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <div className="gallery-thumbnails" style={{ display: 'flex', gap: '12px' }}>
            {["https://cdn.shopify.com/s/files/1/0722/0166/6721/files/photo_2026-04-27_07-43-35.jpg?v=1777265216","https://cdn.shopify.com/s/files/1/0722/0166/6721/files/photo_2026-04-27_07-43-27.jpg?v=1777265222","https://cdn.shopify.com/s/files/1/0722/0166/6721/files/photo_2026-04-27_07-43-48.jpg?v=1777265180"].map((url, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                onPointerEnter={() => setSlide(i)}
                style={{
                  flex: '0 1 auto',
                  width: '72px',
                  height: '72px',
                  padding: '2px',
                  border: slide === i ? '1px solid #111' : '1px solid transparent',
                  borderRadius: '6px',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  opacity: slide === i ? 1 : 0.6,
                  transform: slide === i ? 'scale(1)' : 'scale(0.96)',
                }}
                aria-label={`Thumbnail ${i+1}`}
              >
                <img src={url} alt={`Thumbnail ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              </button>
            ))}
          </div>
          <button
            onClick={() => setSlide(s => Math.min(2, s + 1))}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', background: '#fff', color: '#111', cursor: 'pointer', flexShrink: 0, opacity: slide === 2 ? 0.2 : 1, transition: 'opacity 0.3s ease', zIndex: 2 }}
            disabled={slide === 2}
            aria-label="Next image"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <section className="product-info">
        <p className="eyebrow product-badge">DESIGNED FOR CONFIDENT COVERAGE</p><h1>Belted Cotton Shirt</h1><p className="price">LE 750.00 EGP</p><p className="preorder">PRE-ORDER · 10–15 WORKING DAYS</p>
        <div className="size-selector-new-wrap">
          <div className="size-header-new">
            <span>Size: <strong>{size === 'Small' ? 'S' : size === 'Medium' ? 'M' : size === 'Large' ? 'L' : size === 'X-Large' ? 'XL' : size === 'XX-Large' ? 'XXL' : ''}</strong></span>
            <button className="size-guide-btn" onClick={()=>setGuide(true)}>Size Guide</button>
          </div>
          <div className="size-options-new">
            {['Small','Medium','Large','X-Large','XX-large'].map(s=><button className={size===s?'selected':''} onClick={()=>setSize(s)} key={s}>{s === 'Small' ? 'S' : s === 'Medium' ? 'M' : s === 'Large' ? 'L' : s === 'X-Large' ? 'XL' : 'XXL'}</button>)}
          </div>
        </div>
        <button className={`add squish-anim ${added?'added':''}`} onClick={()=>{setAdded(true); setCartQty(1); setCartOpen(true);}}>{added?'ADDED TO BAG':'PRE-ORDER — LE 750.00 EGP'}</button>




        {/* Gymshark-style collapsible accordion sections */}
        <div className="accordion-group">
          <CustomAccordion title="Description & Features">
            <p>Shirt Set of 3 pieces {'{'}Bodysuit - Wrap Skirt - Leggings{'}'}</p>
            <p>Model is Wearing size SMALL</p>
          </CustomAccordion>

          <CustomAccordion title="Size & Fit">
            <p>Shirts Size Chart</p>
            <ul>
              <li><strong>S:</strong> 50–55 kg</li><li><strong>M:</strong> 55–60 kg</li><li><strong>L:</strong> 60–65 kg</li><li><strong>XL:</strong> 65–70 kg</li><li><strong>XXL:</strong> 70–75 kg</li>
            </ul>
          </CustomAccordion>

          <CustomAccordion title="Shipping">
            <ul>
              <li><strong>Orders:</strong> 2–6 working days</li><li><strong>Pre-orders:</strong> 10–15 working days</li>
            </ul>
          </CustomAccordion>

          <CustomAccordion title="Policy">
            <p>Check if the order suits you before paying. If not, return it with the courier on the spot and only pay shipping fees.</p>
            <ul>
              <li>No returns after paying; exchanges within 14 days.</li><li>Customers cover additional costs.</li><li><strong>Shirts:</strong> once the courier leaves, no exchange or refund.</li><li>No returns or exchanges on sale items.</li>
            </ul>
          </CustomAccordion>
        </div>
      </section>
      <GetTheLook product={products[1]} onPlaceholder={() => setRestrictedMsg(true)} />
      <ProductRail title="YOU MIGHT LIKE TOO" subtitle="We think these products pair perfectly." items={products.slice(0,4)} wishlist={wishlist.map(x=>x.name)} toggleWishlist={toggleWishlist} onRestrictedClick={() => setRestrictedMsg(true)} animClass="reveal-up"/>
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

        <div className="carousel-viewport" style={{ overflow: 'hidden', position: 'relative', width: '100%', touchAction: 'pan-y' }} onPointerDown={e => {
            const startX = e.clientX;
            const handlePointerUp = (upE) => {
              const deltaX = upE.clientX - startX;
              if (Math.abs(deltaX) > 40) {
                if (deltaX > 0) {
                  setActiveReview(prev => (prev === 0 ? clothingReviews.length - 1 : prev - 1));
                } else {
                  setActiveReview(prev => (prev === clothingReviews.length - 1 ? 0 : prev + 1));
                }
              }
              window.removeEventListener('pointerup', handlePointerUp);
            };
            window.addEventListener('pointerup', handlePointerUp);
          }}>
          <div className="carousel-track" style={{ display: 'flex', transition: 'transform 0.4s ease-out', transform: `translateX(-${activeReview * 100}%)` }}>
            {clothingReviews.map((review, i) => (
              <div key={i} className="review-card" style={{ minWidth: '100%', flex: '0 0 100%', boxSizing: 'border-box' }}>
                <div className="review-top">
                  <div className="stars">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} style={{ opacity: idx < review.rating ? 1 : 0.3 }} />
                    ))}
                  </div>
                  <span>{review.time}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>{review.title}</h3>
                <p style={{ fontStyle: 'italic', color: '#555' }}>{review.text}</p>
                <small style={{ fontWeight: '500' }}>— {review.name} (Verified Buyer)</small>
              </div>
            ))}
          </div>
        </div>

        <div className="review-carousel-nav" aria-label="Review navigation">
          <button
            className="review-carousel-arrow"
            onClick={() => setActiveReview(prev => prev === 0 ? clothingReviews.length - 1 : prev - 1)}
            aria-label="Previous review"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="carousel-dots" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {clothingReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveReview(i)}
                style={{
                  width: '8px', height: '8px', borderRadius: '50%', padding: 0,
                  background: activeReview === i ? '#111' : '#ccc', border: 'none', transition: 'background 0.3s'
                }}
                aria-label={`Go to review ${i + 1}`}
                aria-current={activeReview === i ? 'true' : undefined}
              />
            ))}
          </div>
          <button
            className="review-carousel-arrow"
            onClick={() => setActiveReview(prev => prev === clothingReviews.length - 1 ? 0 : prev + 1)}
            aria-label="Next review"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="review-actions" style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button className="review-action-primary" style={{ flex: 1, padding: '14px 10px', background: '#333', color: '#fff', border: '1px solid #333', fontSize: '11px', letterSpacing: '0.05em' }} onClick={() => setRestrictedMsg(true)}>Write a Review</button>
          <button className="review-action-secondary" style={{ flex: 1, padding: '14px 10px', background: 'transparent', color: '#333', border: '1px solid #333', fontSize: '11px', letterSpacing: '0.05em' }} onClick={() => setRestrictedMsg(true)}>SHOW MORE</button>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="newsletter reveal-scale" ref={useScrollReveal()}>
        <h2>{newsletterJoined?'Welcome to the edit.':'New drops, first.'}</h2>
        <p style={{ margin: '12px auto' }}>{newsletterJoined?'You are on the list. Watch your inbox for new collections and private releases.':'Receive considered updates about new pieces, private releases and styling notes.'}</p>
        {!newsletterJoined&&<form className="newsletter-form" onSubmit={e=>{e.preventDefault();setNewsletterJoined(true)}} style={{ margin: '0 auto', textAlign: 'left' }}><label htmlFor="newsletter-email">Email address</label><div><input id="newsletter-email" type="email" required value={newsletterEmail} onChange={e=>setNewsletterEmail(e.target.value)} placeholder="you@example.com"/><button type="submit">JOIN THE LIST <ArrowRight/></button></div></form>}
      </section>
    </main>

    {guide&&<SizeGuide close={()=>setGuide(false)} currentSize={size} setSize={setSize}/>}
    {reviewForm&&<ReviewForm close={()=>setReviewForm(false)} onPlaceholder={() => setRestrictedMsg(true)}/>}
    {menu && (
      <div className="overlay menu-overlay editorial-menu-overlay" onClick={() => setMenu(false)}>
        <section className="editorial-menu-page" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="OODSTORE menu">
          <header className="editorial-menu-topbar">
            <span>OODSTORE</span>
            <div>
              <button onClick={() => { setMenu(false); setSearchOpen(true); }} aria-label="Open search"><Search size={18} /></button>
              <button onClick={() => { setMenu(false); setWishlistOpen(true); }} aria-label="Open saved pieces" className="editorial-menu-saved">
                <Heart size={18} />
                {wishlist.length > 0 && <b>{wishlist.length}</b>}
              </button>
              <button onClick={() => setMenu(false)} aria-label="Close menu"><X size={19} /></button>
            </div>
          </header>

          <div className="editorial-menu-scroll">
            <div className="editorial-menu-intro">
              <p>{menuCollections[menuTab].eyebrow}</p>
              <h2>{menuCollections[menuTab].title}</h2>
            </div>

            <div className="editorial-menu-tabs" role="tablist" aria-label="Shop departments">
              {['Women', 'Men', 'Accessories'].map(tabName => (
                <button
                  key={tabName}
                  role="tab"
                  aria-selected={menuTab === tabName}
                  className={menuTab === tabName ? 'active' : ''}
                  onClick={() => setMenuTab(tabName)}
                >
                  {tabName}
                </button>
              ))}
            </div>

            <button className="editorial-menu-feature" onClick={() => { setMenu(false); setRestrictedMsg(true); }} aria-label={`Explore ${menuCollections[menuTab].feature}`}>
              <img src={products[0].image} alt="Belted Cotton Shirt collection" />
              <span><small>FEATURED EDIT</small><strong>{menuCollections[menuTab].feature}</strong><i>DISCOVER <ArrowRight size={14} /></i></span>
            </button>

            <div className="editorial-menu-links" role="navigation" aria-label={`${menuTab} collections`}>
              {menuCollections[menuTab].links.map(([title, note], index) => (
                <button key={title} onClick={() => { setMenu(false); setRestrictedMsg(true); }}>
                  <span>0{index + 1}</span>
                  <span><strong>{title}</strong><small>{note}</small></span>
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>

            <div className="editorial-menu-service">
              <button onClick={() => { setMenu(false); setWishlistOpen(true); }}><Heart size={17} /><span><strong>Saved pieces</strong><small>{wishlist.length ? `${wishlist.length} in your edit` : 'Build your personal edit'}</small></span><ArrowRight size={15} /></button>
              <button onClick={() => { setMenu(false); setExpertOpen(true); }}><span className="editorial-menu-monogram">O</span><span><strong>Personal styling</strong><small>Talk to the OODSTORE team</small></span><ArrowRight size={15} /></button>
            </div>
          </div>

          <footer className="editorial-menu-footer"><span>CAIRO, EGYPT</span><span>EN · EGP</span></footer>
        </section>
      </div>
    )}

    {/* Editorial search experience */}
    {searchOpen && (
      <div className="overlay editorial-search-overlay" onClick={() => setSearchOpen(false)}>
        <section className="editorial-search-page" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Search OODSTORE">
          <header className="editorial-search-topbar">
            <span>OODSTORE</span>
            <button onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={19} /></button>
          </header>

          <div className="editorial-search-scroll">
            <div className="editorial-search-intro">
              <p>DISCOVER</p>
              <h2>Find your next piece.</h2>
            </div>

            <div className="editorial-search-field">
              <Search size={19} />
              <inpu
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search shirts, colours, edits..."
                aria-label="Search products"
                autoFocus
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} aria-label="Clear search"><X size={16} /></button>}
            </div>

            {searchQuery.trim() ? (
              <section className="editorial-search-results">
                <div className="editorial-search-section-head">
                  <div><p>SEARCH RESULTS</p><h3>{searchMatches.length ? 'Pieces found' : 'Nothing matched'}</h3></div>
                  <span>{searchMatches.length}</span>
                </div>
                {searchMatches.length ? (
                  <div className="editorial-search-grid">
                    {searchMatches.map((product, index) => (
                      <article className="editorial-search-product" key={`${product.name}-${index}`}>
                        <button className="editorial-search-product-image" onClick={() => { setSearchOpen(false); setRestrictedMsg(true); }} aria-label={`View ${product.name}`}>
                          <img src={product.image} alt={product.name} />
                        </button>
                        <div className="editorial-search-product-copy">
                          <div><h4>{product.name}</h4><span>{index === 0 ? 'Grey' : 'Seasonal colour'}</span></div>
                          <button className={wishlist.some(item => item.name === product.name) ? 'saved' : ''} onClick={() => toggleWishlist(product)} aria-label={`Save ${product.name}`}><Heart size={16} /></button>
                          <p>{product.price}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="editorial-search-empty">
                    <p>Try a simpler phrase or explore one of the edits below.</p>
                    <button onClick={() => setSearchQuery('')}>BACK TO DISCOVER</button>
                  </div>
                )}
              </section>
            ) : (
              <div className="editorial-search-discovery">
                <section className="editorial-search-prompts">
                  <div className="editorial-search-section-head"><div><p>START HERE</p><h3>Popular searches</h3></div></div>
                  <div>
                    {['Belted shirts', 'Cotton layers', 'Everyday tailoring', 'New arrivals'].map((term, index) => (
                      <button key={term} onClick={() => setSearchQuery(term.split(' ')[0])}>
                        <span>0{index + 1}</span><strong>{term}</strong><ArrowRight size={16} />
                      </button>
                    ))}
                  </div>
                </section>

                <section className="editorial-search-feature">
                  <button className="editorial-search-feature-image" onClick={() => { setSearchOpen(false); setRestrictedMsg(true); }} aria-label="Explore the shirt edit">
                    <img src={products[0].image} alt="The shirt edit" />
                  </button>
                  <div><p>THE CURRENT EDIT</p><h3>Relaxed structure, considered details.</h3><button onClick={() => setSearchQuery('Shirt')}>EXPLORE SHIRTS <ArrowRight size={14} /></button></div>
                </section>

                <section className="editorial-search-recent">
                  <div className="editorial-search-section-head"><div><p>RETURN TO</p><h3>Recently viewed</h3></div></div>
                  <div className="editorial-search-recent-grid">
                    {products.slice(0, 2).map((product, index) => (
                      <article key={`${product.name}-recent-${index}`}>
                        <button onClick={() => { setSearchOpen(false); setRestrictedMsg(true); }} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} /></button>
                        <h4>{product.name}</h4><p>{product.price}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          <footer className="editorial-search-footer">Curated for considered, everyday dressing.</footer>
        </section>
      </div>
    )}
    {/* Dedicated wishlist drawer */}
    {wishlistOpen && (
      <div className="overlay premium-wishlist-overlay" onClick={() => setWishlistOpen(false)}>
        <aside className="premium-wishlist-drawer" onClick={(e) => e.stopPropagation()} aria-label="Saved pieces">
          <header className="premium-wishlist-header">
            <div>
              <p>YOUR EDIT</p>
              <h2>Saved pieces</h2>
            </div>
            <div className="premium-wishlist-header-actions">
              <span>{wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'}</span>
              <button onClick={() => setWishlistOpen(false)} aria-label="Close saved pieces"><X size={19} /></button>
            </div>
          </header>

          {wishlist.length > 0 ? (
            <div className="premium-wishlist-content">
              <p className="premium-wishlist-intro">A considered collection of the pieces you want to return to.</p>
              <div className="premium-wishlist-list">
                {wishlist.map((item, index) => (
                  <article className="premium-wishlist-item" key={item.name} style={{'--wish-delay': `${120 + index * 70}ms`}}>
                    <button className="premium-wishlist-image" onClick={() => { setWishlistOpen(false); setRestrictedMsg(true); }} aria-label={`View ${item.name}`}>
                      <img src={item.image} alt={item.name} />
                      <span>VIEW</span>
                    </button>
                    <div className="premium-wishlist-copy">
                      <p>OODSTORE</p>
                      <h3>{item.name}</h3>
                      <span className="premium-wishlist-price">{item.price}</span>
                      <div className="premium-wishlist-item-actions">
                        <button className="premium-wishlist-view" onClick={() => { setWishlistOpen(false); setRestrictedMsg(true); }}>VIEW PRODUCT <ArrowRight size={14} /></button>
                        <button className="premium-wishlist-remove" onClick={() => toggleWishlist(item)} aria-label={`Remove ${item.name} from saved pieces`}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="premium-wishlist-empty">
              <div className="premium-wishlist-empty-icon"><Heart size={28} /></div>
              <p>YOUR PERSONAL EDIT</p>
              <h3>Save what speaks to you.</h3>
              <span>Tap the heart on any piece and it will be waiting here when you return.</span>
              <button onClick={() => setWishlistOpen(false)}>CONTINUE BROWSING <ArrowRight size={15} /></button>
            </div>
          )}

          <footer className="premium-wishlist-footer">
            <Heart size={13} /> Pieces you love, kept together.
          </footer>
        </aside>
      </div>
    )}

    {/* Cart drawer overlay */}
    {cartOpen && (
        <div className="overlay cart-overlay" onClick={() => setCartOpen(false)}>
          <aside className="gymshark-cart sleek-cart" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sleek-cart-header">
              <h2>Your cart</h2>
              <button className="cart-close-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Free Shipping Banner */}
            <div className={`sleek-shipping-banner ${added && cartQty > 0 ? 'is-unlocked' : 'is-empty'}`}>
              <p>{added && cartQty > 0 ? "You've unlocked free shipping!" : "Add anything to unlock free shipping"}</p>
              <div className="sleek-shipping-bar-full"></div>
            </div>

            <div className="cart-scroll-content sleek-cart-content">
              {added && cartQty > 0 ? (
                <>
                  {/* Cart Item */}
                  <article className="sleek-cart-item">
                    <div className="sleek-item-image-wrapper">
                      <img src="https://oodstore.com/cdn/shop/files/photo_2026-04-27_07-43-35.jpg?v=1777265216" alt="Belted Cotton Shirt" />
                    </div>
                    <div className="sleek-item-details">
                      <div className="sleek-item-title-row">
                        <h3>Belted Cotton Shirt</h3>
                        <span className="sleek-item-price">LE 750.00 EGP</span>
                      </div>
                      <span className="sleek-badge-new">New</span>
                      <p className="sleek-item-subtitle">Size: {size === 'Small' ? 'S' : size === 'Medium' ? 'M' : size === 'Large' ? 'L' : size === 'X-Large' ? 'XL' : 'XXL'}</p>

                      <div className="sleek-qty-selector">
                        <button className="sleek-qty-btn trash" onClick={() => { setAdded(false); setCartQty(0); setCartOpen(false); }} aria-label="Remove item">
                          <Trash2 size={14} strokeWidth={1.5} color="#555" />
                        </button>
                        <span className="sleek-qty-val">{cartQty}</span>
                        <button className="sleek-qty-btn" onClick={() => setCartQty(q => q + 1)} aria-label="Increase quantity">
                          <Plus size={14} strokeWidth={1.5} color="#555" />
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* You may also like */}
                  <div className="sleek-cross-sell">
                    <div className="sleek-cross-sell-head">
                      <h4>You may also like</h4>
                    </div>

                    <div className="sleek-cross-sell-scroll">
                      <article className="sleek-cs-card">
                        <div className="sleek-cs-image">
                          <img src="https://oodstore.com/cdn/shop/files/photo_2026-04-27_07-43-35.jpg?v=1777265216" alt="Emerald Shirt" />
                        </div>
                        <div className="sleek-cs-info">
                          <h5>Emerald Cotton Shirt</h5>
                          <p className="sleek-cs-color">Color: Emerald</p>
                          <div className="sleek-cs-swatches">
                            <span style={{background: '#2d5a4c'}} className="active"></span>
                            <span style={{background: '#000'}}></span>
                            <span style={{background: '#c5b86a'}}></span>
                            <span style={{background: '#c7c7c7'}}></span>
                          </div>
                          <div className="sleek-cs-bottom">
                            <span className="sleek-cs-price">LE 750</span>
                            <button className="sleek-cs-add" onClick={() => { setCartOpen(false); setRestrictedMsg(true); }}>Add</button>
                          </div>
                        </div>
                      </article>
                      <article className="sleek-cs-card">
                        <div className="sleek-cs-image">
                          <img src="https://oodstore.com/cdn/shop/files/photo_2026-04-27_07-43-35.jpg?v=1777265216" alt="Emerald Shirt" />
                        </div>
                        <div className="sleek-cs-info">
                          <h5>Emerald Cotton Shirt</h5>
                          <p className="sleek-cs-color">Color: Emerald</p>
                          <div className="sleek-cs-swatches">
                            <span style={{background: '#2d5a4c'}} className="active"></span>
                            <span style={{background: '#000'}}></span>
                            <span style={{background: '#c5b86a'}}></span>
                            <span style={{background: '#c7c7c7'}}></span>
                          </div>
                          <div className="sleek-cs-bottom">
                            <span className="sleek-cs-price">LE 750</span>
                            <button className="sleek-cs-add" onClick={() => { setCartOpen(false); setRestrictedMsg(true); }}>Add</button>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                  <div className="cart-urgency-strip">
                    <p><strong>High demand</strong><span> Your size is reserved for a short time. Complete checkout to keep it.</span></p>
                  </div>
                </>
              ) : (
                <div className="empty-cart-state" style={{marginTop: '40px'}}>
                  <ShoppingBag size={48} />
                  <h3>Your bag is empty</h3>
                  <button className="keep-browsing-btn" onClick={() => setCartOpen(false)}>KEEP BROWSING</button>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {added && cartQty > 0 && (
              <div className="sleek-cart-footer">
                <div className="sleek-footer-row">
                  <span className="sleek-f-label">Shipping</span>
                  <span className="sleek-f-val">Free</span>
                </div>
                <div className="sleek-footer-row">
                  <span className="sleek-f-label bold">Subtotal<sup>1</sup></span>
                  <span className="sleek-f-val bold">LE {750 * cartQty}.00 EGP</span>
                </div>
                <button className="sleek-checkout-btn" onClick={() => { setCartOpen(false); setRestrictedMsg(true); }}>
                  Continue to Checkou
                </button>
                <p className="checkout-reassurance">Secure checkout · Free delivery unlocked · Pay safely on arrival</p>
              </div>
            )}
          </aside>
        </div>
      )}
    {/* Sticky bottom buy bar */}
      {!wishlistOpen && !searchOpen && !menu && (
        <div className={`sticky-buy-bar sticky-bar-translucent ${showSticky ? 'sticky-visible' : ''} ${isStickySmall ? 'is-small' : ''}`} aria-hidden={!showSticky}>
          <button className={`free-shipping-btn ${added ? 'added' : ''}`} onClick={() => {setAdded(true); setCartQty(1); setCartOpen(true);}}>
            {added ? 'ADDED' : 'Free Shipping'}
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
          <form className="expert-form" onSubmit={(e) => { e.preventDefault(); setExpertOpen(false); setRestrictedMsg(true); }}>
            <input type="text" placeholder="Your Name" required className="expert-input" />
            <input type="email" placeholder="Your Mail" required className="expert-input" />
            <input type="tel" placeholder="Your Phone" required className="expert-input" />
            <button className="submit-expert" type="submit">SUBMIT</button>
          </form>
        </div>
      </div>
    )}

    {/* Preview environment notice */}
    {restrictedMsg && (
      <div className="overlay preview-notice-overlay" onClick={() => setRestrictedMsg(false)}>
        <section className="preview-notice" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="preview-notice-title">
          <header className="preview-notice-header">
            <div><span>OODSTORE PREVIEW</span><small>PROJECT STATUS · 01</small></div>
            <button onClick={() => setRestrictedMsg(false)} aria-label="Close preview notice"><X size={18} /></button>
          </header>

          <div className="preview-notice-body">
            <span className="preview-notice-label">PREVIEW ENVIRONMENT</span>
            <h2 id="preview-notice-title">Preview only.</h2>
            <p className="preview-notice-copy">
              This storefront is a design placeholder, so product details, prices and purchase actions are not final.
            </p>
          </div>

          <footer className="preview-notice-footer">
            <button onClick={() => setRestrictedMsg(false)}>CONTINUE EXPLORING <ArrowRight size={15} /></button>
          </footer>
        </section>
      </div>
    )}
  </div>
}
