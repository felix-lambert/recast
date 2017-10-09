// const fetch = require('node-fetch');

// const url = "https://api.recast.ai/v2/request";

// const body = {
//     text: 'hello'
// };

var recastai = require('recastai').default

var request = new recastai.request('dc9518b6db70a88c0d3040796550046e')


request.analyseText(process.argv[2])
.then(function(res) {
  // get the intent detected
  var intent = res.intent()

    console.log(intent.slug)
    if (intent.slug === 'greetings') {
        console.log('hello you!! :)');
    }
  // Do your code
}).catch(function(err) {
  // Handle error
  console.log(err);
})

// fetch(url, { 
// 	method: 'POST',
// 	body: body,
//     headers: {
//     'Content-Type': 'application/json', 
//     'Authorization': "dc9518b6db70a88c0d3040796550046e" },
// }).then((res, body) => {
//     console.log(res);
//     let results = res.json();
//     console.log(body);
//     console.log(results);
// });
