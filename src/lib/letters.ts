export interface Letter {
  id: string;
  from: string;
  preview: string;
  image: string;
  trailImage?: string;
}

export const letters: Letter[] = [
  // Ordered by word count (shortest → longest)
  { id: "01", from: "Dustin", preview: "Happy Birthday Arielle!", image: "/letters/25.png", trailImage: "/letters/25-trail.png" }, // ~5 words
  { id: "02", from: "Jairaj", preview: "Hope you have a good one!", image: "/letters/17.png" }, // ~12 words
  { id: "03", from: "Gaurav", preview: "Can't wait to see you again soon", image: "/letters/15.png" }, // ~20 words
  { id: "04", from: "Modi Parents", preview: "We are happy that you are part of our family!", image: "/letters/22.png", trailImage: "/letters/22-trail.png" }, // ~40 words
  { id: "05", from: "Ed", preview: "Our friendship will always be a constant", image: "/letters/05.png" }, // ~42 words
  { id: "06", from: "Baggy", preview: "Thank you for being such a kind-hearted person", image: "/letters/26.png", trailImage: "/letters/26-trail.png" }, // ~52 words
  { id: "07", from: "Anirudh", preview: "You have such a warm, loving soul", image: "/letters/19.png" }, // ~55 words
  { id: "08", from: "Maanasa", preview: "I drew what my alter ego would be lol", image: "/letters/21.png" }, // ~55 words
  { id: "09", from: "Mirage", preview: "I love being your friend and future BIL", image: "/letters/13.png" }, // ~60 words
  { id: "10", from: "Yagnya", preview: "Here's to getting better at boardgames and longer hikes", image: "/letters/04.png" }, // ~62 words
  { id: "11", from: "Grace", preview: "You deserve all the love and happiness that's coming your way", image: "/letters/35.png", trailImage: "/letters/35-trail.png" }, // ~63 words
  { id: "12", from: "Radha", preview: "I love you & am very grateful to be apart of your life", image: "/letters/31.png", trailImage: "/letters/31-trail.png" }, // ~65 words
  { id: "13", from: "Sara, Mama, Oreo, & Andrew", preview: "You are the Easter Bunny! We can't wait to see you soon", image: "/letters/20.png" }, // ~65 words
  { id: "14", from: "Navam", preview: "Here's to another year around the sun", image: "/letters/03.png" }, // ~70 words
  { id: "15", from: "Sahil", preview: "I can't wait to marry you and celebrate many more birthdays", image: "/letters/18.png" }, // ~75 words
  { id: "16", from: "Vamsi", preview: "I'm really grateful we met all those years ago in SF", image: "/letters/27.png", trailImage: "/letters/27-trail.png" }, // ~75 words
  { id: "17", from: "Theresa", preview: "I hope you keep living it up & have the most wonderful birthday", image: "/letters/28.png", trailImage: "/letters/28-trail.png" }, // ~82 words
  { id: "18", from: "Ariana", preview: "Thank you for being part of some of my fondest SF memories", image: "/letters/24.png", trailImage: "/letters/24-trail.png" }, // ~82 words
  { id: "19", from: "Meghana", preview: "So glad to be sharing this special bridal era together", image: "/letters/09.png" }, // ~82 words
  { id: "20", from: "Pranav", preview: "I wish you all the happiness and love in the world", image: "/letters/11.png" }, // ~88 words
  { id: "21", from: "Krithik", preview: "You're one of the most genuine and kind people that I've met", image: "/letters/34.png", trailImage: "/letters/34-trail.png" }, // ~88 words
  { id: "22", from: "Maanu", preview: "Here's the recipe I used for the chai masala", image: "/letters/30.png", trailImage: "/letters/30-trail.png" }, // ~90 words
  { id: "23", from: "Dianna", preview: "So happy to be celebrating with you this year", image: "/letters/07.png" }, // ~105 words
  { id: "24", from: "Keerthana", preview: "Here's to many more lovely memories together", image: "/letters/10.png" }, // ~110 words
  { id: "25", from: "Avika", preview: "You are queen arielle YUPPPP", image: "/letters/01.png" }, // ~120 words
  { id: "26", from: "Viraat", preview: "You have a toxic-positivity about you", image: "/letters/32.png", trailImage: "/letters/32-trail.png" }, // ~120 words
  { id: "27", from: "Dani", preview: "You are exceptionally smart and incredibly kind", image: "/letters/14.png" }, // ~125 words
  { id: "28", from: "Ishitha", preview: "You're truly such a gem", image: "/letters/23.png", trailImage: "/letters/23-trail.png" }, // ~130 words
  { id: "29", from: "Sudesh", preview: "You and Sahil are genuinely one of my safe spaces in the city", image: "/letters/33.png", trailImage: "/letters/33-trail.png" }, // ~155 words
  { id: "30", from: "Srija", preview: "I hope you have the best birthday ever", image: "/letters/06.png" }, // ~165 words
  { id: "31", from: "Sanjana", preview: "It would be impossible to make it as sweet as you", image: "/letters/16.png" }, // ~170 words
  { id: "32", from: "Tika", preview: "I'm so grateful to have you as a friend", image: "/letters/02.png" }, // ~180 words
  { id: "33", from: "Isha", preview: "I feel so lucky to call you one of my closest friends", image: "/letters/29.png", trailImage: "/letters/29-trail.png" }, // ~200 words
  { id: "34", from: "Haley", preview: "I am so proud of you, your strength, your grace", image: "/letters/12.png" }, // ~220 words
  { id: "35", from: "Danial", preview: "May your ducks be in a row and arrows fly straight", image: "/letters/08.png", trailImage: "/letters/08-trail.png" }, // ~270 words
];
