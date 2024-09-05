//can connect to database but keeping everything in memory here
const users=[];
//JOINS USER TO CHAT
//this function basically gonna add a user into the array and return it
function userJoin(id,username,room){
    //create a user with the stuff passed in
    const user={id,username,room};
    //now add/push onto array
    users.push(user);
    //finna return that user now
    return user;
}
//another function to get the current user 
function getCurrentUser(id){
    return users.find(user=>user.id===id);

}
//USER LEAVES THE CHAT 
function userLeave(id){
    const index = users.findIndex(user=>user.id===id); //find the index where user.id is equal to the id passed in the array 
    if(index!==-1){
        return users.splice(index,1)[0]; //returning the user
    }
}
//get room users
function getRoomUsers(room){
    return users.filter(user=>user.room===room);//for each user we want to return only if user.room is equal to the room passed
}
//now export the module
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};