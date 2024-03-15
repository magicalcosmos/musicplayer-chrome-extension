import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const audioId = document.getElementById('audioId');
  const [mp3List, setMp3List] = useState([]);
  const [mp3, setMp3] = useState({});
  const [play, setPlay] = useState(false);

  useEffect(() => {
   loadMp3List();
  }, [mp3List]);

  useEffect(() => {
    Object.keys(mp3).length && playMusic();
   }, [mp3]);

  const toLinkedList = (data) => {
    data.reduce((current, next) => {
      current.next = next;
      next.prev = current;
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
    }).catch(error => { console.log(error)});
  };

  const playMusic = (mp3?: any) => {
    mp3 && setMp3(mp3);
    audioId?.play()
    setPlay(true);
  };

  const pauseMusic = () => {
    audioId?.pause(); 
    setPlay(false);
  }

  const prevMusic = () => {
    playMusic(mp3.prev);
  };

  const nextMusic = () => {
    playMusic(mp3.next);
  };
  
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
      <ul className="song-list">
        {
        mp3List.map((item, index) => {
          return <li key={index} className="song-item" onClick={() => playMusic(item)}>{item.name}</li>
        }
        )}
      </ul>
    </section>
  )
}

export default App
