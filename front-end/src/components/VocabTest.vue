<template>
  <div class="ui container">
    <!-- Language Selector (Before Start) -->
    <div v-if="!hasStarted" style="margin: 30px 0; display: flex; align-items: center;">
      <label for="language-select" style="color: #BADA55; margin-right: 10px;">Choose language:</label>
      <select id="language-select" v-model="targetLanguage" class="ui dropdown" style="padding: 10px; font-size: 14px;">
        <option value="german">German</option>
        <option value="chinese">Chinese</option>
      </select>
    </div>

    <!-- Start Test Button -->
    <div v-if="!hasStarted" style="text-align: center; margin-top: 20px;">
      <button class="ui green button" @click="startTest" style="font-size: 16px; padding: 14px;">Start Test</button>
    </div>

    <!-- Quiz Section -->
    <div v-if="hasStarted && currentWord.english">
      <p style="color: #BADA55;">Translate English word to {{ targetLanguage.charAt(0).toUpperCase() + targetLanguage.slice(1) }}:</p>
      <div class="ui big label" style="margin-bottom: 10px;">{{ currentWord.english }}</div>
      <p style="color: #BADA55; margin-top: 5px;">Time left: {{ timeLeft }}s</p>

      <div class="ui input" style="margin-top: 10px; width: 100%;">
        <input
          v-model="userInput"
          placeholder="Enter translation..."
          @keyup.enter="checkAnswer"
          :disabled="!canAnswer"
          style="padding: 14px; font-size: 16px; height: 50px; width: 100%;"
        />
      </div>

      <div style="margin-top: 10px;">
        <button class="ui green button" @click="checkAnswer" :disabled="!userInput || !canAnswer">Submit</button>
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

    <div v-else-if="hasStarted && !currentWord.english">
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
  name: 'TestWithLanguageTimer',
  data() {
    return {
      words: [],
      currentWord: {},
      userInput: '',
      score: 0,
      total: 0,
      feedback: '',
      scoreHistory: [],
      targetLanguage: 'german',
      timeLeft: 30,
      timerId: null,
      canAnswer: false,
      hasStarted: false
    };
  },
  async mounted() {
    try {
      this.words = await api.getWords();
      const savedHistory = localStorage.getItem('scoreHistory');
      if (savedHistory) {
        this.scoreHistory = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.error('Failed to fetch words:', error);
    }
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    startTest() {
      this.hasStarted = true;
      this.shuffleAndNext();
    },
    shuffleAndNext() {
      this.userInput = '';
      this.feedback = '';
      this.canAnswer = true;
      const index = Math.floor(Math.random() * this.words.length);
      this.currentWord = this.words[index];
      this.startTimer();
    },
    startTimer() {
      this.clearTimer();
      this.timeLeft = 30;
      this.timerId = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.timeUp();
        }
      }, 1000);
    },
    clearTimer() {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    },
    timeUp() {
      this.canAnswer = false;
      const correct = this.currentWord[this.targetLanguage].trim();
      this.feedback = `❌ Time's up! Correct answer: ${correct}`;
      this.total++;
      this.clearTimer();
    },
    checkAnswer() {
      if (!this.canAnswer) return;
      this.clearTimer();
      const input = this.userInput.trim().toLowerCase();
      const answer = this.currentWord[this.targetLanguage].trim().toLowerCase();
      if (input === answer) {
        this.feedback = '✅ Correct!';
        this.score++;
      } else {
        this.feedback = `❌ Incorrect. Correct answer: ${this.currentWord[this.targetLanguage]}`;
      }
      this.total++;
      this.canAnswer = false;
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

      this.score = 0;
      this.total = 0;
      this.feedback = '';
      this.userInput = '';
      this.hasStarted = false;
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

.ui.input input {
  background-color: #1a1a1a;
  color: #BADA55;
  border: 2px solid #BADA55;
}

button.ui.button {
  margin-top: 15px;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: bold;
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

.ui.green.button {
  background-color: #4CAF50;
  color: white;
}

.ui.blue.button {
  background-color: #2196F3;
  color: white;
}

.ui.red.button {
  background-color: #F44336;
  color: white;
}

.ui.green.message {
  background-color: #2e7d32 !important;
  color: #fff;
}

.ui.red.message {
  background-color: #b71c1c !important;
  color: #fff;
}
</style>
