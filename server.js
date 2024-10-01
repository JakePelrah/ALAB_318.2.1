import express from 'express';

const app = express();


app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index',{links:[
            { href: '/', icon: '🏠', text: 'Home' },
            { href: '/about', icon: 'ℹ️', text: 'About' },
            { href: '/contact', icon: '📞', text: 'Contact' },
        ]
        })
  })

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);