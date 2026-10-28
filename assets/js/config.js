// La Baita Lounge: every launch value lives here.
// Edit this file only; index.html and main.js read from it.
window.LA_BAITA = {
  // Links into the booking / ordering / menu web app.
  // Leave a value empty ("") and that button falls back to WhatsApp.
  appUrls: {
    book: "",
    order: "",
    delivery: "",
    menu: "https://labaitamenu.btcproperties.co.ke"
  },
  // Header / bottom bar design on phones: "a" gold dock, "b" white top bar, "c" clear-then-dock, "d" gold top bar, "" two bars
  navStyle: "c",

  // How a menu category links into the web app. {menu} = appUrls.menu, {cat} = category slug.
  menuCategoryUrl: "{menu}#{cat}",

  // CONFIRM with owner: is 0704 222 555 also the WhatsApp number?
  whatsapp: "254704222555",
  whatsappText: "Hi La Baita! I'd like to book a table for __ people on __ at __.",
  // Pre-filled WhatsApp messages for specific buttons
  whatsappTexts: {
    delivery: "Hi La Baita! I'd like to order for delivery to __.",
    match: "Hi La Baita! I'd like a table for the __ vs __ game on __ for __ people.",
    carwash: "Hi La Baita! I'd like a car wash on __ at __.",
    catering: "Hi La Baita! I'd like a catering quote for __ people on __.",
    mixologist: "Hi La Baita! I'd like to book your mixologist for an event on __."
  },
  phone: "+254704222555",
  phoneDisplay: "0704 222 555",

  // CONFIRM with owner: listings disagree on hours.
  hours: "Open daily · breakfast till late",
  address: "Upper Hill Road, next to UAP · High Point Apartments, Nairobi",

  // Bar shelf: spirits only, two tidy rows of three. x / y are % positions on the shelf photo.
  // CONFIRM brands with the owner; "cat" is the web app menu category slug.
  barShelf: [
    { name: "Whisky", cat: "whiskys", x: 32, y: 33, brands: "Jameson · Johnnie Walker Black · Glenfiddich 12 · Jack Daniel's" },
    { name: "Cognac", cat: "cognacs", x: 50, y: 33, brands: "Hennessy VS · Martell VS · Rémy Martin VSOP" },
    { name: "Vodka", cat: "vodka", x: 68, y: 33, brands: "Smirnoff · Absolut · Ciroc · Grey Goose" },
    { name: "Gin", cat: "gin", x: 32, y: 60, brands: "Tanqueray · Gordon's · Hendrick's · Gilbey's" },
    { name: "Tequila", cat: "tequila", x: 50, y: 60, brands: "Olmeca · Jose Cuervo · Don Julio" },
    { name: "Champagne", cat: "champagne", x: 68, y: 60, brands: "Moët · Veuve Clicquot · Belaire" }
  ],

  // Theme nights & events (posters from Instagram). CONFIRM days with the owner.
  events: [
    { img: "assets/img/events/ladies-night.webp", when: "Wednesdays", title: "Ladies Night", text: "Music, cocktails and the girls. Dress up, we'll handle the vibe.", url: "https://www.instagram.com/p/DfAwv4lIlsN/" },
    { img: "assets/img/events/after-work.webp", when: "Thursdays", title: "After Work", text: "Clock out and come up the hill. Cold drinks, choma and a good playlist.", url: "https://www.instagram.com/p/DfAyuYEoGBD/" },
    { img: "assets/img/events/watch-party.webp", when: "Match days", title: "Watch Party", text: "Every big Premier League game on the big screen, sound on.", url: "https://www.instagram.com/p/De6T6VQIXYR/" },
    { img: "assets/img/events/weekend-party.webp", when: "Fri & Sat", title: "Weekend Nights", text: "DJ, lights and a full dance floor till late.", url: "https://www.instagram.com/reel/De4uzm3I38i/" },
    { img: "assets/img/events/rhumba-culture.webp", when: "Special event", title: "Rhumba Culture", text: "Rhumba meets Benga with live bands. Tickets on Instagram.", url: "https://www.instagram.com/p/Deg6BqcI7Tp/" }
  ],

  // "Follow the Vibe" tiles: a picture saved from each post + the post link.
  social: [
    { img: "assets/img/social/De8_COdI9Gn.webp", url: "https://www.instagram.com/reel/De8_COdI9Gn/", type: "reel", alt: "Grilled chicken fresh off the grill" },
    { img: "assets/img/social/De9iKPHo6bF.webp", url: "https://www.instagram.com/reel/De9iKPHo6bF/", type: "reel", alt: "The Rhumba Culture crew at La Baita" },
    { img: "assets/img/social/De_kihFIQuY.webp", url: "https://www.instagram.com/reel/De_kihFIQuY/", type: "reel", alt: "Guests enjoying a choma spread" },
    { img: "assets/img/social/De8fEGro3Ud.webp", url: "https://www.instagram.com/reel/De8fEGro3Ud/", type: "reel", alt: "Coffee and cake on the terrace" },
    { img: "assets/img/social/De_G33Cosxj.webp", url: "https://www.instagram.com/reel/De_G33Cosxj/", type: "reel", alt: "Rhumba Culture announcement" },
    { img: "assets/img/social/DfCaWPaIR23.webp", url: "https://www.instagram.com/reel/DfCaWPaIR23/", type: "reel", alt: "Parking at La Baita on Upper Hill Road" }
  ],

  instagram: "https://www.instagram.com/labaitaloungeupperhill/",
  instagramHandle: "@labaitaloungeupperhill",
  tiktok: "",
  facebook: "https://www.facebook.com/people/La-baita-lounge-FB/100065202525445/"
};
