const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const playstore = require('./playstore');


app.get('/playstore', (req, res) => {

    const { search = "", sort, genres} = req.query;
    if (sort) {
        if (!['rating', 'app'].includes(sort)) {
          return res
            .status(400)
            .send('Sort must be one of rating or app');
        }
      }

      if (genres) {
        if(!['Action','Puzzle','Strategy','Casual','Arcade','Card'].includes(genres)){
            return res.status(400).send('genre must be action, puzzle, strategy, casual or arcade');
        }
    }

    let results = playstore.filter(result =>
+          result.App.toLowerCase().includes(search.toLowerCase()));

    if(sort) {
        results.sort((a,b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1: 0;
        });
    }

    if(genres) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }

    if(genres) {
        results = results.filter(app => app.Genres.includes(genres));
    }

    res.json(results);
  });

  
  
  app.listen(8000, () => {
    console.log('Server started on PORT 8000');
  });