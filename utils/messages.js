const moment=require('moment');
function formatMessage(username,text){
    return{
        username,
        text,
        time:moment().format('h:mm: a')
    }
}
//TIMEEEEE TO EXPORT THE MODULE
module.exports=formatMessage;