
function appendSentMsg() {
  generateAndAppendHTML({msg:  $("#msg").val(), sender: $("#send").data('sender-name'), class: "left"})
  $("#msg").val("");
  $(".panel-body").animate({scrollTop: 100000})
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

function sendMsg(btn) {
  var params = "sender=" + btn.data("sender") + "&channelId=" + btn.data("channel") + "&msg=" + $("#msg").val() + "&receiver=" + btn.data("receiver");
  io.socket.get("/msg/send?" + params, function(body, respons){
    appendSentMsg(this)
  })
}

function initChat(currentUser) {
  io.socket.get('/msg/subscribe', function(res){console.log(res)});

  io.socket.on('message', function onServerSentEvent (msg) {
    if(msg.data.channel == $("#send").data('channel') && currentUser.id != msg.data.sender) {
      appendReceivedMsg(msg.data)
    }
  });

  $("#send").click(function(){
    sendMsg($("#send"))
  });

  $(document).keypress(function(e) {
    if(e.which == 13) {
      sendMsg($("#send"))
    }
});
}
