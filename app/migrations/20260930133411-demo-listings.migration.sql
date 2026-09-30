-- demo agents, listings, photos, open houses and inquiries

insert into users (email, passwordHash, name, role, title, phone, bio, photo)
     values
  ('nora@keystoop.test', crypt('keystoop', genSalt('bf', 12)), 'Nora Whitfield', 'agent', 'Principal Broker', '(555) 201-4410', 'Nora founded Keystoop in 2009 after fifteen years selling homes across the county. She knows every street in Old Town and Lakeview.', 'nora'),
  ('marcus@keystoop.test', crypt('keystoop', genSalt('bf', 12)), 'Marcus Bell', 'agent', 'Associate Broker', '(555) 201-4422', 'Marcus came to real estate from home building, and he still reads a house from the foundation up. He covers Cedar Park, Bellmont Hills and Harbor Point.', 'marcus'),
  ('maya@keystoop.test', crypt('keystoop', genSalt('bf', 12)), 'Maya Torres', 'agent', 'Sales Agent', '(555) 201-4437', 'Maya helps first-time buyers and downsizers find their footing in Maple Heights, Riverside and the West End.', 'maya');

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '14 Cobble Row', 'Old Town', 'townhouse', 685000, 3, 2.5, 1840, 1200, 1911, 'Brick row house on Old Town''s quietest block', 'A century-old brick townhouse with original heart-pine floors, tall sash windows and a gas fireplace in the front parlor. The kitchen was rebuilt in 2021 with quartz counters and a walk-in pantry. Out back, a private brick patio catches the afternoon sun.', now() - interval '2 days' - interval '37 minutes', null
       from users where email = 'nora@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'cobble-row'),
  (1, 'living-01'),
  (2, 'kitchen-1'),
  (3, 'bedroom-1'),
  (4, 'bath-1'),
  (5, 'living-06')
       ) as v (position, asset)
      where l.address = '14 Cobble Row';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '88 Hollow Pine Lane', 'Cedar Park', 'house', 749000, 4, 3, 2650, 21000, 1978, 'Wooded half-acre with a slate roof', 'Set back from the road under tall pines, this gray-sided home has an open living room with a stone hearth, a sunroom facing the woods and a finished lower level. New slate roof in 2022. Walk to the Cedar Park trailhead.', now() - interval '5 days' - interval '74 minutes', null
       from users where email = 'marcus@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'hollow-pine'),
  (1, 'living-02'),
  (2, 'kitchen-2'),
  (3, 'bedroom-2'),
  (4, 'bath-2'),
  (5, 'living-07')
       ) as v (position, asset)
      where l.address = '88 Hollow Pine Lane';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '203 Orchard Street', 'Maple Heights', 'house', 529000, 3, 1.5, 1620, 7400, 1924, 'Picket-fence farmhouse, fully restored', 'The classic Maple Heights farmhouse: a covered front porch, a white picket fence and a yard with two mature maples. Inside, a bright eat-in kitchen, refinished oak floors and three bedrooms upstairs. Two blocks to Maple Heights Elementary.', now() - interval '1 days' - interval '111 minutes', null
       from users where email = 'maya@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'orchard'),
  (1, 'living-03'),
  (2, 'kitchen-3'),
  (3, 'bedroom-3'),
  (4, 'bath-1'),
  (5, 'living-08')
       ) as v (position, asset)
      where l.address = '203 Orchard Street';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'pending', '7 Lantern Court', 'West End', 'townhouse', 612000, 3, 2.5, 1780, 900, 2016, 'End-unit townhouse with a rooftop deck', 'A corner end unit with windows on three sides, a garage, and a rooftop deck with views toward the harbor. Open main floor with a chef''s kitchen and a powder room. Steps from West End cafes and the light rail.', now() - interval '18 days' - interval '148 minutes', null
       from users where email = 'nora@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'lantern-court'),
  (1, 'living-04'),
  (2, 'kitchen-4'),
  (3, 'bedroom-4'),
  (4, 'bath-2'),
  (5, 'living-09')
       ) as v (position, asset)
      where l.address = '7 Lantern Court';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '1 Seagrass Point', 'Harbor Point', 'house', 2395000, 5, 5.5, 5200, 18000, 2019, 'Modern waterfront with an infinity pool', 'Floor-to-ceiling glass opens the great room onto a limestone terrace and an infinity-edge pool above the water. Five en-suite bedrooms, a primary wing with a private balcony, a wine room and a three-car garage.', now() - interval '3 days' - interval '185 minutes', null
       from users where email = 'marcus@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'seagrass'),
  (1, 'seagrass-2'),
  (2, 'living-05'),
  (3, 'kitchen-1'),
  (4, 'bedroom-1'),
  (5, 'bath-1'),
  (6, 'living-10')
       ) as v (position, asset)
      where l.address = '1 Seagrass Point';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '450 Glass Lake Drive', 'Lakeview', 'house', 1485000, 4, 3.5, 3900, 15500, 2014, 'Glass-walled lake house with a dock', 'An architect-designed home that lives on the lake: a two-story glass living room, radiant floors, a lower-level family room with walkout access and a private dock. Heated three-car garage.', now() - interval '9 days' - interval '222 minutes', null
       from users where email = 'nora@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'glass-lake'),
  (1, 'glass-lake-2'),
  (2, 'living-06'),
  (3, 'kitchen-2'),
  (4, 'bedroom-2'),
  (5, 'bath-2'),
  (6, 'living-11')
       ) as v (position, asset)
      where l.address = '450 Glass Lake Drive';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'sold', '310 River Walk #5B', 'Riverside', 'condo', 415000, 2, 2, 1150, null, 2008, 'Corner two-bed on the river walk', 'A corner unit with river views from both bedrooms, an open kitchen with a breakfast bar and in-unit laundry. The building has a gym, a roof terrace and deeded parking.', now() - interval '42 days' - interval '259 minutes', now() - interval '22 days'
       from users where email = 'maya@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'river-walk'),
  (1, 'living-07'),
  (2, 'kitchen-3'),
  (3, 'bedroom-3'),
  (4, 'bath-1')
       ) as v (position, asset)
      where l.address = '310 River Walk #5B';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '12 Red Barn Road', 'Bellmont Hills', 'house', 299000, 1, 1, 720, 43000, 1952, 'Rose-covered cottage on an acre', 'A tidy one-bedroom cottage with a rose-covered veranda and a picket fence, on an acre with long views across Bellmont Hills. Wood stove, updated bath, and a detached studio that makes a fine workshop. Ideal starter or weekend place.', now() - interval '6 days' - interval '296 minutes', null
       from users where email = 'marcus@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'red-barn'),
  (1, 'living-08'),
  (2, 'kitchen-4'),
  (3, 'bedroom-4')
       ) as v (position, asset)
      where l.address = '12 Red Barn Road';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '22 Tidewater Terrace #3', 'Harbor Point', 'condo', 865000, 2, 2, 1420, null, 2020, 'Stacked-white condo steps from the marina', 'A light-filled condo in a boutique building of twelve. Wide-plank oak floors, a kitchen with integrated appliances, and a private terrace that faces the marina. Two garage spaces and storage.', now() - interval '4 days' - interval '333 minutes', null
       from users where email = 'nora@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'tidewater'),
  (1, 'living-09'),
  (2, 'kitchen-1'),
  (3, 'bedroom-1'),
  (4, 'bath-1')
       ) as v (position, asset)
      where l.address = '22 Tidewater Terrace #3';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '600 Ashby Avenue #1204', 'West End', 'condo', 489000, 1, 1, 860, null, 2017, 'Twelfth-floor one-bed with skyline views', 'High in the West End Tower with skyline views from every room. Open kitchen with a gas range, a spa bath, and a building with a 24-hour concierge, pool and co-working lounge.', now() - interval '11 days' - interval '370 minutes', null
       from users where email = 'maya@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'ashby'),
  (1, 'view-1'),
  (2, 'kitchen-2'),
  (3, 'bedroom-2')
       ) as v (position, asset)
      where l.address = '600 Ashby Avenue #1204';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'pending', '95 Sunset Ridge', 'Bellmont Hills', 'house', 815000, 4, 3, 3100, 52000, 1998, 'Ridge-top home with sunset views', 'A stone-front home on the ridge with a wraparound deck built for evening light. Vaulted living room, a main-floor primary suite and a three-season porch. Over an acre of lawn and woods.', now() - interval '24 days' - interval '407 minutes', null
       from users where email = 'marcus@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'sunset-ridge'),
  (1, 'living-11'),
  (2, 'kitchen-3'),
  (3, 'bedroom-3'),
  (4, 'bath-1'),
  (5, 'living-03')
       ) as v (position, asset)
      where l.address = '95 Sunset Ridge';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '41 Bluebell Lane', 'Maple Heights', 'house', 598000, 3, 2, 1950, 6800, 1931, 'Blue Victorian with a deep porch', 'A porch swing, a blue front door and room to linger. This Victorian has a renovated kitchen, a first-floor bedroom and two more upstairs under the gables. Fenced backyard with raised beds.', now() - interval '7 days' - interval '444 minutes', null
       from users where email = 'maya@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'bluebell'),
  (1, 'living-12'),
  (2, 'kitchen-4'),
  (3, 'bedroom-4'),
  (4, 'bath-2'),
  (5, 'living-04')
       ) as v (position, asset)
      where l.address = '41 Bluebell Lane';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '8 Palmetto Circle', 'Harbor Point', 'house', 1675000, 5, 4, 4300, 12500, 2006, 'Resort-style pool home near the beach', 'A two-story brick home with a pool and spa framed by clipped cypress, garden lighting and an outdoor kitchen. Inside, a formal living room, a family room open to the kitchen, and a guest suite on the main floor.', now() - interval '13 days' - interval '481 minutes', null
       from users where email = 'nora@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'palmetto'),
  (1, 'living-06'),
  (2, 'living-13'),
  (3, 'kitchen-1'),
  (4, 'bedroom-1'),
  (5, 'bath-1'),
  (6, 'living-05')
       ) as v (position, asset)
      where l.address = '8 Palmetto Circle';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '19 Garden Mews', 'Riverside', 'townhouse', 459000, 3, 2.5, 1560, 1100, 2004, 'Garden townhouse in a pocket neighborhood', 'One of twelve painted townhouses around a shared green. Hardwood floors, a gas fireplace, an attached garage and a private patio. Riverside Park is a five-minute walk.', now() - interval '15 days' - interval '518 minutes', null
       from users where email = 'maya@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'garden-mews'),
  (1, 'living-01'),
  (2, 'kitchen-2'),
  (3, 'bedroom-2'),
  (4, 'bath-2'),
  (5, 'living-06')
       ) as v (position, asset)
      where l.address = '19 Garden Mews';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '260 Lantern Hill', 'Cedar Park', 'house', 1125000, 4, 3.5, 3450, 24000, 2011, 'Stone-and-shingle Craftsman near the pines', 'A shingle-style Craftsman with a great room under exposed beams, a stone fireplace and a kitchen with a butcher-block island. Covered back porch, screened sleeping porch and a heated garage.', now() - interval '8 days' - interval '555 minutes', null
       from users where email = 'marcus@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'lantern-hill'),
  (1, 'living-02'),
  (2, 'kitchen-3'),
  (3, 'bedroom-3'),
  (4, 'bath-1'),
  (5, 'living-07')
       ) as v (position, asset)
      where l.address = '260 Lantern Hill';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'sold', '5 Commons Way', 'Lakeview', 'house', 945000, 4, 2.5, 3000, 14800, 1989, 'Shingle colonial across from the commons', 'A gray shingle colonial with a wraparound porch facing Lakeview Commons. Formal dining room, updated kitchen, four bedrooms and a finished attic. Mature gardens and a two-car garage.', now() - interval '55 days' - interval '592 minutes', now() - interval '35 days'
       from users where email = 'nora@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'commons'),
  (1, 'living-03'),
  (2, 'kitchen-4'),
  (3, 'bedroom-4'),
  (4, 'bath-2'),
  (5, 'living-08')
       ) as v (position, asset)
      where l.address = '5 Commons Way';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '77 Timber Trail', 'Bellmont Hills', 'house', 689000, 3, 2, 2200, 65000, 1985, 'Log home with a wraparound deck', 'A true log home on an acre and a half, with a cathedral great room, a stone chimney and a loft. Updated kitchen and baths, a new metal roof, and trails out the back door.', now() - interval '20 days' - interval '629 minutes', null
       from users where email = 'marcus@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'timber-trail'),
  (1, 'living-04'),
  (2, 'kitchen-1'),
  (3, 'bedroom-1'),
  (4, 'bath-1'),
  (5, 'living-09')
       ) as v (position, asset)
      where l.address = '77 Timber Trail';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'pending', '30 Chestnut Street', 'Old Town', 'house', 559000, 3, 1.5, 1480, 4200, 1922, 'Porch-front bungalow near the square', 'A classic Old Town bungalow with a full-width front porch, built-ins, a sunny dining room and a walk-up attic. Two blocks from the farmers market and the square.', now() - interval '27 days' - interval '666 minutes', null
       from users where email = 'maya@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'chestnut'),
  (1, 'living-05'),
  (2, 'kitchen-2'),
  (3, 'bedroom-2'),
  (4, 'bath-2'),
  (5, 'living-10')
       ) as v (position, asset)
      where l.address = '30 Chestnut Street';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '112 Rosebay Lane', 'Maple Heights', 'house', 629000, 4, 2.5, 2100, 7200, 1946, 'Storybook Tudor with a steep gable', 'Clinker brick, a steep slate gable and a tall stone chimney. Four bedrooms, a remodeled kitchen with a farmhouse sink and a finished basement. Backyard with a stone patio.', now() - interval '10 days' - interval '703 minutes', null
       from users where email = 'nora@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'rosebay'),
  (1, 'living-06'),
  (2, 'kitchen-3'),
  (3, 'bedroom-3'),
  (4, 'bath-1'),
  (5, 'living-11')
       ) as v (position, asset)
      where l.address = '112 Rosebay Lane';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '3 Beacon Cove', 'Harbor Point', 'house', 1950000, 4, 4.5, 4100, 11000, 2021, 'Just listed: new-build modern with a pool', 'Completed in 2021: a modern home with a cantilevered upper floor, walls of glass and a heated pool. Open kitchen with a waterfall island, a home office, and a primary suite with a soaking tub.', now() - interval '0 days' - interval '740 minutes', null
       from users where email = 'marcus@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'beacon-cove'),
  (1, 'view-4'),
  (2, 'living-07'),
  (3, 'kitchen-4'),
  (4, 'bedroom-4'),
  (5, 'bath-2'),
  (6, 'living-12')
       ) as v (position, asset)
      where l.address = '3 Beacon Cove';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '58 Birch Lane', 'Lakeview', 'house', 689000, 4, 2.5, 2400, 11800, 1996, 'Updated four-bed on a cul-de-sac', 'A two-story home at the end of a quiet cul-de-sac. New kitchen, new windows, a family room with a fireplace and a big level yard. Walk to Lakeview Middle School and the beach club.', now() - interval '12 days' - interval '777 minutes', null
       from users where email = 'maya@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'birch'),
  (1, 'living-08'),
  (2, 'kitchen-1'),
  (3, 'bedroom-1'),
  (4, 'bath-1'),
  (5, 'living-13')
       ) as v (position, asset)
      where l.address = '58 Birch Lane';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '140 Meadow View Road', 'Cedar Park', 'house', 575000, 3, 2, 1900, 16000, 1990, 'Stucco ranch with a two-car garage', 'Single-level living with an open living and dining room, a sunroom, and three bedrooms including a primary with its own bath. Deep lot with a garden shed.', now() - interval '16 days' - interval '814 minutes', null
       from users where email = 'nora@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'meadow-view'),
  (1, 'living-09'),
  (2, 'kitchen-2'),
  (3, 'bedroom-2'),
  (4, 'bath-2'),
  (5, 'living-01')
       ) as v (position, asset)
      where l.address = '140 Meadow View Road';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'pending', '9 Hawthorn Place', 'Maple Heights', 'house', 719000, 4, 3, 2600, 9500, 2002, 'Brick colonial with a three-car garage', 'A solid brick colonial on a corner lot with a formal living room, a kitchen with an island and a large family room. Four bedrooms up, finished basement and a three-car garage.', now() - interval '21 days' - interval '851 minutes', null
       from users where email = 'marcus@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'hawthorn'),
  (1, 'living-10'),
  (2, 'kitchen-3'),
  (3, 'bedroom-3'),
  (4, 'bath-1'),
  (5, 'living-02')
       ) as v (position, asset)
      where l.address = '9 Hawthorn Place';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '1 Coral Crest', 'Harbor Point', 'house', 2250000, 6, 6, 5800, 20000, 2010, 'Stone estate with a lagoon pool', 'A white stone estate with a lagoon pool and spa, a covered loggia and gardens. Six bedrooms, a media room, a gym and a guest casita. Two blocks to the private beach.', now() - interval '19 days' - interval '888 minutes', null
       from users where email = 'nora@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'coral-crest'),
  (1, 'view-2'),
  (2, 'living-11'),
  (3, 'kitchen-4'),
  (4, 'bedroom-4'),
  (5, 'bath-2'),
  (6, 'living-03')
       ) as v (position, asset)
      where l.address = '1 Coral Crest';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'sold', '44 Foundry Lane', 'West End', 'townhouse', 799000, 3, 3.5, 2100, 1000, 2018, 'Brick-clad modern townhouse', 'A modern townhouse with charcoal brick cladding, a two-story living room, a roof deck and an elevator. Garage parking for two. In the heart of the West End arts district.', now() - interval '61 days' - interval '925 minutes', now() - interval '41 days'
       from users where email = 'maya@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'foundry'),
  (1, 'living-12'),
  (2, 'kitchen-1'),
  (3, 'bedroom-1'),
  (4, 'bath-1'),
  (5, 'living-04')
       ) as v (position, asset)
      where l.address = '44 Foundry Lane';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '17 Kiln Street', 'Old Town', 'townhouse', 735000, 2, 2.5, 1650, 1300, 2019, 'Architect''s townhouse by the old kiln works', 'A modern infill townhouse with a courtyard entry, polished concrete floors and a sleek kitchen. Two en-suite bedrooms and a studio loft. Walk to the square.', now() - interval '14 days' - interval '962 minutes', null
       from users where email = 'marcus@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'kiln'),
  (1, 'living-13'),
  (2, 'kitchen-2'),
  (3, 'bedroom-2'),
  (4, 'bath-2')
       ) as v (position, asset)
      where l.address = '17 Kiln Street';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '330 Heron Bay Drive', 'Lakeview', 'house', 1295000, 4, 3.5, 3600, 13000, 2017, 'Timber-and-glass modern on Heron Bay', 'A modern home framed by a century oak, with walls of glass onto a lawn that runs to the bay. Open kitchen and living space, a main-floor office and four bedrooms upstairs.', now() - interval '22 days' - interval '999 minutes', null
       from users where email = 'maya@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'heron-bay'),
  (1, 'living-01'),
  (2, 'kitchen-3'),
  (3, 'bedroom-3'),
  (4, 'bath-1'),
  (5, 'living-06')
       ) as v (position, asset)
      where l.address = '330 Heron Bay Drive';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'pending', '505 Mill Race #7', 'Riverside', 'condo', 569000, 2, 2, 1300, null, 2015, 'Loft condo in the converted mill', 'A two-level loft in the Mill Race building, with 14-foot ceilings, black steel windows and a private balcony over the race. Parking, storage and a rooftop lounge.', now() - interval '30 days' - interval '1036 minutes', null
       from users where email = 'nora@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'mill-race'),
  (1, 'view-3'),
  (2, 'kitchen-4'),
  (3, 'bedroom-4'),
  (4, 'bath-2')
       ) as v (position, asset)
      where l.address = '505 Mill Race #7';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '71 Fieldstone Drive', 'Cedar Park', 'house', 875000, 5, 3.5, 3300, 19000, 2004, 'Stone-front five-bed near the reservoir', 'A stone and brick home with a two-story foyer, a formal dining room and a family room open to the kitchen. Five bedrooms, a finished lower level and a three-car garage.', now() - interval '17 days' - interval '1073 minutes', null
       from users where email = 'marcus@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'fieldstone'),
  (1, 'living-03'),
  (2, 'kitchen-1'),
  (3, 'bedroom-1'),
  (4, 'bath-1'),
  (5, 'living-08')
       ) as v (position, asset)
      where l.address = '71 Fieldstone Drive';

insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt, headline, description, listedAt, soldAt)
     select id, 'active', '26 Linden Avenue', 'Old Town', 'house', 645000, 3, 2, 1750, 5200, 1915, 'Craftsman with a columned porch', 'A painted Craftsman with tapered porch columns, a beamed living room, and a remodeled kitchen with a breakfast nook. Three bedrooms up and a detached garage off the alley.', now() - interval '25 days' - interval '1110 minutes', null
       from users where email = 'maya@keystoop.test';

insert into photos (listingId, position, asset)
     select l.id, v.position, v.asset
       from listings l, (values
  (0, 'linden'),
  (1, 'living-04'),
  (2, 'kitchen-2'),
  (3, 'bedroom-2'),
  (4, 'bath-2'),
  (5, 'living-09')
       ) as v (position, asset)
      where l.address = '26 Linden Avenue';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '11 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '13 hours') at time zone 'America/New_York'
       from listings where address = '14 Cobble Row';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '12 days' + interval '13 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '12 days' + interval '15 hours') at time zone 'America/New_York'
       from listings where address = '14 Cobble Row';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '12 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '14 hours') at time zone 'America/New_York'
       from listings where address = '203 Orchard Street';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '13 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '15 hours') at time zone 'America/New_York'
       from listings where address = '1 Seagrass Point';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '11 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '13 hours') at time zone 'America/New_York'
       from listings where address = '450 Glass Lake Drive';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '13 days' + interval '13 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '13 days' + interval '15 hours') at time zone 'America/New_York'
       from listings where address = '450 Glass Lake Drive';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '12 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '14 hours') at time zone 'America/New_York'
       from listings where address = '22 Tidewater Terrace #3';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '13 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '15 hours') at time zone 'America/New_York'
       from listings where address = '41 Bluebell Lane';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '11 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '13 hours') at time zone 'America/New_York'
       from listings where address = '8 Palmetto Circle';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '12 days' + interval '13 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '12 days' + interval '15 hours') at time zone 'America/New_York'
       from listings where address = '8 Palmetto Circle';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '12 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '14 hours') at time zone 'America/New_York'
       from listings where address = '260 Lantern Hill';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '13 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '15 hours') at time zone 'America/New_York'
       from listings where address = '112 Rosebay Lane';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '11 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '13 hours') at time zone 'America/New_York'
       from listings where address = '3 Beacon Cove';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '13 days' + interval '13 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '13 days' + interval '15 hours') at time zone 'America/New_York'
       from listings where address = '3 Beacon Cove';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '12 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '14 hours') at time zone 'America/New_York'
       from listings where address = '1 Coral Crest';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '13 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '6 days' + interval '15 hours') at time zone 'America/New_York'
       from listings where address = '330 Heron Bay Drive';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '11 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '5 days' + interval '13 hours') at time zone 'America/New_York'
       from listings where address = '26 Linden Avenue';

insert into openHouses (listingId, startsAt, endsAt)
     select id,
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '12 days' + interval '13 hours') at time zone 'America/New_York',
            (date_trunc('week', now() at time zone 'America/New_York' + interval '2 days') + interval '12 days' + interval '15 hours') at time zone 'America/New_York'
       from listings where address = '26 Linden Avenue';

insert into inquiries (listingId, agentId, kind, name, email, phone, message, preferredTime, createdAt, readAt)
     select id, agentId, 'showing', 'Jordan Price', 'jordan.price@example.com', '(555) 330-1182', 'We''d love to see it this weekend. Is the patio shared with the neighbors?', 'Saturday morning', now() - interval '3 minutes', null
       from listings where address = '14 Cobble Row';

insert into inquiries (listingId, agentId, kind, name, email, phone, message, preferredTime, createdAt, readAt)
     select id, agentId, 'question', 'Alex Kim', 'alex.kim@example.com', '', 'Is the dock deeded, and how deep is the water at the end of it?', '', now() - interval '20 minutes', null
       from listings where address = '450 Glass Lake Drive';

insert into inquiries (listingId, agentId, kind, name, email, phone, message, preferredTime, createdAt, readAt)
     select id, agentId, 'showing', 'Sam Rivera', 'sam.rivera@example.com', '(555) 481-0093', 'Pre-approved and relocating in November. Could we tour Thursday after work?', 'Thursday after 5pm', now() - interval '50 minutes', null
       from listings where address = '22 Tidewater Terrace #3';

insert into inquiries (listingId, agentId, kind, name, email, phone, message, preferredTime, createdAt, readAt)
     select id, agentId, 'question', 'Taylor Brooks', 'taylor.b@example.com', '(555) 212-7781', 'What are the annual taxes and is the pool heated?', '', now() - interval '90 minutes', now() - interval '88 minutes'
       from listings where address = '1 Seagrass Point';

insert into inquiries (listingId, agentId, kind, name, email, phone, message, preferredTime, createdAt, readAt)
     select id, agentId, 'showing', 'Morgan Lee', 'morgan.lee@example.com', '', 'Can we see the Craftsman on Sunday? We have two kids and a dog.', 'Sunday afternoon', now() - interval '8 minutes', null
       from listings where address = '260 Lantern Hill';

insert into inquiries (listingId, agentId, kind, name, email, phone, message, preferredTime, createdAt, readAt)
     select id, agentId, 'question', 'Chris Patel', 'chris.patel@example.com', '(555) 902-4410', 'Is the builder''s warranty transferable?', '', now() - interval '200 minutes', now() - interval '198 minutes'
       from listings where address = '3 Beacon Cove';

insert into inquiries (listingId, agentId, kind, name, email, phone, message, preferredTime, createdAt, readAt)
     select id, agentId, 'showing', 'Riley Chen', 'riley.chen@example.com', '(555) 313-5620', 'First-time buyers here. Is there any flexibility on closing dates?', 'Weekday evenings', now() - interval '12 minutes', null
       from listings where address = '203 Orchard Street';

insert into inquiries (listingId, agentId, kind, name, email, phone, message, preferredTime, createdAt, readAt)
     select id, agentId, 'question', 'Jamie Novak', 'jamie.novak@example.com', '', 'What are the HOA fees and do they include parking?', '', now() - interval '140 minutes', now() - interval '138 minutes'
       from listings where address = '600 Ashby Avenue #1204';

-- a demo buyer with saved homes and saved searches
insert into users (email, passwordHash, name, role)
     values ('sam.rivera@example.com', crypt('keystoop', genSalt('bf', 12)), 'Sam Rivera', 'buyer');

insert into favorites (userId, listingId, createdAt)
     select u.id, l.id, now() - v.ago
       from users u, listings l, (values
  ('203 Orchard Street', interval '40 minutes'),
  ('22 Tidewater Terrace #3', interval '2 hours'),
  ('41 Bluebell Lane', interval '1 days'),
  ('26 Linden Avenue', interval '2 days'),
  ('7 Lantern Court', interval '4 days')
       ) as v (address, ago)
      where u.email = 'sam.rivera@example.com' and l.address = v.address;

insert into savedSearches (userId, name, minPrice, maxPrice, minBeds, minBaths, propertyType, neighborhood, createdAt)
     select id, v.name, v.minPrice, v.maxPrice, v.minBeds, v.minBaths, v.propertyType, v.neighborhood, now() - v.ago
       from users, (values
  ('Condos in Harbor Point', null::integer, null::integer, null::integer, null::real, 'condo', 'Harbor Point', interval '3 days'),
  ('Homes in Old Town, $500K to $750K, 3+ beds', 500000, 750000, 3, null::real, null, 'Old Town', interval '6 days')
       ) as v (name, minPrice, maxPrice, minBeds, minBaths, propertyType, neighborhood, ago)
      where email = 'sam.rivera@example.com';
