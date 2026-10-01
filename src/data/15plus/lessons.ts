import type { Lesson } from '@/types';

/** 15+ lessons: concise briefings with key data, terms and a myth-vs-fact check. */
export const plusLessons: Lesson[] = [
  {
    topicId: 'p-climate',
    title: 'Climate Change: Science to Solutions',
    intro:
      'Earth’s climate has always changed, but today’s warming is unusually fast and driven mainly by human greenhouse gas emissions.',
    sections: [
      {
        heading: 'The greenhouse effect',
        body: 'Greenhouse gases such as CO₂, methane and nitrous oxide let sunlight in but slow the escape of heat. The natural effect keeps Earth habitable; burning fossil fuels strengthens it.',
        bullets: [
          'Without any greenhouse effect, Earth would average about −18 °C instead of ~15 °C.',
          'CO₂ is the largest contributor to human-caused warming; methane is far more potent but shorter-lived.',
        ],
      },
      {
        heading: 'Feedback loops',
        body: 'Some effects of warming cause more warming. These positive feedbacks can accelerate change.',
        bullets: [
          'Ice–albedo: melting ice exposes darker ocean that absorbs more sunlight.',
          'Permafrost thaw releases stored carbon as CO₂ and methane.',
          'Warmer air holds more water vapour, itself a greenhouse gas.',
        ],
      },
      {
        heading: 'Impacts',
        body: 'Warming raises sea levels through thermal expansion and melting land ice, intensifies heatwaves and heavy rainfall, and acidifies oceans as they absorb CO₂.',
      },
      {
        heading: 'Responses',
        body: 'Mitigation cuts emissions to limit future warming; adaptation prepares for impacts already locked in. The 2015 Paris Agreement aims to keep warming well below 2 °C and pursue 1.5 °C.',
        bullets: ['Net zero means remaining emissions are balanced by removals from the atmosphere.'],
      },
    ],
    keyStats: [
      { value: '~50%', label: 'rise in atmospheric CO₂ since pre-industrial times (280 → ~424 ppm)' },
      { value: '~¾', label: 'of global emissions come from energy use' },
      { value: '2015', label: 'Paris Agreement adopted' },
    ],
    keyTerms: [
      { term: 'Mitigation', definition: 'Actions that reduce or prevent greenhouse gas emissions.' },
      { term: 'Adaptation', definition: 'Adjusting systems to reduce harm from climate impacts.' },
      { term: 'Albedo', definition: 'How much sunlight a surface reflects.' },
    ],
    mythFact: {
      myth: 'The climate has changed before, so today’s change must be natural.',
      fact: 'Past changes had natural causes; today’s rapid warming matches the fingerprint of human greenhouse gas emissions.',
    },
    takeaway: 'Every fraction of a degree avoided reduces risk — cutting emissions this decade matters most.',
  },
  {
    topicId: 'p-carbon',
    title: 'Understanding Carbon Footprints',
    intro: 'A carbon footprint measures the greenhouse gases caused by a person, product, organisation or activity, expressed in CO₂-equivalent (CO₂e).',
    sections: [
      {
        heading: 'Why CO₂-equivalent?',
        body: 'Different gases trap different amounts of heat. CO₂e converts methane, nitrous oxide and others into the amount of CO₂ that would cause the same warming, so they can be added together.',
      },
      {
        heading: 'Where personal emissions come from',
        body: 'For most people the biggest slices are transport, home energy, food and the goods they buy.',
        bullets: [
          'A domestic flight emits roughly 7× more CO₂e per passenger-km than a train.',
          'Electricity emissions depend on the grid: kWh used × the grid’s emission factor.',
          'Beef has many times the footprint of pulses per kg of food.',
        ],
      },
      {
        heading: 'Organisations: Scopes 1, 2 and 3',
        body: 'Scope 1 covers direct emissions (own fuel), Scope 2 purchased electricity and heat, and Scope 3 the wider value chain — often the largest share.',
      },
      {
        heading: 'Reduce first, offset last',
        body: 'Offsets vary in quality. Credible ones are additional, verifiable and permanent, but avoiding emissions in the first place is always more reliable.',
      },
    ],
    keyStats: [
      { value: '~4.7 t', label: 'world average fossil CO₂ per person per year' },
      { value: '~2 t', label: 'average per person in India' },
      { value: '0.7 kg', label: 'approx. CO₂ per kWh on a coal-heavy grid' },
    ],
    keyTerms: [
      { term: 'CO₂e', definition: 'Greenhouse gases expressed as the equivalent warming of CO₂.' },
      { term: 'Emission factor', definition: 'Emissions released per unit of activity, e.g. kg CO₂ per kWh.' },
      { term: 'Embodied carbon', definition: 'Emissions from making a product or building before it is used.' },
    ],
    mythFact: {
      myth: 'Small habits like skipping plastic straws are the best way to cut your footprint.',
      fact: 'Big-ticket choices — flights, car use, diet and home energy — matter far more.',
    },
    takeaway: 'Measure, then target the biggest sources first.',
  },
  {
    topicId: 'p-renewables',
    title: 'Renewable Energy Systems',
    intro: 'Renewable sources are naturally replenished. Solar and wind are now among the cheapest sources of new electricity in much of the world.',
    sections: [
      {
        heading: 'The main sources',
        body: 'Solar photovoltaics turn light into electricity; wind turbines convert moving air; hydropower uses flowing water; geothermal taps heat from inside the Earth.',
      },
      {
        heading: 'Variability and storage',
        body: 'Sun and wind vary by hour and season. Batteries, pumped hydro, wider grids and flexible demand help match supply with demand.',
        bullets: [
          'The “duck curve”: net demand dips at midday as solar floods the grid, then ramps steeply at sunset.',
          'Combining sources that peak at different times smooths output.',
        ],
      },
      {
        heading: 'Capacity factor',
        body: 'A capacity factor compares actual yearly output with the maximum possible. Solar is around 15–25%, onshore wind 25–45%, while nuclear runs near 90%.',
      },
      {
        heading: 'New frontiers',
        body: 'Green hydrogen — made by splitting water with renewable electricity — could decarbonise steel, fertiliser and shipping.',
      },
    ],
    keyStats: [
      { value: '~90%', label: 'fall in solar module prices during the 2010s' },
      { value: '15–25%', label: 'typical solar capacity factor' },
      { value: '0.3–0.5%', label: 'PV efficiency lost per °C above 25 °C' },
    ],
    keyTerms: [
      { term: 'Photovoltaic', definition: 'Converting light directly into electricity using semiconductors.' },
      { term: 'Grid integration', definition: 'Managing variable power so supply and demand stay balanced.' },
      { term: 'Electrolysis', definition: 'Splitting water into hydrogen and oxygen using electricity.' },
    ],
    mythFact: {
      myth: 'Renewables can’t provide reliable power.',
      fact: 'Diverse renewables plus storage, interconnection and demand flexibility can deliver reliable supply.',
    },
    takeaway: 'The challenge has shifted from cost to integration: storage, grids and smart demand.',
  },
  {
    topicId: 'p-waste',
    title: 'Managing Waste Responsibly',
    intro: 'Waste management is about more than disposal. The aim is to prevent waste and recover value from what remains.',
    sections: [
      {
        heading: 'The waste hierarchy',
        body: 'Reduce → Reuse → Recycle → Recover → Dispose. Prevention sits at the top; landfill is the last resort.',
      },
      {
        heading: 'Segregation at source',
        body: 'Separating wet (organic) and dry waste keeps recyclables clean and lets organics be composted or turned into biogas.',
        bullets: ['Organic waste in landfills decomposes without oxygen, producing methane.', 'Open burning releases dioxins and fine particles.'],
      },
      {
        heading: 'Landfills and leachate',
        body: 'Rain percolating through waste forms leachate that can pollute groundwater. Engineered landfills use liners, leachate treatment and gas capture.',
      },
      {
        heading: 'E-waste and EPR',
        body: 'Electronics contain valuable metals and toxic substances. Extended Producer Responsibility makes manufacturers responsible for collecting and recycling their products.',
      },
    ],
    keyStats: [
      { value: '~95%', label: 'energy saved by recycling aluminium vs new production' },
      { value: '5–7×', label: 'times paper fibres can typically be recycled' },
      { value: '~50%', label: 'of municipal waste is often organic in Indian cities' },
    ],
    keyTerms: [
      { term: 'Leachate', definition: 'Contaminated liquid that drains through landfill waste.' },
      { term: 'Anaerobic digestion', definition: 'Breakdown of organic matter without oxygen, producing biogas.' },
      { term: 'EPR', definition: 'Extended Producer Responsibility for a product’s end of life.' },
    ],
    mythFact: {
      myth: 'If it has a recycling symbol, it will be recycled.',
      fact: 'Contamination and lack of facilities mean many items are not recycled. “Wish-cycling” can spoil whole loads.',
    },
    takeaway: 'Good waste systems start in the home — segregate, compost and buy less.',
  },
  {
    topicId: 'p-water',
    title: 'Water Security',
    intro: 'Water security means reliable access to enough safe water for people, food, energy and ecosystems.',
    sections: [
      {
        heading: 'A scarce resource',
        body: 'About 97% of Earth’s water is salty. Most fresh water is locked in ice or deep underground, leaving a small share easily accessible.',
      },
      {
        heading: 'Who uses it?',
        body: 'Agriculture uses about 70% of global freshwater withdrawals. India is the world’s largest user of groundwater, mostly for irrigation.',
        bullets: ['Drip irrigation delivers water to roots and can save a large share of water compared with flooding fields.'],
      },
      {
        heading: 'Hidden water',
        body: 'Water footprints include “virtual water” used to make products — around 15,000 litres per kg of beef and about 2,700 litres for one cotton T-shirt.',
      },
      {
        heading: 'Solutions',
        body: 'Rainwater harvesting, aquifer recharge, fixing leaks, treating and reusing wastewater, and cooperation over shared rivers all strengthen water security.',
      },
    ],
    keyStats: [
      { value: '~70%', label: 'of freshwater withdrawals go to agriculture' },
      { value: '~2.5%', label: 'of Earth’s water is fresh' },
      { value: 'SDG 6', label: 'clean water and sanitation for all' },
    ],
    keyTerms: [
      { term: 'Aquifer', definition: 'Underground rock or sediment that stores groundwater.' },
      { term: 'Water stress', definition: 'When demand approaches or exceeds available supply.' },
      { term: 'Virtual water', definition: 'Water embedded in the production of traded goods.' },
    ],
    mythFact: {
      myth: 'Water is renewable, so we can’t really run out.',
      fact: 'Aquifers can take decades to recharge; over-pumping can deplete them or let seawater intrude.',
    },
    takeaway: 'Saving water in farming and cities, and recharging aquifers, secures water for the future.',
  },
  {
    topicId: 'p-biodiversity',
    title: 'Biodiversity: The Web of Life',
    intro: 'Biodiversity is the variety of life at every level — genes, species and ecosystems — and it underpins food, water, medicine and climate stability.',
    sections: [
      {
        heading: 'Why it matters',
        body: 'Ecosystems provide services such as pollination, clean water, fertile soil and climate regulation. Genetic diversity helps species adapt to disease and change.',
      },
      {
        heading: 'Drivers of loss',
        body: 'The biggest driver is land- and sea-use change, followed by direct exploitation, climate change, pollution and invasive species.',
        bullets: ['WWF’s Living Planet Report 2024 found an average 73% decline in monitored wildlife populations since 1970.'],
      },
      {
        heading: 'Keystones and cascades',
        body: 'Keystone species have outsized effects. When wolves returned to Yellowstone, changes rippled through the food web — a trophic cascade.',
      },
      {
        heading: 'Conservation',
        body: 'Protected areas, wildlife corridors, restoration and sustainable use all help. The Kunming-Montreal framework aims to conserve 30% of land and oceans by 2030.',
      },
    ],
    keyStats: [
      { value: '73%', label: 'average decline in monitored wildlife populations since 1970' },
      { value: '4 of 36', label: 'global biodiversity hotspots are in India' },
      { value: '30×30', label: 'protect 30% of land and sea by 2030' },
    ],
    keyTerms: [
      { term: 'Endemic', definition: 'Found naturally in only one place.' },
      { term: 'Trophic cascade', definition: 'Ripple effects through a food web after a change at one level.' },
      { term: 'Invasive species', definition: 'A non-native species that spreads and causes harm.' },
    ],
    mythFact: {
      myth: 'Losing one species doesn’t really matter.',
      fact: 'Species are interconnected; losing pollinators or predators can destabilise whole ecosystems.',
    },
    takeaway: 'Protecting habitats is the single most powerful way to protect species.',
  },
  {
    topicId: 'p-sdg',
    title: 'Sustainable Development',
    intro: 'Sustainable development meets the needs of the present without compromising the ability of future generations to meet their own (Brundtland Report, 1987).',
    sections: [
      {
        heading: 'The 17 SDGs',
        body: 'Adopted by all UN member states in 2015, the Sustainable Development Goals cover poverty, health, education, equality, water, energy, cities, climate, oceans and land — targeting 2030.',
      },
      {
        heading: 'Three pillars',
        body: 'Sustainability balances environmental protection, social equity and economic viability. Good projects create benefits across all three.',
      },
      {
        heading: 'Trade-offs and synergies',
        body: 'Goals interact. Solar irrigation pumps can advance energy access, climate action and farmer incomes together; a large dam may bring power but displace communities.',
      },
      {
        heading: 'Staying honest',
        body: 'Greenwashing exaggerates environmental claims. Decoupling — growing the economy while cutting emissions — and a just transition for workers are signs of real progress.',
      },
    ],
    keyStats: [
      { value: '17', label: 'Sustainable Development Goals' },
      { value: '169', label: 'targets beneath the goals' },
      { value: '2030', label: 'target year for the 2030 Agenda' },
    ],
    keyTerms: [
      { term: 'Greenwashing', definition: 'Misleading claims about environmental benefits.' },
      { term: 'Decoupling', definition: 'Economic growth without rising resource use or emissions.' },
      { term: 'Just transition', definition: 'Moving to a green economy fairly for affected workers and communities.' },
    ],
    mythFact: {
      myth: 'The SDGs are only for developing countries.',
      fact: 'The SDGs are universal: every country has commitments.',
    },
    takeaway: 'Sustainable development is about balance — and leaving no one behind.',
  },
  {
    topicId: 'p-circular',
    title: 'The Circular Economy',
    intro: 'A circular economy replaces “take–make–waste” with systems that keep products and materials in use at their highest value.',
    sections: [
      {
        heading: 'Three principles',
        body: 'Eliminate waste and pollution, circulate products and materials, and regenerate nature (Ellen MacArthur Foundation).',
      },
      {
        heading: 'Design is decisive',
        body: 'Most of a product’s environmental impact is locked in at the design stage — materials, durability, repairability and recyclability.',
        bullets: ['Modular phones with replaceable batteries extend product life.', 'Planned obsolescence does the opposite.'],
      },
      {
        heading: 'New business models',
        body: 'Product-as-a-service (leasing instead of selling), refurbishment, sharing platforms and take-back schemes keep materials in circulation.',
      },
      {
        heading: 'Closing loops',
        body: 'Upcycling adds value, while downcycling reduces quality. Industrial symbiosis turns one firm’s by-products into another’s inputs.',
      },
    ],
    keyStats: [
      { value: '~7%', label: 'of materials used globally come from secondary sources' },
      { value: '~100 Gt', label: 'materials consumed by the world economy each year' },
      { value: '3', label: 'core circular principles' },
    ],
    keyTerms: [
      { term: 'Upcycling', definition: 'Turning waste into products of higher value.' },
      { term: 'Industrial symbiosis', definition: 'One industry’s waste becomes another’s raw material.' },
      { term: 'Material passport', definition: 'A record of materials in a product to enable reuse.' },
    ],
    mythFact: {
      myth: 'A circular economy is just recycling.',
      fact: 'Recycling is the outer loop; reuse, repair, sharing and redesign keep more value.',
    },
    takeaway: 'The best waste is designed out before a product is ever made.',
  },
  {
    topicId: 'p-living',
    title: 'Sustainable Living',
    intro: 'Individual choices add up — especially high-impact ones around food, travel, home energy and consumption.',
    sections: [
      {
        heading: 'Food',
        body: 'Shifting to plant-rich diets and cutting food waste are among the most effective personal actions.',
        bullets: ['Per 100 g of protein, beef can emit around 25× more than tofu.', 'Roughly a third of food produced is lost or wasted.'],
      },
      {
        heading: 'Travel',
        body: 'Walking, cycling and public transport beat solo car trips; trains beat short flights by a wide margin.',
      },
      {
        heading: 'Home energy',
        body: 'Efficient appliances, LED lighting and sensible cooling — such as setting ACs at 24 °C — cut bills and emissions.',
        bullets: ['Each 1 °C higher AC setting can save about 6% of its electricity.'],
      },
      {
        heading: 'Think in life cycles',
        body: 'Consider a product’s full impact from materials to disposal. Keep things longer, buy second-hand, and watch out for the rebound effect.',
      },
    ],
    keyStats: [
      { value: '~1/3', label: 'of food produced is lost or wasted' },
      { value: '24 °C', label: 'recommended default AC setting in India' },
      { value: '~6%', label: 'AC energy saved per degree higher' },
    ],
    keyTerms: [
      { term: 'Rebound effect', definition: 'When efficiency savings lead to more consumption.' },
      { term: 'Life-cycle assessment', definition: 'Measuring impacts from raw materials to disposal.' },
      { term: 'Phantom load', definition: 'Electricity used by devices on standby.' },
    ],
    mythFact: {
      myth: 'Buying a new “eco” product is always greener.',
      fact: 'Making new products has a footprint; using what you have for longer is often better.',
    },
    takeaway: 'Focus on the few choices with the biggest impact — then make them habits.',
  },
];
