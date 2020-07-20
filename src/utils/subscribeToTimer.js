import io from 'socket.io-client';

const socket = io.connect('http://localhost:8000',{
  query: {
    accountId: sessionStorage.getItem("accountId")
  }
});



function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('ui', 1000);
}

export { subscribeToTimer };