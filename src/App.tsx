// @ts-nocheck
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const audioId = document.getElementById('audioId');
  const [mp3List, setMp3List] = useState([]);
  const [mp3, setMp3] = useState({});
  const [play, setPlay] = useState('');
  const [time, setTime] = useState(0);

  useEffect(() => {
   mp3List.length < 1 && loadMp3List();
  }, []);


  const toLinkedList = (data) => {
    data.reduce((current, next) => {
      if (current) {
        current.next = next;
        next.prev = current;
      }
    });
    data[0].prev = data[data.length - 1];
    data[data.length - 1].next = data[0];
  };

  const loadMp3List = () => {
    fetch('db.json').then((response) => {
      return response.json();
    }).then((data) => {
      toLinkedList(data);
      setMp3List(data);
      setMp3(data[0]);
    }).catch(error => { console.log(error)});
  };

  const playMusic = (newMp3?: any) => {
    if (!newMp3 && typeof play === 'string') {
      setMp3(mp3List[0]);
    } else {
      setMp3(newMp3);
    }
    audioId.pause();
    setTimeout(() => {
      audioId.play();
      setPlay(true);
    }, 0);
  };

  const pauseMusic = () => {
    audioId.pause();
    setPlay(false);
  }

  const prevMusic = () => {
    playMusic(mp3.prev);
  };

  const nextMusic = () => {
    playMusic(mp3.next);
  };

  const conversion = (value) => {
    let minute = Math.floor(value / 60);
    minute = minute.toString().length === 1 ? ('0' + minute) : minute;
    let second = Math.round(value % 60);
    second = second.toString().length === 1 ? ('0' + second) : second;
    return `${minute || '00'}:${second || '00'}`;
  }

  if (audioId) {
    audioId.onended = () => { nextMusic() };
    document.querySelector('.download-bar')?.addEventListener('click', function (event) {
      let coordStart = this.getBoundingClientRect().left;
      let coordEnd = event.pageX;
      let p = (coordEnd - coordStart) / this.offsetWidth;
      setTime(p.toFixed(3) * 100 + '%');
  
      audioId.currentTime = p * audioId.duration;
      audioId.play();
    })
    audioId.addEventListener('timeupdate', (event) => {
      const newTime = audioId.currentTime / audioId.duration.toFixed(3) * 100 + '%';
      setTime(newTime);
    });  
  }
  
  return (
    <section className="music-player">
      <audio id="audioId" src={mp3.url} className="audio-class"></audio>
      <div className="controls">
        <a href="#" className="prev mode-bg" title="上一曲" onClick={() => prevMusic()}></a>
        { !play ?
          <a href="#" className="play mode-bg" title="播放" onClick={() => playMusic()}></a>
        :
          <a href="#" className="pause mode-bg" title="暂停" onClick={() => pauseMusic()}></a>
        }
        <a href="#" className="next mode-bg" title="下一曲" onClick={() => { nextMusic()}}></a>
      </div>
      {
        play ? 
        <>
          <div className="info">
            <div className="tracks bg">
              <div className="download-bar bg" style={{ width: '100%'}}>
                <div className="l bg">l</div>
                <div className="r bg">r</div>
              </div>
              <div className="seek-bar bg" style={{ width: audioId ? time : '0%'}}>
                <div className="l bg"></div>
                <div className="r bg"></div>
                <div className="point bg"></div>
              </div>
            </div>
          </div>
          <span>{ audioId && conversion(audioId.duration) }</span>
          </>
           : ''
      }
      <br/>
      <ul className="song-list">
        {
        mp3List.map((item, index) => {
          return <li key={index} className={mp3.url === item.url ? 'song-item current' : 'song-item'} onClick={() => playMusic(item)}>{index}.{item.name}</li>
        }
        )}
      </ul>
    </section>
  )
}

export default App
