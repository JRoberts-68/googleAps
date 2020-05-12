const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const playstore = require('./playstore.js');

app.get('/playstore', (req, res) => {
    const { sort='', genres='' } = req.query;

    if(!sort && !genres) {
        res.status(200).send(playstore);
    }

    if(sort) {
        if(!['Rating', 'App'].includes(sort)) {
            return res
                .status(400)
                .send('Must sort by rating or app title')
        }

        let sortResults = playstore.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });

        res.status(200).send(sortResults);
    }

    if(genres) {
        let gameGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

        if(!gameGenres.includes(genres)) {
            return res
                .status(400)
                .send('Genre not recognized')
        }

        const matchGenres = gameGenres.filter(term => term === genres);

        let newResults = playstore.filter(game => {
            let genreValues = game.Genres.split(';');
            let multipleGenres;

            if(genreValues.length > 1) {
                multipleGenres = genreValues[1].split(' ');
            }

            if(multipleGenres) {                
                return (multipleGenres.find(genre => genre === matchGenres[0]) === matchGenres[0]);
            }

            return genreValues[0] === matchGenres[0];
        });
        
        res.status(200).send(newResults);
    }

})

module.exports = app;