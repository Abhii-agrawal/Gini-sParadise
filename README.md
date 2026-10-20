# BestFriends? — Birthday Tribute Website for Gini ♡

A romantic web experience in a soothing pastel sky-blue palette, featuring your personal photos, an uncluttered landing page, and a real-time live working clock footer in the soothing blue of love with orbiting photo memories.

---

## 🌟 Structure & Features

### 1. 🏠 Home Section (`#home`)
- **Unobstructed Hero Visual**: Features your uploaded hero photo (`Photos/Hero_image.png`) shifted to the right with soft, natural lighting, keeping both faces completely visible and clear.
- **Corner Action Buttons**: Action buttons (**💌 Letter** and **🎬 Edit Room**) are neatly anchored at the bottom-right corner.
- **Floating Controls**: Center scroll down indicator to the clock footer, and bottom-right floating music player.
- **Ambient Canvas Particles**: Drifting powder-blue hearts and glowing bokeh circles.

### 2. 🍰 Gini's SugarCloud (`#bakery`)
- **Atmospheric Boutique Entrance**:
  - Main Tagline: *“A little bakery, with a little extra love in every bite. ♡”*
  - Main Heading: *“Welcome to Your Little Sweet Escape, Gini.”*
  - Supporting Message: *“Freshly picked sweetness, little happy moments, and a whole lot of love. Come in, choose your favourites, and let me take care of the sweetness. 💙”*
  - Prominent CTA: **“Enter My Sweet Little Bakery ♡”** with smooth scroll into the counter.
- **Parisian Glass Pastry Counter (`#bakeryCounter`)**:
  - Scalloped powder-blue striped canopy with brass valance, warm shelf lighting bulbs, and filigree sign: *“Gini's SugarCloud — Freshly Baked with Love for Shubhangini ♡”*.
  - Pinned scrapbook paper notes: *“Good things inside. ♡”* & *“A little sweetness for my favourite human. 💙”*.
  - Category Filter Tabs: All Sweet Treats (15), Artisanal Pastries 🥐, Royal Mithai 🍯, Chill & Scoops 🍨, and Special Surprises 🎁.
  - Interactive Glass Showcase displaying all **15 required desserts**:
    1. Cookies (Artisanal Warm Cookies)
    2. Blueberry Cheesecake (Blueberry Cloud Cheesecake)
    3. Kaju Barfi (Royal Kaju Katli)
    4. Rasmalai (Pistachio Cream Rasmalai)
    5. Ice Cream (Boutique Gelato & Ice Cream)
    6. Besan Laddu (Golden Desi Ghee Besan Laddu)
    7. Candies (Pastel Artisan Candies)
    8. Chocolate Brownie (Fudge Sizzling Brownie)
    9. Tiramisu (Cloud Mascarpone Tiramisu)
    10. Motichoor Laddu (Royal Motichoor Laddu)
    11. Chocolate Truffles (Hand-Rolled Cocoa Truffles)
    12. Cupcakes (Pastel Swirl Cupcakes)
    13. Macarons (Parisian Pastel Macarons)
    14. Cinnamon Rolls (Glazed Brioche Cinnamon Rolls)
    15. Surprise Dessert Box (Gini's Special Surprise Box)
  - Marble & brass apron base with live status badge: *“Bakery Open & Freshly Stocked ♡”*.
  - Discreet trigger button for the **Bakery Order Desk**.
- **Interactive Product Modal (`#bakeryProductModal`)**:
  - Real-looking dessert photography with graceful fallback to `Photos/bakery.jpeg`.
  - Flavour / variant picker buttons with active highlight.
  - Stepper quantity selector (`-`, count, `+`).
  - **“Add to Gini's Basket ♡”** with audio chime and toast notification.
- **Cart Drawer (`#bakeryCartDrawer`) — “Your Little Basket of Happiness ♡”**:
  - Floating HUD basket pill with live count badge and pulse animation.
  - Item listing with thumbnails, variants, quantity controls, and delete button.
  - Personal Baker's Note textarea for box dedications.
  - **“Pack My Little Happiness ♡”** CTA button.
  - Local persistence via `localStorage` (`gini_bakery_cart`).
- **Signature 4-Stage Gift-Box Packing Animation (`#packingOverlay`)**:
  - **Stage 1 (0s)**: Receiving Gini's sweet order — 3D powder-blue boutique box lid unfolds open.
  - **Stage 2 (1.4s)**: Tucking in sweet treats — miniature treat icons float and bounce into the box.
  - **Stage 3 (2.8s)**: Wrapping with love & blue satin ribbon — lid smoothly closes, horizontal and vertical ribbons wrap, ribbon bow ties, and blush-pink wax heart seal stamps down with an elastic bounce.
  - **Stage 4 (4.2s)**: Confetti celebration burst and reveal.
  - Includes a **Skip Animation ⏭** button.
- **Simulated Order Confirmation Screen (`#bakeryConfirmationModal`)**:
  - Unique Order ID (`GINI-SUGARCLOUD-XXXX`).
  - Real-time **Admin Email Notification Badge** (`#confirmEmailStatus`) confirming order dispatch to Admin's inbox.
  - Dedicated note preview and itemized summary of packed treats.
  - Actions: **“Order Another Box 🍰”** and **“View in Bakery Desk 📋”**.
- **Admin Order Email Notification System (`email-config.json` & `serve.js`)**:
  - **Recipient**: Admin (`abhishekagrawal031@gmail.com`).
  - **Payload**: Order ID, timestamp, item details (names, variants, icons, quantities), baker's dedicated note, and status.
  - **Fail-Safe Archive**: Every order is archived locally to `orders/order-{id}.html` and logged to `orders/orders.json`.
  - **Live Dispatch**: Can be sent via Nodemailer SMTP (Gmail App Password) or Web3Forms API.
- **Discreet Bakery Desk Modal (`#bakeryDeskModal`)**:
  - Simulated live bakery order dispatcher log (`localStorage` key `gini_bakery_orders`).
  - Interactive status toggle pills: `Pending ⏳`, `Accepted 💙`, `Preparing 🧁`, `Fulfilled 🎀`.

### 3. ⏰ Footer Section — Live Working Clock (`#clockFooter`)
- **Header**: **"Life would be a li less sweet without you"** in bold typography.
- **Soothing Blue of Love Live Clock**:
  - Non-robotic, clean, minimalist glowing circular dial in soft soothing sky blue (`#7dd3fc`).
  - Real-time **Hour**, **Minute**, and **Second** hands smoothly sweeping at 60fps.
  - Digital time display and robotic markers removed for a romantic aesthetic.
- **Orbiting Photo Ring (12 Positions)**:
  - Uses all your uploaded clock images (`Photos/clock1.jpg` through `Photos/clock6.jpg`).
  - **Circular Motion with Upright Stability**: Photos revolve smoothly around the center clock dial in circular motion, while counter-rotating to stay upright and static relative to the dial.
  - **Pure Image Lightbox**: Clicking on any photo opens ONLY the photo in high resolution with soft rounded corners and subtle blue glow — no text, no captions, no distractions!

### 4. 🧭 Sticky Floating Navigation Bar
- **Home**: Smoothly scrolls to the Hero landing page.
- **Jukebox 📻**: Opens the *"Our Jukebox 📻"* cassette mixtape player modal with songs and audio controls.
- **Bakery 🍰**: Smoothly scrolls to **Gini's SugarCloud**.
- **Gallery**: Opens the visual photo vault modal.
- **Personal Diary**: Opens the secret handwritten letter modal for Gini.
- **Clock**: Smoothly scrolls to the live working clock footer.

---

## 🚀 How to Run & View

- **Local Dev Server**: Running at [**http://localhost:3000**](http://localhost:3000).
- **Direct File**: Double-click [**`index.html`**](file:///c:/Gini_Birthday/index.html) to open directly in any browser.
