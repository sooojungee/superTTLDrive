setInterval(setTime, 10000);

function setTime(){
  const $time = $('.time-grid');
  const dt = new Date();
  let hour = dt.getHours();
  let minute = dt.getMinutes();
  if(minute >= 0 && minute < 10)
    minute = '0' + minute;
    if(hour >= 0 && hour < 10)
    hour = '0' + hour;
  const time = hour + ":" + minute;
  console.log(time);
  $time.text(time);
}

setTime();

