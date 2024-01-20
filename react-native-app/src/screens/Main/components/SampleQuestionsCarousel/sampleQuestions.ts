export default [
    // Self
    'How can I boost my confidence?',
    "What's my purpose in life?",
    'How should I handle stress?',
    'Why am I feeling stuck?',
    'How can I be more creative?',
    'What should I learn next?',
    'How do I find inner peace?',
    'What adventure should I try?',
    'How can I express myself?',
    'Why am I feeling restless?',
  
    // Family
    'How should I connect with family?',
    'What can I do for family harmony?',
    'How can I resolve a family conflict?',
    'How should I support my parents?',
    'Why am I feeling distant from family?',
    'What family tradition to start?',
    'How can I improve family communication?',
    "What's my role in my family?",
    'How to create family bonding time?',
    'Why am I worried about family?',
  
    // Work
    'How can I improve at work?',
    'What career path should I pursue?',
    'How should I handle work pressure?',
    'Why am I feeling unmotivated at work?',
    'What skills should I develop?',
    'How can I be a better leader?',
    'How to balance work and life?',
    'What work challenge should I take on?',
    'How to foster teamwork?',
    'Why am I feeling overwhelmed at work?',
  
    // Finance
    'How can I save more money?',
    "What's a smart investment strategy?",
    'How should I budget this month?',
    'Why am I worried about money?',
    'What financial habit to change?',
    'How can I earn extra income?',
    'How to plan for financial stability?',
    "What's my financial health status?",
    'How can I be more generous?',
    'Why am I feeling greedy?',
  
    // Love
    'How should I approach dating?',
    'What can I do to be more romantic?',
    'How to deepen my relationship?',
    'Why am I feeling lonely?',
    'What qualities to seek in a partner?',
    'How to handle a love setback?',
    'How can I show more affection?',
    'Why am I scared of commitment?',
    'What to do on a first date?',
    'How can I heal from a breakup?',
  
    // Positive and Quirky
    "How do I brighten someone's day?",
    'What colors should I wear today?',
    'How can I make someone smile?',
    'What new hobby should I try?',
    'How to find joy in small things?',
    "What's a fun weekend activity?",
    'How can I surprise a friend?',
    'What unique gift should I give?',
    'How to start my day positively?',
    "What's a quirky skill to learn?",
  
    // Emotional and Situational
    'How can I overcome fear?',
    'What to do when feeling sad?',
    'How should I celebrate a win?',
    'Why am I feeling anxious?',
    "What's the best way to relax?",
    'How to cope with change?',
    'How to stay hopeful?',
    'What to do in uncertain times?',
    'How can I be more empathetic?',
    'Why am I feeling excited?',
  
    // General and Interesting
    'What new place should I explore?',
    'How to be a good friend?',
    "What's a healthy lifestyle change?",
    'How to stay motivated?',
    'What book should I read next?',
    'How to practice gratitude?',
    "What's a fun exercise to try?",
    'How to be more environmentally friendly?',
    "What's a creative project to start?",
    'How to stay curious?',
  ]
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)