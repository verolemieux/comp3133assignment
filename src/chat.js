$(function() {
    var socket = io.connect('http://localhost:3000')

    var playGame = $("#playGame")
    var leaveGame = $("#leaveGame")
    var message = $("#message")
    var username = $("#username")
    var send_message = $("#send_message")
    var send_username = $("send_username")
    var room = $("#room")

    /** SEND MESSAGE ***/
    send_message.click(function(){
        socket.emit('new_message', { message: message.val() });
    })

    socket.on("new_message", (data) => {
        // console.log(data);
        room.append("<p class='message'><i>" + data.username + "</i>: " + data.message + "</p>");
        message.val("");
    })

    /*** PLAY GAME ***/
    playGame.click(function(){
        io.emit('player_join', { username: "Anonymous"});
    })

    socket.on("player_join", (data) => {
        room.append("<p class='player-action'><i>" + data.username + " has joined the game...</i></p>");
    })

    /*** LEAVE GAME ***/
    leaveGame.click(function(){
        io.emit('player_left', { username: "Anonymous"});
    })
    socket.on("player_left", (data) => {
        room.append("<p class='player-action'><i>" + data.username + " has left the game...</i></p>");
    })

    send_username.click(function(){
        // console.log(username.val())
        socket.emit('change_username', { username: username.val() })
    })    
});