//腾讯云插件 请填写自己的appid、secretid、secretkey
const appid = ""
const secretid = ""
const secretkey = ""

let plugin = requirePlugin("QCloudAIVoice");
plugin.setQCloudSecret(appid, secretid, secretkey,true);
let manager = plugin.getRecordRecognitionManager();

var _page = ""
// 请在页面onLoad时初始化好下列函数并确保腾讯云账号信息已经设置
manager.onStart((res) => {
        console.log('recorder start', res.msg);
})
manager.onStop((res) => {
        console.log('recorder stop', res.tempFilePath);
        _page.setData({
          tempFilePath: res.tempFilePath
        })
})
manager.onError((res) => {
        console.log('recorder error', res.errMsg);
})
manager.onRecognize((res) => {
        if(res.result || res.resList){
          _page.setData({
            resultText: res.result
          })
            console.log("current result", res.result, res.resList);
        }else if(res.errMsg){
            console.log("recognize error", res.errMsg);
        }
})

Page({
  data: {
    voiceButtonName: '开始(腾讯云)',
    tempFilePath: '',
  },
  tapVoiceButton: function () {
    _page = this
    var start = this.data.voiceButtonName == '开始(腾讯云)';
    this.setData({
      voiceButtonName: start ? '结束识别' : '开始(腾讯云)'
    })
    if (start) {
      this.setData({
        tempFilePath: '',
      })
          manager.start({
            duration:30000,
            engine_model_type: '16k_zh',
            // 以下为非必填参数，可跟据业务自行修改
            // hotword_id = '08003a00000000000000000000000000',
            // filter_dirty = 0,
            // filter_modal = 0,
            // filter_punc = 0,
            // convert_num_mode = 0,
            // needvad = 1
            });
    } else {
          manager.stop();
    }
  },
  playVoice() {
    const innerAudioContext = wx.createInnerAudioContext({
      useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
    })
    innerAudioContext.src = this.data.tempFilePath;

    innerAudioContext.play() // 播放
  },
  toggleVoicePlugin() {
    wx.reLaunch({
      url: '/pages/logs/logs',
    })
  }
})
