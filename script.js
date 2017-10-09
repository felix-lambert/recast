const fetch = require('node-fetch');

const getAllDomains = (callback) => {
    let results = [];

    async function getMoreDomains(callback, after) {
        const url = 'https://www.reddit.com/r/programming.json?' + (after ? 'after=' + encodeURIComponent(after) : '');
        const body = await fetch(url).then(res => res.json());
        const domain = body.data.children.map(data => 
            data.data.created < 1504994400 ? callback(null, results) : data.data.domain);
        
        console.log('Please wait...');
        const onlyUnique = (value, index, self) => self.indexOf(value) === index;

        results = results.concat(domain);
        results = results.filter(onlyUnique);
        if (body.data.after) {   
            getMoreDomains(callback, body.data.after);
        } else {
            callback(`Can't get all the domains`, results);
        }
    }
    getMoreDomains(callback);
}

getAllDomains((err, domains) => {
    if (err) console.log('ERROR:', err);
    console.log(JSON.stringify(domains, null, 2));
});