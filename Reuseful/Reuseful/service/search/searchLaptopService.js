const GLOBAL = require('../../GLOBAL_VARS.json');
const utils = require('../../utilities/utilitieFunc');

module.exports = {
    dynamicSearchMessage: function (data, start, dataTotalCount) {

      var messages = [];
      var end = (dataTotalCount - start > GLOBAL.SEARCH.MAX_MESSENGER_PAGE_SIZE) ? start + GLOBAL.SEARCH.MAX_MESSENGER_PAGE_SIZE : start + (dataTotalCount - start);



  if (dataTotalCount > 0) {
    messages.push({
      "message": {
        "text": "We've curated a collection of laptops from"+(start + 1) + "-" + end + " of " + dataTotalCount + "top-notch brands for you. Check them out below!👇"
      }
    });

    //Create properties card
    messages.push({
      "message": {
        "attachment": {
          "payload": {
            "elements": createSearchGallery(data, start, dataTotalCount),
            "template_type": "generic"
          },
          "type": "template"
        }
      }
    });
  } else {
    messages.push({
      "message": {
        "text": "Sorry! Nothing found. Please refine your search."
      }
    });
  }


  return messages;
    }
};

// Define the createSearchGallery function

function createSearchGallery(data, start, dataTotalCount) {
  var cards = [];

  data.forEach((item) => {
    var buttons = [];

    buttons.push({
      "title": "Details 📝",
      "type": "postback",
      "payload": JSON.stringify({
        "actions": createCUFActions(
          [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_id", item._source["id"]],
          [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SEND_FLOW, "1715154542581"]
        )
      })
    });

    buttons.push({
      "title": "Like ❤️",
      "type": "postback",
      "payload": JSON.stringify({
        "actions": createCUFActions(
          [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_id", item._source["id"]],
          [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SEND_FLOW, "1715152291331"]
        )
      })
    });

   

    var card = {
      "title": "💻" +  item._source["brand_name"].trim() + " " +  item._source["model"].trim(),
      "subtitle": "📥RAM: " +  item._source["ram"].trim() + "\n 🖲️Processor: " +  item._source["processor"].trim() + "\n💸Price: " +  item._source["price"],
        "image_url": item._source["image_link"],
      "buttons": buttons
    };

    cards.push(card);
  });

  // Last card as pagination
  if (dataTotalCount > (start + GLOBAL.SEARCH.MAX_PAGE_SIZE)) {
    var card = {
      "title": "Tap for more👇",
      "image_url": GLOBAL.FLOW.NEXT_PAGE_CARDS.IMAGE,
      "buttons": [{
        "title": GLOBAL.FLOW.NEXT_PAGE_CARDS.TEXT,
        "type": "postback",
        "payload": JSON.stringify({
          "actions": [
            {
              "action": "set_field_value",
              "field_name": "card_search_index",
              "value": start + GLOBAL.SEARCH.MAX_PAGE_SIZE
            }, {
              "action": "send_flow",
              "flow_id": GLOBAL.FLOW.NEXT_PAGE_CARDS.FLOW_ID // add to cart flow
            }
          ]
        })
      }]
    };

    cards.push(card);
  }

  return cards;
}
