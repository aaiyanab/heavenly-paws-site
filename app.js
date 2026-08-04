/* =====================================================================
   ★★★  PASTE YOUR STORE LINKS HERE  ★★★
   Replace the two ALL-CAPS blanks below with your live store URLs.
   (Find & Replace works too: search the blank word, paste your URL.)
   Until you do, the Shop / Buy buttons stay politely inert.
       club_merch          = Printify Pop-Up merch store
       membership_madison  = Square annual subscription link
       partner_featured    = Square annual subscription link ($149)
       treats              = Square Online treats store
       donate_once         = Square checkout: "Heavenly Paws Guardian Angel — One-Time Gift"
                             (donor chooses the amount)
       donate_monthly      = Square recurring checkout: "Heavenly Paws Monthly Guardian Angel"
   Every "Make a One-Time Gift" / "Become a Monthly Guardian Angel"
   button on the WAGS and Guardian Angel pages wires itself to these
   two links automatically. Until pasted, the buttons stay politely inert.
   ===================================================================== */
const STORE_URLS = {
  club_merch:         "https://madisonpetclub.printify.me/",         // Printify Pop-Up store URL
  membership_madison: "https://square.link/u/de8PPp6G", // Square subscription checkout link (annual)
  partner_featured:   "https://square.link/u/wZeUevhA",   // Square subscription checkout link ($149 annual)
  treats:             "https://heavenly-paws-treats.square.site",        // Square Online treats store
  donate_once:        "https://square.link/u/apycqaA0",   // Square donation checkout — one-time gift, donor picks amount
  donate_monthly:     "https://square.link/u/Uu7QJTOU"     // Square donation checkout — recurring monthly gift
};


/* =====================================================================
   ★★★  PASTE YOUR SUBSTACK URL HERE  ★★★
   Just your publication's base address — nothing else. Example:
       const SUBSTACK_URL = "https://madisonpetclub.substack.com";
   From this ONE value the Newsletter page builds itself:
     • the sign-up form            (…/embed)
     • the "Read Past Issues" link (…/archive)
     • the live list of posts      (…/feed)
   Publish on Substack and the site updates on its own — no edits, no redeploy.
   ===================================================================== */
const SUBSTACK_URL = "https://heavenlypaws.substack.com";


/* =====================================================================
   ★★★  PASTE YOUR LUMA CALENDAR EMBED URL HERE  ★★★
   In Luma: your Calendar -> Settings -> Embed -> copy the iframe's src.
   It looks like:  https://lu.ma/embed/calendar/cal-XXXXXXXX/events
   Events you create in Luma then appear on the site automatically,
   with RSVP built in. Optional: also paste your public calendar page
   (e.g. https://lu.ma/madisonpetclub) for the "View on Luma" button.
   ===================================================================== */
const LUMA_EMBED_URL = "https://luma.com/embed/calendar/cal-orBA3QUuyzd34Hl/events";
const LUMA_PAGE_URL  = "https://luma.com/qi2pmc4m";   // public calendar page
/* Wire every element with data-store="club|treats" to the right storefront */
function wireStores(){
  document.querySelectorAll("[data-store]").forEach(el=>{
    const url = STORE_URLS[el.getAttribute("data-store")];
    const ready = url && url !== "#" && url.indexOf("PASTE_") !== 0;
    if(ready){
      el.setAttribute("href", url);
      el.setAttribute("target","_blank");
      el.setAttribute("rel","noopener");
    }else{
      el.setAttribute("href","#");
      el.addEventListener("click",e=>{
        e.preventDefault();
        el.classList.add("nudge");
        setTimeout(()=>el.classList.remove("nudge"),500);
      });
    }
  });
}

/* Mobile nav */
function wireNav(){
  const toggle = document.querySelector(".nav-toggle");
  const links  = document.querySelector(".nav-links");
  if(!toggle||!links) return;
  toggle.addEventListener("click",()=>{
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open",open);
    toggle.setAttribute("aria-expanded",open);
  });
  links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    links.classList.remove("open");toggle.classList.remove("open");
  }));
}

/* Scroll reveal */
function wireReveal(){
  const els = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)||!els.length){
    els.forEach(e=>e.classList.add("in"));return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);} });
  },{threshold:.14});
  els.forEach(e=>io.observe(e));
}



/* ---------------------------------------------------------------------
   NEWSLETTER: build signup embed, links, and auto-load latest posts.
   Posts are pulled live from the Substack RSS feed, so new posts appear
   automatically. If the feed can't be reached, we fall back to a link.
   ------------------------------------------------------------------ */
function substackReady(){
  return SUBSTACK_URL && SUBSTACK_URL.indexOf("PASTE_") !== 0 && SUBSTACK_URL.indexOf("http") === 0;
}
function baseUrl(){ return SUBSTACK_URL.replace(/\/+$/,""); }

function wireNewsletter(){
  const feedEl = document.getElementById("post-feed");
  if(!feedEl) return;                 // not the newsletter page

  if(!substackReady()){
    if(feedEl) feedEl.innerHTML = '<div class="feed-state">Posts will appear here once your Substack URL is added.</div>';
    return;
  }
  const base = baseUrl();

  // Point every subscribe / archive button at the real publication
  document.querySelectorAll('a[href="PASTE_NEWSLETTER_URL_HERE"]').forEach((a,i)=>{
    a.setAttribute("href", i === 0 ? base : base + "/archive");
    a.setAttribute("target","_blank"); a.setAttribute("rel","noopener");
  });

  if(feedEl) loadPosts(base, feedEl);
}

function loadPosts(base, el){
  el.innerHTML = '<div class="feed-state">Loading the latest posts…</div>';
  const rss = encodeURIComponent(base + "/feed");
  fetch("https://api.rss2json.com/v1/api.json?rss_url=" + rss)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => {
      if(!d.items || !d.items.length) return Promise.reject();
      el.innerHTML = "";
      d.items.slice(0,6).forEach(p => el.appendChild(postCard(p)));
    })
    .catch(() => {
      el.innerHTML = '<div class="feed-fallback">'
        + '<p class="feed-state">Read every issue over on Substack.</p>'
        + '<a class="btn gold" target="_blank" rel="noopener" href="' + base + '/archive">Read Past Issues</a>'
        + '</div>';
    });
}

function postCard(p){
  const a = document.createElement("a");
  a.className = "post-card"; a.href = p.link; a.target = "_blank"; a.rel = "noopener";

  // cover image: use the post's thumbnail, else first image in the body
  let img = p.thumbnail || "";
  if(!img && p.content){
    const m = p.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if(m) img = m[1];
  }
  const date = p.pubDate ? new Date(p.pubDate.replace(" ","T")).toLocaleDateString(undefined,
                 {month:"short", day:"numeric", year:"numeric"}) : "";
  const text = (p.description || "").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim().slice(0,140);

  const cover = document.createElement("div");
  cover.className = "pc-img";
  if(img) cover.style.backgroundImage = "url('" + img + "')";

  const body = document.createElement("div");
  body.className = "pc-body";
  const d = document.createElement("div"); d.className="pc-date"; d.textContent = date;
  const h = document.createElement("h3");   h.textContent = p.title || "New post";
  const s = document.createElement("p");    s.textContent = text ? text + "…" : "";
  const m = document.createElement("div");  m.className="pc-more"; m.textContent = "Read on Substack →";
  body.append(d,h,s,m);
  a.append(cover, body);
  return a;
}


/* Upcoming Events: inject the Luma calendar iframe when configured */
function wireEvents(){
  const slot=document.querySelector(".luma-slot");
  if(!slot) return;
  const ready = LUMA_EMBED_URL && LUMA_EMBED_URL.indexOf("http")===0;
  if(ready){
    slot.innerHTML="";
    const f=document.createElement("iframe");
    f.src=LUMA_EMBED_URL;
    f.setAttribute("title","Upcoming events calendar");
    f.setAttribute("allowfullscreen","");
    f.setAttribute("aria-hidden","false");
    slot.appendChild(f);
  }
  const pageBtn=document.querySelector(".luma-page-btn");
  if(pageBtn && LUMA_PAGE_URL.indexOf("http")===0){
    pageBtn.setAttribute("href",LUMA_PAGE_URL);
    pageBtn.setAttribute("target","_blank"); pageBtn.setAttribute("rel","noopener");
  }
}

/* Keep any unfilled PASTE_ links inert (e.g. newsletter before setup) */
function wirePlaceholderLinks(){
  document.querySelectorAll('a[href^="PASTE_"]').forEach(el=>{
    el.addEventListener("click",e=>{
      e.preventDefault(); el.classList.add("nudge");
      setTimeout(()=>el.classList.remove("nudge"),500);
    });
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  wireStores();wireNav();wireReveal();wireNewsletter();wireEvents();wirePlaceholderLinks();
  /* Failsafe: if anything blocks the observer, reveal everything anyway */
  setTimeout(()=>document.querySelectorAll(".reveal:not(.in)").forEach(e=>e.classList.add("in")),1600);
});
