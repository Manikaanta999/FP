const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const connectDB = require('../config/db');

const sampleMovies = [
  // Telugu Movies - Action
  { title: 'Pushpa: The Rise', poster: 'https://via.placeholder.com/300x450', plot: 'A smuggler rises to power in the red sandalwood trade.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: '18+', genre: 'Action', ott: 'Amazon Prime Video', rating: 8.2, year: 2021 },
  { title: 'Bheeshma', poster: 'https://via.placeholder.com/300x450', plot: 'A young man gets caught in a situation with a powerful female leader.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: 'U/A', genre: 'Action', ott: 'Amazon Prime Video', rating: 6.8, year: 2020 },
  { title: 'Akhanda', poster: 'https://via.placeholder.com/300x450', plot: 'A spiritual leader faces off against a powerful antagonist.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: '18+', genre: 'Action', ott: 'Hotstar', rating: 7.5, year: 2021 },
  
  // Telugu Movies - Romance
  { title: 'Arjun Reddy', poster: 'https://via.placeholder.com/300x450', plot: 'A passionate young man struggles with his feelings.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: '18+', genre: 'Romance', ott: 'Netflix', rating: 8.0, year: 2017 },
  { title: 'Geetha Govindam', poster: 'https://via.placeholder.com/300x450', plot: 'A romantic drama involving a teacher and student.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: 'U/A', genre: 'Romance', ott: 'Amazon Prime Video', rating: 7.2, year: 2018 },
  
  // Telugu Movies - Comedy
  { title: 'Sathamanam Bhavati', poster: 'https://via.placeholder.com/300x450', plot: 'A lighthearted family comedy about celebrations.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: 'All', genre: 'Comedy', ott: 'Netflix', rating: 7.3, year: 2017 },
  { title: 'Chandee Ledhenu', poster: 'https://via.placeholder.com/300x450', plot: 'A hilarious comedy about young friends.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: 'ALL', genre: 'Comedy', ott: 'Hotstar', rating: 6.9, year: 2019 },
  
  // Telugu Movies - Thriller/Crime
  { title: 'Evaru', poster: 'https://via.placeholder.com/300x450', plot: 'A complex crime thriller with unexpected twists.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: '16+', genre: 'Thriller/Crime', ott: 'Amazon Prime Video', rating: 7.8, year: 2019 },
  { title: 'Goodachari', poster: 'https://via.placeholder.com/300x450', plot: 'A spy thriller with international intrigue.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: '13+', genre: 'Thriller/Crime', ott: 'Netflix', rating: 7.1, year: 2018 },

  // Hindi Movies - Action
  { title: 'Pathaan', poster: 'https://via.placeholder.com/300x450', plot: 'A spy thriller with high-octane action sequences.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: '13+', genre: 'Action', ott: 'Amazon Prime Video', rating: 7.6, year: 2023 },
  { title: 'Bhaiyya Ji', poster: 'https://via.placeholder.com/300x450', plot: 'An action-packed revenge drama.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: '18+', genre: 'Action', ott: 'Netflix', rating: 7.0, year: 2023 },
  { title: 'Jawan', poster: 'https://via.placeholder.com/300x450', plot: 'An intense action thriller with strong narrative.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: '13+', genre: 'Action', ott: 'Amazon Prime Video', rating: 7.3, year: 2023 },
  
  // Hindi Movies - Romance
  { title: 'Rocky Aur Rani Kii Prem Kahaani', poster: 'https://via.placeholder.com/300x450', plot: 'A modern romantic comedy with cultural clash.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: 'U/A', genre: 'Romance', ott: 'Netflix', rating: 7.5, year: 2023 },
  { title: 'Atrangi Re', poster: 'https://via.placeholder.com/300x450', plot: 'A unique love story with a twist.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: '13+', genre: 'Romance', ott: 'Amazon Prime Video', rating: 7.2, year: 2021 },
  
  // Hindi Movies - Comedy
  { title: 'Khel Khel Mein', poster: 'https://via.placeholder.com/300x450', plot: 'A group of friends in a comedic adventure.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: 'U/A', genre: 'Comedy', ott: 'Netflix', rating: 7.1, year: 2021 },
  { title: 'Fukrey', poster: 'https://via.placeholder.com/300x450', plot: 'A comedy about four friends and their schemes.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: '13+', genre: 'Comedy', ott: 'Amazon Prime Video', rating: 7.0, year: 2013 },
  
  // Hindi Movies - Thriller/Crime
  { title: 'An Action Hero', poster: 'https://via.placeholder.com/300x450', plot: 'A gripping thriller with crime elements.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: '16+', genre: 'Thriller/Crime', ott: 'Hotstar', rating: 7.2, year: 2022 },
  { title: 'Khufiya', poster: 'https://via.placeholder.com/300x450', plot: 'An intelligent spy thriller.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: '16+', genre: 'Thriller/Crime', ott: 'Netflix', rating: 6.8, year: 2023 },

  // English Movies - Action
  { title: 'Top Gun: Maverick', poster: 'https://via.placeholder.com/300x450', plot: 'A legendary pilot trains the next generation.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'English', age: '13+', genre: 'Action', ott: 'Hotstar', rating: 8.3, year: 2022 },
  { title: 'Fast X', poster: 'https://via.placeholder.com/300x450', plot: 'The continuation of high-octane car action.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'English', age: '13+', genre: 'Action', ott: 'Netflix', rating: 7.2, year: 2023 },
  { title: 'John Wick 4', poster: 'https://via.placeholder.com/300x450', plot: 'The legendary assassin returns for vengeance.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'English', age: '18+', genre: 'Action', ott: 'Amazon Prime Video', rating: 7.5, year: 2023 },
  
  // English Movies - Romance
  { title: 'The Proposal', poster: 'https://via.placeholder.com/300x450', plot: 'A romantic comedy about unexpected love.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'English', age: 'U/A', genre: 'Romance', ott: 'Netflix', rating: 7.0, year: 2009 },
  { title: 'Midnight in Paris', poster: 'https://via.placeholder.com/300x450', plot: 'A man travels through time to find love.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'English', age: 'U/A', genre: 'Romance', ott: 'Hotstar', rating: 7.7, year: 2011 },
  
  // English Movies - Comedy
  { title: 'Barbie', poster: 'https://via.placeholder.com/300x450', plot: 'A hilarious take on the iconic doll.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'English', age: 'U/A', genre: 'Comedy', ott: 'Netflix', rating: 7.8, year: 2023 },
  { title: 'Knives Out', poster: 'https://via.placeholder.com/300x450', plot: 'A comedic mystery with an ensemble cast.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'English', age: '13+', genre: 'Comedy', ott: 'Netflix', rating: 7.9, year: 2019 },
  
  // English Movies - Thriller/Crime
  { title: 'Oppenheimer', poster: 'https://via.placeholder.com/300x450', plot: 'A gripping biographical thriller.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'English', age: '13+', genre: 'Thriller/Crime', ott: 'Amazon Prime Video', rating: 8.0, year: 2023 },
  { title: 'Killers of the Flower Moon', poster: 'https://via.placeholder.com/300x450', plot: 'A crime drama with intense atmosphere.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'English', age: '16+', genre: 'Thriller/Crime', ott: 'Apple TV+', rating: 8.0, year: 2023 },

  // More Telugu movies to reach 512+
  { title: 'Magadheera', poster: 'https://via.placeholder.com/300x450', plot: 'An action-packed romantic epic with reincarnation.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: '13+', genre: 'Action', ott: 'Amazon Prime Video', rating: 7.6, year: 2009 },
  { title: 'Eega', poster: 'https://via.placeholder.com/300x450', plot: 'A unique revenge story with fantasy elements.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: 'U/A', genre: 'Thriller/Crime', ott: 'Netflix', rating: 7.8, year: 2012 },
  { title: 'Kabali', poster: 'https://via.placeholder.com/300x450', plot: 'An action-packed crime drama.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: '18+', genre: 'Action', ott: 'Hotstar', rating: 7.0, year: 2016 },
  { title: 'Baahubali: The Beginning', poster: 'https://via.placeholder.com/300x450', plot: 'An epic action fantasy film.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: '13+', genre: 'Action', ott: 'Netflix', rating: 8.0, year: 2015 },
  { title: 'Ninnu Kori', poster: 'https://via.placeholder.com/300x450', plot: 'A touching romantic drama.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Telugu', age: 'U/A', genre: 'Romance', ott: 'Amazon Prime Video', rating: 6.9, year: 2017 },
  { title: 'Maine Pyar Kiya', poster: 'https://via.placeholder.com/300x450', plot: 'A classic romantic comedy.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: 'All', genre: 'Romance', ott: 'Hotstar', rating: 7.4, year: 1989 },
  { title: 'Drishti', poster: 'https://via.placeholder.com/300x450', plot: 'A gripping psychological thriller.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: '16+', genre: 'Thriller/Crime', ott: 'Netflix', rating: 6.7, year: 1990 },
  { title: 'Sholay', poster: 'https://via.placeholder.com/300x450', plot: 'A classic action-adventure film.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: 'U/A', genre: 'Action', ott: 'Hotstar', rating: 8.1, year: 1975 },
  { title: 'Lagaan', poster: 'https://via.placeholder.com/300x450', plot: 'An epic period drama with cricket and romance.', trailer: 'https://youtube.com/watch?v=example', detailsLink: 'https://imdb.com', language: 'Hindi', age: 'U/A', genre: 'Drama', ott: 'Amazon Prime Video', rating: 8.2, year: 2001 },
];

// Generate more movies to reach 512+
const generateMoreMovies = () => {
  const languages = ['Telugu', 'Hindi', 'English', 'Others'];
  const ages = ['All', 'U/A', '13+', '16+', '18+', 'A'];
  const genres = ['Action', 'Romance', 'Comedy', 'Thriller/Crime'];
  const otts = ['Hotstar', 'Netflix', 'Prime Video', 'Others'];
  
  const movieTitles = [
    'The Dark Knight', 'Inception', 'Interstellar', 'The Matrix', 'Avatar',
    'Titanic', 'The Notebook', 'La La Land', 'Pride and Prejudice', 'Crazy Rich Asians',
    'Joker', 'Parasite', 'Se7en', 'Fight Club', 'The Sixth Sense',
    'Superbad', 'Just Go with It', 'Step Brothers', 'The Hangover', 'Dodgeball',
    'Drishyam', 'Kakakapo', 'Piku', 'Article 15', 'Natarang',
    'Intelligent Khiladi', 'Love Aaj Kal', 'Kuch Kuch Hota Hai', 'DDLJ', 'Om Shanti Om',
  ];

  const additionalMovies = [];
  let count = 0;

  while (count < 480) {
    const movie = {
      title: `${movieTitles[Math.floor(Math.random() * movieTitles.length)]} ${count}`,
      poster: 'https://via.placeholder.com/300x450',
      plot: 'An exciting movie with great entertainment value.',
      trailer: 'https://youtube.com/watch?v=example',
      detailsLink: 'https://imdb.com',
      language: languages[Math.floor(Math.random() * languages.length)],
      age: ages[Math.floor(Math.random() * ages.length)],
      genre: genres[Math.floor(Math.random() * genres.length)],
      ott: otts[Math.floor(Math.random() * otts.length)],
      rating: (Math.random() * 3 + 6).toFixed(1),
      year: Math.floor(Math.random() * 10) + 2015
    };
    additionalMovies.push(movie);
    count++;
  }

  return [...sampleMovies, ...additionalMovies];
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Check if movies already exist
    const existingCount = await Movie.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} movies. Skipping seed.`);
      process.exit(0);
    }

    const allMovies = generateMoreMovies();
    await Movie.insertMany(allMovies);
    
    console.log(`Successfully seeded ${allMovies.length} movies to the database!`);
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
