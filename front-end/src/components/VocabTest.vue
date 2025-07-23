<template>
  <div class="ui container">

    <div v-if="currentWord.english">
      <p style="color: #BADA55;">Translate English word to:</p>
      <div class="ui big label">{{ currentWord.english }}</div>

      <div class="ui input" style="margin-top: 10px; width: 100%;">
  <input
    v-model="userInput"
    placeholder="Enter German or Chinese..."
    @keyup.enter="checkAnswer"
    style="padding: 14px; font-size: 16px; height: 50px; width: 100%;"
  />
</div>


      <div style="margin-top: 10px;">
        <button class="ui green button" @click="checkAnswer" :disabled="!userInput">Submit</button>
        <button class="ui blue button" v-if="feedback" @click="nextWord">Next</button>
      </div>

      <div v-if="feedback" style="margin-top: 10px;">
        <p :class="feedback.includes('Correct') ? 'ui green message' : 'ui red message'">
          {{ feedback }}
        </p>
      </div>

      <p style="margin-top: 10px; color: #BADA55;">Score: {{ score }} / {{ total }}</p>
      <button class="ui red button" v-if="total > 0" @click="endTest">End Test & Save</button>
    </div>

    <div v-else>
      <p>Loading words...</p>
    </div>

    <!-- Score History Section -->
    <div style="margin-top: 30px;" v-if="scoreHistory.length">
      <h3 style="color: #BADA55;">📊 Score History </h3>
      <table class="ui celled table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Score</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, i) in scoreHistory" :key="i">
            <td>{{ record.date }}</td>
            <td>{{ record.score }}</td>
            <td>{{ record.total }}</td>
          </tr>
        </tbody>
      </table>
      <button class="ui orange button" @click="clearHistory">Clear History</button>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers';

export default {
  name: 'test',
  data() {
    return {
      words: [],
      currentWord: {},
      userInput: '',
      score: 0,
      total: 0,
      feedback: '',
      scoreHistory: []
    };
  },
  async mounted() {
    try {
      this.words = await api.getWords();
      this.shuffleAndNext();

      const savedHistory = localStorage.getItem('scoreHistory');
      if (savedHistory) {
        this.scoreHistory = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.error('Failed to fetch words:', error);
    }
  },
  methods: {
    shuffleAndNext() {
      this.userInput = '';
      this.feedback = '';
      const index = Math.floor(Math.random() * this.words.length);
      this.currentWord = this.words[index];
    },
    checkAnswer() {
      const input = this.userInput.trim().toLowerCase();
      const german = this.currentWord.german.trim().toLowerCase();
      const chinese = this.currentWord.chinese.trim().toLowerCase();

      if (input === german || input === chinese) {
        this.feedback = '✅ Correct!';
        this.score++;
      } else {
        this.feedback = `❌ Incorrect. Correct answers: ${german} / ${chinese}`;
      }

      this.total++;
    },
    nextWord() {
      this.shuffleAndNext();
    },
    endTest() {
      const record = {
        score: this.score,
        total: this.total,
        date: new Date().toLocaleString()
      };
      this.scoreHistory.unshift(record);
      localStorage.setItem('scoreHistory', JSON.stringify(this.scoreHistory));

      // Reset test
      this.score = 0;
      this.total = 0;
      this.feedback = '';
      this.userInput = '';
      this.shuffleAndNext();
      alert('Test session saved!');
    },
    clearHistory() {
      const confirmed = window.confirm('Are you sure you want to clear all score history?');
      if (!confirmed) return;

      this.scoreHistory = [];
      localStorage.removeItem('scoreHistory');
    }
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

* {
  font-family: 'Press Start 2P', cursive;
  box-sizing: border-box;
}

h2 {
  color: #BADA55;
  background-color: #2a2a2a;
  border: 3px solid #BADA55;
  padding: 10px;
  font-size: 12px;
  text-align: center;
  margin-bottom: 20px;
  border-radius: 10px;
  text-shadow: 1px 1px #000;
}

.ui.labeled.input .ui.label {
  background-color: #333 !important;
  color: #BADA55 !important;
  border: 2px solid #BADA55 !important;
}

.ui.input input {
  background-color: #1a1a1a;
  color: #BADA55;
  border: 2px solid #BADA55;
  padding: 10px;
  font-size: 10px;
  width: 100%;
}

button.ui.button {
  margin-top: 15px;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: bold;
  font-family: 'Press Start 2P', cursive;
}

button.positive.ui.button {
  background-color: #4CAF50;
  color: white;
  border: 2px solid #2d862d;
}

button.positive.ui.button:hover {
  background-color: #45a049;
}

button.ui.orange.button {
  background-color: #FF9800;
  color: white;
  border: 2px solid #e65100;
}

.results {
  margin: 25px auto;
  padding: 15px;
  border-radius: 5px;
  font-size: 10px;
  color: #fff;
}

.error {
  border: 2px solid #d32f2f;
  background-color: #b71c1c;
  color: #fff;
}

.success {
  border: 2px solid #2e7d32;
  background-color: #1b5e20;
  color: #fff;
}

.ui.input input {
  background-color: #1a1a1a;
  color: #BADA55;
  border: 2px solid #BADA55;
  padding: 10px;
  font-size: 10px;
  width: 100%;
}



</style>
