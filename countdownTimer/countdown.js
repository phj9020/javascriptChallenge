// ending date
// current date


const newYears = '01 01 2021'; 

countDown();

function countDown(){
    const dayText = document.querySelector("#days")
    const hoursText = document.querySelector("#hours")
    const minText = document.querySelector("#mins")
    const secondsText = document.querySelector("#seconds")

    const newYearsDate = new Date(newYears);
    const currentDate = new Date();

    // timestamp milliseconds to seconds
    const diffSeconds = (newYearsDate-currentDate) / 1000;

    // seconds to days 
    const days = Math.floor(diffSeconds / 3600 / 24);
    const hours = Math.floor(diffSeconds / 3600) % 24; 
    const minutes = Math.floor(diffSeconds / 60) % 60; 
    const seconds = Math.floor(diffSeconds % 60);

    // console.log(days, hours, minutes, seconds)

    dayText.innerHTML = formatTime(days);
    hoursText.innerHTML = formatTime(hours);
    minText.innerHTML = formatTime(minutes);
    secondsText.innerHTML = formatTime(seconds);
}

    // 시간이 0 이하면 시간 앞에 0을 붙이고 아니면 그냥 time을 보여줘라 
    function formatTime(time){
        return time < 10 ? `0${time}` : time;
    }

setInterval(countDown,1000)