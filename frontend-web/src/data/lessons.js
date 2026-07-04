export const lessons = [
  {
    id: 1,
    title: 'Gurmukhi Basics',
    description: 'Learn the first 15 Gurmukhi letters',
    unit: 1,
    type: 'unit',
    category: 'script',
    xpReward: 50,
    letters: [
      { id: 1, title: 'ਅ (A)', character: 'ਅ', transliteration: 'a', pronunciation: 'like "a" in "father"', exampleWord: 'ਅੱਖ', exampleMeaning: 'eye' },
      { id: 2, title: 'ਆ (AA)', character: 'ਆ', transliteration: 'aa', pronunciation: 'like "a" in "father" but longer', exampleWord: 'ਆਮ', exampleMeaning: 'mango' },
      { id: 3, title: 'ਇ (I)', character: 'ਇ', transliteration: 'i', pronunciation: 'like "i" in "sit"', exampleWord: 'ਇੱਕ', exampleMeaning: 'one' },
      { id: 4, title: 'ਈ (II)', character: 'ਈ', transliteration: 'ii', pronunciation: 'like "ee" in "see"', exampleWord: 'ਈਹ', exampleMeaning: 'this' },
      { id: 5, title: 'ਉ (U)', character: 'ਉ', transliteration: 'u', pronunciation: 'like "u" in "put"', exampleWord: 'ਉੱਲੂ', exampleMeaning: 'owl' },
      { id: 6, title: 'ਊ (UU)', character: 'ਊ', transliteration: 'uu', pronunciation: 'like "oo" in "food"', exampleWord: 'ਊਨ', exampleMeaning: 'wool' }
    ]
  },
  {
    id: 2,
    title: 'Greetings & Introductions',
    description: 'Learn basic greetings and how to introduce yourself',
    unit: 1,
    type: 'lesson',
    category: 'conversation',
    xpReward: 30,
    phrases: [
      { id: 1, punjabi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', transliteration: 'Sat Sri Akal', english: 'Hello / Goodbye (formal Sikh greeting)', pronunciationTip: 'Saht sree ah-kal', culturalNote: 'Traditional Sikh greeting meaning "God is Truth"' },
      { id: 2, punjabi: 'ਕਿਵੇਂ ਹੋ?', transliteration: 'Kiven ho?', english: 'How are you?', pronunciationTip: 'Kee-ven ho?', response: 'ਮੈਂ ਠੀਕ ਹਾਂ (Main theek haan) - I am fine' },
      { id: 3, punjabi: 'ਮੇਰਾ ਨਾਮ [ਨਾਮ] ਹੈ', transliteration: 'Mera naam [naam] hai', english: 'My name is [name]', pronunciationTip: 'May-rah naam [naam] hiye' },
      { id: 4, punjabi: 'ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?', transliteration: 'Tuhada naam ki hai?', english: 'What is your name?', pronunciationTip: 'Too-ha-da naam kee hiye?' },
      { id: 5, punjabi: 'ਧਨਵਾਦ', transliteration: 'Dhanvaad', english: 'Thank you', pronunciationTip: 'Dhun-vaad' }
    ]
  },
  {
    id: 3,
    title: 'Numbers 1-10',
    description: 'Learn to count from 1 to 10 in Punjabi',
    unit: 1,
    type: 'lesson',
    category: 'vocabulary',
    xpReward: 25,
    numbers: [
      { punjabi: 'ਇੱਕ', transliteration: 'Ik', english: 'One', pronunciation: 'Ik' },
      { punjabi: 'ਦੋ', transliteration: 'Do', english: 'Two', pronunciation: 'Do' },
      { punjabi: 'ਤੀਨ', transliteration: 'Tin', english: 'Three', pronunciation: 'Teen' },
      { punjabi: 'ਚਾਰ', transliteration: 'Char', english: 'Four', pronunciation: 'Chaar' },
      { punjabi: 'ਪੰਜ', transliteration: 'Panj', english: 'Five', pronunciation: 'Punj' },
      { punjabi: 'ਛੇ', transliteration: 'Chhe', english: 'Six', pronunciation: 'Chay' },
      { punjabi: 'ਸੱਤ', transliteration: 'Satt', english: 'Seven', pronunciation: 'Sutt' },
      { punjabi: 'ਅੱਠ', transliteration: 'Atth', english: 'Eight', pronunciation: 'Utth' },
      { punjabi: 'ਨੌਂ', transliteration: 'Nau', english: 'Nine', pronunciation: 'Now' },
      { punjabi: 'ਦਸ', transliteration: 'Das', english: 'Ten', pronunciation: 'Dus' }
    ]
  },
  {
    id: 4,
    title: 'Family Members',
    description: 'Learn names of family members and relationships',
    unit: 1,
    type: 'lesson',
    category: 'vocabulary',
    xpReward: 30,
    words: [
      { punjabi: 'ਪਿਤਾ', transliteration: 'Pita', english: 'Father', pronunciation: 'Pee-ta' },
      { punjabi: 'ਮਾਤਾ', transliteration: 'Mata', english: 'Mother', pronunciation: 'Ma-ta' },
      { punjabi: 'ਭਰਾ', transliteration: 'Bhara', english: 'Brother', pronunciation: 'Bha-ra' },
      { punjabi: 'ਭੈਣ', transliteration: 'Bhain', english: 'Sister', pronunciation: 'Bhain' },
      { punjabi: 'ਪੁੱਤਰ', transliteration: 'Putar', english: 'Son', pronunciation: 'Pu-tar' },
      { punjabi: 'ਧੀ', transliteration: 'Dhee', english: 'Daughter', pronunciation: 'Dhee' }
    ]
  },
  {
    id: 5,
    title: 'Food & Eating',
    description: 'Learn common food items and eating-related phrases',
    unit: 1,
    type: 'lesson',
    category: 'vocabulary',
    xpReward: 35,
    words: [
      { punjabi: 'ਰੋਟੀ', transliteration: 'Roti', english: 'Bread', pronunciation: 'Ro-tee' },
      { punjabi: 'ਦਾਲ', transliteration: 'Dal', english: 'Lentils', pronunciation: 'Daal' },
      { punjabi: 'ਸਬਜ਼ੀ', transliteration: 'Sabzi', english: 'Vegetables', pronunciation: 'Sab-zee' },
      { punjabi: 'ਚਾਵਲ', transliteration: 'Chawal', english: 'Rice', pronunciation: 'Cha-val' },
      { punjabi: 'ਦੁੱਧ', transliteration: 'Dudh', english: 'Milk', pronunciation: 'Dudh' },
      { punjabi: 'ਲੱਸੀ', transliteration: 'Lassi', english: 'Buttermilk', pronunciation: 'Las-see' }
    ]
  },
  {
    id: 6,
    title: 'Past Tense Basics',
    description: 'Learn to form and use simple past tense in Punjabi',
    unit: 2,
    type: 'lesson',
    category: 'grammar',
    xpReward: 40,
    grammarPoints: [
      { rule: 'Verb +ਿਆ/ੀ', example: 'ਕਿਤਾ (kita) - did/made', explanation: 'Add iya/ii to verb stem for masculine/feminine' },
      { rule: 'Subject + Object + Verb', example: 'ਮੈਂ ਨੇ ਕਿਤਾਬ ਪੜ੍ਹੀ (Main ne kitab parhi) - I read the book' }
    ],
    examples: [
      { punjabi: 'ਮੈਂ ਖਾਣਾ ਖਾਇਆ', transliteration: 'Main khaana khaaya', english: 'I ate food' },
      { punjabi: 'ਉਹ ਸਕੂਲ ਗਿਆ', transliteration: 'Uh school gaya', english: 'He went to school' }
    ]
  },
  {
    id: 7,
    title: 'Future Tense',
    description: 'Learn to express future actions in Punjabi',
    unit: 2,
    type: 'lesson',
    category: 'grammar',
    xpReward: 40,
    grammarPoints: [
      { rule: 'Verb +ੇਗਾ/ੇਗੀ', example: 'ਕਰੇਗਾ/ਕਰੇਗੀ (karega/karegi) - will do' },
      { rule: 'Future time indicators: ਕੱਲ (kal) - tomorrow, ਭਵਿੱਖ (bhavishkh) - future' }
    ],
    examples: [
      { punjabi: 'ਮੈਂ ਕੱਲ ਜਾਣਗਾ', transliteration: 'Main kal jaunga', english: 'I will go tomorrow' },
      { punjabi: 'ਅਸੀਂ ਕੱਲ ਮਿਲੇਗੇ', transliteration: 'Asin kal milenge', english: 'We will meet tomorrow' }
    ]
  },
  {
    id: 8,
    title: 'Punjabi Cuisine',
    description: 'Explore traditional Punjabi dishes and cooking terms',
    unit: 3,
    type: 'lesson',
    category: 'culture',
    xpReward: 50,
    words: [
      { punjabi: 'ਮੱਕੀ ਦੀ ਰੋਟੀ', transliteration: 'Makki di roti', english: 'Corn flour bread', pronunciation: 'Muk-kee dee ro-tee' },
      { punjabi: 'ਸਰਸੋਂ ਦਾ ਸਾਗ', transliteration: 'Sarson da saag', english: 'Mustard greens curry', pronunciation: 'Sar-son da saag' },
      { punjabi: 'ਲੱਸੀ', transliteration: 'Lassi', english: 'Sweet yogurt drink', pronunciation: 'Las-see' },
      { punjabi: 'ਗੁਲਾਬ ਜਾਮੁਨ', transliteration: 'Gulab jamun', english: 'Sweet milk-solid balls', pronunciation: 'Gu-laab ja-mun' }
    ]
  }
];

export function getLessonById(id) {
  return lessons.find((lesson) => lesson.id === Number(id)) || null;
}

export function getLessonsByUnit(unit) {
  return lessons.filter((lesson) => lesson.unit === Number(unit));
}

export function getLessonsByCategory(category) {
  return lessons.filter((lesson) => lesson.category === category);
}