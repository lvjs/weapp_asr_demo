function useWxSpeakTranslate() {
  const plugin = requirePlugin("WechatSI")
  return plugin.getRecordRecognitionManager()
}

const wxRecorderBtnName = {
  start: '开始（微信录音插件）',
  error: '录音出错，点击重试',
  doing: '停止',
};

const wxRecorderStatus = {
  done: 'done',
  error: 'error',
  doing: 'doing',
};


Page({
  data: {
    wxRecorder: {
      btnName: wxRecorderBtnName.start,
      status: wxRecorderStatus.done,
      text: '',
      voiceFilePath: '',
    },
  },
  recorder: useWxSpeakTranslate(), // useWxSpeakTranslate(),

  onLoad(query) {
    console.log(query);
    this.recorder.onStop = this.onWxRecorderStop;
    this.recorder.onError = this.onWxRecorderError;
    this.recorder.onRecognize = this.onWxRecorderRecognize;
    this.recorder.onStart = this.onWxRecorderStart;
  },

  tapWxRecorder() {
    const {wxRecorder: {status}} = this.data;
    if (status === wxRecorderStatus.doing) {
      this.recorder.stop();
    } else {
      this.recorder.start({duration: 30 * 1000, lang: "zh_CN"});
    }
  },
  onWxRecorderStart(res) {
    console.log("成功开始录音识别", res)
    this.setData({
      wxRecorder: {
        btnName: wxRecorderBtnName.doing,
        status: wxRecorderStatus.doing,
        voiceFilePath: '',
        text: '',
      }
    })
  },
  onWxRecorderStop(res) {
    console.log("record file path", res.tempFilePath)
    console.log("result", res.result)
    this.setData({
      wxRecorder: {
        btnName: wxRecorderBtnName.start,
        status: wxRecorderStatus.done,
        voiceFilePath: res.tempFilePath,
        text: res.result,
      }
    })
  },
  onWxRecorderRecognize(res) {
    console.log("current result", res.result)
    this.setData({
      [`wxRecorder.text`]: res.result,
    })
  },
  onWxRecorderError(res) {
    console.error("error msg", res.msg)
    this.setData({
      wxRecorder: {
        btnName: wxRecorderBtnName.error,
        status: wxRecorderStatus.error,
        voiceFilePath: '',
        text: res.msg,
      }
    })
  },
  playVoice() {
    const innerAudioContext = wx.createInnerAudioContext({
      useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
    })
    innerAudioContext.src = this.data.wxRecorder.voiceFilePath;

    innerAudioContext.play() // 播放
  },

  toggleVoicePlugin() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})
