const fetch = require('node-fetch');

const getAllDomains = (callback) => {
    
    var results = [];

    const getMoreDomains = (callback, after) => {
        const url = 'https://www.reddit.com/r/programming.json?' + (after ? 'after=' + encodeURIComponent(after) : '');
        fetch(url)
        .then(res => res.json())
        .then(res => {
            console.log('Please wait...');
            const domain = res.data.children.map(data => {
                if (data.data.created < 1504994400) {
                    callback(null, results);
                }
                return data.data.domain;
            });

            const onlyUnique = (value, index, self) => { 
                return self.indexOf(value) === index;
            }

            results = results.concat(domain);
            results = results.filter(onlyUnique);
            if (res.data.after) {   
                getMoreDomains(callback, res.data.after);
            } else {
                callback(`Can't get all the domains`, results);
            }
        }); 
    }
    getMoreDomains(callback);
}

getAllDomains((err, domains) => {
    if (err) console.log('ERROR:', err);
    console.log(JSON.stringify(domains, null, 2));
});
