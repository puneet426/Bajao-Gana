// let's select all required tags and element

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");






let musicIndex = 1;

window.addEventListener("load",()=>{
    loadMusic(musicIndex); //calling load music once window
    playingNow();
})

//load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb-1].name;
    musicArtist.innerText = allMusic[indexNumb-1].artist;
    musicImg.src = `images/${allMusic[indexNumb-1].img}.jpeg`;
    mainAudio.src = `songs/${allMusic[indexNumb-1].src}.mp3`;
}
//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}
//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
//next music function
function nextMusic(){
    //here we'll just increase index by 1
    musicIndex++;
    // if music index is greater than array length then music index is 1 so the first song play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//prev music function
function prevMusic(){
    //here we'll just decrease index by 1
    musicIndex--;
    // if music index is less than 1 then music index will we arry length so the last song play
    musicIndex <1 ? musicIndex = allMusic.length :musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// play button event
playPauseBtn.addEventListener("click",()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    // if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
})
nextBtn.addEventListener("click",()=>{
    nextMusic();  // calling next music function
});

prevBtn.addEventListener("click",()=>{
    prevMusic();  // calling next music function
});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate",(e)=>{
  const currentTime = e.target.currentTime; // getting current time of song
  const duration = e.target.duration;// getting total duration of song
  let progressWidth = (currentTime/duration)*100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
  musicDuration = wrapper.querySelector(".duration");
  mainAudio.addEventListener("loadeddata",()=>{
   

    //update song total duration
    let audioDuration = mainAudio.duration;
    let totalMins = Math.floor(audioDuration/60);
    let totalSec = Math.floor(audioDuration%60);
    if(totalSec<10){  // adding 0 if sec is less than 10
        totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMins}:${totalSec}`
});

    //update song Current time
    
    let currentMins = Math.floor(currentTime/60);
    let currentSec = Math.floor(currentTime%60);
    if(currentSec<10){  // adding 0 if sec is less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMins}:${currentSec}`
 
});

//lets update the playing song on according to the progress bar width
 progressArea.addEventListener("click",(e)=>{
    let progressWidthval = progressArea.clientWidth;  // getting the width of progress bar
    let clickedoffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; // getting total duration of song
    mainAudio.currentTime = (clickedoffSetX/progressWidthval)*songDuration;
    playMusic();
    playingNow();
});

// suffle song
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click",()=>{
   // first we get inner text of the icon then we'will change accordingly
   let getText = repeatBtn.innerText; //getting innerText of icon
   // lets do different changes on different icon click using switch
   switch(getText){
    case "repeat": //in this icon is repeat
         repeatBtn.innerText = "repeat_one";
         repeatBtn.setAttribute("title","Song looped");
    break;
    case "repeat_one": //if icon is repeat_one then change into suffle
         repeatBtn.innerText = "shuffle"
         repeatBtn.setAttribute("title","Playback shuffle");
    break;
    case "shuffle": //if icon is shuffle then change into repeat
        repeatBtn.innerText = "repeat"
        repeatBtn.setAttribute("title","Playlist looped");
    break;
   }
});

//above we just change the icon , now lets work on what to do
//after song ended
mainAudio.addEventListener("ended",()=>{
    //we'll do according to the icon means if user has set icon to loop song then we'll repeat
    // the current song and will do further accordingly
    let getText = repeatBtn.innerText; //getting innerText of icon
   // lets do different changes on different icon click using switch
   switch(getText){
    case "repeat": //if this icon is repeat then simply we call the next music so the next song play
         nextMusic();
         playMusic();
         playingNow();
          break;
    case "repeat_one": //if icon is repeat_one then we'll change the current playing song current time to 0 so song will play from beggining 
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
        playingNow();
        break;
    case "shuffle": //if icon is shuffle then change into repeat
    // genrating random index between the max range of array
       let randIndex = Math.floor((Math.random()*allMusic.length) + 1);
       do{
        randIndex = Math.floor((Math.random()*allMusic.length) + 1);
       }while(musicIndex == randIndex);  // this loop run until the next number won't be the same of the current music index
       musicIndex= randIndex;
       loadMusic(musicIndex);//calling 
       playMusic()
        break;
   }
});

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click",()=>{
  showMoreBtn.click();
});
const ulTag = wrapper.querySelector("ul");

for(let i=0; i<allMusic.length; i++){
    let liTag = ` <li li-index="${i+1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
             <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
            <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
        </li>`;
        ulTag.insertAdjacentHTML("beforeend",liTag);
        let liAudioDuaration = ulTag.querySelector(`#${allMusic[i].src}`);
        let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

        liAudioTag.addEventListener("loadeddata",()=>{
            let audioDuration = liAudioTag.duration;
            let totalMins = Math.floor(audioDuration/60);
            let totalSec = Math.floor(audioDuration%60);
            if(totalSec<10){  // adding 0 if sec is less than 10
                totalSec = `0${totalSec}`;
            }
            liAudioDuaration.innerText = `${totalMins}:${totalSec}`
            liAudioDuaration.setAttribute("t-duration", `${totalMins}:${totalSec}` );
        });
       
}

// lets work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for(let j=0; j<allLiTags.length; j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        //if there is an li tag which li-index is equal to musicIndex
        // then this music is playing now and we'll style it
        if(allLiTags[j].getAttribute("li-index")== musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
            
        }
        
        
            // adding click attribute in all li tags
            allLiTags[j].setAttribute("onclick","clicked(this)");
        }
}

//lets play song on li click
function clicked(element){
    // getting li index of parrticular click
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}