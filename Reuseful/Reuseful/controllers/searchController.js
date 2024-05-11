const GLOBAL = require('../GLOBAL_VARS.json');
const queryBuilderUtils = require('../utilities/zincQueryBuilder');
const utilitieFunc = require('../utilities/utilitieFunc');
const createSearchWhatsAppGallery = require('../service/search/searchWhatsappGalleryService');
const searchLaptopService = require('../service/search/searchLaptopService');


exports.searchLaptop = async (req,res) =>{


  var postData =req.body;

  var PAGE_START = Number(postData.start);

  const elasticData = await queryBuilderUtils.getElasticData(PAGE_START, GLOBAL.SEARCH.MAX_PAGE_SIZE, postData.data, GLOBAL.SERVER.ZS_LAPTOP_INDEX);

  const data = elasticData.hits.hits;
  let dataTotalCount = Number(elasticData.hits.total.value);

  let message = await searchLaptopService.dynamicSearchMessage(data, PAGE_START, dataTotalCount);

  let dynamicContent = {
    "messages": message
  };

  res.json(dynamicContent)

}







exports.searchwhatsapp =async (req,res)=>{

  var postData = req.body;

  var PAGE_START = Number(postData.start);

  const elasticData = await queryBuilderUtils. getElasticData(PAGE_START, GLOBAL.SEARCH.MAX_WHATSAPP_PAGE_SIZE, postData.data, GLOBAL.SERVER.ZS_LAPTOP_INDEX);

  const data = elasticData.hits.hits;
  let dataTotalCount = Number(elasticData.hits.total.value);
  const messages = [];
  let actions = [];

  console.log("dataTotalcount:" + dataTotalCount);

  try {
    if (dataTotalCount > 0) {
      const templateData = createSearchWhatsAppGallery(data, postData["user-id"]);

      messages.push(templateData);

      const brandscount = dataTotalCount - (PAGE_START + GLOBAL.SEARCH.MAX_WHATSAPP_PAGE_SIZE);



      actions = await utilitieFunc.createCUFActions(
        [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_whatsapp_msg_status", "accepted"],
        [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_is_nextpage_available", dataTotalCount > (PAGE_START + GLOBAL.SEARCH.MAX_WHATSAPP_PAGE_SIZE)],
        [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_brand_count", brandscount]
      );
    } else {
      actions =await utilitieFunc. createCUFActions(
        [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_whatsapp_msg_status", "no-data-found"],
        [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_is_nextpage_available", false]
      );

    }
  } catch (e) {
    actions = await utilitieFunc.createCUFActions(
      [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_whatsapp_msg_status", "error"],
      [GLOBAL.BOTAMATION_CUF_DATA_PROCESSING.SET_CUF, "reusable_is_nextpage_available", false]
    );
  }

  let dynamicContent = {
    "messages": messages,
    "actions": actions
  };

  res.json(dynamicContent);

};