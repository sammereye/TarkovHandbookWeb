const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars');
const request = require('request');
const MiniSearch = require('minisearch');

const app = express();
const port = 3002;

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }))

app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/tarkov', express.static(path.join(__dirname, 'public')));

app.get('/tarkov', (req, res) => {
  res.render('index', {title: 'Tarkov Handbook (Web)', root_path: 'tarkov'})
})

// #region ITEM SEARCH

app.post('/tarkov/itemSearch', (req, res) => {
  let val = req.body.value;
  let results = db.search(val)
  condensedResults = results.slice(0, 4);
  for (let i in condensedResults) {
    if (condensedResults[i].id in questItems) {
      condensedResults[i]['quests'] = questItems[condensedResults[i].id]
    }

    if (condensedResults[i].id in hideoutItems) {
      condensedResults[i]['hideout'] = hideoutItems[condensedResults[i].id]
    }
  }

  res.send(condensedResults)
})

// #endregion

// #region QUEST SEARCH
app.post('/tarkov/questSearch', (req, res) => {
  let val = req.body.value;
  let results = questDB.search(val)
  condensedResults = results.slice(0, 4)

  let questResults = getQuests(condensedResults, {});

  res.send(questResults);
})
// #endregion

// #region GET ITEM DICTIONARY
app.post('/tarkov/getItemDictionary', (req, res) => {
  res.send(itemsDictionary);
})
// #endregion

// #region GET QUESTS
app.post('/tarkov/getQuests', (req, res) => {
  let trader = req.body.trader;

  let questResults = getQuests(quests, {'trader': trader});

  res.send(questResults);
})
// #endregion

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})


// #region DATA INITIALIZATION
let items = '';
let itemsDictionary = {};
let db = '';
let questItems = {};
let traders = ['Prapor', 'Therapist', 'Skier', 'Peacekeeper', 'Mechanic', 'Ragman', 'Jaegar', 'Fence']
let questPathList = []

let options = {
  'method': 'POST',
  'url': 'https://tarkov-tools.com/graphql',
  'headers': {
    'authority': 'tarkov-tools.com',
    'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
    'accept': 'application/json',
    'dnt': '1',
    'content-type': 'application/json',
    'sec-ch-ua-mobile': '?0',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
    'sec-ch-ua-platform': '"Windows"',
    'origin': 'https://tarkov-tools.com',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://tarkov-tools.com/item/golden-rooster',
    'accept-language': 'en-US,en;q=0.9'
  },
  body: JSON.stringify({
    "query": "{\n            itemsByType(type:any){\n                id\n                name\n                shortName\n                basePrice\n                normalizedName\n                types\n                width\n                height\n                avg24hPrice\n                wikiLink\n                changeLast48h\n                low24hPrice\n                high24hPrice\n                lastLowPrice\n                gridImageLink\n                iconLink\n                traderPrices {\n                    price\n                    trader {\n                        name\n                    }\n                }\n                sellFor {\n                    source\n                    price\n                    requirements {\n                        type\n                        value\n                    }\n                    currency\n                }\n                buyFor {\n                    source\n                    price\n                    currency\n                    requirements {\n                        type\n                        value\n                    }\n                }\n                containsItems {\n                    count\n                    item {\n                        id\n                    }\n                }\n            }\n        }"
  })
};

function getItemsPromise() {
  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) {
        reject(error);
      } else {
        let itemData = JSON.parse(response.body).data.itemsByType;
        resolve(itemData)
      }
    });
  })
}

async function makeSynchronousRequestForItems(request) {
	try {
		let http_promise = getItemsPromise();
		let response_body = await http_promise;

    items = response_body
	}
	catch(error) {
		console.log(error);
	}
}

let quests = '';
let questDB = '';
let questPath = {};

let questOptions = {
  url: 'https://raw.githubusercontent.com/TarkovTracker/tarkovdata/master/quests.json',
  json: true
};

function getQuestsPromise() {
  return new Promise((resolve, reject) => {
    request(questOptions, function (error, response) {
      if (error) {
        reject(error);
      } else {
        // let itemData = JSON.parse(response.body).data.itemsByType;
        // resolve(itemData)
        resolve(response.body)
      }
    });
  })
}

async function makeSynchronousRequestForQuests(request) {
	try {
		let http_promise = getQuestsPromise();
		let response_body = await http_promise;

    quests = response_body
	}
	catch(error) {
		console.log(error);
	}
}

// HIDEOUT //
let hideout = '';
let hideoutItems = {};

let hideoutOptions = {
  url: 'https://raw.githubusercontent.com/TarkovTracker/tarkovdata/master/hideout.json',
  json: true
};

function getHideoutPromise() {
  return new Promise((resolve, reject) => {
    request(hideoutOptions, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response.body)
      }
    });
  })
}

async function makeSynchronousRequestForHideout(request) {
	try {
		let http_promise = getHideoutPromise();
		let response_body = await http_promise;

    hideout = response_body
	}
	catch(error) {
		console.log(error);
	}
}

// CRAFTS //
let crafts = '';
let craftItems = [];

let craftOptions = {
  'method': 'POST',
  'url': 'https://tarkov-tools.com/graphql',
  'headers': {
    'authority': 'tarkov-tools.com',
    'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
    'accept': 'application/json',
    'dnt': '1',
    'content-type': 'application/json',
    'sec-ch-ua-mobile': '?0',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
    'sec-ch-ua-platform': '"Windows"',
    'origin': 'https://tarkov-tools.com',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://tarkov-tools.com/hideout-profit/',
    'accept-language': 'en-US,en;q=0.9'
  },
  body: JSON.stringify({
    "query": "{\n        crafts {\n          rewardItems {\n            item {\n              id\n              basePrice\n              name\n              normalizedName\n              iconLink\n              imageLink\n              wikiLink\n              avg24hPrice\n              lastLowPrice\n              traderPrices {\n                  price\n                  trader {\n                      name\n                  }\n              }\n              buyFor {\n                source\n                price\n                currency\n              }\n              sellFor {\n                source\n                price\n                currency\n              }\n            }\n            count\n          }\n          requiredItems {\n            item {\n              id\n              basePrice\n              name\n              normalizedName\n              iconLink\n              imageLink\n              wikiLink\n              avg24hPrice\n              lastLowPrice\n              traderPrices {\n                price\n                trader {\n                    name\n                }\n              }\n              buyFor {\n                source\n                price\n                currency\n              }\n              sellFor {\n                source\n                price\n                currency\n              }\n            }\n            count\n          }\n          source\n          duration\n        }\n    }"
  })

};

function getCraftsPromise() {
  return new Promise((resolve, reject) => {
    request(craftOptions, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response.body)
      }
    });
  })
}

async function makeSynchronousRequestForCrafts(request) {
	try {
		let http_promise = getCraftsPromise();
		let response_body = await http_promise;

    crafts = JSON.parse(response_body)
	}
	catch(error) {
		console.log(error);
	}
}

updateData()
setInterval(updateData, 1000 * 60 * 30)

async function updateData() { 
  items = '', itemsDictionary = {}, db = '', questItems = {}, quests = '', questDB = '', hideout = '', hideoutItems = {}, crafts = '', craftItems = [];
	await makeSynchronousRequestForQuests();
  await makeSynchronousRequestForItems();
  await makeSynchronousRequestForHideout();
  await makeSynchronousRequestForCrafts();

  db = new MiniSearch({
    fields: ['name', 'shortName'], // fields to index for full-text search
    storeFields: ['name', 'shortName', 'avg24hPrice', 'traderPrices', 'basePrice'], // fields to return with search results
    searchOptions: {
      fuzzy: 0.2, 
      prefix: true,
      boost: {
        'shortName': 1.5
      }
    }
  })

  db.addAll(items);

  for (let i in items) {
    itemsDictionary[items[i].id] = items[i]
  }

  for (let i in quests) {
    let questArr = quests[i].require.quests
    questPath[quests[i].id] = [].concat.apply([], questArr);
  }

  questDB = new MiniSearch({
    fields: ['title'], // fields to index for full-text search
    storeFields: ['giver', 'title', 'locales', 'objectives', 'require', 'wiki'], // fields to return with search results
    searchOptions: {
      fuzzy: 0.2,
      prefix: true
    }
  })
  
  questDB.addAll(quests);

  for (let i in quests) {
    let objectives = quests[i].objectives;
    for (let j in objectives) {
      let objective = objectives[j];
      
      if (objective.type == 'find') {
        let title = quests[i].title;
        let item = objective.target;
        let amount = objective.number;

        if (!(item in questItems)) {
          questItems[item] = []
        }

        questItems[item].push({
          'quest_id': quests[i].id,
          'title': title,
          'amount': amount,
          'completed': false
        })
      }
    }
  }

  let hideoutTranslations = {}
  for (let i in hideout.stations) {
    let name = hideout.stations[i].locales.en;
    switch (name) {
      case 'Intelligence center':
        name = 'Intelligence Center'
        break;
      case 'Nutrition Unit':
        name = 'Nutrition unit'
        break;
    }

    hideoutTranslations[name] = hideout.stations[i].id
  }

  for (let i in hideout.modules) {
    let stationId = hideout.modules[i].stationId;
    let requires = hideout.modules[i].require;
    for (let j in requires) {
      let item = requires[j];
      
      if (item.type == 'item') {
        let module = hideout.modules[i].module;
        let level = hideout.modules[i].level;
        let itemName = item.name
        let quantity = item.quantity;

        if (!(itemName in hideoutItems)) {
          hideoutItems[itemName] = []
        }

        hideoutItems[itemName].push({
          'module': module,
          'stationId': stationId,
          'level': level,
          'quantity': quantity,
          'completed': false
        })
      }
    }
  }

  crafts = crafts.data.crafts
  for (let i in crafts) {
    let rewardItems = crafts[i].rewardItems;
    let requiredItems = crafts[i].requiredItems;
    let stationId = hideoutTranslations[crafts[i].source.split(' level ')[0]]
    let craftLevel = parseInt(crafts[i].source.split(' level ')[1])

    let craftItem = {};
    craftItem.stationId = stationId;
    craftItem.level = craftLevel;
    craftItem.output = {
      name: itemsDictionary[rewardItems[0].item.id].name,
      amount: rewardItems[0].count,
      price: itemsDictionary[rewardItems[0].item.id].avg24hPrice,
      duration: crafts[i].duration
    }

    craftItem.input = [];
    for (let j in requiredItems) {
      craftItem.input.push({
        name: itemsDictionary[requiredItems[j].item.id].name,
        amount: requiredItems[j].count,
        price: itemsDictionary[requiredItems[j].item.id].avg24hPrice
      })
    }

    craftItems.push(craftItem)
  }
};
// #endregion

// #region FUNCTIONS
function getQuests(quests, options) {
  let allQuests = [];
  for (let i in quests) {
    let traderValid = true;
    if ('trader' in options) {
      if (quests[i].giver != options.trader) {
        traderValid = false
      }
    }

    if (traderValid) {
      allQuests.push(quests[i])
    }
  }
  
  sortQuests(allQuests)

  return([allQuests])
}

function iterateThroughQuest(id) {
  questPathList.push(id);

  if (id in questPath) {
    if (questPath[id].length > 0) {
      for (let i in questPath[id]) {
        iterateThroughQuest(questPath[id][i])
      }
    }
  }
}

const sortQuests = (arr = []) => {
  const assignValue = val => {
     if(val === null){
        return Infinity;
     }
     else{
        return val;
     };
  };
  const sorter = (a, b) => {
     return assignValue(a.require.level) - assignValue(b.require.level);
  };
  arr.sort(sorter);
}
// #endregion