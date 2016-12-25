var socket = io();

socket.on("nuevaimagen", function(data){
  data = JSON.parse(data);
  console.log(data);
});
