import express from 'express';
import ejs from 'ejs'


const app = express();

app.use(express.json());

app.use(express.static('public'))
app.set('view engine', 'ejs')


app.get('/',(req, res) => {
  res.render('index', {
    links: [
      { href: '/', icon: '🏠', text: 'Home' },
      { href: '/tenDay', icon: 'ℹ️', text: 'About' },
    ],
    footer: [count+=1]
  })
})

app.post('/coord',(req, res) => {
  console.log(req.body, 9999)
  count+=1
  res.redirect('/')
})

app.get('/tenDay', (req, res)=>{
  res.render('tenDay', {})
})

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);


function getPointData(lat, lng) {
  return fetch(`${pointURL}/${lat},${lng}`)
     .then(res => res.json())
 }
 
 
 function getForecast(lat, lng){
   getPointData(lat, lng)
   .then(pointData=>{
     
   })
 }