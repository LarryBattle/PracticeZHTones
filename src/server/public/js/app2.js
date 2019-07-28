// Date created: July 28, 2019
// Vue 2.3 Cheatsheet: https://www.vuemastery.com/pdf/Vue-Essentials-Cheat-Sheet.pdf

const chinese_data = {
    chinese : "这是一支笔",
    pinyin : "Zhè shì yī zhī bǐ",
    meaning_en: "This is a pen"
};

const translateService = {
    recordUserVoice : function(){
        console.log("Start recording...");
        return new Promise(function(resolve, reject){
            window.setTimeout(function(){
                resolve("Disabled for now");
            }, 7 * 1000);
        });
    }
};

Vue.component("app-chinese-card-quiz", {
    props : {
        quiz: Object
    },
    template: "#app-chinese-card-quiz-template",
    data : function(){
        return {
            isRecording: false,
            recordingTimerMap: {},
            recordingSecLeft: -1,
            ALLOWED_RECORDING_SEC : 7,
            latestTimerIndex : -1
        };
    },
    computed: {
        recordingPercLeft: function(){
            return this.recordingSecLeft / this.ALLOWED_RECORDING_SEC;  
        },
        recordingLeftWidthStyle: function(){
            const x = this.recordingSecLeft / this.ALLOWED_RECORDING_SEC;
            const perc = (100 * x).toFixed(0);
            return `width: ${perc}%`;
        }
    },
    methods : {
        clearRecordingTimerAtIndex: function(i){
            const cancelTimerFn = this.recordingTimerMap[i];

            if( cancelTimerFn ){
                console.debug(`-> Cleared timer with key: %s`, i);
                cancelTimerFn();
            }
        },
        resetRecordingTimers : function(){
            this.latestTimerIndex = -1;
            this.recordingSecLeft = this.ALLOWED_RECORDING_SEC;

            Object.keys(this.recordingTimerMap).forEach((key) => {
                this.clearRecordingTimerAtIndex(key);
                delete this.recordingTimerMap[key];
            });
        },
        startRecordingTimer: function(){
            this.resetRecordingTimers();
 
            let timerIndex = window.setInterval(() => {
                this.recordingSecLeft -= 1;
            }, 1000);
            this.latestTimerIndex = timerIndex;

            this.recordingTimerMap[timerIndex] = () => {
                window.clearInterval(timerIndex);
            };

            window.setTimeout(() => {
                this.clearRecordingTimerAtIndex( timerIndex );
            }, this.ALLOWED_RECORDING_SEC * 1000);

            return timerIndex;
        },
        recordUserVoice: function(){
            this.isRecording = true;
            const recordingTimerIndex = this.startRecordingTimer();

            console.log("you're recording stuff");
            console.log("Timer Index: ", recordingTimerIndex);

            translateService.recordUserVoice().then((translation) => {
                console.log("The service finished recording.");
                this.showTranslatedUserVoice(translation, recordingTimerIndex);
            }).catch((e) => {
                console.log("Service got an exception", e);
                this.clearRecordingTimerAtIndex( recordingTimerIndex );
            });
        },
        showTranslatedUserVoice : function(translation, recordingTimerIndex){
            console.log( "this.latestTimerIndex (%s) != recordingTimerIndex (%s) = %s", this.latestTimerIndex, recordingTimerIndex, this.latestTimerIndex != recordingTimerIndex);
            if(this.latestTimerIndex != recordingTimerIndex){
                this.clearRecordingTimerAtIndex(recordingTimerIndex);
                return;
            }
            this.resetRecordingTimers();
            this.isRecording = false;
            console.log("Showing translation");
        },
        stopRecordingUserVoice: function(){
            this.resetRecordingTimers();
            this.isRecording = false;
            console.log("stopped recording user's voice");
        }
    }
});

var app = new Vue({
  el: '#app',
  data: {
    chineseQuiz : chinese_data
  }
});
