// Загрузка плейлиста из localStorage
export function loadPlaylist() {
    const savedPlaylist = localStorage.getItem("playlist");
    if (savedPlaylist) {
      const tracks = JSON.parse(savedPlaylist);
      for (let i = 0; i < tracks.length; i++) {
        const option = document.createElement("option");
        option.value = tracks[i].src;
        option.text = tracks[i].name;
        playlist.appendChild(option);
      }
    } else {
      // Если плейлист не найден, загрузим тестовые файлы из папки "sound"
      const soundFolder = "./audio/";
      const testFiles = [
        { name: "Test Track 1", src: soundFolder + "sample-1.mp3", index: 0 },
        { name: "Test Track 2", src: soundFolder + "sample-2.mp3", index: 1 },
        { name: "Test Track 3", src: soundFolder + "sample-3.mp3", index: 2 },
        { name: "Test Track 4", src: soundFolder + "sample-4.mp3", index: 3 },
        { name: "Test Track 5", src: soundFolder + "sample-5.mp3", index: 4 },
      ];
  
      for (let i = 0; i < testFiles.length; i++) {
        const option = document.createElement("option");
        option.value = testFiles[i].src;
        option.text = testFiles[i].name;
        playlist.appendChild(option);
      }
  
      // Сохранение тестовых файлов в localStorage
      localStorage.setItem("playlist", JSON.stringify(testFiles));
    }
    console.log('savedPlaylist', savedPlaylist)
  }