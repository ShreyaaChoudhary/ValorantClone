const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
//getting username and room from url usign qs lib  (destructuring)
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix: true}); //adding 2nd parameter to eliminate symbols / special
//character from url
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');
const socket = io();

//join servers(addibng event and sending objects) -> NOW GOTTA CATCH THIS SHIT ON SERVERSIDE
socket.emit('joinRoom',{username,room});
//get room and users
socket.on('roomUsers',({room,users})=>{
    //output this stuff, dom operations
    outputRoomName(room);
    outputUsers(users);
});
//message from server
//this catches the msg when logging and setting to output message(line/20)->when then puts that into dom
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    //auto scroll down to new msg
    chatMessages.scrollTop=chatMessages.scrollHeight;
})
//and when a user joins/leaves it gets emitted as message -> server.js line 50, so all of these are getting caught right here in this sec

//message submittion <3
chatForm.addEventListener('submit',(e)=>{
    //since on submittion it automatically sibmits to a file so to prevent that from happening
    e.preventDefault();
    //take input yk the alt? go for dom but thsi way is clean af
    const msg=e.target.elements.msg.value; //target gives us the current element
    //emit msg to server (send this msg as payload to be exact)
    socket.emit('chatMessage',msg); //catch this msg now go go gog go go
    //clear input for next on focus
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});
//output msg to dom
function outputMessage(message){
    //dom manipulation 
    const div=document.createElement('div'); //div from line 31 to 37, wewant to have a wrapper of all classes
    //classList finna give us the list of all the class but we want the class of msg
    div.classList.add('message');
    //dont have time access
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
    ${message.text} 
    </p>`; //since message is no longer a string, its an object
    //whenever a new msg generated, its gonna add a new division to this chat message
    document.querySelector('.chat-messages').appendChild(div);
}
//add room name to dom
function outputRoomName(room){
    roomName.innerText=room;
}
//add users to dom
function outputUsers(users){ //strign template we are gonna map through array for each user
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}