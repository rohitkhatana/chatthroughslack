
function appendSentMsg() {
  generateAndAppendHTML({msg:  $("#msg").val(), sender: $("#send").data('sender-name'), class: "left"})
  $("#msg").val("");
}

function generateAndAppendHTML(data) {
  var source   = $("#send-template").html();
  var template = Handlebars.compile(source);
  var html = template(data)
  $(".chat").append(html);
}

function appendReceivedMsg(msg) {
  generateAndAppendHTML({msg:  msg.msg, sender: $("#send").data('receiver-name'), class: "right"});
}

function initChat(currentUser) {
  io.socket.get('/msg/subscribe', function(res){console.log(res)});

  io.socket.on('message', function onServerSentEvent (msg) {
    if(msg.data.channel == $("#send").data('channel') && currentUser.id != msg.data.sender) {
      appendReceivedMsg(msg.data)
    }
  });

  $("#send").click(function(){
    var params = "sender=" + $(this).data("sender") + "&channelId=" + $(this).data("channel") + "&msg=" + $("#msg").val() + "&receiver=" + $(this).data("receiver");
    io.socket.get("/msg/send?" + params, function(body, respons){
      appendSentMsg(this)
    })
  });
}
