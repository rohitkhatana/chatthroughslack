$("#send").click(function(){
  var params = "sender=" + $(this).data("sender") + "&channelId=" + $(this).data("channel") + "&msg=" + $("#msg").val() + "&receiver=" + $(this).data("receiver");
  io.socket.get("/msg/send?" + params, function(body, respons){
    console.log(body);
    appendSentMsg(this)
  })
});

function appendSentMsg() {
  var source   = $("#send-template").html();
  var template = Handlebars.compile(source);
  var html = template({msg:  $("#msg").val(), sender: $("#send").data('sender-name')})
  $(".chat").append(html);
  $("#msg").val("");
}
