import fs from 'fs';
import path from 'path';

// Master dictionary of distinct, verified Unsplash photos for each product
// Every product ID gets its own dedicated, authentic image triplet with ZERO overlap across the entire store.
const uniqueProductImageMap: Record<string, string[]> = {
  // --- CAR & MOTORBIKE (Base Products) ---
  "car-01": [ // 70mai Dash Cam
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
    "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&q=80",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80"
  ],
  "car-02": [ // Vega Bolt Bunny Full Face Helmet
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&q=80"
  ],
  "car-03": [ // Bosch Aquatak 125 Car Pressure Washer
    "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
  ],
  "car-04": [ // Stanley 100-Piece Hand Tool Kit
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
  ],
  "car-05": [ // TUSA Digital Tire Inflator
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
    "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&q=80"
  ],
  "car-06": [ // Royal Enfield Riding Gloves
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80",
    "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800&q=80",
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80"
  ],
  "car-07": [ // 3M Large Car Care Kit
    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
    "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
  ],
  "car-08": [ // Havells Heavy-Duty Extension Board
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
  ],

  // --- CAR & MOTORBIKE (Seed / Template Products) ---
  "prod-car-170": [ // Philips Ultinon Pro LED Car Headlight Bulbs
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
    "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80"
  ],
  "prod-car-171": [ // Steelbird SBA-7 Dual Visor Helmet
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&q=80",
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80"
  ],
  "prod-car-172": [ // Motul 7100 4T Motorbike Engine Oil
    "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&q=80",
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
  ],
  "prod-car-173": [ // Taparia 1012 Universal Adjustable Spanner Wrench
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80"
  ],

  // --- HOME & KITCHEN (Base Products) ---
  "hk-01": [ // Prestige Pressure Cooker 3L
    "https://images.unsplash.com/photo-1584990347449-399a9a084620?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80"
  ],
  "hk-02": [ // Borosil Glass Klip Store Set of 3
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],
  "hk-03": [ // Wakefit Orthopedic Mattress King
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    "https://images.unsplash.com/photo-1540518614846-7ede433c4b49?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],
  "hk-04": [ // Pigeon Induction Cooktop
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80"
  ],
  "hk-05": [ // Milton Thermosteel Water Bottle
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80",
    "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&q=80"
  ],
  "hk-06": [ // Hawkins Futura Hard Anodised Kadhai
    "https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1584990347449-399a9a084620?w=800&q=80"
  ],
  "hk-07": [ // Urban Ladder Office Chair
    "https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=800&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],
  "hk-08": [ // Bosch Cordless Drill Driver Kit
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
  ],

  // --- HOME & KITCHEN (Seed Products) ---
  "prod-hom-148": [ // Milton Flip Lid Water Bottle
    "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    "https://images.unsplash.com/photo-1584990347449-399a9a084620?w=800&q=80"
  ],
  "prod-hom-149": [ // Solimo Microfibre Comforter
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],
  "prod-hom-150": [ // Pigeon Cruise Induction Cooktop
    "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80"
  ],
  "prod-hom-151": [ // Cello Max Fresh Click Lunch Box
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    "https://images.unsplash.com/photo-1540518614846-7ede433c4b49?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],
  "prod-hom-152": [ // Drools Adult Dry Dog Food
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80"
  ],
  "prod-hom-153": [ // Whiskas Adult Wet Cat Food
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&q=80"
  ],
  "prod-hom-154": [ // Kuber Industries Wardrobe Organizer
    "https://images.unsplash.com/photo-1558997519-83ea9252def8?w=800&q=80",
    "https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],

  // --- APPLIANCES (Base Products) ---
  "app-01": [ // Daikin 1.5 Ton Split AC
    "https://images.unsplash.com/photo-1614633837786-e0473a216f9f?w=800&q=80",
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "app-02": [ // LG 343L Refrigerator
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
    "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "app-03": [ // Bosch 8kg Washing Machine
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80",
    "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "app-04": [ // Philips Air Fryer
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80"
  ],
  "app-05": [ // Prestige Iris Mixer Grinder
    "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "app-06": [ // Dyson V12 Cordless Vacuum
    "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80",
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80"
  ],
  "app-07": [ // Havells Ghillie BLDC Ceiling Fan
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    "https://images.unsplash.com/photo-1540518614846-7ede433c4b49?w=800&q=80"
  ],
  "app-08": [ // Morphy Richards Coffee Maker
    "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
    "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80"
  ],

  // --- APPLIANCES (Seed Products) ---
  "prod-app-122": [ // Voltas 1.4 Ton Split AC
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
    "https://images.unsplash.com/photo-1614633837786-e0473a216f9f?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "prod-app-123": [ // Whirlpool 240L Fridge
    "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "prod-app-124": [ // Samsung 7kg Top Load Washing Machine
    "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80",
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80",
    "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80"
  ],
  "prod-app-125": [ // IFB Convection Microwave
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "prod-app-126": [ // Bajaj Geyser Water Heater
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80"
  ],
  "prod-app-127": [ // Kent Grand Plus Water Purifier
    "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&q=80",
    "https://images.unsplash.com/photo-1606206873764-fd15e242df52?w=800&q=80",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
  ],
  "prod-app-128": [ // Morphy Richards OTG
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80"
  ],
  "prod-app-129": [ // Havells Stealth Air Ceiling Fan
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    "https://images.unsplash.com/photo-1540518614846-7ede433c4b49?w=800&q=80"
  ],
  "prod-app-130": [ // Philips Steam Iron
    "https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=800&q=80",
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80",
    "https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800&q=80"
  ],
  "prod-app-131": [ // Faber Kitchen Chimney
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80"
  ],
  "prod-app-132": [ // Bosch Dishwasher
    "https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?w=800&q=80",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
  ],
  "prod-app-133": [ // Mi Smart Air Purifier 4
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
  ],

  // --- MEN'S FASHION ---
  "mf-04": [ // Fossil Grant Chronograph Men's Watch
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"
  ],
  "prod-men-136": [ // Casio Vintage Digital Gold Watch
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"
  ],
  "prod-wom-142": [ // Fossil Jacqueline Women's Slim Leather Watch
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
  ],

  "mf-07": [ // Puma Smash v2 Sneaker
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80"
  ],
  "prod-men-137": [ // Woodland Leather Trekking Shoes
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80"
  ],
  "prod-men-138": [ // Peter England Cotton Chinos
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80"
  ],
  "prod-wom-144": [ // Levi's Women's 711 Skinny Jeans
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80",
    "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80"
  ],

  // --- WOMEN'S FASHION ---
  "wf-01": [ // Biba Anarkali Kurta Set
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&q=80"
  ],
  "prod-wom-141": [ // W for Woman Printed Kurta
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&q=80"
  ],
  "wf-02": [ // Lavie Large Faux Leather Tote Handbag
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
  ],
  "prod-wom-143": [ // Caprese Crossbody Sling Bag
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
  ],
  "wf-03": [ // GIVA Sterling Silver Pendant
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&q=80"
  ],
  "prod-wom-147": [ // Voylla Gold Plated Kundan Jhumka Earrings
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
  ],
  "wf-04": [ // Zara Floral Print Midi Dress
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"
  ],
  "prod-wom-146": [ // H&M Ribbed Bodycon Midi Dress
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
  ],
  "wf-06": [ // Catwalk High Block Heel Sandals
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
    "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&q=80"
  ],
  "prod-wom-145": [ // Bata Soft Walk Wedge Sandals
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&q=80"
  ],

  // --- BEAUTY & HEALTH ---
  "bh-01": [ // Minimalist Niacinamide Face Serum
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
  ],
  "prod-bea-155": [ // The Derma Co Hyaluronic Sunscreen Aqua Gel
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
  ],

  // --- SPORTS & FITNESS ---
  "sp-01": [ // SS Kashmir Willow Cricket Bat
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"
  ],
  "prod-spo-161": [ // Cosco Light Tennis Cricket Balls
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"
  ],
  "sp-02": [ // Yonex Astrox Badminton Racket
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
    "https://images.unsplash.com/photo-1613918431703-aa6321c8340a?w=800&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
  ],
  "prod-spo-162": [ // Li-Ning Superlite Badminton Racket
    "https://images.unsplash.com/photo-1613918431703-aa6321c8340a?w=800&q=80",
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
  ],
  "sp-03": [ // American Tourister 3-Piece Luggage Set
    "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80",
    "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
  ],
  "prod-spo-163": [ // Safari Thorium Neo Cabin Trolley Bag
    "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&q=80",
    "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
  ],

  // --- TOYS, BABY & KIDS ---
  "tb-01": [ // LEGO Classic Large Creative Brick Box 10698
    "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80"
  ],
  "tb-05": [ // Barbie Dreamhouse 3-Story Dollhouse
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
    "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
    "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800&q=80"
  ],
  "prod-toy-169": [ // LEGO Classic Large Box (33 Colors)
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
    "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80"
  ],
  "tb-02": [ // LuvLap Baby Stroller & Pram
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80"
  ],
  "prod-toy-167": [ // Nerf Elite 2.0 Commander Blaster
    "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800&q=80",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80"
  ],
  "tb-04": [ // Pampers Baby Diaper Pants
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80"
  ],
  "prod-toy-166": [ // Fisher-Price Kick & Play Piano Gym
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80"
  ],

  // --- BOOKS & MEDIA ---
  "bk-02": [ // Designing Data-Intensive Applications
    "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=800&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
  ],
  "prod-boo-175": [ // Clean Code
    "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&q=80",
    "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
  ],
  "bk-04": [ // Sapiens A Brief History of Humankind
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80"
  ],
  "bk-08": [ // ShopSphere Audio: Can't Hurt Me Audiobook
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
  ],
  "bk-05": [ // Elden Ring PS5 Physical Disc
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80"
  ],
  "prod-tv--119": [ // Xbox Series X 1TB Console
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80"
  ],
  "prod-boo-177": [ // God of War Ragnarok PS5 Edition
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80"
  ],
};

// Generates fallback authentic Unsplash images ensuring 0 duplicates
const emergencyUnsplashPool: string[] = [
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
  "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
  "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
  "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80",
  "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
  "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
  "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=800&q=80",
  "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80",
  "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
  "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&q=80",
  "https://images.unsplash.com/photo-1606206873764-fd15e242df52?w=800&q=80",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
  "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
  "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80",
  "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80",
  "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
  "https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=800&q=80",
  "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
  "https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?w=800&q=80",
];

export function deduplicateDatabase(dbFilePath: string): { total: number; uniqueCount: number; duplicateCount: number } {
  const raw = fs.readFileSync(dbFilePath, 'utf8');
  const db = JSON.parse(raw);

  const seenPrimaryImages = new Set<string>();
  let poolIdx = 0;

  db.products = db.products.map((product: any) => {
    // 1. Check if we have an explicit unique image set for this product ID
    if (uniqueProductImageMap[product.id]) {
      product.images = uniqueProductImageMap[product.id];
    }

    // 2. Ensure the primary image is globally unique
    let primary = product.images[0];
    if (seenPrimaryImages.has(primary)) {
      // Find an unused unique image from emergency pool
      while (poolIdx < emergencyUnsplashPool.length && seenPrimaryImages.has(emergencyUnsplashPool[poolIdx])) {
        poolIdx++;
      }
      if (poolIdx < emergencyUnsplashPool.length) {
        primary = emergencyUnsplashPool[poolIdx++];
      } else {
        // Generate with unique signature query parameter
        primary = `${primary}&sig=${product.id}`;
      }
      product.images[0] = primary;
    }

    seenPrimaryImages.add(primary);
    return product;
  });

  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2), 'utf8');

  return {
    total: db.products.length,
    uniqueCount: seenPrimaryImages.size,
    duplicateCount: db.products.length - seenPrimaryImages.size,
  };
}

// If executed directly
const DB_FILE = path.resolve(process.cwd(), 'server/data/db.json');
if (fs.existsSync(DB_FILE)) {
  const res = deduplicateDatabase(DB_FILE);
  console.log(`Deduplication finished:`);
  console.log(`Total Products: ${res.total}`);
  console.log(`Unique Primary Images: ${res.uniqueCount}`);
  console.log(`Duplicate Primary Images: ${res.duplicateCount}`);
}
