# Bharatsanagro Connect

Build a modern, production-ready, fully responsive Bharatsanagro website with a complete authentication system and role-based dashboards.




1. BRAND IDENTITY




Website name: Bharatsanagro




Tagline:




शेतकऱ्याची प्रगती, देशाची समृद्धी




Bharatsanagro is an India-wide agricultural website that connects:




- 👨‍🌾 Farmers

- 🏪 Agro Store owners




Core purpose:




Farmers can discover agricultural products available at nearby Agro Stores, book them online, and collect them directly from the selected Agro Store.




Important:




- This is a website, not a mobile application.

- Do NOT create an Admin role.

- Do NOT create delivery/shipping functionality.

- Farmers only book products online and collect them offline from the Agro Store.




---




2. COMPLETE WEBSITE USER FLOW




Create this complete flow:




Landing / Authentication Page




→ Login




→ Farmer Dashboard




OR




→ Agro Store Dashboard




OR




→ Create New Account




→ Farmer Registration




OR




→ Agro Store Registration




OR




→ Explore as Guest




→ Public Website




Guest users can browse the website but cannot book products.




---




3. AUTHENTICATION PAGE




Create a premium full-screen agricultural background containing:




- Green agricultural fields

- Indian farmer

- Crops

- Agro Store

- Greenery

- Warm natural sunlight

- Indian rural environment




Use:




- Agricultural green

- Dark green

- White

- Light earthy tones




Add a subtle dark/green overlay so text and forms remain readable.




---




4. HEADER




Create a clean white header.




Left




Show:




Bharatsanagro




Below:




शेतकऱ्याची प्रगती, देशाची समृद्धी




Use a professional agricultural logo.




Right




Show:




- 🌐 Language Selector

- Login

- Create New Account




On mobile, convert the navigation into a hamburger menu.




---




5. MULTILINGUAL SYSTEM




Create a centralized website-wide i18n system.




Languages:




- English

- मराठी

- हिन्दी




Default language:




English




When language changes, translate the entire website, not only the login page.




Translate:




- Navigation

- Buttons

- Forms

- Products

- Categories

- Dashboards

- Bookings

- Notifications

- Error messages

- Success messages

- Modals

- Footer

- About Us

- Contact Us

- Privacy Policy

- Terms & Conditions




Store the selected language in localStorage so it remains after refresh.




---




6. MAIN AUTHENTICATION CARD




Create a large premium white rounded authentication card.




Desktop:




LOGIN | CREATE NEW ACCOUNT




Side-by-side layout.




Mobile:




Stack them vertically.




Use:




- Rounded corners

- Soft shadows

- Clean spacing

- Professional typography

- Agricultural visual accents




---




7. LOGIN




Heading:




Login




Subtitle:




Welcome back! Please login to your account




Fields:




Mobile Number




Placeholder:




Enter Mobile Number




Password




Placeholder:




Enter Password




Include:




- Mobile icon

- Lock icon

- Show/hide password




Add:




Forgot Password?




Primary button:




Login




Then:




OR




Secondary button:




Login with OTP




Below:




Don't have an account? Create New Account




Implement validation and useful error messages.




After successful login, detect the user's role automatically.




---




8. CREATE NEW ACCOUNT




Heading:




Create New Account




Subtitle:




Select your account type to get started




Show exactly two account types.




Farmer




Icon/illustration:




Indian farmer / agriculture.




Description:




Buy agricultural products from nearby stores and grow better.




Button:




Create Farmer Account




Registration fields:




- Full Name

- Mobile Number

- Email optional

- State

- District

- Village

- Password

- Confirm Password

- OTP verification




After registration:




Farmer Dashboard




---




Agro Store




Icon/illustration:




Indian agricultural shop.




Description:




List your products and connect with farmers across India.




Button:




Create Agro Store Account




Fields:




- Store Name

- Owner Name

- Mobile Number

- Email

- State

- District

- Full Address

- Pincode

- GST Number optional

- Store registration/license details optional

- Password

- Confirm Password

- OTP verification




After registration:




Agro Store Dashboard




---




9. EXPLORE AS GUEST




This must be completely separate from authentication.




Do NOT make it look like a third account type.




After the authentication card:




LOGIN + CREATE NEW ACCOUNT




↓




OR




↓




Explore as Guest




Description:




Browse agricultural products and nearby Agro Stores without creating an account.




Button:




Explore as Guest →




Use a separate white rounded container with a subtle green border.




The button should be smaller than the main Login/Create Account buttons.




---




10. GUEST WEBSITE




When Explore as Guest is selected, open the public Bharatsanagro website.




Guest can:




- Browse products

- Search products

- Browse categories

- View product details

- View prices

- View availability

- Discover Agro Stores

- View store profiles

- View store location

- View How It Works

- View About Us

- View Contact Us

- Change language




Guest cannot:




- Book products

- View My Bookings

- Access Farmer Dashboard

- Access Agro Store Dashboard

- Add/edit/delete products

- Access private information




If Guest clicks Book Now, show:




Create an account to book




Please login or create a Farmer account to book this product from the Agro Store.




Buttons:




Login




Create Farmer Account




Secondary:




Continue Browsing




---




11. MAIN WEBSITE HEADER AFTER LOGIN




Create a consistent website header.




Farmer




Logo + navigation:




Home | Products | Agro Stores | My Bookings | Profile




Right side:




- Language

- Notifications

- Profile

- Logout




Agro Store




Navigation:




Dashboard | Products | Bookings | Store Profile




Right side:




- Language

- Notifications

- Profile

- Logout




---




12. FARMER DASHBOARD




Create a simple, modern and highly farmer-friendly dashboard.




Welcome Section




Show:




Welcome, [Farmer Name]! 👋




Subtitle:




Find agricultural products from Agro Stores near you.




Add:




📍 Location selector




🔎 Search bar:




Search seeds, fertilizers, pesticides, equipment...




Primary action:




Find Agro Stores Near Me




---




13. FARMER DASHBOARD SECTIONS




Quick Actions




Create large cards:




- 🔎 Search Products

- 🏪 Find Agro Stores

- 📦 My Bookings

- 👤 My Profile




---




Product Categories




Create attractive cards for:




- 🌱 Seeds

- 🧪 Fertilizers

- 🛡️ Pesticides

- 🌾 Crop Protection

- 🚜 Agricultural Equipment

- 💧 Irrigation Products

- Other Agricultural Products




Make every category clickable.




---




14. PRODUCT LISTING




Create a modern product grid.




Every product card should show:




- Product image

- Product name

- Brand

- Category

- Price

- Available quantity

- Agro Store name

- Store location

- Rating

- Availability status




Buttons:




View Details




Book Now




Add:




- Search

- Category filter

- Location filter

- Price filter

- Availability filter

- Sorting




---




15. PRODUCT DETAILS PAGE




Show:




- Large product image

- Product name

- Brand

- Category

- Price

- Manufacturing date

- Expiry date

- Available quantity

- Product description

- Agro Store name

- Store address

- Store location

- Store rating




Add quantity selector.




Button:




Book Product




Clearly display:




Collect your booked product directly from the Agro Store.




Do NOT display:




- Delivery

- Shipping

- Delivery charges

- Delivery tracking




---




16. BOOKING FLOW




Create this exact flow:




Search Product




↓




View Product




↓




Select Quantity




↓




Choose Agro Store




↓




Book Product




↓




Booking Confirmation




↓




Collect from Agro Store




After booking, generate a unique Booking ID.




Show:




- Booking ID

- Product

- Quantity

- Agro Store

- Store address

- Booking date

- Collection information

- Booking status




---




17. BOOKING STATUS




Use these statuses:




- Pending

- Confirmed

- Ready for Collection

- Collected

- Cancelled




Show status clearly using badges.




---




18. MY BOOKINGS




Create a dedicated Farmer My Bookings page.




Tabs:




All | Pending | Confirmed | Ready | Collected | Cancelled




Each booking card should show:




- Booking ID

- Product

- Quantity

- Store

- Date

- Status

- View Details




---




19. NEARBY AGRO STORES




Create an Agro Store discovery page.




Show store cards containing:




- Store name

- Store image

- Rating

- Distance

- Address

- Open/Closed

- Product count

- Available categories




Buttons:




View Store




View Products




Allow location-based filtering.




---




20. AGRO STORE PROFILE — PUBLIC




A Farmer or Guest can view a store's public profile.




Show:




- Store name

- Store image

- Rating

- Address

- Location

- Opening hours

- Available categories

- Products

- Store information




Guests can view this page but cannot book.




---




21. AGRO STORE DASHBOARD




When an Agro Store owner logs in, show:




Welcome




Welcome, [Store Name]!




Dashboard overview cards:




- Total Products

- Available Products

- New Bookings

- Confirmed Bookings

- Ready for Collection

- Completed Bookings




---




22. AGRO STORE PRODUCT MANAGEMENT




Create:




Add New Product




Fields:




- Product Image

- Product Name

- Brand

- Category

- Price

- Available Quantity

- Manufacturing Date

- Expiry Date

- Description

- Availability Status




Store owner can:




- Add

- Edit

- Update quantity

- Mark unavailable

- Delete




Important:




An Agro Store owner can only manage products belonging to their own store.




---




23. AGRO STORE BOOKINGS




Create:




Farmer Bookings




Show:




- Booking ID

- Farmer name

- Product

- Quantity

- Booking date

- Status




Store owner can update:




Pending → Confirmed → Ready for Collection → Collected




Also allow:




Reject/Cancel




---




24. STORE PROFILE MANAGEMENT




Store owner can update:




- Store Name

- Owner Name

- Mobile Number

- Email

- Address

- State

- District

- Pincode

- Location

- Opening Hours

- Store Image

- Store description




---




25. FARMER PROFILE




Create a Farmer Profile page containing:




- Profile photo

- Full name

- Mobile number

- Email

- State

- District

- Village

- Language preference




Actions:




Edit Profile




Change Password




Logout




Farmers can only access their own profile.




---




26. SECURITY & ACCESS CONTROL




There are exactly three access states:




Guest




Can access public information only.




Farmer




Can access:




- Own profile

- Own bookings

- Product booking




Agro Store




Can access:




- Own store

- Own products

- Bookings belonging to their store




There is:




NO ADMIN ROLE




If using Supabase:




- Use secure authentication

- Use role-based authorization

- Implement Row Level Security

- Protect private data

- Farmers cannot access other farmers' data

- Stores cannot access other stores' management data

- Guests cannot access private data




---




27. HOME PAGE




Create a public Bharatsanagro homepage containing:




Hero




शेतकऱ्याची प्रगती, देशाची समृद्धी




Subtitle:




Connect with nearby Agro Stores. Discover products. Book easily. Collect directly from the store.




Buttons:




Explore Products




Find Agro Stores




Explore as Guest




---




28. HOW IT WORKS




Create a simple four-step section:




1. Search




Find the agricultural product you need.




2. Choose Store




Select a nearby Agro Store.




3. Book




Book the available product online.




4. Collect




Collect the product directly from the Agro Store.




Clearly mention:




No delivery — simple offline collection from your selected Agro Store.




---




29. TRUST & BENEFITS




Create four premium cards:




Trusted Transactions




Secure and reliable experience.




Nearby Agro Stores




Connect with stores near you.




Quality Products




Get clear product information.




Farmer Friendly




Simple and easy to use.




---




30. REVIEWS & RATINGS




Create a Farmer Feedback section.




Ask:




How was your experience with Bharatsanagro?




Allow:




⭐ 1–5 star rating




Feedback categories:




- Product availability

- Agro Store experience

- Booking experience

- Website usability




Add:




Submit Review




Only logged-in users can submit reviews.




---




31. FOOTER




Create a dark green footer.




Include:




Bharatsanagro




शेतकऱ्याची प्रगती, देशाची समृद्धी




Links:




- Home

- Products

- Agro Stores

- How It Works

- About Us

- Contact Us

- Privacy Policy

- Terms & Conditions




Language selector.




Copyright:




© 2026 Bharatsanagro. All rights reserved.




---




32. RESPONSIVE DESIGN




The entire website must work perfectly on:




- Desktop

- Laptop

- Tablet

- Android phones

- iPhone




Mobile requirements:




- Stack cards vertically

- Mobile hamburger navigation

- Touch-friendly buttons

- Responsive search

- No horizontal scrolling

- Responsive product cards

- Responsive dashboards

- Proper Indian-language font rendering

- Sticky mobile navigation where appropriate




---




33. UI/UX STYLE




Create a premium Indian agricultural marketplace, not a generic e-commerce template.




Design characteristics:




- Natural agricultural imagery

- Modern green/earth palette

- Clean white cards

- Soft shadows

- Rounded corners

- Professional typography

- Simple icons

- Subtle animations

- Clear visual hierarchy

- Large touch-friendly controls

- Farmer-friendly interface




Avoid:




- Excessive animations

- Complicated navigation

- Delivery/shipping UI

- Admin dashboards

- Unnecessary e-commerce features

- Overcrowded screens




---




34. FUNCTIONAL REQUIREMENT




Do not create only a visual mockup.




Build the website structure so the following functionality is implemented:




- Authentication

- Farmer registration

- Agro Store registration

- OTP verification

- Login

- Logout

- Forgot password

- Role-based routing

- Guest mode

- Product search

- Product filtering

- Store discovery

- Product details

- Product booking

- Booking status

- Offline collection workflow

- Farmer profile

- Store profile

- Store product management

- Store booking management

- Ratings and reviews

- Multilingual system

- Secure authorization




If Supabase is available, integrate the authentication and database using Supabase.




Use proper database relationships for:




Users → Roles → Farmers / Agro Stores → Products → Bookings → Reviews




---




35. FINAL NAVIGATION STRUCTURE




Public / Guest




Home | Products | Agro Stores | How It Works | About Us | Contact Us | Login




Farmer




Home | Products | Agro Stores | My Bookings | Profile




Agro Store




Dashboard | Products | Bookings | Store Profile




Do not show Admin anywhere.




---




36. MOST IMPORTANT USER EXPERIENCE




The entire website should revolve around this simple concept:




Farmer finds product → Finds nearby Agro Store → Books product → Store confirms → Farmer collects product directly from store.




Make this workflow extremely clear throughout the website.




The final result should feel like a real, scalable, production-ready Indian agricultural platform called Bharatsanagro, with a strong agricultural identity, simple farmer-friendly UX, secure role-based access, multilingual support, and a clear offline collection model.




Maintain the brand consistently everywhere:




Bharatsanagro




शेतकऱ्याची प्रगती, देशाची समृद्धी




37. BRANDED 5-SECOND SPLASH SCREEN — IMPORTANT




Use the provided Bharatsanagro logo image as the official website logo.




Do not recreate, redraw, replace, or generate a different logo.




Initial Website Loading




Every time the Bharatsanagro website is opened, first display a dedicated full-screen splash screen.




The splash screen must appear for exactly 5 seconds before automatically transitioning to the main website.




Splash Screen Design




Use:




- The provided Bharatsanagro logo prominently in the center

- Bharatsanagro brand name if it is not already included in the provided logo

- Tagline:

  शेतकऱ्याची प्रगती, देशाची समृद्धी

- Premium Indian agricultural background

- Green fields / subtle agricultural visual elements

- Clean white/green branding

- Smooth fade-in and fade-out animation




Keep the provided logo visually clear and high quality.




Splash Screen Layout




Center the logo vertically and horizontally.




Example visual hierarchy:




[ PROVIDED BHARATSANAGRO LOGO ]




शेतकऱ्याची प्रगती, देशाची समृद्धी




Then after 5 seconds:




Splash Screen → Authentication / Home Page




Important Behavior




- Splash screen must automatically disappear after 5 seconds.

- Do not require the user to click anything.

- Do not show the splash screen indefinitely.

- Do not add unnecessary loading screens after the 5-second splash.

- Keep the transition smooth and professional.

- Make the splash screen responsive on desktop, tablet and mobile.

- Ensure the logo is not stretched or distorted.

- Maintain the original aspect ratio of the provided image.




Website Header Logo




Use the same provided logo image in the website header.




Desktop:




[Provided Logo] Bharatsanagro




Tagline:




शेतकऱ्याची प्रगती, देशाची समृद्धी




Mobile:




Display the provided logo appropriately without making it too large.




Logo Consistency




Use the provided logo consistently in:




- 5-second splash screen

- Main website header

- Farmer dashboard

- Agro Store dashboard

- Login page

- Guest website

- Footer

- Relevant authentication screens




Do not create alternative logos.




Loading Sequence




The final website opening sequence must be:




Website Open




↓




5-Second Bharatsanagro Splash Screen




↓




Authentication / Home Page




↓




Login / Create Account / Explore as Guest




↓




Role-Based Dashboard or Guest Website




Make the splash screen feel like a professional brand introduction rather than a generic loading screen.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/46cdf5a1-eb7d-4448-8dc1-ed55f8d02d09).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
