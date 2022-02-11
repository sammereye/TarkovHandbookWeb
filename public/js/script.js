// #region GLOBAL VARIABLES
let activeTab = 'items';

// Data
let moduleLevels = {};
let traders = ['Prapor', 'Therapist', 'Skier', 'Peacekeeper', 'Mechanic', 'Ragman', 'Jaegar', 'Fence']
let locations = ['Factory', 'Customs', 'Woods', 'Shoreline', 'Interchange', 'Labs', 'Reserve' , 'Lighthouse']
// #endregion

$(document).ready(() => {
  // #region INITIALIZATION
  $('.search-input').focus()
  // #endregion

  // #region ITEMS
  // ipcRenderer.on('itemResults', (e, data) => {
  //   $('.search-results-container').css('display', 'none');
  //   $('.search-results-container').empty();

  //   if (data.length > 0) {
  //     $('.no-results').remove();
  //     $('.search-results-container').append(
  //       $('<div/>', {
  //         class: 'search-header'
  //       }).append(
  //         $('<div/>', {
  //           class: 'name-container',
  //           text: 'Item Name'
  //         })
  //       ).append(
  //         $('<div/>', {
  //           class: 'item-requirements',
  //           text: 'Requirements'
  //         })
  //       ).append(
  //         $('<div/>', {
  //           class: 'average',
  //           html: '<div>Average</div><div class="fee-title">(After Fee)</div>'
  //         })
  //       ).append(
  //         $('<div/>', {
  //           class: 'trader',
  //           text: 'Trader'
  //         })
  //       )
  //     )
  
  //     for (let i in data) {
  //       let nameSecondaryElement = 
  //         $('<div/>', {class: 'name-secondary'}).append(
  //           $('<div/>', {class: 'full-name', text: `(${data[i].name})`})
  //         )

  //         let requirementsElement = $('<div/>', {class: 'item-requirements'})
  
  //       if ('quests' in data[i]) {
  //         for (let j in data[i].quests) {
  //           let quest = data[i].quests[j];
  //           requirementsElement.append(
  //             $('<div/>', {class: 'name-quests'}).append(
  //               $('<div/>', {
  //                 class: 'in-raid-quest',
  //                 text: quest.title
  //               })
  //             ).append (
  //               $('<embed/>', {
  //                 'height': '15',
  //                 'width': '15',
  //                 'class': 'in-raid-icon',
  //                 'src': 'images/check-circle.svg'
  //               })
  //             ).append(
  //               $('<div/>', {
  //                 class: 'in-raid-amount',
  //                 text: quest.amount
  //               })
  //             )
  //           )
  //         }
  //       }
  
  //       if ('hideout' in data[i]) {
  //         for (let j in data[i].hideout) {
  //           let hideout = data[i].hideout[j]
  //           requirementsElement.append(
  //             $('<div/>', {class: 'name-hideout'}).append(
  //               $('<div/>', {
  //                 class: 'hideout-title',
  //                 text: `${hideout.module} L${hideout.level}`
  //               })
  //             ).append (
  //               $('<embed/>', {
  //                 'height': '15',
  //                 'width': '15',
  //                 'class': 'hideout-icon',
  //                 'src': 'images/hashtag.svg'
  //               })
  //             ).append(
  //               $('<div/>', {
  //                 class: 'hideout-amount',
  //                 text: hideout.quantity
  //               })
  //             )
  //           )
  //         }
  //       }
  
  //       let nameElement = 
  //         $('<div/>', {class: 'name-container'}).append(
  //           $('<div/>', {class: 'short-name', text: data[i].shortName})
  //         ).append(
  //           nameSecondaryElement
  //         )
  
  //       let traderPrice = -1;
  
  //       for (let j in data[i].traderPrices) {
  //         if (data[i].traderPrices[j].price > traderPrice) {
  //           traderPrice = data[i].traderPrices[j].price
  //         }
  //       }
  
  //       let basePrice = data[i].basePrice;
  //       let avgPrice = data[i].avg24hPrice;
  
  //       let fee = Math.round((basePrice * 0.09 * Math.pow(4, Math.pow(Math.log10(basePrice / avgPrice), (avgPrice < basePrice ? 1.08 : 1))) + avgPrice * Math.pow(4, Math.pow(Math.log10(avgPrice / basePrice), (basePrice <= avgPrice ? 1.08 : 1))) * 0.05));
  //       let priceAfterFee = avgPrice - fee;
  
  //       $('.search-results-container').append(
  //         $('<div/>', {
  //           class: 'search-row'
  //         }).append(
  //           nameElement
  //         ).append(
  //           requirementsElement
  //         ).append(
  //           $('<div/>', {
  //             class: 'average',
  //             html: `₽${avgPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<span class="fee-price">₽(${priceAfterFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</span>`
  //           })
  //         ).append(
  //           $('<div/>', {
  //             class: 'trader',
  //             text: `₽${traderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  //           })
  //         )
  //       )
  //     }
  //   } else {
  //     $('.search-results-container').empty();
  //     $('.search-results-container').append(
  //       $('<div/>', {class: 'no-results', text: 'No results found.'})
  //     )
  //   }

  //   $('.search-results-container').css('display', 'flex');
  //   $('.search-results-container').scrollTop(0)
  // });
  // #endregion

  // #region TABS (NAVIGATION)
  $('.tab').on('click', (e) => {
    let tab = $(e.currentTarget).data().id;
    activeTab = tab;
    // Universal
    $('.search-results-container').empty();
    $('.active-tab').removeClass('active-tab');
    $(e.currentTarget).addClass('active-tab');
    $('.search-input').attr('placeholder', $(e.currentTarget).data().placeholder)
    $('.search-input').val('')
    $('.active-subtab').removeClass('active-subtab')

    // Tab-Specific
    if (tab == 'hideout' || tab == 'maps') {
      $('.search-input').prop('disabled', 'disabled')
    } else {
      $('.search-input').removeAttr('disabled')
      $('.search-input').focus()
    }

    if (tab == 'hideout') {
      $('.hideout-subtab-container').css('display', 'flex')
    } else {
      $('.hideout-subtab-container').css('display', 'none')
    }

    if (tab == 'maps') {
      $('.maps-subtab-container').css('display', 'flex')
      $('.map-results-container').css('display', 'flex')
    } else {
      $('.maps-subtab-container').css('display', 'none')
      $('.map-results-container').css('display', 'none')
    }

    if (tab == 'quests') {
      $('.quest-subtab-container').css('display', 'flex')
    } else {
      $('.quest-subtab-container').css('display', 'none')
    }
  });

  $('.subtab').on('click', (e) => {
    let subtabId = $(e.currentTarget).data().id;
    $('.active-subtab').removeClass('active-subtab')
    $(e.currentTarget).addClass('active-subtab')

    // If a subtab that is under the hideout section is clicked
    if ($(e.currentTarget).parent().hasClass('hideout-subtab-container'))  {
      // ipcRenderer.send('getHideout', {id: subtabId})
    } else if ($(e.currentTarget).parent().hasClass('quest-subtab-container'))  { // If a subtab that is under the quest section is clicked
      // ipcRenderer.send('getQuests', {trader: subtabId, level: $('.level-input').val()})
    } else if ($(e.currentTarget).parent().hasClass('maps-subtab-container')) {
      $(e.currentTarget).parent().next().next().empty()
      $(e.currentTarget).parent().next().next().append(
        $('<iframe/>', {id: 'iframe', src: `maps/${subtabId}.html`, height: '600', width: '100%', frameBorder: '0'})
      )

      $(e.currentTarget).parent().next().next().css('display', 'flex')      
    }
  });
  // #endregion

  // #region QUESTS
  // ipcRenderer.on('questResults', (e, data) => {
  //   $('.search-results-container').css('display', 'none')
  //   $('.search-results-container').empty()

  //   if (data[0].length > 0) {
  //     $('.no-results').remove();
  //     $('.search-results-container').append(
  //       $('<div/>', {
  //         class: 'quest-header'
  //       }).append(
  //         $('<div/>', {class: 'quest-trader', text: 'Trader'})
  //       ).append(
  //         $('<div/>', {class: 'quest-name', text: 'Quest Name'})
  //       ).append(
  //         $('<div/>', {class: 'quest-tasks', text: 'Tasks'})
  //       ).append(
  //         $('<div/>', {class: 'quest-expand'})
  //       ).append(
  //         $('<div/>', {class: 'quest-check'})
  //       )
  //     )

  //     let quests = data[0];
  //     let itemDictionary = data[1];

  //     for (let i in quests) {
  //       let objectives = [];
  //       for (let j in quests[i].objectives) {
  //         let task = '<div class="task-line-container"><div class="task-dash">-</div>';
  //         let type = quests[i].objectives[j].type;
  //         let number = quests[i].objectives[j].number;
  //         let target = quests[i].objectives[j].target;
  //         let location = quests[i].objectives[j].location;

  //         if (type == 'reputation') {
  //           type = 'reach level';
  //           target = 'on ' + traders[target]
  //         }

  //         if (type == 'skill') {
  //           type = 'achieve level';
  //         }

  //         if (type == 'key') {
  //           type = 'requires';
  //         }

  //         if (type == 'find') {
  //           type = 'find in raid';
  //         }

  //         if (['kill', 'collect', 'find in raid', 'pickup', 'place', 'mark', 'reach level', 'requires', 'locate', 'build', 'achieve level'].includes(type)) {
  //           task += `${capitalizeFirstLetter(type)}`;
  //         }

  //         if (!(['mark', 'pickup', 'warning', 'locate', 'build'].includes(type))) {
  //           if (['place', 'requires'].includes(type)) {
  //             if (number > 1) {
  //               task += ` ${number}`
  //             } 
  //           } else {
  //             task += ` ${number}`
  //           }
  //         }

  //         if (Array.isArray(target)) {
  //           for (let k in target) {
  //             if (target[k] in itemDictionary) {
  //               target[k] = itemDictionary[target[k]].name
  //             }
  //           }
  //           target = target.join(', ')
  //         } else {
  //           if (target in itemDictionary) {
  //             target = itemDictionary[target].name
  //           }
  //         }
          
  //         task += ` ${target}`

  //         if (location > -1 && type != 'requires') {
  //           task += ` on ${locations[location]}`
  //         }

  //         if ('with' in quests[i].objectives[j] && quests[i].objectives[j].type != 'build') {
  //           task += ` (${quests[i].objectives[j].with.join(', ')})`
  //         }

  //         task += '</div>'
  //         objectives.push(task)
  //       }

  //       $('.search-results-container').append(
  //         $('<div/>', {
  //           class: 'quest-row',
  //           'data-wiki': quests[i].wiki,
  //           'data-id': quests[i].id
  //         }).append(
  //           $('<div/>', {class: 'quest-trader', text: traders[quests[i].giver]})
  //         ).append(
  //           $('<div/>', {class: 'quest-name', text: quests[i].locales.en})
  //         ).append(
  //           $('<div/>', {class: 'quest-tasks', html: objectives.join('')})
  //         ).append(
  //           $('<div/>', {class: 'quest-expand'}).append(
  //             $('<div/>', {class: 'quest-expand-box'}).append(
  //               $('<svg/>', {xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 320 512", height: '20', width: '20'}).append(
  //                 $('<path/>', {fill: "#b9b8bd", d: "M151.5 347.8L3.5 201c-4.7-4.7-4.7-12.3 0-17l19.8-19.8c4.7-4.7 12.3-4.7 17 0L160 282.7l119.7-118.5c4.7-4.7 12.3-4.7 17 0l19.8 19.8c4.7 4.7 4.7 12.3 0 17l-148 146.8c-4.7 4.7-12.3 4.7-17 0z"})
  //               )
  //             )
  //           )
  //         )
  //       )

  //       $('.search-results-container').append(
  //         $('<div/>', {
  //           class: 'quest-info-container'
  //         })
  //       )
  //     }
  //   } else {
  //     $('.search-results-container').empty();
  //     $('.search-results-container').append(
  //       $('<div/>', {class: 'no-results', text: 'No results found.'})
  //     )
  //   }

  //   $('.search-results-container').css('display', 'flex');
  //   $('.search-results-container').html($('.search-results-container').html());
  //   $('.search-results-container').scrollTop(0)
  // });
  // #endregion

  // #region CRAFTS
  // ipcRenderer.on('craftResults', (e, craftItems) => {
  //   $('.search-results-container').css('display', 'none');
  //   $('.search-results-container').empty();

  //   $('.search-results-container').append(
  //     $('<div/>', {
  //       class: 'craft-header'
  //     }).append(
  //       $('<div/>', {class: 'craft-input', text: 'Input'})
  //     ).append(
  //       $('<div/>', {class: 'craft-output', text: 'Output'})
  //     ).append(
  //       $('<div/>', {class: 'craft-profit', text: 'Profit'})
  //     )
  //   )

  //   let craftList = [];

  //   for (let i in craftItems) {
  //     let noPrice = false;
  //     let inputString = '<div>';

  //     let inputTotal = 0;
  //     for (let j in craftItems[i].input) {
  //       let totalPrice = craftItems[i].input[j].amount * craftItems[i].input[j].price;
  //       inputString += `<div>${craftItems[i].input[j].amount} x ${craftItems[i].input[j].name} <span class="craft-price">(₽${totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</span></div>`
  //       inputTotal += totalPrice

  //       if (craftItems[i].input[j].price == 0) {
  //         noPrice = true;
  //       }
  //     }

  //     inputString += '</div>'

  //     let outputTotal = craftItems[i].output.amount * craftItems[i].output.price;

  //     if (craftItems[i].output.price == 0) {
  //       noPrice = true;
  //     }

  //     let profit = outputTotal - inputTotal;
  //     let profitPerHour = (profit / (craftItems[i].output.duration / 60 / 60))

  //     craftList.push({
  //       input: inputString,
  //       output: `${craftItems[i].output.amount} x ${craftItems[i].output.name} <span class="craft-price">(₽${outputTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</span>`,
  //       profit: noPrice ? 0 : Math.round(profit),
  //       profitPerHour: noPrice ? 0 : Math.round(profitPerHour),
  //     })
  //   }

  //   craftList.sort((a,b) => b.profit - a.profit)

  //   if (craftList.length == 0) {
  //     $('.search-results-container').empty();
  //     $('.search-results-container').append(
  //       $('<div/>', {class: 'no-results', text: 'No crafts available, upgrade your hideout to view crafts or disable "Crafts dependent on hideout" in the settings.'})
  //     )
  //   } else {
  //     for (let i in craftList) {
  //       $('.search-results-container').append(
  //         $('<div/>', {
  //           class: 'craft-row'
  //         }).append(
  //           $('<div/>', {class: 'craft-input', html: craftList[i].input})
  //         ).append(
  //           $('<div/>', {class: 'craft-output', html: craftList[i].output})
  //         ).append(
  //           $('<div/>', {class: 'craft-profit', html: `<div>₽${craftList[i].profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div><div class="craft-profit-hour">(₽${craftList[i].profitPerHour.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/h)</div>`})
  //         )
  //       )
  //     }
  //   }

  //   $('.search-results-container').css('display', 'flex');
  //   $('.search-results-container').html($('.search-results-container').html());
  //   $('.search-results-container').scrollTop(0)
  // });
  // #endregion

  // #region STATIONS
  $(document).on('click', '.hideout-expand-box', (e) => {
    let row = $(e.target).closest('.hideout-row');
    let stationId = row.attr('id').split('-')[1]
    $(`.hideout-station-${stationId}`).toggleClass('hidden');
  });

  // ipcRenderer.on('stationResults', (e, data) => {
  //   $('.search-results-container').css('display', 'none');
  //   $('.search-results-container').empty();

  //   $('.search-results-container').append(
  //     $('<div/>', {
  //       class: 'hideout-header'
  //     }).append(
  //       $('<div/>', {class: 'hideout-name', html: '<div>Station</div><div class="hideout-level-header">Current Level</div>'})
  //     ).append(
  //       $('<div/>', {class: 'hideout-requirements', text: 'Requirements'})
  //     ).append(
  //       $('<div/>', {class: 'hideout-expand'})
  //     )
  //   )

  //   let stations = data[0].stations;
  //   let modules = data[0].modules;
  //   let itemDictionary = data[1];
  //   let progress = data[2];

  //   for (let i in stations) {
  //     $('.search-results-container').append(
  //       $('<div/>', {
  //         class: 'hideout-row',
  //         id: `hideout-${stations[i].id}`
  //       }).append(
  //         $('<div/>', {class: 'hideout-name', html: `<div>${stations[i].locales.en}</div>`})
  //       ).append(
  //         $('<div/>', {class: 'hideout-requirements'})
  //       ).append(
  //         $('<div/>', {class: 'hideout-expand'}).append(
  //           $('<div/>', {class: 'hideout-expand-box'}).append(
  //             $('<svg/>', {xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 320 512", height: '20', width: '20'}).append(
  //               $('<path/>', {fill: "#b9b8bd", d: "M151.5 347.8L3.5 201c-4.7-4.7-4.7-12.3 0-17l19.8-19.8c4.7-4.7 12.3-4.7 17 0L160 282.7l119.7-118.5c4.7-4.7 12.3-4.7 17 0l19.8 19.8c4.7 4.7 4.7 12.3 0 17l-148 146.8c-4.7 4.7-12.3 4.7-17 0z"})
  //             )
  //           )
  //         )
  //       )
  //     )
  //   }

  //   for (let i in modules) {
  //     if (!(modules[i].stationId in moduleLevels)) {
  //       moduleLevels[modules[i].stationId] = {};
  //     }

  //     moduleLevels[modules[i].stationId][modules[i].level] = modules[i].require
  //   }

  //   // Insert module levels
  //   for (let i in modules) {
  //     let level = 0;
  //     let stationId = modules[i].stationId;

  //     if ($(`#hideout-${stationId}`).children().first().children().length == 1) {
  //       $(`#hideout-${stationId}`).children().first().html($(`#hideout-${stationId}`).children().first().html() + `<div class="hideout-level-tag${progress[stationId] == level ? '  hideout-level-active' : ''}">0</div>`);
  //     };

  //     if (level == progress[stationId]) {
  //       if ((level + 1) in moduleLevels[stationId]) {
  //         let requirementsString = getRequirementsString(moduleLevels[stationId][(level + 1)], itemDictionary, traders);
  //         $(`#hideout-${stationId}`).children().eq(1).html(requirementsString);
  //       } else {
  //         $(`#hideout-${stationId}`).children().eq(1).html('<div>Max Level</div>')
  //       }
  //     }

  //     level = modules[i].level

  //     if (level == progress[stationId]) {
  //       if ((level + 1) in moduleLevels[stationId]) {
  //         let requirementsString = getRequirementsString(moduleLevels[stationId][(level + 1)], itemDictionary, traders)

  //         $(`#hideout-${stationId}`).children().eq(1).html(requirementsString)
  //       } else {
  //         $(`#hideout-${stationId}`).children().eq(1).html('<div>Max Level</div>')
  //       }
  //     }
  //   }


  //   modules = modules.reverse();
  //   for (let i in modules) {
  //     let requirements = modules[i].require;
  //     let level = modules[i].level;
  //     let station = modules[i].stationId;

  //     let requirementsString = getRequirementsString(requirements, itemDictionary, traders);

  //     (
  //       $('<div/>', {
  //         class: `hideout-row hideout-station-${station} module-row hidden`,
  //         id: `module-${modules[i].id}`
  //       }).append(
  //         $('<div/>', {class: 'hideout-name', html: `<span class="hideout-dash">–</span>${modules[i].module} Level ${level}`})
  //       ).append(
  //         $('<div/>', {class: 'hideout-requirements', html: requirementsString})
  //       ).append(
  //         $('<div/>', {class: 'hideout-expand'})
  //       )
  //     ).insertAfter(`#hideout-${station}`);
  //   }

  //   $('.search-results-container').css('display', 'flex');
  //   $('.search-results-container').html($('.search-results-container').html());
  //   $('.search-results-container').scrollTop(0)
  // });

  // ipcRenderer.on('stationLevelResults', (e, data) => {
  //   let itemDictionary = data[0]
  //   let level = data[1]
  //   let stationId = data[2]
  //   if ((parseInt(level) + 1) in moduleLevels[stationId]) {
  //     let requirementsString = getRequirementsString(moduleLevels[stationId][parseInt(level) + 1], itemDictionary, traders);

  //     $(`#hideout-${stationId}`).children().eq(1).html(requirementsString)
  //   } else {
  //     $(`#hideout-${stationId}`).children().eq(1).html('<div>Max Level</div>')
  //   }
  // });
  
  function getRequirementsString(requirements, itemDictionary, traders) {
    let requirementItems = [];

    for (let j in requirements) {
      let row = requirements[j];

      if (row.type == 'item') {
        if (row.name in itemDictionary) {
          row.name = itemDictionary[row.name].name
        }
        requirementItems.push(`<div><span class="module-dash">-</span>${row.quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} x ${row.name}</div>`);
      }

      if (row.type == 'skill' || row.type == 'module') {
        requirementItems.push(`<div><span class="module-dash">-</span>Level ${row.quantity} ${row.name}</div>`);
      }

      if (row.type == 'trader') {
        requirementItems.push(`<div><span class="module-dash">-</span>Level ${row.quantity} ${traders[row.name]}</div>`);
      }
    }

    return requirementItems.join('')
  }
  // #endregion

  // #region QUEST-INFO-CONTAINER
  $(document).on('click', '.quest-expand-box', (e) => {
    // ipcRenderer.send('getWiki', $(e.target).closest('.quest-row').data().wiki)
  });

  // ipcRenderer.on('wikiResults', (e, data) => {
  //   $(`[data-wiki="${data[0]}"]`).next().html(data[1])
  //   $(`[data-wiki="${data[0]}"]`).next().toggle()
  // });

  $(document).on('click', '.quest-info-container img', (e) => {
    $(e.target).toggleClass('maximize-img')
  });
  // #endregion

  // #region TYPING TIMER
  let typingTimer; //timer identifier
  let doneTypingInterval = 250; //time in ms, 5 second for example
  let $input = $('.search-input');

  //on keyup, start the countdown
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });

  //on keydown, clear the countdown 
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });

  //user is "finished typing," do something
  function doneTyping() {
    let val = $('.search-input').val();

    if (val.trim() != '') {
      if (activeTab == 'items') {
        



        // ipcRenderer.send('itemSearch', val);
      } else if (activeTab == 'quests') {
        // ipcRenderer.send('questSearch', val);
        $('.active-subtab').removeClass('active-subtab')
      }
      
    } else {
      $('.search-results-container').hide();
    }
  }
  // #endregion
});

// #region FUNCTIONS
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// #endregion