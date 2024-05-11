const GLOBAL = require('../../GLOBAL_VARS.json');
const utils = require('../../utilities/utilitieFunc');

module.exports ={

createSearchWhatsAppGallery: function(data, userId) {
    var cards = [];
  
    data.forEach((item, index) => {
  
      var card = {
        "card_index": index,
        "components": [
          {
            "type": "HEADER",
            "parameters": [
              {
                "type": "IMAGE",
                "image": {
                  "link": item._source["image_link"]
                }
              }
            ]
          },
          {
            "type": "BODY",
            "parameters": [
              {
                "type": "TEXT",
                "text": item._source["model"] + " | 🖲️ " + item._source["generation"].trim() + " | 💳 ₹" + item._source["price"].toLocaleString(GLOBAL.SEARCH.CURRENCY_LOCAL_DENOMINATION, { style: 'decimal', useGrouping: true, minimumFractionDigits: 0 })
              }
            ]
          },
          {
            "type": "BUTTON",
            "sub_type": "QUICK_REPLY",
            "index": "0",
            "parameters": [
              {
                "type": "PAYLOAD",
                "payload": JSON.stringify({
                  "actions": createCUFActions(
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_id", item._source["id"]],
                    
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_brand_name", item._source["brand_name"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_model", item._source["model"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_Purpose", item._source["purpose"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_processor", item._source["processor"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_RAM", item._source["ram"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_SSD", item._source["ssd"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_HDD", item._source["hdd"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_screen_size", item._source["screen_size"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_graphics_card", item._source["graphics_card"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_OS", item._source["os"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_colour", item._source["colour"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_price", item._source["price"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_guarantee", item._source["guarantee"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_warranty", item._source["warranty"]],
  
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SEND_FLOW, "1715154542581"]
                  )
                })
  
              }
            ]
          },
          {
            "type": "BUTTON",
            "sub_type": "QUICK_REPLY",
            "index": "1",
            "parameters": [
              {
                "type": "PAYLOAD",
                "payload": JSON.stringify({
                  "actions": createCUFActions(
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_id", item._source["id"]],
                    [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SEND_FLOW, "1715154542581"]
                  )
                })
  
              }
            ]
          }
        ]
      };
  
      cards.push(card);

    });
  
    if (cards) {
      return {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": userId,
        "type": "template",
        "template": {
          "name": "reuse_2btn_" + cards.length,
          "language": {
            "code": "en"
          },
          "components": [
            {
              "type": "CAROUSEL",
              "cards": cards
            }]
        }
      };
    } else {
      return {};
    }
  
  }
 


}