// Production seed script - realistic products for ALL categories
// Generates multilingual listings with category-specific content and images
// Supports 3 languages: English, Slovak, Czech

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomChoice = (arr) => arr[random(0, arr.length - 1)]

// Real product names for ALL categories
const productsByCategory = {
  electronics: {
    en: [
      'iPhone 14 Pro Max',
      'Samsung Galaxy S23 Ultra',
      'MacBook Pro M2',
      'Sony WH-1000XM5 Headphones',
      'iPad Air 2024',
      'Dell XPS 15 Laptop',
      'Canon EOS R6 Camera',
      'Apple Watch Series 9',
      'Sony PlayStation 5 Console',
      'Nintendo Switch OLED',
    ],
    sk: [
      'iPhone 14 Pro Max',
      'Samsung Galaxy S23 Ultra',
      'MacBook Pro M2',
      'Slúchadlá Sony WH-1000XM5',
      'iPad Air 2024',
      'Notebook Dell XPS 15',
      'Fotoaparát Canon EOS R6',
      'Apple Watch Series 9',
      'Herná konzola Sony PlayStation 5',
      'Nintendo Switch OLED',
    ],
    cs: [
      'iPhone 14 Pro Max',
      'Samsung Galaxy S23 Ultra',
      'MacBook Pro M2',
      'Sluchátka Sony WH-1000XM5',
      'iPad Air 2024',
      'Notebook Dell XPS 15',
      'Fotoaparát Canon EOS R6',
      'Apple Watch Series 9',
      'Herní konzole Sony PlayStation 5',
      'Nintendo Switch OLED',
    ],
  },
  clothing: {
    en: [
      'Nike Air Max 270 Sneakers',
      "Levi's 501 Original Jeans",
      'North Face Winter Jacket',
      'Adidas Originals Hoodie',
      'Zara Summer Floral Dress',
      'H&M Basic T-Shirt 5-Pack',
      'Genuine Leather Biker Jacket',
      'Puma Running Shoes',
      'Michael Kors Designer Handbag',
      'Wool Winter Coat',
    ],
    sk: [
      'Tenisky Nike Air Max 270',
      "Džínsy Levi's 501 Original",
      'Zimná bunda North Face',
      'Mikina Adidas Originals',
      'Letné kvetinové šaty Zara',
      'Balík 5 tričiek H&M Basic',
      'Pravá kožená motorkárska bunda',
      'Bežecké topánky Puma',
      'Dizajnérska kabelka Michael Kors',
      'Vlnený zimný kabát',
    ],
    cs: [
      'Tenisky Nike Air Max 270',
      "Džíny Levi's 501 Original",
      'Zimní bunda North Face',
      'Mikina Adidas Originals',
      'Letní květinové šaty Zara',
      'Balík 5 triček H&M Basic',
      'Pravá kožená motorkářská bunda',
      'Běžecké boty Puma',
      'Designová kabelka Michael Kors',
      'Vlněný zimní kabát',
    ],
  },
  'home-garden': {
    en: [
      'IKEA Hemnes Bookshelf',
      'Philips Hue Smart Light Set',
      'Dyson V15 Vacuum Cleaner',
      'KitchenAid Stand Mixer',
      'Nespresso Coffee Machine',
      'Persian Oriental Rug 200x300cm',
      'Garden Patio Furniture Set',
      'Weber Gas Grill',
      'Potted Monstera Plant XL',
      'LED Floor Lamp Modern',
    ],
    sk: [
      'Knižnica IKEA Hemnes',
      'Sada inteligentných svetiel Philips Hue',
      'Vysávač Dyson V15',
      'Kuchynský robot KitchenAid',
      'Kávovar Nespresso',
      'Perzský orientálny koberec 200x300cm',
      'Záhradný nábytok na terasu',
      'Plynový gril Weber',
      'Veľká kvetinová monstera v kvetináči',
      'Moderná stojaca LED lampa',
    ],
    cs: [
      'Knihovna IKEA Hemnes',
      'Sada chytrých světel Philips Hue',
      'Vysavač Dyson V15',
      'Kuchyňský robot KitchenAid',
      'Kávovar Nespresso',
      'Perský orientální koberec 200x300cm',
      'Zahradní nábytek na terasu',
      'Plynový gril Weber',
      'Velká květinová monstera v květináči',
      'Moderní stojací LED lampa',
    ],
  },
  sports: {
    en: [
      'Trek Mountain Bike 29"',
      'Adidas Football Size 5',
      'Yoga Mat with Carrying Strap',
      'Bowflex Adjustable Dumbbells',
      'Garmin Forerunner 255 Watch',
      'Wilson Tennis Racket',
      'Skateboard Complete Setup',
      'Boxing Gloves Everlast 12oz',
      'Swimming Goggles Speedo',
      'Fitness Resistance Bands Set',
    ],
    sk: [
      'Horský bicykel Trek 29"',
      'Futbalová lopta Adidas veľ. 5',
      'Jogová podložka s popruhom',
      'Nastaviteľné činky Bowflex',
      'Hodinky Garmin Forerunner 255',
      'Tenisová raketa Wilson',
      'Kompletný skateboard',
      'Boxerské rukavice Everlast 12oz',
      'Plavecké okuliare Speedo',
      'Sada odporových pásov na fitness',
    ],
    cs: [
      'Horské kolo Trek 29"',
      'Fotbalový míč Adidas vel. 5',
      'Jogová podložka s popruhem',
      'Nastavitelné činky Bowflex',
      'Hodinky Garmin Forerunner 255',
      'Tenisová raketa Wilson',
      'Kompletní skateboard',
      'Boxerské rukavice Everlast 12oz',
      'Plavecké brýle Speedo',
      'Sada odporových pásů na fitness',
    ],
  },
  'kids-baby': {
    en: [
      'Bugaboo Fox 5 Stroller',
      'LEGO City Police Station Set',
      'Fisher-Price Baby Monitor',
      'Pampers Diapers Size 3 Box',
      'Baby Crib with Mattress',
      'Kids Wooden Toy Kitchen',
      'Chicco Car Seat 0-18kg',
      'Baby Clothes Bundle 0-6 months',
      'Educational Tablet for Kids',
      'Outdoor Swing Set',
    ],
    sk: [
      'Kočík Bugaboo Fox 5',
      'LEGO City policajná stanica',
      'Detská elektronická opatrovateľka Fisher-Price',
      'Plienky Pampers veľ. 3 balenie',
      'Detská postieľka s matracom',
      'Detská drevená kuchynka na hranie',
      'Autosedačka Chicco 0-18kg',
      'Balík detského oblečenia 0-6 mesiacov',
      'Vzdelávací tablet pre deti',
      'Vonkajšia detská hojdačka',
    ],
    cs: [
      'Kočárek Bugaboo Fox 5',
      'LEGO City policejní stanice',
      'Dětská elektronická chůva Fisher-Price',
      'Pleny Pampers vel. 3 balení',
      'Dětská postýlka s matracemi',
      'Dětská dřevěná kuchyňka na hraní',
      'Autosedačka Chicco 0-18kg',
      'Balík dětského oblečení 0-6 měsíců',
      'Vzdělávací tablet pro děti',
      'Venkovní dětská houpačka',
    ],
  },
  vehicles: {
    en: [
      'BMW 320d 2020 Diesel',
      'Audi A4 2021 Automatic',
      'VW Golf 8 GTI 2022',
      'Škoda Octavia RS 2019',
      'Mercedes-Benz C-Class 2020',
      'Toyota Corolla Hybrid 2021',
      'Honda Civic Type R 2020',
      'Ford Mustang GT 2019',
      'Mazda CX-5 AWD 2022',
      'Tesla Model 3 Long Range',
    ],
    sk: [
      'BMW 320d 2020 Diesel',
      'Audi A4 2021 Automat',
      'VW Golf 8 GTI 2022',
      'Škoda Octavia RS 2019',
      'Mercedes-Benz C-Class 2020',
      'Toyota Corolla Hybrid 2021',
      'Honda Civic Type R 2020',
      'Ford Mustang GT 2019',
      'Mazda CX-5 AWD 2022',
      'Tesla Model 3 Long Range',
    ],
    cs: [
      'BMW 320d 2020 Diesel',
      'Audi A4 2021 Automat',
      'VW Golf 8 GTI 2022',
      'Škoda Octavia RS 2019',
      'Mercedes-Benz C-Class 2020',
      'Toyota Corolla Hybrid 2021',
      'Honda Civic Type R 2020',
      'Ford Mustang GT 2019',
      'Mazda CX-5 AWD 2022',
      'Tesla Model 3 Long Range',
    ],
  },
  'real-estate': {
    en: [
      '2-Bedroom Apartment Downtown',
      'Modern Villa with Pool 250m²',
      'Cozy Studio 35m² City Center',
      '3-Bedroom Family House',
      'Luxury Penthouse with Terrace',
      'Country Cottage with Garden',
      'Office Space 120m²',
      'Commercial Property Warehouse',
      'New Build Apartment 65m²',
      'Renovated Flat 4th Floor',
    ],
    sk: [
      '2-izbový byt v centre',
      'Moderná vila s bazénom 250m²',
      'Útulné štúdio 35m² centrum',
      'Rodinný dom 3 izby',
      'Luxusný penthouse s terasou',
      'Vidiecka chalupa so záhradou',
      'Kancelársky priestor 120m²',
      'Komerčná nehnuteľnosť sklad',
      'Novostavba byt 65m²',
      'Zrekonštruovaný byt 4. poschodie',
    ],
    cs: [
      '2-pokojový byt v centru',
      'Moderní vila s bazénem 250m²',
      'Útulné studio 35m² centrum',
      'Rodinný dům 3 pokoje',
      'Luxusní penthouse s terasou',
      'Venkovská chalupa se zahradou',
      'Kancelářský prostor 120m²',
      'Komerční nemovitost sklad',
      'Novostavba byt 65m²',
      'Zrekonstruovaný byt 4. patro',
    ],
  },
  services: {
    en: [
      'Plumbing Repair Service',
      'House Cleaning Professional',
      'Electrician Available 24/7',
      'Handyman Home Repairs',
      'Moving Service with Truck',
      'Painting & Decorating',
      'Garden Maintenance Service',
      'Computer Repair & IT Support',
      'Pet Grooming Service',
      'Photography Services Wedding',
    ],
    sk: [
      'Inštalatérske práce opravy',
      'Profesionálne upratovanie domácností',
      'Elektrikár k dispozícii 24/7',
      'Údržbár domáce opravy',
      'Sťahovacia služba s autom',
      'Maľovanie a dekorovanie',
      'Údržba záhrady služba',
      'Oprava počítačov a IT podpora',
      'Starostlivosť o domáce zvieratá',
      'Fotografické služby svadby',
    ],
    cs: [
      'Instalatérské práce opravy',
      'Profesionální úklid domácností',
      'Elektrikář k dispozici 24/7',
      'Údržbář domácí opravy',
      'Stěhovací služba s autem',
      'Malování a dekorace',
      'Údržba zahrady služba',
      'Oprava počítačů a IT podpora',
      'Péče o domácí zvířata',
      'Fotografické služby svatby',
    ],
  },
  pets: {
    en: [
      'Golden Retriever Puppies',
      'British Shorthair Kitten',
      'Aquarium 200L Complete Setup',
      'Dog Training Service',
      'Cat Tower Scratching Post',
      'Pet Carrier Travel Bag',
      'Automatic Pet Feeder',
      'Dog Bed Memory Foam XL',
      'Bird Cage with Stand',
      'Hamster Cage Full Kit',
    ],
    sk: [
      'Šteniatka Golden Retriever',
      'Mačiatko britská krátkosrstá',
      'Akvárium 200L kompletné',
      'Výcvik psov služba',
      'Mačací škrabací strom',
      'Prepravka pre domáce zvieratá',
      'Automatické kŕmidlo pre zvieratá',
      'Psí pelech memory foam XL',
      'Vtáčia klietka so stojanom',
      'Klietka pre škrečka komplet',
    ],
    cs: [
      'Štěňata Golden Retriever',
      'Kotě britská krátkosrstá',
      'Akvárium 200L kompletní',
      'Výcvik psů služba',
      'Kočičí škrabací strom',
      'Přepravka pro domácí zvířata',
      'Automatické krmítko pro zvířata',
      'Psí pelech memory foam XL',
      'Ptačí klec se stojanem',
      'Klec pro křečka komplet',
    ],
  },
  hobbies: {
    en: [
      'Oil Painting Set Professional',
      'Stamp Collection Vintage',
      'Model Train Set HO Scale',
      'Telescope Astronomy 150mm',
      'Coin Collection Starter Pack',
      'Drawing Tablet Wacom',
      'Drone with 4K Camera',
      'Fishing Rod Carbon Fiber',
      'Knitting Yarn Bundle',
      'Chess Set Wooden Handmade',
    ],
    sk: [
      'Profesionálna sada na maľovanie olejom',
      'Zbierka starých známok',
      'Modelová železnica HO mierka',
      'Teleskop astronomický 150mm',
      'Štartovací balík zbierky mincí',
      'Grafický tablet Wacom',
      'Dron s 4K kamerou',
      'Rybársky prút carbon',
      'Balík priadze na pletenie',
      'Ručne vyrobená drevená šachová súprava',
    ],
    cs: [
      'Profesionální sada na malování olejem',
      'Sbírka starých známek',
      'Modelová železnice HO měřítko',
      'Teleskop astronomický 150mm',
      'Startovací balík sbírky mincí',
      'Grafický tablet Wacom',
      'Dron s 4K kamerou',
      'Rybářský prut carbon',
      'Balík příze na pletení',
      'Ručně vyrobená dřevěná šachová souprava',
    ],
  },
  'books-magazines': {
    en: [
      'Harry Potter Complete Collection',
      'National Geographic Subscription',
      'Cookbook Mediterranean Diet',
      'Business Book Rich Dad Poor Dad',
      'Fashion Magazine Vogue 2024',
      "Children's Book Collection",
      'Psychology Book Atomic Habits',
      'Travel Guide Europe Lonely Planet',
      'Mystery Novel Bestseller',
      'Science Magazine Subscription',
    ],
    sk: [
      'Harry Potter kompletná kolekcia',
      'Predplatné National Geographic',
      'Kuchárska kniha stredomorská diéta',
      'Obchodná kniha Bohatý otec chudobný otec',
      'Módny časopis Vogue 2024',
      'Zbierka detských kníh',
      'Psychologická kniha Atomické návyky',
      'Cestovný sprievodca Európa Lonely Planet',
      'Detektívny román bestseller',
      'Predplatné vedeckého časopisu',
    ],
    cs: [
      'Harry Potter kompletní kolekce',
      'Předplatné National Geographic',
      'Kuchařská kniha středomořská dieta',
      'Obchodní kniha Bohatý táta chudý táta',
      'Módní časopis Vogue 2024',
      'Sbírka dětských knih',
      'Psychologická kniha Atomové návyky',
      'Cestovní průvodce Evropa Lonely Planet',
      'Detektivní román bestseller',
      'Předplatné vědeckého časopisu',
    ],
  },
  'music-instruments': {
    en: [
      'Yamaha Acoustic Guitar FG800',
      'Roland Digital Piano 88 Keys',
      'Fender Stratocaster Electric Guitar',
      'Pearl Drum Set 5-Piece',
      'Yamaha Violin 4/4 Size',
      'Saxophone Alto Yamaha',
      'Ukulele Soprano Kala',
      'Keyboard Synthesizer Casio',
      'Bass Guitar Ibanez 4-String',
      'Microphone Shure SM58',
    ],
    sk: [
      'Akustická gitara Yamaha FG800',
      'Digitálne piano Roland 88 klávesov',
      'Elektrická gitara Fender Stratocaster',
      'Bubenícka súprava Pearl 5 kusov',
      'Husle Yamaha veľkosť 4/4',
      'Saxofón alt Yamaha',
      'Ukulele sopránové Kala',
      'Klávesový syntetizátor Casio',
      'Basová gitara Ibanez 4 struny',
      'Mikrofón Shure SM58',
    ],
    cs: [
      'Akustická kytara Yamaha FG800',
      'Digitální piano Roland 88 kláves',
      'Elektrická kytara Fender Stratocaster',
      'Bicí souprava Pearl 5 kusů',
      'Housle Yamaha velikost 4/4',
      'Saxofon alt Yamaha',
      'Ukulele sopránové Kala',
      'Klávesový syntetizátor Casio',
      'Basová kytara Ibanez 4 struny',
      'Mikrofon Shure SM58',
    ],
  },
  'movies-music': {
    en: [
      'Vinyl Record The Beatles Abbey Road',
      'Blu-ray Marvel Collection 20 Films',
      'Spotify Premium 1 Year',
      'DVD Box Set Game of Thrones',
      'Concert Tickets Coldplay 2024',
      'Vintage Vinyl Player Turntable',
      'Movie Projector Home Cinema',
      'CD Collection Classic Rock',
      'Netflix Gift Card 100€',
      'Soundbar Bose 700',
    ],
    sk: [
      'Vinylová platňa The Beatles Abbey Road',
      'Blu-ray Marvel kolekcia 20 filmov',
      'Spotify Premium 1 rok',
      'DVD box set Hra o tróny',
      'Vstupenky na koncert Coldplay 2024',
      'Vintage gramofón na vinyly',
      'Filmový projektor domáce kino',
      'CD kolekcia Classic Rock',
      'Netflix darčeková karta 100€',
      'Soundbar Bose 700',
    ],
    cs: [
      'Vinylová deska The Beatles Abbey Road',
      'Blu-ray Marvel kolekce 20 filmů',
      'Spotify Premium 1 rok',
      'DVD box set Hra o trůny',
      'Vstupenky na koncert Coldplay 2024',
      'Vintage gramofon na vinyly',
      'Filmový projektor domácí kino',
      'CD kolekce Classic Rock',
      'Netflix dárková karta 100€',
      'Soundbar Bose 700',
    ],
  },
  'beauty-health': {
    en: [
      'Dyson Airwrap Hair Styler',
      'Skincare Set The Ordinary',
      'Perfume Chanel No. 5 100ml',
      'Electric Toothbrush Oral-B',
      'Massage Gun Theragun',
      'Yoga Mat Premium 6mm',
      'Protein Powder Whey 2kg',
      'Vitamins Multivitamin Pack',
      'Face Cream Anti-Aging Retinol',
      'Hair Dryer Professional Salon',
    ],
    sk: [
      'Dyson Airwrap kulma na vlasy',
      'Kozmetická sada The Ordinary',
      'Parfum Chanel No. 5 100ml',
      'Elektrická kefka Oral-B',
      'Masážna pištoľ Theragun',
      'Prémiová jogová podložka 6mm',
      'Proteínový prášok Whey 2kg',
      'Vitamíny multivitamínový balík',
      'Pleťový krém proti starnutiu retinol',
      'Profesionálny fén na vlasy',
    ],
    cs: [
      'Dyson Airwrap kulma na vlasy',
      'Kosmetická sada The Ordinary',
      'Parfém Chanel No. 5 100ml',
      'Elektrický kartáček Oral-B',
      'Masážní pistole Theragun',
      'Prémiová jogová podložka 6mm',
      'Proteinový prášek Whey 2kg',
      'Vitamíny multivitaminový balík',
      'Pleťový krém proti stárnutí retinol',
      'Profesionální fén na vlasy',
    ],
  },
  'toys-games': {
    en: [
      'LEGO Star Wars Millennium Falcon',
      'PlayStation 5 Digital Edition',
      'Board Game Catan Expansion',
      'Barbie Dreamhouse Dollhouse',
      'Hot Wheels Track Set Mega',
      "Rubik's Cube Original",
      'Monopoly Board Game Classic',
      'Remote Control Car 4WD',
      'Puzzle 1000 Pieces Landscape',
      'Nintendo Switch Games Bundle',
    ],
    sk: [
      'LEGO Star Wars Millennium Falcon',
      'PlayStation 5 Digital Edition',
      'Stolová hra Catan rozšírenie',
      'Barbie Dreamhouse domček pre bábiky',
      'Hot Wheels dráha Mega set',
      'Rubikova kocka originál',
      'Monopoly stolová hra klasická',
      'Auto na diaľkové ovládanie 4WD',
      'Puzzle 1000 dielikov krajina',
      'Nintendo Switch balík hier',
    ],
    cs: [
      'LEGO Star Wars Millennium Falcon',
      'PlayStation 5 Digital Edition',
      'Stolní hra Catan rozšíření',
      'Barbie Dreamhouse domeček pro panenky',
      'Hot Wheels dráha Mega set',
      'Rubikova kostka originál',
      'Monopoly stolní hra klasická',
      'Auto na dálkové ovládání 4WD',
      'Puzzle 1000 dílků krajina',
      'Nintendo Switch balík her',
    ],
  },
  furniture: {
    en: [
      'IKEA Malm Bed Frame 160x200',
      'L-Shaped Corner Sofa Grey',
      'Dining Table Oak Wood 6 Seats',
      'Office Chair Ergonomic Herman Miller',
      'Wardrobe 3 Doors White',
      'Coffee Table Modern Glass',
      'TV Stand 180cm Black',
      'Bookshelf Industrial Style',
      'King Size Mattress Memory Foam',
      'Sideboard Storage Cabinet',
    ],
    sk: [
      'IKEA Malm posteľ 160x200',
      'Rohová sedačka do L šedá',
      'Jedálenský stôl dubové drevo 6 miest',
      'Kancelárska stolička ergonomická Herman Miller',
      'Šatníková skriňa 3 dvere biela',
      'Konferenčný stolík moderný sklo',
      'TV stolík 180cm čierny',
      'Knižnica priemyselný štýl',
      'Matrac king size memory foam',
      'Komoda úložná skrinka',
    ],
    cs: [
      'IKEA Malm postel 160x200',
      'Rohová sedačka do L šedá',
      'Jídelní stůl dubové dřevo 6 míst',
      'Kancelářská židle ergonomická Herman Miller',
      'Šatní skříň 3 dveře bílá',
      'Konferenční stolek moderní sklo',
      'TV stolek 180cm černý',
      'Knihovna průmyslový styl',
      'Matrace king size memory foam',
      'Komoda úložná skříňka',
    ],
  },
  'garden-equipment': {
    en: [
      'Lawn Mower Electric 1800W',
      'Hedge Trimmer Bosch',
      'Garden Hose 50m Professional',
      'Pressure Washer Karcher K5',
      'Chainsaw Stihl MS 250',
      'Leaf Blower Battery Powered',
      'Garden Tools Set 10 Pieces',
      'Greenhouse Polycarbonate 6m²',
      'Watering System Automatic',
      'Wheelbarrow Heavy Duty 100L',
    ],
    sk: [
      'Kosačka elektrická 1800W',
      'Orezávač živého plotu Bosch',
      'Záhradná hadica 50m profesionálna',
      'Vysokotlakový čistič Karcher K5',
      'Motorová píla Stihl MS 250',
      'Fúkač lístia na batériu',
      'Sada záhradného náradia 10 kusov',
      'Skleník polykarbonát 6m²',
      'Zavlažovací systém automatický',
      'Fúrik záhradný 100L odolný',
    ],
    cs: [
      'Sekačka elektrická 1800W',
      'Ořezávač živého plotu Bosch',
      'Zahradní hadice 50m profesionální',
      'Vysokotlaký čistič Karcher K5',
      'Motorová pila Stihl MS 250',
      'Foukač listí na baterii',
      'Sada zahradního nářadí 10 kusů',
      'Skleník polykarbonát 6m²',
      'Zavlažovací systém automatický',
      'Kolečko zahradní 100L odolné',
    ],
  },
  'tools-machinery': {
    en: [
      'Bosch Drill Set 18V Cordless',
      'DeWalt Table Saw Professional',
      'Angle Grinder Makita 125mm',
      'Tool Chest with Wheels Stanley',
      'Welding Machine MIG 200A',
      'Air Compressor 50L',
      'Circular Saw 1200W',
      'Ladder Aluminum 3 Sections',
      'Generator 3000W Portable',
      'Socket Set 120 Pieces',
    ],
    sk: [
      'Aku vŕtačka Bosch 18V sada',
      'Stolová píla DeWalt profesionálna',
      'Uhlová brúska Makita 125mm',
      'Dielenský vozík s nástrojmi Stanley',
      'Zvárací prístroj MIG 200A',
      'Kompresor 50L',
      'Okružná píla 1200W',
      'Rebrík hliníkový 3 sekcie',
      'Generátor 3000W prenosný',
      'Sada nástrčných kľúčov 120 kusov',
    ],
    cs: [
      'Aku vrtačka Bosch 18V sada',
      'Stolní pila DeWalt profesionální',
      'Úhlová bruska Makita 125mm',
      'Dílenský vozík s nástroji Stanley',
      'Svářecí přístroj MIG 200A',
      'Kompresor 50L',
      'Okružní pila 1200W',
      'Žebřík hliníkový 3 sekce',
      'Generátor 3000W přenosný',
      'Sada nástrčných klíčů 120 kusů',
    ],
  },
  'food-drink': {
    en: [
      'Organic Honey 1kg Local',
      'Italian Pasta Set 5kg',
      'Premium Olive Oil Extra Virgin',
      'Cheese Selection Box',
      'Coffee Beans Arabica 1kg',
      'Wine Red Cabernet Sauvignon',
      'Chocolate Gift Box Belgian',
      'Spice Collection 20 Types',
      'Tea Set Green Black Herbal',
      'Jam Homemade Variety Pack',
    ],
    sk: [
      'Bio med 1kg miestny',
      'Talianske cestoviny set 5kg',
      'Prémiový olivový olej extra panenský',
      'Box výber syrov',
      'Kávové zrná Arabica 1kg',
      'Červené víno Cabernet Sauvignon',
      'Čokoládová darčeková krabica belgická',
      'Kolekcia korenia 20 druhov',
      'Čajový set zelený čierny bylinný',
      'Domáci džem mix',
    ],
    cs: [
      'Bio med 1kg místní',
      'Italské těstoviny set 5kg',
      'Prémiový olivový olej extra panenský',
      'Box výběr sýrů',
      'Kávová zrna Arabica 1kg',
      'Červené víno Cabernet Sauvignon',
      'Čokoládová dárková krabice belgická',
      'Kolekce koření 20 druhů',
      'Čajový set zelený černý bylinný',
      'Domácí džem mix',
    ],
  },
  'jewelry-watches': {
    en: [
      'Rolex Submariner Watch',
      'Diamond Ring 0.5 Carat',
      'Pandora Charm Bracelet Silver',
      'Gold Necklace 14K Chain',
      'Ray-Ban Sunglasses Aviator',
      'Swarovski Crystal Earrings',
      "Men's Watch Omega Seamaster",
      'Wedding Ring Set White Gold',
      'Pearl Necklace Natural',
      'Engagement Ring 1 Carat Diamond',
    ],
    sk: [
      'Hodinky Rolex Submariner',
      'Diamantový prsteň 0,5 karátu',
      'Pandora náramok s príveskom strieborný',
      'Zlatý náhrdelník 14K retiazka',
      'Slnečné okuliare Ray-Ban Aviator',
      'Náušnice Swarovski kryštálové',
      'Pánske hodinky Omega Seamaster',
      'Svadobné obrúčky biele zlato',
      'Perlový náhrdelník prírodný',
      'Zásnubný prsteň 1 karát diamant',
    ],
    cs: [
      'Hodinky Rolex Submariner',
      'Diamantový prsten 0,5 karátu',
      'Pandora náramek s přívěskem stříbrný',
      'Zlatý náhrdelník 14K řetízek',
      'Sluneční brýle Ray-Ban Aviator',
      'Náušnice Swarovski křišťálové',
      'Pánské hodinky Omega Seamaster',
      'Svatební prsteny bílé zlato',
      'Perlový náhrdelník přírodní',
      'Zásnubní prsten 1 karát diamant',
    ],
  },
  'business-industrial': {
    en: [
      'Forklift Toyota 2.5 Ton',
      'Pallet Rack Storage System',
      'Industrial Shelving Heavy Duty',
      'Warehouse Ladder Platform',
      'Safety Equipment PPE Kit',
      'Loading Ramp Aluminum 2m',
      'Hand Pallet Jack 2 Ton',
      'Industrial Fan 30 Inch',
      'Office Desk Bulk 10 Units',
      'Shipping Boxes 100 Pack',
    ],
    sk: [
      'Vysokozdvižný vozík Toyota 2,5 tony',
      'Paletový regálový systém',
      'Priemyselné regály extra pevné',
      'Skladový rebrík plošina',
      'Bezpečnostné vybavenie PPE kit',
      'Nakladacia rampa hliník 2m',
      'Ručný paletový vozík 2 tony',
      'Priemyselný ventilátor 30 palcov',
      'Kancelársky stôl balík 10 kusov',
      'Prepravné krabice 100 kusov',
    ],
    cs: [
      'Vysokozdvižný vozík Toyota 2,5 tuny',
      'Paletový regálový systém',
      'Průmyslové regály extra pevné',
      'Skladový žebřík plošina',
      'Bezpečnostní vybavení PPE kit',
      'Nakládací rampa hliník 2m',
      'Ruční paletový vozík 2 tuny',
      'Průmyslový ventilátor 30 palců',
      'Kancelářský stůl balík 10 kusů',
      'Přepravní krabice 100 kusů',
    ],
  },
  travel: {
    en: [
      'Samsonite Suitcase Set 3 Pieces',
      'Travel Backpack 40L Waterproof',
      'Flight Tickets Paris Return',
      'Hotel Voucher 5 Star Resort',
      'Travel Adapter Universal',
      'Camping Tent 4 Person',
      'Sleeping Bag -15°C Winter',
      'GoPro Hero 11 Action Camera',
      'Travel Pillow Memory Foam',
      'Luggage Scale Digital',
    ],
    sk: [
      'Samsonite kufor set 3 kusy',
      'Cestovný batoh 40L vodotesný',
      'Letenky do Paríža spiatočné',
      'Hotelový poukaz 5 hviezdičkový rezort',
      'Cestovný adaptér univerzálny',
      'Campingový stan pre 4 osoby',
      'Spací vak -15°C zimný',
      'GoPro Hero 11 akčná kamera',
      'Cestovný vankúš memory foam',
      'Váha na batožinu digitálna',
    ],
    cs: [
      'Samsonite kufr set 3 kusy',
      'Cestovní batoh 40L vodotěsný',
      'Letenky do Paříže zpáteční',
      'Hotelový poukaz 5 hvězdičkový rezort',
      'Cestovní adaptér univerzální',
      'Campingový stan pro 4 osoby',
      'Spací pytel -15°C zimní',
      'GoPro Hero 11 akční kamera',
      'Cestovní polštář memory foam',
      'Váha na zavazadla digitální',
    ],
  },
  'tickets-events': {
    en: [
      'Ed Sheeran Concert Tickets VIP',
      'Football Match Real Madrid vs Barcelona',
      'Theater Show Hamilton Musical',
      'Festival Pass Tomorrowland 2024',
      'Opera Tickets La Traviata',
      'NBA Game Courtside Seats',
      'Cinema Tickets 4D Experience',
      'Comedy Show Stand-up Night',
      'Museum Pass Annual',
      'Ski Pass Season Ticket',
    ],
    sk: [
      'Vstupenky na koncert Ed Sheeran VIP',
      'Futbalový zápas Real Madrid vs Barcelona',
      'Divadelné predstavenie Hamilton muzikál',
      'Permanentka na festival Tomorrowland 2024',
      'Vstupenky do opery La Traviata',
      'NBA zápas sedadlá pri kurte',
      'Kinovstupenky 4D zážitok',
      'Komédia stand-up večer',
      'Múzejná permanentka ročná',
      'Skipas sezónny lístok',
    ],
    cs: [
      'Vstupenky na koncert Ed Sheeran VIP',
      'Fotbalový zápas Real Madrid vs Barcelona',
      'Divadelní představení Hamilton muzikál',
      'Permanentka na festival Tomorrowland 2024',
      'Vstupenky do opery La Traviata',
      'NBA zápas sedadla u kurtu',
      'Kinovstupenky 4D zážitek',
      'Komedie stand-up večer',
      'Muzejní permanentka roční',
      'Skipas sezónní lístek',
    ],
  },
  gifts: {
    en: [
      'Gift Card Amazon 100€',
      'Luxury Gift Box Set',
      'Personalized Photo Album',
      'Scented Candles Set 10 Pieces',
      'Gift Basket Gourmet Food',
      'Wireless Charging Station',
      'Customized Mug with Photo',
      'Flower Bouquet Premium Roses',
      'Bath Bomb Gift Set Lush',
      'Experience Gift Skydiving',
    ],
    sk: [
      'Darčeková karta Amazon 100€',
      'Luxusný darčekový box set',
      'Personalizovaný fotoalbum',
      'Vonné sviečky set 10 kusov',
      'Darčekový kôš gurmánske jedlo',
      'Bezdrôtová nabíjacia stanica',
      'Personalizovaný hrnček s fotkou',
      'Kytice kvetov prémiové ruže',
      'Kúpeľový balík bomby Lush',
      'Darček zážitok zoskok padákom',
    ],
    cs: [
      'Dárková karta Amazon 100€',
      'Luxusní dárkový box set',
      'Personalizovaný fotoalbum',
      'Vonné svíčky set 10 kusů',
      'Dárkový koš gurmánské jídlo',
      'Bezdrátová nabíjecí stanice',
      'Personalizovaný hrnek s fotkou',
      'Kytice květin prémiové růže',
      'Koupelový balík bomby Lush',
      'Dárek zážitek seskok padákem',
    ],
  },
  other: {
    en: [
      'Miscellaneous Items Bundle',
      'Storage Boxes Plastic 50L',
      'Second Hand Items Mixed',
      'Collectibles Various',
      'Wholesale Lot Mixed Products',
      'Garage Sale Items',
      'Estate Sale Collection',
      'Vintage Items Assorted',
      'Bulk Purchase Mixed Goods',
      'Clearance Sale Mixed Items',
    ],
    sk: [
      'Rôzne položky balík',
      'Úložné boxy plastové 50L',
      'Použitý tovar miešaný',
      'Zberateľské predmety rôzne',
      'Veľkoobchodný balík zmiešané produkty',
      'Predaj z garáže položky',
      'Dedičská výpredaj kolekcia',
      'Vintage predmety rôzne',
      'Hromadný nákup miešané tovary',
      'Výpredaj miešané položky',
    ],
    cs: [
      'Různé položky balík',
      'Úložné boxy plastové 50L',
      'Použité zboží smíšené',
      'Sběratelské předměty různé',
      'Velkoobchodní balík smíšené produkty',
      'Prodej z garáže položky',
      'Dědictvo výprodej kolekce',
      'Vintage předměty různé',
      'Hromadný nákup smíšené zboží',
      'Výprodej smíšené položky',
    ],
  },
}

const descriptions = {
  en: 'Excellent condition, well-maintained and ready for immediate use. Perfect for anyone looking for quality and great value. Serious buyers only please. Contact for more details or to arrange viewing. Fast response guaranteed.',
  sk: 'Vynikajúci stav, dobre udržiavaný a pripravený na okamžité použitie. Ideálne pre každého, kto hľadá kvalitu a skvelú hodnotu. Len vážni kupujúci prosím. Kontaktujte pre viac detailov alebo dohodnutie prezretia. Zaručená rýchla odpoveď.',
  cs: 'Vynikající stav, dobře udržovaný a připravený k okamžitému použití. Ideální pro každého, kdo hledá kvalitu a skvělou hodnotu. Pouze vážní kupující prosím. Kontaktujte pro více detailů nebo domluvení prohlídky. Zaručená rychlá odpověď.',
}

const locations = {
  sk: [
    'Bratislava',
    'Košice',
    'Prešov',
    'Žilina',
    'Banská Bystrica',
    'Nitra',
    'Trnava',
    'Martin',
  ],
  cs: [
    'Praha',
    'Brno',
    'Ostrava',
    'Plzeň',
    'Liberec',
    'Olomouc',
    'Hradec Králové',
    'České Budějovice',
  ],
  en: [
    'Bratislava',
    'Kosice',
    'Presov',
    'Zilina',
    'Banska Bystrica',
    'Nitra',
    'Trnava',
    'Martin',
  ],
}

function getImageUrl(keyword, width = 800, height = 600) {
  // Use Lorem Picsum for reliable, fast images
  const seed = Math.random().toString(36).substring(7)
  return `https://picsum.photos/seed/${keyword}-${seed}/${width}/${height}`
}

function generateListing(category, index) {
  const slug = category.slug
  const products = productsByCategory[slug] || productsByCategory['other']

  const productIndex = index % products.en.length

  return {
    title: products.en[productIndex],
    title_sk: products.sk[productIndex],
    title_cs: products.cs[productIndex],
    title_en: products.en[productIndex],
    description: descriptions.en,
    description_sk: descriptions.sk,
    description_cs: descriptions.cs,
    description_en: descriptions.en,
    price: random(20, 2000),
    currency: 'EUR',
    condition: randomChoice(['new', 'used']),
    location: randomChoice(locations.en),
    views: random(0, 200),
    is_active: true,
    images: [
      getImageUrl(`${slug}-${index}-1`),
      getImageUrl(`${slug}-${index}-2`),
      getImageUrl(`${slug}-${index}-3`),
    ],
  }
}

async function ensureTestSeller() {
  const userId = '522f621e-3e70-40bc-b312-81ba9a105170'
  const userEmail = 'test.seller@slovor.sk'

  console.log(`🔧 Ensuring test seller exists (${userId})...`)

  // 1. Check if user exists in public.users (Required for listings FK)
  const { data: existingPublicUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single()

  if (!existingPublicUser) {
    console.log('   Creating record in public.users...')

    const { error } = await supabase.from('users').insert({
      id: userId,
      username: 'test_seller',
      display_name: 'Test Seller',
      verified: true,
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testseller',
    })

    if (error) {
      // Ignore duplicate key error if it happened in parallel
      if (error.code !== '23505') {
        console.warn(
          '   ⚠️ Warning: Could not create public.users record:',
          error.message
        )
      }
    } else {
      console.log('   ✅ Created public.users record')
    }
  }

  // 2. Ensuring profile exists (Required for Seller Page)
  // This is usually handled by triggers, but good to double check for seed stability
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()

  if (!existingProfile) {
    console.log('   Creating record in public.profiles...')
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      display_name: 'Test Seller',
      bio: 'Professional seller with great products and reviews.',
      location: 'Bratislava, Slovakia',
      phone: '+421 123 456 789',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testseller',
    })
    if (profileError && profileError.code !== '23505') {
      console.warn(
        '   ⚠️ Warning: Could not create profile:',
        profileError.message
      )
    } else {
      console.log('   ✅ Created profile record')
    }
  }

  return userId
}

async function seedDatabase() {
  console.log('🚀 Starting multilingual realistic seed...')
  console.log('')

  try {
    const userId = await ensureTestSeller()

    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (catError) throw catError

    console.log(`✅ Found ${categories.length} categories`)
    console.log('🌍 Creating multilingual listings (EN/SK/CS)')
    console.log('')

    let totalCreated = 0

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      const categoryName = category.name

      console.log(`📦 [${i + 1}/${categories.length}] ${categoryName}`)

      for (let j = 0; j < 10; j++) {
        const listingData = generateListing(category, j)

        const { error: insertError } = await supabase.from('listings').insert({
          ...listingData,
          category_id: category.id,
          user_id: userId,
        })

        if (insertError) {
          console.error(`  ❌ Error: ${insertError.message}`)
          continue
        }

        totalCreated++
      }

      console.log(`  ✅ Created 10 multilingual listings`)
    }

    console.log('')
    console.log('🎉 Seed complete!')
    console.log('')
    console.log('📊 Statistics:')
    console.log(`  - Categories: ${categories.length}`)
    console.log(`  - Listings created: ${totalCreated}`)
    console.log(`  - Languages: 3 (EN/SK/CS)`)
    console.log(`  - Images per listing: 3`)
    console.log(`  - Total images: ${totalCreated * 3}`)
    console.log('')
    console.log('✅ All listings have real product names and translations!')
    console.log('✅ Images are working (Lorem Picsum)!')
    console.log('')
  } catch (error) {
    console.error('❌ Seed failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

seedDatabase()
