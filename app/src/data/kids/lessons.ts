import type { Lesson } from '@/types';

/** Kids lessons are short picture cards: one idea per card, short sentences, one "Did you know?" each. */
export const kidsLessons: Lesson[] = [
  {
    topicId: 'k-planet',
    title: 'Our Amazing Planet',
    intro: 'Earth is our home in space. Let’s explore what makes it so special!',
    sections: [
      {
        emoji: '🌍',
        heading: 'The blue planet',
        body: 'Earth is the third planet from the Sun. Most of it is covered in water, so it looks blue from space.',
        fact: 'About 71 out of every 100 parts of Earth’s surface are water!',
      },
      {
        emoji: '☀️',
        heading: 'Day and night',
        body: 'Earth spins like a top. The side facing the Sun has day. The side facing away has night.',
        fact: 'One full spin takes about 24 hours — that’s one whole day.',
      },
      {
        emoji: '🛡️',
        heading: 'Earth’s air blanket',
        body: 'A layer of air called the atmosphere wraps around Earth. It gives us air to breathe and keeps us warm.',
        fact: 'The ozone layer, high in the sky, works like sunscreen for the whole planet!',
      },
      {
        emoji: '🗺️',
        heading: 'Land and oceans',
        body: 'Earth has 7 continents and 5 big oceans. The Pacific Ocean is the biggest of all.',
        fact: 'Asia is the biggest continent, and India is part of it.',
      },
    ],
    takeaway: 'Earth is the only planet we know with life. Let’s take good care of it!',
  },
  {
    topicId: 'k-water',
    title: 'Every Drop Counts',
    intro: 'All living things need water. But only a tiny bit of Earth’s water is fresh water we can drink.',
    sections: [
      {
        emoji: '🌊',
        heading: 'Salty and fresh',
        body: 'Almost all of Earth’s water is salty sea water. Fresh water comes from rivers, lakes, rain and under the ground.',
        fact: 'Less than 1% of Earth’s water is fresh water we can easily use.',
      },
      {
        emoji: '🌧️',
        heading: 'The water cycle',
        body: 'The Sun warms water so it rises up as vapour. It makes clouds, falls as rain, and flows back to the sea.',
        fact: 'The water you drink today may once have been drunk by a dinosaur!',
      },
      {
        emoji: '🚰',
        heading: 'Save water at home',
        body: 'Turn off the tap while brushing. Take short showers. Tell a grown-up about leaky taps.',
        fact: 'A dripping tap can waste buckets of water every single day.',
      },
      {
        emoji: '🪣',
        heading: 'Catch the rain',
        body: 'We can collect rainwater from roofs and store it. This is called rainwater harvesting.',
        fact: 'Water used to wash vegetables can be reused to water plants!',
      },
    ],
    takeaway: 'Use water wisely — every drop you save helps people, plants and animals.',
  },
  {
    topicId: 'k-recycling',
    title: 'Reduce, Reuse, Recycle',
    intro: 'Waste is anything we throw away. The 3 Rs help us make less of it!',
    sections: [
      {
        emoji: '✋',
        heading: 'Reduce',
        body: 'Use less. Carry a cloth bag and a water bottle so you don’t need new plastic ones.',
        fact: 'Reduce is the best R — no waste is made at all!',
      },
      {
        emoji: '🔁',
        heading: 'Reuse',
        body: 'Use things again. A glass jar can become a pencil holder. Old clothes can be given to others.',
        fact: 'One cloth bag can replace hundreds of plastic bags.',
      },
      {
        emoji: '♻️',
        heading: 'Recycle',
        body: 'Paper, cans, glass and some plastics can be made into new things. Put them in the recycling bin.',
        fact: 'Glass can be recycled again and again without getting worse.',
      },
      {
        emoji: '🗑️',
        heading: 'Sort your waste',
        body: 'Food scraps go in the organic bin to become compost. Old batteries and phones are e-waste and need special collection.',
        fact: 'A plastic bottle can last hundreds of years in nature.',
      },
    ],
    takeaway: 'Sorting waste into the right bin turns trash into treasure!',
  },
  {
    topicId: 'k-energy',
    title: 'Power Up the Planet',
    intro: 'Energy makes lights shine and fans spin. Saving it keeps our air and planet healthy.',
    sections: [
      {
        emoji: '🏭',
        heading: 'Where electricity comes from',
        body: 'Many power stations burn coal or gas to make electricity. This makes smoke and warms the planet.',
        fact: 'Coal, oil and gas are called fossil fuels. They will run out one day.',
      },
      {
        emoji: '☀️',
        heading: 'Clean energy',
        body: 'Solar panels use sunlight. Wind turbines use wind. Dams use flowing water. These never run out!',
        fact: 'Energy that never runs out is called renewable energy.',
      },
      {
        emoji: '💡',
        heading: 'Switch off!',
        body: 'Turn off lights and fans when you leave a room. Unplug chargers when you’re done.',
        fact: 'LED bulbs use much less electricity than old bulbs.',
      },
      {
        emoji: '🚲',
        heading: 'Use your own power',
        body: 'Walking and cycling use your body’s energy — no fuel and no smoke.',
        fact: 'Opening the curtains on a sunny day gives you free light!',
      },
    ],
    takeaway: 'Every switch you turn off helps keep the Earth cool and clean.',
  },
  {
    topicId: 'k-forests',
    title: 'Trees Are Superheroes',
    intro: 'Plants give us food, oxygen and shade. Forests are home to amazing animals.',
    sections: [
      {
        emoji: '🌱',
        heading: 'How plants grow',
        body: 'Plants need sunlight, water, air and good soil. Roots drink water from the ground.',
        fact: 'Plants make their own food from sunlight. This is called photosynthesis.',
      },
      {
        emoji: '🍃',
        heading: 'Green leaves',
        body: 'Leaves are green because of chlorophyll. It catches sunlight to help the plant make food.',
        fact: 'Trees breathe in carbon dioxide and breathe out the oxygen we need.',
      },
      {
        emoji: '🐝',
        heading: 'Busy pollinators',
        body: 'Bees and butterflies carry pollen from flower to flower. This helps plants make fruits and seeds.',
        fact: 'Many fruits like mangoes and apples need pollinators to grow.',
      },
      {
        emoji: '🌳',
        heading: 'Forests need us',
        body: 'When forests are cut down, animals lose their homes and soil washes away. We can plant native trees and protect forests.',
        fact: 'World Environment Day is celebrated on 5 June every year.',
      },
    ],
    takeaway: 'Plant a tree, care for it, and it will care for the planet for many years.',
  },
  {
    topicId: 'k-animals',
    title: 'Wonderful Wildlife',
    intro: 'From tiny bees to giant elephants, every animal has a special place in nature.',
    sections: [
      {
        emoji: '🏠',
        heading: 'Habitats',
        body: 'A habitat is an animal’s natural home. Polar bears live on Arctic ice. Camels live in deserts.',
        fact: 'Each habitat gives animals food, water and shelter.',
      },
      {
        emoji: '🔗',
        heading: 'Food chains',
        body: 'Food chains show who eats whom. Grass is eaten by deer, and deer are eaten by tigers.',
        fact: 'Every food chain starts with a plant that uses sunlight.',
      },
      {
        emoji: '⚠️',
        heading: 'Animals in danger',
        body: 'Endangered animals have very few left. Extinct animals, like the dodo, are gone forever.',
        fact: 'The tiger is India’s national animal, protected by Project Tiger.',
      },
      {
        emoji: '🐢',
        heading: 'How we can help',
        body: 'Keep plastic out of nature, protect forests and support wildlife parks.',
        fact: 'Sea turtles can mistake floating plastic bags for jellyfish.',
      },
    ],
    takeaway: 'Biodiversity means all living things together. Protecting one helps protect them all.',
  },
  {
    topicId: 'k-air',
    title: 'Fresh Air for Everyone',
    intro: 'We breathe air all day long. Clean air keeps our lungs healthy and happy.',
    sections: [
      {
        emoji: '🚗',
        heading: 'What makes air dirty?',
        body: 'Smoke from cars, factories and burning trash makes the air dirty.',
        fact: 'When smoke and fog mix, they make smog.',
      },
      {
        emoji: '📊',
        heading: 'Air Quality Index',
        body: 'AQI is a number that tells us how clean the air is. Low is good. High means the air is unhealthy.',
        fact: 'On high-AQI days, it’s safer to play indoors.',
      },
      {
        emoji: '🌳',
        heading: 'Nature’s air cleaners',
        body: 'Trees take in harmful gases and trap dust on their leaves.',
        fact: 'A street lined with trees is often cooler and cleaner.',
      },
      {
        emoji: '🚲',
        heading: 'Be an air hero',
        body: 'Walk, cycle or take the bus. Never burn leaves or trash — compost leaves instead!',
        fact: 'The ozone layer is healing because the world stopped using harmful CFC chemicals.',
      },
    ],
    takeaway: 'Less smoke means cleaner air for every living thing.',
  },
  {
    topicId: 'k-living',
    title: 'Little Habits, Big Difference',
    intro: 'Living sustainably means taking care of the planet in our everyday life.',
    sections: [
      {
        emoji: '🍱',
        heading: 'Pack it smart',
        body: 'Use a reusable lunch box and water bottle. They make no waste!',
        fact: 'A refillable bottle can save hundreds of plastic bottles.',
      },
      {
        emoji: '🍽️',
        heading: 'Love your food',
        body: 'Take only what you can eat. Save leftovers for later.',
        fact: 'Seasonal fruits, like mangoes in summer, don’t need to travel far.',
      },
      {
        emoji: '🔧',
        heading: 'Fix, swap and share',
        body: 'Fix broken toys, swap books and give away clothes you’ve outgrown.',
        fact: 'Things that are shared and reused don’t become waste.',
      },
      {
        emoji: '🌻',
        heading: 'Grow your own',
        body: 'Grow herbs or tomatoes in pots. It’s fun and fresh!',
        fact: 'Food from your garden needs no packaging or trucks.',
      },
    ],
    takeaway: 'You don’t need to be big to make a big difference!',
  },
];
