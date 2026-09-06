const fs = require('fs');
const path = require('path');
const { CATEGORIES } = require('../../dist/data/categories.js');

const DATA_DIR = path.resolve(__dirname, '../../data');
const HARVEST_CACHE_FILE = path.join(DATA_DIR, 'harvested_amazon_images.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Subcategory to Amazon search queries mapping
const SUBCATEGORY_QUERIES = {
  // 1. Mobiles, Computers (12)
  'all-mobile-phones': ['smartphones', '5g mobile phones', 'android smartphone'],
  'mobile-accessories': ['mobile accessories', 'phone cables fast charger', 'mobile stand holder'],
  'cases-covers': ['phone back cover case', 'shockproof mobile case', 'silicone phone cover'],
  'screen-protectors': ['tempered glass screen protector', 'privacy screen protector phone', 'screen guard'],
  'power-banks': ['power bank 10000mah', 'power bank 20000mah fast charging', 'magnetic power bank'],
  'tablets': ['tablets ipad', 'android tablet 11 inch', 'drawing tablet stylus'],
  'wearable-devices': ['smartwatch for men women', 'fitness tracker band', 'smart watch amoled'],
  'smart-home': ['smart home alexa devices', 'smart wifi plug socket', 'smart led bulb wifi'],
  'laptops-computers': ['laptops for students office', 'gaming laptop rtx', 'thin and light laptop'],
  'computer-accessories': ['wireless mouse keyboard combo', 'mechanical gaming keyboard', 'laptop stand ergonomic'],
  'office-stationery': ['office stationery supplies', 'diary notebook pen set', 'desk organizer office'],
  'software': ['antivirus software pc', 'microsoft 365 software', 'pc utility software'],

  // 2. TV, Appliances, Electronics (12)
  'televisions': ['smart tv 4k 55 inch', 'qled oled smart tv', '43 inch smart tv 4k'],
  'home-entertainment': ['home theatre speaker system 5.1', 'dolby atmos soundbar', 'home cinema projector 4k'],
  'headphones': ['wireless bluetooth headphones over ear', 'active noise cancelling headphones', 'gaming headset with mic'],
  'speakers': ['portable bluetooth speaker waterproof', 'party speaker with bass', 'wireless smart speaker'],
  'home-audio-theater': ['soundbar with subwoofer', 'home audio amplifier receiver', 'tower speaker system bluetooth'],
  'cameras': ['digital vlogging camera 4k', 'compact travel camera', 'instant camera instax'],
  'dslr-cameras': ['dslr camera with lens kit', 'mirrorless camera 4k', 'professional photography camera'],
  'security-cameras': ['wifi security camera cctv', 'outdoor security camera 360', 'home cctv camera smart'],
  'camera-accessories': ['camera tripod stand', 'camera bag backpack', 'camera lens filter cleaning kit'],
  'musical-instruments': ['acoustic guitar for beginners', 'electronic keyboard piano 61 keys', 'ukulele musical instrument'],
  'gaming-consoles': ['gaming console ps5 xbox', 'retro video game console', 'handheld gaming console'],
  'all-electronics': ['extension board with usb surge protector', 'hdmi cable 4k high speed', 'universal travel adapter plug'],

  // 3. Appliances (6)
  'air-conditioners': ['inverter split air conditioner 1.5 ton', '5 star inverter ac', 'portable air conditioner'],
  'refrigerators': ['double door refrigerator frost free', 'side by side refrigerator inverter', 'single door refrigerator'],
  'washing-machines': ['front load washing machine fully automatic', 'top load washing machine 7kg', 'inverter washing machine'],
  'kitchen-home-appliances': ['microwave oven convection', 'air fryer digital', 'water purifier ro uv'],
  'heating-cooling-appliances': ['room heater blower oil filled', 'tower air cooler personal', 'ceiling fan bldc energy saving'],
  'all-small-appliances': ['electric kettle stainless steel', 'sandwich toaster grill maker', 'dry iron lightweight steam'],

  // 4. Men's Fashion (14)
  'mens-clothing': ['mens casual wear shirts', 'mens formal wear clothing', 'mens summer clothes'],
  't-shirts-polos': ['mens cotton t shirts round neck', 'mens polo t shirt collar', 'mens graphic printed tshirt'],
  'shirts': ['mens formal shirts slim fit', 'mens casual cotton linen shirt', 'mens check shirt casual'],
  'jeans': ['mens slim fit stretchable jeans', 'mens relaxed straight fit jeans', 'mens denim blue jeans'],
  'trousers-chinos': ['mens casual chino trousers', 'mens formal formal trousers pants', 'mens cotton khaki chinos'],
  'innerwear': ['mens cotton vests trunks briefs', 'mens boxer shorts pack of 3', 'mens thermal innerwear'],
  'watches': ['mens analog watch stainless steel', 'mens chronograph watch leather strap', 'mens sports digital watch'],
  'bags-luggage': ['mens laptop backpack water resistant', 'mens travel duffle bag gym', 'leather messenger bag for men'],
  'shoes': ['mens casual shoes sneakers', 'mens running walking shoes sports', 'mens loafers slip on'],
  'sneakers': ['mens white sneakers casual', 'mens high top sneakers street style', 'mens retro fashion sneakers'],
  'formal-shoes': ['mens formal leather shoes oxford derby', 'mens formal slip on leather shoes', 'mens brogue formal dress shoes'],
  'sunglasses': ['mens polarized aviator sunglasses', 'mens wayfarer sunglasses uv400', 'mens retro rectangular sunglasses'],
  'jewelry': ['mens stainless steel bracelet chain', 'mens silver ring band', 'mens pendant chain necklace'],
  'wallets': ['mens genuine leather wallet rfid blocking', 'mens slim card holder bifold wallet', 'mens classy leather wallet'],

  // 5. Women's Fashion (13)
  'womens-clothing': ['womens casual wear dress tops', 'womens trendy clothes fashion', 'womens summer fashion wear'],
  'western-wear': ['womens western top blouse stylish', 'womens denim jacket casual', 'womens jumpsuits playsuits fashionable'],
  'ethnic-wear': ['womens anarkali kurta pant set', 'womens cotton kurti with palazzo', 'womens designer saree with blouse'],
  'dresses': ['womens floral a line midi dress', 'womens maxi dress summer casual', 'womens bodycon party dress'],
  'tops-tees': ['womens printed crop top tshirt', 'womens casual cotton round neck tee', 'womens elegant work blouse top'],
  'womens-jeans': ['womens high waist skinny jeans', 'womens wide leg boyfriend denim jeans', 'womens bootcut stretchable jeans'],
  'womens-sandals': ['womens flat slide sandals casual', 'womens block heel party sandals', 'womens comfortable walking sandals'],
  'womens-handbags': ['womens shoulder handbag tote bag', 'womens stylish crossbody sling bag', 'womens structured top handle bag'],
  'clutches': ['womens bridal party clutch purse', 'womens evening glitter clutch bag', 'womens envelope wallet clutch'],
  'womens-jewelry': ['womens gold plated necklace earrings set', 'womens silver pendant choker chain', 'womens crystal pearl stud earrings'],
  'womens-watches': ['womens rose gold analog watch', 'womens diamond studded luxury watch', 'womens slim mesh strap watch'],
  'womens-sunglasses': ['womens oversized cat eye sunglasses uv400', 'womens round vintage sunglasses', 'womens designer polarized sunglasses'],
  'womens-footwear': ['womens pointed toe flat ballet shoes', 'womens casual slip on canvas shoes', 'womens wedge heels comfort footwear'],

  // 6. Home, Kitchen, Pets (12)
  'kitchen-dining': ['stainless steel dinner set cutlery', 'glass food storage containers airtight', 'kitchen spice jar rack organizer'],
  'cookware': ['non stick induction frying pan kadhai set', 'stainless steel triply pressure cooker', 'granite coating dosa tawa'],
  'small-kitchen-appliances': ['mixer grinder 750 watt 3 jars', 'hand blender electric whisk', 'pop up bread toaster 2 slice'],
  'tableware': ['ceramic dinner plates bowls set', 'crystal glassware tumbler set', 'wooden serving tray coasters set'],
  'furniture': ['wooden coffee table living room', 'ergonomic study office chair', 'solid wood bedside table organizer'],
  'bedding-linen': ['pure cotton king size bedsheet with pillow covers', 'microfibre reversible comforter blanket', 'orthopedic memory foam pillow'],
  'home-decor': ['decorative wall art hanging frames', 'aromatic scented jar candles set', 'modern ceramic flower vase living room'],
  'lighting': ['modern led ceiling lamp warm white', 'smart table lamp desk study', 'decorative fairy string lights warm'],
  'storage-organization': ['cloth organizer storage box foldable', 'plastic drawer modular organizer', 'shoe rack multi tier metal'],
  'cleaning-supplies': ['microfiber spin mop bucket set', 'automatic robot vacuum cleaner', 'floor cleaner liquid spray bottle'],
  'pet-food': ['dog dry food adult chicken pedigree royal canin', 'cat dry food fish drools whiskas', 'puppy nutrition growth dog food'],
  'pet-supplies': ['dog leash harness padded set', 'cat scratcher tree post bed', 'pet grooming brush shampoo dog'],

  // 7. Beauty, Health, Grocery (9)
  'beauty-luxury': ['luxury perfume eau de parfum for men women', 'premium facial serum anti aging', 'luxury skincare cosmetic gift set'],
  'make-up': ['matte liquid lipstick set long lasting', 'waterproof liquid eyeliner mascara combo', 'compact face powder foundation makeup'],
  'skin-care': ['vitamin c face serum hyaluronic acid', 'sunscreen spf 50 pa+++ gel matte', 'gentle foaming face wash hydrating cleanser'],
  'hair-care': ['hair oil onion bhringraj growth', 'anti dandruff shampoo conditioner set', 'hair serum argan oil heat protectant'],
  'bath-shower': ['body wash shower gel moisturizing', 'exfoliating body scrub bath sponge', 'handmade bathing soap bar natural'],
  'health-personal-care': ['digital blood pressure monitor automatic', 'multivitamin supplement capsules zinc', 'electric sonic rechargeable toothbrush'],
  'gourmet-foods': ['premium almond cashew dry fruits gift box', 'extra virgin olive oil cold pressed', 'dark chocolate bar artisanal luxury'],
  'coffee-tea': ['instant premium arabica coffee beans ground', 'green tea bags organic detox chamomile', 'filter coffee powder roasted chicory'],
  'daily-groceries': ['basmati rice premium aged 5kg', 'organic cold pressed mustard oil cooking', 'organic whole wheat flour atta 5kg'],

  // 8. Sports, Fitness, Bags, Luggage (20)
  'cricket': ['english willow cricket bat full size', 'leather cricket ball tournament', 'cricket batting gloves pads kit'],
  'badminton': ['badminton racket graphite carbon fiber', 'feather nylon shuttlecock pack of 6', 'badminton kit bag with shoe compartment'],
  'football': ['football size 5 all weather durable', 'football goalkeeper gloves with finger protection', 'shin guards soccer football training'],
  'gym-equipment': ['rubber coated dumbbell set hex 5kg 10kg', 'pull up bar doorway home gym', 'resistance bands set exercise loop'],
  'yoga-mats': ['anti slip thick yoga mat with carry strap', 'cork eco friendly exercise mat', 'eva fitness workout mat 6mm'],
  'running-shoes': ['mens lightweight running shoes mesh', 'cushioned athletic marathon running shoes', 'womens trail running shoes outdoor'],
  'cycling': ['mountain bike bicycle 21 speed disc brake', 'cycling helmet with rear safety led light', 'bicycle led front light and horn usb'],
  'outdoor-recreation': ['camping tent waterproof 4 person', 'outdoor sleeping bag lightweight cold weather', 'tactical led flashlight rechargeable super bright'],
  'camping-hiking': ['hiking trekking backpack 50l waterproof', 'trekking walking pole aluminium adjustable', 'portable camping gas stove burner'],
  'swimming': ['swimming goggles anti fog uv protection', 'silicone waterproof swimming cap', 'swim kickboard training aid pool'],
  'travel-duffles': ['leather duffle travel gym bag', 'water resistant foldable travel duffel luggage', 'canvas weekender travel bag with shoulder strap'],
  'suitcases': ['hard trolley cabin suitcase 4 wheels tsa lock', 'expandable travel luggage suitcase set', 'polycarbonate lightweight check in trolley bag'],
  'backpacks': ['anti theft water resistant college laptop backpack', 'urban everyday travel rucksack backpack', 'hiking mountaineering rucksack backpack 45l'],
  'trolley-bags': ['4 wheel spinner lightweight trolley bag', 'softside cabin trolley suitcase with wheels', 'printed fashion kids trolley travel bag'],
  'fitness-accessories': ['gym shaker bottle protein mixer wire whisk', 'weightlifting leather wrist wraps gym straps', 'jump skipping rope speed bearing wire'],
  'sports-apparel': ['mens dry fit athletic sports gym track pants', 'dri fit compression activewear gym tshirt', 'womens high waist sports leggings tights'],
  'team-sports': ['basketball official size 7 indoor outdoor', 'volleyball size 5 official match soft touch', 'table tennis racquets bat with 3 balls'],
  'fitness-trackers': ['heart rate monitor spo2 smart fitness band', 'calorie step counter pedometer activity tracker', 'gps running sports watch multisport'],
  'strength-training': ['adjustable weight bench foldable home workout', 'kettlebell cast iron 8kg 12kg', 'push up stand bar pushup workout handles'],
  'cardio-equipment': ['indoor magnetic exercise cycle spin bike', 'manual motorized folding running treadmill', 'cross trainer elliptical trainer home cardio'],

  // 9. Toys, Baby Products, Kids' Fashion (21)
  'baby-care': ['gentle moisturizing baby daily lotion baby cream', 'soft wet baby wipes with aloe vera 72 pack', 'gentle head to toe tear free baby wash shampoo'],
  'diapers': ['pant style baby diapers rash protection large', 'taped newborn baby diapers soft breathable', 'cloth reusable washable pocket diapers with inserts'],
  'strollers-prams': ['baby pram stroller lightweight folding with canopy', 'compact travel umbrella buggy stroller', 'reversible handle baby pushchair stroller'],
  'baby-feeding': ['bpa free anti colic baby feeding bottle glass', 'baby silicone bib with food catcher tray', 'infant breast pump manual electric rechargeable'],
  'nursery': ['wooden baby cot crib with wheels', 'baby crib musical mobile toy dangling lullaby', 'soft breathable cotton baby bedding mattress with mosquito net'],
  'toys-games': ['diy stem educational science robot building kit', 'multi color stacking ring toy developmental learning', 'magnetic drawing board toddler sketching toy'],
  'building-sets': ['classic building bricks blocks educational toy 500 pcs', 'architectural theme city police building block set', 'magnetic building tiles set 3d creative blocks'],
  'action-figures': ['12 inch articulated superhero titan action figure', 'transforming robot car toy action figure', 'collectible anime battle action figure toy'],
  'board-games': ['classic family strategy board game monopoly scrabble', 'wooden international standard chess board coins set', 'fast paced card game uno sequence family game'],
  'remote-control': ['high speed rc stunt car 360 rotation rock crawler', 'rechargeable drone with 1080p camera altitude hold', 'remote controlled electric helicopter toy indoor'],
  'boys-clothing': ['boys pure cotton casual tshirt and shorts combo set', 'boys party wear printed button down shirt with jeans', 'boys winter warm hooded sweatshirt hoodie fleece'],
  'girls-clothing': ['girls floral party wear princess frock tutu dress', 'girls printed top and denim skirt casual outfit set', 'girls ethnic festive embroidered lehenga choli set'],
  'kids-footwear': ['kids lightweight breathable light up led sneakers', 'kids waterproof anti slip clogs sandals beach shoes', 'girls cute velcro strap flat princess ballerina shoes'],
  'school-bags': ['durable cartoon print kids school backpack 3 compartments', 'ergonomic padded shoulder waterproof primary school bag', 'cute 3d plush animal nursery kindergarten bag'],
  'puzzles': ['wooden jigsaw puzzle educational cartoon animals alphabet', '500 piece scenic panoramic landscape jigsaw puzzle', '3d wooden architectural mechanical puzzle model diy'],
  'dolls-accessories': ['fashion doll with interchangeable trendy outfits salon accessories', 'soft cuddly plush baby doll interactive sound toy', 'miniature dollhouse furniture play set toy for girls'],
  'outdoor-toys': ['kids 3 wheel folding scooter with led flashing wheels', 'soft foam blaster dart gun toy with 20 suction darts', 'indoor outdoor pop up kids play tent castle playhouse'],
  'baby-safety': ['soft foam baby proofing edge corner guards table protector', 'adjustable safety bed rail guard for toddlers fall protection', 'baby electrical socket plug safety safety locks child proof'],
  'maternity-wear': ['soft cotton feeding maternity kurti with zip nursing', 'comfortable high waist maternity pregnancy leggings pants', 'cotton maternity nightwear nursing feeding pajama gown'],
  'educational-toys': ['talking interactive electronic phonics flash cards preschool learning', 'wooden montessori counting shape sorting stacking toy', 'kids optical microscope science lab exploration kit 1200x'],
  'soft-toys': ['giant plush stuffed teddy bear soft huggable 3 feet', 'cute plush animal soft cuddly squishy pillow toy', 'musical peekaboo plush elephant interactive electronic toy'],

  // 10. Car, Motorbike, Industrial (12)
  'car-accessories': ['car mobile phone dashboard windshield mount holder magnetic', 'high power car vacuum cleaner handheld wet dry portable', 'car seat neck headrest pillow cushion memory foam'],
  'car-care': ['car scratch remover polish compound detailing wax', 'super absorbent microfiber car cleaning drying cloth towel pack', 'car interior dashboard plastic leather shine cleaner spray'],
  'motor-oils': ['fully synthetic engine motor oil 5w-30 4 stroke 3.5l', 'semi synthetic 4t 10w-40 bike motorcycle engine oil 1l', 'high performance transmission brake fluid dot 4'],
  'car-tyres': ['digital portable car tyre inflator air compressor 12v pump', 'tubeless tyre puncture repair emergency kit with rubber strips', 'digital tire pressure gauge accurate backlit lcd display'],
  'helmets': ['full face dot approved motorcycle safety helmet visor', 'open face vintage retro scooter biker helmet black', 'modular flip up dual visor motorcycle riding helmet'],
  'riding-gear': ['breathable touchscreen motorcycle riding gloves hard knuckle protector', 'heavy duty motorcycle armored riding protective jacket all weather', 'biker knee shin elbow protective guard armor set 4 pcs'],
  'motorbike-accessories': ['waterproof all weather bike motorcycle full body body cover uv', 'heavy duty alloy disc brake lock with anti theft reminder cable', 'motorcycle auxiliary led fog light spotlight bar projector pod'],
  'power-tools': ['cordless electric drill driver kit 21v with accessories drill bits', 'heavy duty 4 inch angle grinder machine 850w metal cutting', 'rotary hammer drill machine 26mm sds plus chuck with chisels'],
  'safety-security': ['ansi certified industrial safety goggles anti scratch clear lens', 'heavy duty cut resistant work gloves nitrile coated safety grip', 'lightweight steel toe puncture proof industrial safety shoes work boots'],
  'industrial-electrical': ['digital multimeter automatic ranging voltage current tester ac dc', 'high precision non contact voltage detector pen tester with buzzer', 'wire stripper crimping tool heavy duty cable cutter electrician'],
  'hand-tools': ['comprehensive 100 piece household repair hand tool kit tool box', 'heavy duty chrome vanadium adjustable spanner wrench 10 inch', 'magnetic precision screwdriver bit set 64 in 1 laptop repair'],
  'industrial-testing': ['handheld laser distance meter measuring tape 40m digital', 'digital non contact infrared laser temperature thermometer gun pyrometer', 'digital vernier caliper stainless steel 150mm lcd electronic measuring'],

  // 11. Books, Movies, Music & Video Games (30)
  'fiction': ['bestselling fiction novels english literature bestseller', 'contemporary fiction popular paperback book bestseller', 'award winning contemporary literary fiction book'],
  'non-fiction': ['inspiring non fiction bestselling books self help psychology', 'popular science non fiction paperback bestseller book', 'thought provoking non fiction books english literature'],
  'literature-classics': ['classic literature penguin clothbound classics paperback book', 'timeless classic novels english literature masterpieces', 'world classic vintage books collection paperback novel'],
  'sci-fi-fantasy': ['epic sci fi science fiction novel space odyssey galaxy', 'bestselling fantasy fiction epic adventure novel trilogy', 'dystopian sci fi fantasy paperback novel book'],
  'mystery-thrillers': ['psychological crime thriller suspense murder mystery novel', 'detective mystery thriller bestselling detective paperback book', 'gripping fast paced legal mystery thriller novel book'],
  'romance': ['contemporary romance paperback novel enemies to lovers bestseller', 'heartwarming romantic comedy fiction novel book', 'historical romance sweeping epic love story paperback novel'],
  'historical-fiction': ['historical fiction sweeping war drama paperback novel', 'ancient historical drama epic fiction novel book', 'bestselling historical fiction world war paperback novel'],
  'biographies': ['inspiring autobiographies and biographies of leaders icons', 'official biography of visionary innovator paperback book', 'memoir inspiring autobiography bestselling biography book'],
  'self-help': ['atomic habits self help personal development bestseller book', 'psychology of success motivation self help paperback book', 'mindset emotional intelligence personal growth book'],
  'business-investing': ['intelligent investor business finance investing bestselling book', 'start up business management entrepreneurship paperback book', 'wealth creation financial freedom personal finance guide book'],
  'childrens-books': ['illustrated bedtime story books for young children kids', 'roald dahl classic illustrated children story book paperback', 'enid blyton classic adventure stories children book'],
  'young-adult': ['young adult fantasy fiction romance paperback bestseller book', 'coming of age young adult high school novel book', 'dystopian young adult adventure thriller novel paperback'],
  'comics-graphic-novels': ['batman spider man marvel dc graphic novel comic book collection', 'manga comic book english translation volume 1', 'classic illustrated graphic novel comic volume full color'],
  'textbooks-study-guides': ['higher secondary college science mathematics textbooks guide', 'computer science engineering academic textbook reference book', 'economics business studies university textbook reference guide'],
  'competitive-exam-books': ['upsc civil services general studies solved papers book', 'jee main advanced physics chemistry mathematics exam guide book', 'neet ug biology exam preparation objective questions book'],
  'audiobooks': ['audiobook collection digital listening popular bestseller unabridged', 'spoken word audio narrative cd collection audiobook', 'audio literature masterclass personal development listening cd'],
  'movies-tv-shows': ['blockbuster hollywood 4k ultra hd blu ray movie disc', 'complete tv series collector edition blu ray box set boxset', 'classic award winning world cinema collection dvd disc'],
  'music-cds-vinyl': ['audiophile 180 gram vinyl lp record album classic rock', 'original motion picture soundtrack audio music cd album', 'legendary jazz blues vinyl record audiophile pressing'],
  'video-games': ['playstation 5 ps5 blockbuster action adventure video game disc', 'xbox series x action rpg video game disc ultimate edition', 'nintendo switch exclusive adventure video game cartridge'],
  'gaming-accessories': ['ergonomic wireless gaming controller with dual vibration feedback', 'pro gaming mouse high precision optical sensor rgb lighting', 'rgb extra large extended gaming mouse pad stitched edges desk mat'],
  'cookbooks-food': ['gourmet masterchef international culinary recipe cookbook book', 'authentic indian regional traditional recipes cookbook food book', 'healthy baking vegan vegetarian delicious recipes cookbook book'],
  'health-fitness-books': ['holistic health nutrition wellness diet fitness paperback book', 'functional strength training workout exercise guide book', 'mindfulness meditation stress relief wellness guide book'],
  'art-photography-books': ['fine art history painting masterpieces hardcover coffee table book', 'national geographic professional nature photography book', 'interior design modern architecture hardcover coffee table book'],
  'travel-holiday-books': ['lonely planet travel guide international destinations travel book', 'inspiring world travel visual explorer photography handbook', 'hiking backpacking wilderness adventure travel stories book'],
  'history-books': ['sapiens world civilization historical journey paperback book', 'indian history modern ancient freedom struggle comprehensive book', 'military history world war documentary historic chronicles book'],
  'philosophy-religion': ['stoicism ancient greek philosophy wisdom reflections paperback book', 'bhagavad gita translation spiritual commentary philosophical book', 'eastern spiritual philosophy mindfulness inner peace book'],
  'science-nature-books': ['astrophysics cosmos universe quantum physics popular science book', 'wildlife evolutionary biology planet earth nature science book', 'brief history of time cosmology universe popular science paperback'],
  'poetry-drama': ['classic contemporary poetry anthologies collection verses book', 'shakespeare complete dramatic works plays sonnets collection book', 'modern lyrical poetry paperback book collection of poems'],
  'humor-entertainment': ['witty humorous essays satire observational comedy paperback book', 'stand up comedian memoir backstage funny anecdotes book', 'cartoon comic strips collection hilarious humor paperback book'],
  'magazines-newspapers': ['national geographic monthly issue collector scientific magazine', 'the economist international business current affairs magazine', 'tech wired future innovation gadgets monthly magazine'],
};

// Paced Amazon search tile extractor
async function fetchAmazonImageIds(query, maxNeeded = 35) {
  const imageIds = new Set();
  const pages = [1, 2];

  for (const page of pages) {
    if (imageIds.size >= maxNeeded) break;
    try {
      const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}&page=${page}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });
      if (!res.ok) continue;
      const text = await res.text();
      const re = /https:\/\/m\.media-amazon\.com\/images\/I\/([A-Za-z0-9+_-]+?)(?:\._[^\"]+)?\.jpg/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        const id = m[1];
        if (
          id.length >= 8 &&
          id.length <= 14 &&
          !id.includes('grey') &&
          !id.includes('transparent') &&
          !id.includes('pixel') &&
          !id.includes('placeholder')
        ) {
          imageIds.add(id);
        }
      }
    } catch (e) {
      // Ignore network errors
    }
    // Polite pacing delay
    await new Promise((r) => setTimeout(r, 450));
  }

  return Array.from(imageIds);
}

module.exports = {
  SUBCATEGORY_QUERIES,
  fetchAmazonImageIds,
  HARVEST_CACHE_FILE,
  PRODUCTS_FILE,
};
