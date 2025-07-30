<template>
  <div id="app">
    <div class="navbar">
      <img class="logo" src="/logo-mc.png">
      <div class="menu-links">
        <router-link to="/words" exact class="item">📖 Words</router-link>
        <router-link to="/words/new" class="item">➕ New</router-link>
        <router-link to="/test" class="item">🎮 Test</router-link>
        <router-link to="/translate" class="item">🌐 Translate</router-link>
      </div>
    </div>

    <div class="main-content">
      <flash-message class="myFlash"></flash-message>
      <div class="panel">
        
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

* {
  font-family: 'Press Start 2P', cursive;
  box-sizing: border-box;
}

body {
  background-image: url(''); 
  background-size: 64px 64px;
  background-repeat: repeat;
  background-attachment: fixed;
}


.navbar {
  background-color: #222;
  padding: 20px;
  text-align: center;
  border-bottom: 5px solid #444;
}

.logo {
  height: 40px;
  margin-bottom: 10px;
}

.menu-links {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.item {
  color: #BADA55;
  font-size: 12px;
  text-decoration: none;
  border: 2px solid transparent;
  padding: 10px;
}

.item:hover {
  background-color: #333;
  border: 2px solid #BADA55;
}

.main-content {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.panel {
  background-color: #111;
  border: 6px solid #666;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 0 20px black;
  text-align: center;
}

.panel h1 {
  font-size: 20px;
  color: #BADA55;
  background-color: #222;
  border: 4px solid #BADA55;
  padding: 15px 20px;
  margin-bottom: 30px;
  text-shadow: 2px 2px #000;
  box-shadow: 0 0 10px #333;
  display: inline-block;
  border-radius: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
}


.myFlash {
  width: 250px;
  position: absolute;
  top: 20px;
  right: 10px;
  font-size: 10px;
}

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  background-image: url('https://wallpapersok.com/images/hd/4k-minecraft-plethora-of-trees-nycjpsxqlnpplpxy.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

</style>
