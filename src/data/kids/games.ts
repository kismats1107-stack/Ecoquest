/** Content for the Kids 10-second challenges. */

export type BinId = 'recyclable' | 'organic' | 'ewaste';

export interface SortItem {
  id: string;
  emoji: string;
  label: string;
  bin: BinId;
  tip: string;
  plural?: boolean;
}

export const bins: { id: BinId; label: string; emoji: string; color: string; hint: string }[] = [
  { id: 'recyclable', label: 'Recyclable', emoji: '♻️', color: 'sky', hint: 'Paper, cans, glass, bottles' },
  { id: 'organic', label: 'Organic', emoji: '🍂', color: 'lime', hint: 'Food & garden scraps' },
  { id: 'ewaste', label: 'E-Waste', emoji: '🔋', color: 'orange', hint: 'Batteries & gadgets' },
];

export const sortItems: SortItem[] = [
  { id: 'can', emoji: '🥫', label: 'Tin can', bin: 'recyclable', tip: 'Metal cans can be melted and made into new cans.' },
  { id: 'newspaper', emoji: '📰', label: 'Newspaper', bin: 'recyclable', tip: 'Old newspapers become new paper.' },
  { id: 'glass', emoji: '🍾', label: 'Glass bottle', bin: 'recyclable', tip: 'Glass can be recycled again and again.' },
  { id: 'box', emoji: '📦', label: 'Cardboard box', bin: 'recyclable', tip: 'Flatten boxes so they fit in the recycling bin.' },
  { id: 'bottle', emoji: '🧴', label: 'Plastic bottle', bin: 'recyclable', tip: 'Rinse bottles before recycling them.' },
  { id: 'notebook', emoji: '📓', label: 'Old notebook', bin: 'recyclable', tip: 'Paper from notebooks can be recycled.' },
  { id: 'jar', emoji: '🫙', label: 'Glass jar', bin: 'recyclable', tip: 'Jars can be reused first, then recycled.' },
  { id: 'banana', emoji: '🍌', label: 'Banana peel', bin: 'organic', tip: 'Peels turn into compost for plants.' },
  { id: 'apple', emoji: '🍎', label: 'Apple core', bin: 'organic', tip: 'Fruit scraps make great compost.' },
  { id: 'eggshell', emoji: '🥚', label: 'Eggshells', bin: 'organic', plural: true, tip: 'Eggshells add goodness to compost.' },
  { id: 'leaves', emoji: '🍂', label: 'Dry leaves', bin: 'organic', plural: true, tip: 'Leaves become rich soil — never burn them!' },
  { id: 'carrot', emoji: '🥕', label: 'Carrot tops', bin: 'organic', plural: true, tip: 'Vegetable scraps belong in the compost.' },
  { id: 'watermelon', emoji: '🍉', label: 'Melon rind', bin: 'organic', tip: 'Fruit rinds rot down into compost.' },
  { id: 'bread', emoji: '🍞', label: 'Stale bread', bin: 'organic', tip: 'Food leftovers are organic waste.' },
  { id: 'corn', emoji: '🌽', label: 'Corn cob', bin: 'organic', tip: 'Corn cobs break down in compost.' },
  { id: 'battery', emoji: '🔋', label: 'Battery', bin: 'ewaste', tip: 'Batteries have chemicals — they need special collection.' },
  { id: 'phone', emoji: '📱', label: 'Old phone', bin: 'ewaste', tip: 'Phones contain precious metals that can be recovered.' },
  { id: 'laptop', emoji: '💻', label: 'Broken laptop', bin: 'ewaste', tip: 'Computers must go to e-waste recyclers.' },
  { id: 'charger', emoji: '🔌', label: 'Charger cable', bin: 'ewaste', tip: 'Old cables and chargers are e-waste.' },
  { id: 'headphones', emoji: '🎧', label: 'Headphones', bin: 'ewaste', plural: true, tip: 'Gadgets with wires are e-waste.' },
  { id: 'mouse', emoji: '🖱️', label: 'Computer mouse', bin: 'ewaste', tip: 'Electronic gadgets go in the e-waste box.' },
  { id: 'controller', emoji: '🎮', label: 'Game controller', bin: 'ewaste', tip: 'Broken electronics are e-waste.' },
];

export interface MemoryCard {
  emoji: string;
  label: string;
  fact: string;
}

/** Topic-themed decks so Memory Match reinforces what the child just learned. */
export const memoryDecks: Record<string, MemoryCard[]> = {
  'k-planet': [
    { emoji: '🌍', label: 'Earth', fact: 'Earth is the only planet known to have life.' },
    { emoji: '☀️', label: 'Sun', fact: 'The Sun is a star that gives us light and heat.' },
    { emoji: '🌊', label: 'Ocean', fact: 'Oceans cover most of our planet.' },
    { emoji: '⛰️', label: 'Mountain', fact: 'Mountains are home to glaciers that feed rivers.' },
    { emoji: '🌙', label: 'Moon', fact: 'The Moon pulls on the oceans to make tides.' },
    { emoji: '🌋', label: 'Volcano', fact: 'Volcanoes show Earth is hot inside.' },
  ],
  'k-water': [
    { emoji: '💧', label: 'Water drop', fact: 'Every drop of fresh water is precious.' },
    { emoji: '🚰', label: 'Tap', fact: 'Turn off the tap while brushing!' },
    { emoji: '🌧️', label: 'Rain', fact: 'Rain can be collected and stored.' },
    { emoji: '🐟', label: 'Fish', fact: 'Fish need clean rivers to live.' },
    { emoji: '☁️', label: 'Cloud', fact: 'Clouds are made of tiny water droplets.' },
    { emoji: '🪣', label: 'Bucket', fact: 'A bucket bath uses less water than a long shower.' },
  ],
  'k-recycling': [
    { emoji: '♻️', label: 'Recycle', fact: 'Recycling turns old things into new things.' },
    { emoji: '📦', label: 'Box', fact: 'Cardboard is easy to recycle.' },
    { emoji: '🍾', label: 'Bottle', fact: 'Glass can be recycled again and again.' },
    { emoji: '🥫', label: 'Can', fact: 'Metal cans are recycled into new cans.' },
    { emoji: '📰', label: 'Paper', fact: 'Recycling paper helps save trees.' },
    { emoji: '🍂', label: 'Compost', fact: 'Leaves and food scraps become compost.' },
  ],
  'k-energy': [
    { emoji: '☀️', label: 'Solar', fact: 'Solar panels turn sunlight into electricity.' },
    { emoji: '💡', label: 'LED bulb', fact: 'LED bulbs use much less electricity.' },
    { emoji: '🌬️', label: 'Wind', fact: 'Wind turbines make clean electricity.' },
    { emoji: '🔌', label: 'Plug', fact: 'Unplug chargers when you’re done.' },
    { emoji: '🔋', label: 'Battery', fact: 'Batteries store energy for later.' },
    { emoji: '🚲', label: 'Bicycle', fact: 'Cycling runs on people power!' },
  ],
  'k-forests': [
    { emoji: '🌳', label: 'Tree', fact: 'Trees give us oxygen and shade.' },
    { emoji: '🌱', label: 'Sprout', fact: 'Every big tree starts as a tiny seed.' },
    { emoji: '🍃', label: 'Leaf', fact: 'Leaves make food from sunlight.' },
    { emoji: '🍄', label: 'Mushroom', fact: 'Mushrooms help recycle dead leaves into soil.' },
    { emoji: '🐝', label: 'Bee', fact: 'Bees pollinate flowers.' },
    { emoji: '🌸', label: 'Flower', fact: 'Flowers turn into fruits and seeds.' },
  ],
  'k-animals': [
    { emoji: '🐯', label: 'Tiger', fact: 'The tiger is India’s national animal.' },
    { emoji: '🐘', label: 'Elephant', fact: 'Elephants spread seeds as they roam.' },
    { emoji: '🐢', label: 'Turtle', fact: 'Sea turtles are harmed by plastic.' },
    { emoji: '🦋', label: 'Butterfly', fact: 'Butterflies are pollinators too.' },
    { emoji: '🐬', label: 'Dolphin', fact: 'Dolphins need clean, healthy oceans.' },
    { emoji: '🦉', label: 'Owl', fact: 'Owls keep mouse numbers in balance.' },
  ],
  'k-air': [
    { emoji: '🌳', label: 'Tree', fact: 'Trees trap dust and clean the air.' },
    { emoji: '🚲', label: 'Bicycle', fact: 'Bikes make zero smoke.' },
    { emoji: '🚌', label: 'Bus', fact: 'One bus can replace many cars.' },
    { emoji: '😷', label: 'Mask', fact: 'Masks help on very polluted days.' },
    { emoji: '🌬️', label: 'Fresh air', fact: 'Clean air keeps lungs healthy.' },
    { emoji: '🚶', label: 'Walk', fact: 'Walking short trips keeps the air clean.' },
  ],
  'k-living': [
    { emoji: '🍱', label: 'Lunch box', fact: 'Reusable lunch boxes make no waste.' },
    { emoji: '👜', label: 'Cloth bag', fact: 'A cloth bag replaces many plastic bags.' },
    { emoji: '🫙', label: 'Jar', fact: 'Jars can be reused for storage.' },
    { emoji: '🧺', label: 'Basket', fact: 'Baskets are great for shopping.' },
    { emoji: '🌻', label: 'Garden', fact: 'Grow your own herbs and veggies!' },
    { emoji: '🔧', label: 'Repair', fact: 'Fixing things makes them last longer.' },
  ],
};

export interface OceanThing {
  emoji: string;
  label: string;
}

export const oceanLitter: OceanThing[] = [
  { emoji: '🥤', label: 'Plastic cup' },
  { emoji: '🛍️', label: 'Plastic bag' },
  { emoji: '🧴', label: 'Bottle' },
  { emoji: '🥫', label: 'Can' },
  { emoji: '🎈', label: 'Balloon' },
  { emoji: '🧃', label: 'Juice box' },
  { emoji: '👟', label: 'Old shoe' },
];

export const oceanFriends: OceanThing[] = [
  { emoji: '🐢', label: 'Turtle' },
  { emoji: '🐟', label: 'Fish' },
  { emoji: '🐠', label: 'Tropical fish' },
  { emoji: '🐙', label: 'Octopus' },
  { emoji: '🦀', label: 'Crab' },
];

/** Animals and clearly distinct habitats used to generate fresh Kids questions. */
export const habitatNames = ['Desert', 'Ocean', 'Icy Arctic', 'Snowy mountains', 'Rainforest', 'Grassland'];

export const habitats: { animal: string; emoji: string; habitat: string; fact: string }[] = [
  { animal: 'polar bear', emoji: '🐻‍❄️', habitat: 'Icy Arctic', fact: 'Polar bears hunt seals from sea ice in the cold Arctic.' },
  { animal: 'camel', emoji: '🐪', habitat: 'Desert', fact: 'Camels can go days without water in the hot desert.' },
  { animal: 'dolphin', emoji: '🐬', habitat: 'Ocean', fact: 'Dolphins live in the ocean and swim up to the surface to breathe air.' },
  { animal: 'snow leopard', emoji: '🐆', habitat: 'Snowy mountains', fact: 'Snow leopards live high in snowy mountains like the Himalayas. Their thick tails keep them warm.' },
  { animal: 'orangutan', emoji: '🦧', habitat: 'Rainforest', fact: 'Orangutans live high in rainforest trees and eat lots of fruit.' },
  { animal: 'zebra', emoji: '🦓', habitat: 'Grassland', fact: 'Zebras graze on the wide grasslands of Africa.' },
];
