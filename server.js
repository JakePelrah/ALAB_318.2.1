import express from 'express';
import session from 'express-session';

const app = express();

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
app.set('view engine', 'ejs')


// get the homepage
app.get('/', (req, res) => {
  const { coordinates, location, periods } = req.session
  res.render('index', {
    links: location?.city ?
      [{ href: '/tenDay', text: 'Extended Forecast' }] : [],
    lat: coordinates?.[0] || 42.2626,
    lng: coordinates?.[1] || -71.8023,
    city: location?.city || null,
    state: location?.state || null,
    periods: periods?.[0] ? [periods[0]] : []
  })
})

app.post('/coord', async (req, res) => {

  const { lat, lng } = req.body
  req.session.coordinates = [lat, lng] || []


  try {

    const pointData = await getPointData(lat, lng)

    const { city, state } = pointData?.properties?.relativeLocation?.properties || {}
    req.session.location = { city, state }

    const { cwa, gridX, gridY } = pointData.properties
    const weatherData = await getForecastData(cwa, gridX, gridY)
    req.session.periods = weatherData?.properties?.periods || []

    
  } catch {
    console.log('area not available')
  }
  finally{
    res.redirect('/')
  }

})

// get 10 day forecast page
app.get('/tenDay', (req, res) => {
  const { coordinates, location, periods } = req.session
  res.render('tenDay', {
    links: [],
    lat: coordinates?.[0] || null,
    lng: coordinates?.[1] || null,
    city: location?.city || null,
    state: location?.state || null,
    periods: periods || [],
  })
})


app.get('/download/:city/:state', (req, res) => {
  console.log(req.params)
  res.download('public/weatherStation.jpg', function (error) {
    console.log("Error : ", error)
  });
})

app.post('/submit', (req, res) => {

  const url = `https://nominatim.openstreetmap.org/search?q=${req.body.location}&format=json`
  fetch(url).then(res => res.json()).then(async data => {

  
    const { lat, lon } = data[0]
    req.session.coordinates = [lat, lon] || []

    try {

      const pointData = await getPointData(lat, lon)

      const { city, state } = pointData?.properties?.relativeLocation?.properties || {}
      req.session.location = { city, state }

      const { cwa, gridX, gridY } = pointData.properties
      const weatherData = await getForecastData(cwa, gridX, gridY)
      req.session.periods = weatherData?.properties?.periods || []

    } catch {
      console.log('area not available')
    }
    finally{
      res.redirect('/')

    }
  
  })
})

// 404 page
app.use((req, res) => {
  res.render('404')
})


app.listen(3000, () =>
  console.log('Weather app @ http://localhost:3000'),
);


/////////////////////////////////// Weather API ///////////////////////////////////
const pointURL = "https://api.weather.gov/points/"
const forecastURL = "https://api.weather.gov/gridpoints/"

function getPointData(lat, lng) {
  return fetch(`${pointURL}${lat},${lng}`)
    .then(res => res.json())
}
function getForecastData(office, gridX, gridY) {
  return fetch(`${forecastURL}/${office}/${gridX},${gridY}/forecast`)
    .then(res => res.json())
}
