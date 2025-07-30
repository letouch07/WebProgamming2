<template>
  <div class="translate-page">
    <h1>🌐 Translate</h1>

    <textarea
      v-model="text"
      placeholder="Input text to translate"
      rows="4"
    ></textarea>
     <p>Choost language to translate</p>
    <select v-model="target">
      <option value="en">English</option>
      <option value="de">German</option>
      <option value="zh-CN">Chinese (Simplified)</option>
      <option value="vi">Vietnamese</option>
      
    </select>

    <button class="ui primary button" @click="doTranslate" :disabled="!text">
      Submit
    </button>

    <div v-if="translation" class="result">
      <h3>Kết quả:</h3>
      <p>{{ translation }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Translate',
  data() {
    return {
      text: '',
      target: 'vi',
      translation: ''
    };
  },
  methods: {
    async doTranslate() {
      try {
        const res = await axios.post('http://localhost:3000/translate', {
          text: this.text,
          target: this.target
        });
        this.translation = res.data.translation;
      } catch (err) {
        console.error(err);
        alert('Dịch thất bại');
      }
    }
  }
};
</script>

<style scoped>
.translate-page {
  max-width: 600px;
  margin: 2rem auto;
  font-family: 'Press Start 2P', cursive;
  color: #BADA55;
}
textarea {
  width: 100%;
  background: #1a1a1a;
  color: #BADA55;
  border: 2px solid #BADA55;
  padding: 10px;
  font-family: inherit;
  margin-bottom: 1rem;
}
select {
  width: 100%;
  background: #1a1a1a;
  color: #BADA55;
  border: 2px solid #BADA55;
  padding: 10px;
  font-family: inherit;
  margin-bottom: 1rem;
}
button.ui.button {
  background: #4CAF50 !important;
  color: #fff !important;
  font-family: inherit;
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.result {
  background: #2a2a2a;
  padding: 1rem;
  border: 2px solid #BADA55;
  border-radius: 8px;
}
</style>
