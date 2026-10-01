import type { TopicGroup } from '@/types';

/** Content for the 15+ 10-second challenges. Emission values are rounded estimates for learning. */

export interface CarbonOption {
  label: string;
  emoji: string;
  kg: number;
}

export interface CarbonDecision {
  id: string;
  prompt: string;
  low: CarbonOption;
  high: CarbonOption;
}

export const carbonDecisions: CarbonDecision[] = [
  { id: 'commute', prompt: '10 km commute to college', low: { label: 'Metro', emoji: '🚇', kg: 0.4 }, high: { label: 'Drive alone', emoji: '🚗', kg: 1.7 } },
  { id: 'lunch', prompt: 'Lunch today', low: { label: 'Dal, rice & veg', emoji: '🍛', kg: 0.6 }, high: { label: 'Beef burger', emoji: '🍔', kg: 5 } },
  { id: 'laundry', prompt: 'Dry a load of laundry', low: { label: 'Line dry', emoji: '🧺', kg: 0 }, high: { label: 'Tumble dryer', emoji: '🌀', kg: 1.8 } },
  { id: 'trip', prompt: 'Delhi → Mumbai (~1,150 km)', low: { label: 'Train', emoji: '🚆', kg: 40 }, high: { label: 'Flight', emoji: '✈️', kg: 280 } },
  { id: 'cooling', prompt: 'Cool your room for 8 hours', low: { label: 'Ceiling fan', emoji: '🌬️', kg: 0.4 }, high: { label: 'AC at 18 °C', emoji: '❄️', kg: 7.5 } },
  { id: 'lighting', prompt: 'Light a room for 5 hours', low: { label: 'LED bulb', emoji: '💡', kg: 0.03 }, high: { label: 'Incandescent', emoji: '🔆', kg: 0.2 } },
  { id: 'jeans', prompt: 'You need new jeans', low: { label: 'Buy second-hand', emoji: '♻️', kg: 1 }, high: { label: 'Buy brand new', emoji: '🛍️', kg: 25 } },
  { id: 'phone', prompt: 'Your phone battery is weak', low: { label: 'Replace battery', emoji: '🔧', kg: 5 }, high: { label: 'Buy a new phone', emoji: '📱', kg: 70 } },
  { id: 'shop', prompt: 'Quick trip to a shop 3 km away', low: { label: 'Cycle', emoji: '🚲', kg: 0 }, high: { label: 'Drive', emoji: '🚙', kg: 1 } },
  { id: 'scraps', prompt: '1 kg of food scraps', low: { label: 'Compost it', emoji: '🌱', kg: 0.1 }, high: { label: 'Landfill', emoji: '🗑️', kg: 0.6 } },
  { id: 'shower', prompt: 'Hot shower with an electric geyser', low: { label: '5 minutes', emoji: '🚿', kg: 0.8 }, high: { label: '15 minutes', emoji: '♨️', kg: 2.4 } },
  { id: 'weekend', prompt: '200 km weekend trip, 4 friends', low: { label: 'Share one car', emoji: '🚘', kg: 8.5 }, high: { label: 'Each drives alone', emoji: '🚗', kg: 34 } },
  { id: 'water-heat', prompt: 'Heat water for the family', low: { label: 'Solar heater', emoji: '☀️', kg: 0.1 }, high: { label: 'Electric geyser', emoji: '🔌', kg: 1.4 } },
  { id: 'bottle', prompt: 'Drinking water for the day', low: { label: 'Refill a bottle', emoji: '🫙', kg: 0.01 }, high: { label: '2 plastic bottles', emoji: '🧴', kg: 0.3 } },
];

export interface FoodChain {
  id: string;
  ecosystem: string;
  emoji: string;
  /** Producer → primary → secondary → tertiary consumer. */
  organisms: { name: string; emoji: string }[];
}

export const trophicLevels = ['Producer', 'Primary consumer', 'Secondary consumer', 'Tertiary consumer'];

export const foodChains: FoodChain[] = [
  { id: 'grassland', ecosystem: 'Grassland', emoji: '🌾', organisms: [{ name: 'Grass', emoji: '🌾' }, { name: 'Grasshopper', emoji: '🦗' }, { name: 'Frog', emoji: '🐸' }, { name: 'Snake', emoji: '🐍' }] },
  { id: 'ocean', ecosystem: 'Ocean', emoji: '🌊', organisms: [{ name: 'Phytoplankton', emoji: '🦠' }, { name: 'Zooplankton', emoji: '🦐' }, { name: 'Small fish', emoji: '🐟' }, { name: 'Shark', emoji: '🦈' }] },
  { id: 'forest', ecosystem: 'Forest', emoji: '🌲', organisms: [{ name: 'Leaves', emoji: '🌿' }, { name: 'Caterpillar', emoji: '🐛' }, { name: 'Sparrow', emoji: '🐦' }, { name: 'Hawk', emoji: '🦅' }] },
  { id: 'farm', ecosystem: 'Rice field', emoji: '🌾', organisms: [{ name: 'Rice plant', emoji: '🌱' }, { name: 'Rat', emoji: '🐀' }, { name: 'Rat snake', emoji: '🐍' }, { name: 'Eagle', emoji: '🦅' }] },
  { id: 'arctic', ecosystem: 'Arctic sea', emoji: '🧊', organisms: [{ name: 'Phytoplankton', emoji: '🦠' }, { name: 'Krill', emoji: '🦐' }, { name: 'Arctic cod', emoji: '🐟' }, { name: 'Seal', emoji: '🦭' }] },
  { id: 'desert', ecosystem: 'Desert', emoji: '🏜️', organisms: [{ name: 'Desert shrub', emoji: '🌵' }, { name: 'Grasshopper', emoji: '🦗' }, { name: 'Lizard', emoji: '🦎' }, { name: 'Hawk', emoji: '🦅' }] },
];

export interface EcoDecision {
  id: string;
  group: 'energy' | 'waste' | 'water' | 'nature' | 'city';
  situation: string;
  good: { label: string; outcome: string };
  bad: { label: string; outcome: string };
}

export const ecoDecisions: EcoDecision[] = [
  { id: 'power', group: 'energy', situation: 'Your city needs more power.', good: { label: 'Solar park + storage', outcome: 'Clean power, cleaner air.' }, bad: { label: 'New coal plant', outcome: 'Smog and CO₂ rise for decades.' } },
  { id: 'heatwave', group: 'energy', situation: 'Heatwave: offices are overheating.', good: { label: 'Cool roofs + 24 °C rule', outcome: 'Comfort with ~25% less power.' }, bad: { label: 'All ACs to 16 °C', outcome: 'Grid overloads, blackouts follow.' } },
  { id: 'streetlights', group: 'energy', situation: 'Old streetlights need replacing.', good: { label: 'LEDs with sensors', outcome: 'Lighting energy drops sharply.' }, bad: { label: 'Keep them on all day', outcome: 'Wasted power, higher bills.' } },
  { id: 'pumps', group: 'energy', situation: 'Farmers rely on diesel pumps.', good: { label: 'Subsidise solar pumps', outcome: 'Lower costs and emissions.' }, bad: { label: 'Subsidise more diesel', outcome: 'Fuel bills and fumes rise.' } },
  { id: 'landfill', group: 'waste', situation: 'The landfill is overflowing.', good: { label: 'Segregate + compost', outcome: 'Half the waste never reaches landfill.' }, bad: { label: 'Open a new landfill', outcome: 'More methane and leachate.' } },
  { id: 'festival', group: 'waste', situation: 'A festival will create tonnes of waste.', good: { label: 'Reusable plates & cups', outcome: 'Waste falls by over 80%.' }, bad: { label: 'Single-use everything', outcome: 'Mountains of plastic left behind.' } },
  { id: 'ewaste', group: 'waste', situation: 'Old phones are piling up in homes.', good: { label: 'Certified e-waste drive', outcome: 'Metals recovered safely.' }, bad: { label: 'Toss them in trash', outcome: 'Toxins leak into soil.' } },
  { id: 'bags', group: 'waste', situation: 'Plastic bags are clogging drains.', good: { label: 'Ban + cloth bag drive', outcome: 'Drains clear, floods ease.' }, bad: { label: 'Free plastic bags', outcome: 'Monsoon flooding worsens.' } },
  { id: 'groundwater', group: 'water', situation: 'Groundwater is falling fast.', good: { label: 'Mandate rainwater harvesting', outcome: 'Aquifers start to recharge.' }, bad: { label: 'Drill deeper borewells', outcome: 'Wells run dry sooner.' } },
  { id: 'drought', group: 'water', situation: 'Crops need water in a drought.', good: { label: 'Drip irrigation', outcome: 'Same harvest, far less water.' }, bad: { label: 'Flood the fields', outcome: 'Reservoirs empty early.' } },
  { id: 'sewage', group: 'water', situation: 'Sewage is polluting the river.', good: { label: 'Build treatment plants', outcome: 'Fish return downstream.' }, bad: { label: 'Dump it further downstream', outcome: 'Villages downstream fall ill.' } },
  { id: 'leaks', group: 'water', situation: 'City pipes leak 30% of water.', good: { label: 'Fix the leaks first', outcome: 'Supply rises without new dams.' }, bad: { label: 'Pump in more water', outcome: 'Costs rise, losses continue.' } },
  { id: 'wetland', group: 'nature', situation: 'A wetland could become a mall.', good: { label: 'Protect the wetland', outcome: 'Birds stay, floods are absorbed.' }, bad: { label: 'Fill it for the mall', outcome: 'Flooding and habitat loss.' } },
  { id: 'corridor', group: 'nature', situation: 'A highway will cross a tiger corridor.', good: { label: 'Build wildlife underpasses', outcome: 'Tigers cross safely.' }, bad: { label: 'No crossings at all', outcome: 'Roadkill and isolated populations.' } },
  { id: 'pests', group: 'nature', situation: 'Crop pests are rising.', good: { label: 'Integrated pest management', outcome: 'Pollinators survive, yields hold.' }, bad: { label: 'Spray broad pesticides', outcome: 'Bees die, fruit yields fall.' } },
  { id: 'traffic', group: 'city', situation: 'Traffic jams every morning.', good: { label: 'Bus lanes & bike paths', outcome: 'Faster trips, cleaner air.' }, bad: { label: 'Widen roads for cars', outcome: 'More cars — jams return.' } },
  { id: 'heat-island', group: 'city', situation: 'The city keeps getting hotter.', good: { label: 'Plant street trees & parks', outcome: 'Streets cool by several degrees.' }, bad: { label: 'Pave over green spaces', outcome: 'Heat island intensifies.' } },
  { id: 'buildings', group: 'city', situation: 'New offices are being designed.', good: { label: 'Efficient green design', outcome: 'Energy use roughly halves.' }, bad: { label: 'Sealed glass towers', outcome: 'Huge cooling bills.' } },
];

/** Which eco-decision deck best reinforces each 15+ topic group. */
export const decisionGroupsForTopic: Record<TopicGroup, EcoDecision['group'][]> = {
  climate: ['energy', 'city'],
  energy: ['energy', 'city'],
  waste: ['waste', 'city'],
  water: ['water', 'nature'],
  biodiversity: ['nature', 'water'],
  development: ['city', 'energy', 'water'],
  living: ['city', 'energy', 'waste'],
  planet: ['nature', 'energy'],
  air: ['city', 'energy'],
  forests: ['nature'],
};
