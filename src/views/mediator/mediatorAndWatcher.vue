<script>
  // 中介者，并且同时是观察者，减轻中介者的逻辑复杂度
  // 并做不下来，几个用例之间依赖交互太多，并不简单，感觉难以实现
  // 只有 back-home 简单一点
  const pageConfig = {
    mixins: [],
    methods: {
      emit(key, ...params) { this.$emit(key, ...params) },
      on(key, fn) { this.$on(key, fn); },
    },
  };

  // 以用例垂直划分边界

  // 家
  pageConfig.mixins.push({
    data() {
      return {
        homePersonList: ['Dan'],
      };
    },
    methods: {
      atHome(person) {
        return this.homePersonList.includes(person);
      },
      backHome(person) {
        this.homePersonList.push(person);
        this.emit('back-home', person, person => this.atHome(person));
      },
      leaveHome(person) {
        this.homePersonList = this.homePersonList.filter(_it => _it !== person);
      },
    },
  });

  // 人物
  pageConfig.mixins.push({
    data() {
      return {
        // 奇
        qiName: 'Qi',
        // 丹
        danName: 'Dan',
      };
    },
    methods: {
      kiss(person1, person2) {
        console.log(person1 + 'kiss' + person2);
      },
    },
    mounted() {
      this.on('back-home', (person, atHome) => {
        if (person === this.qiName && atHome(this.danName)) this.kiss(this.qiName, this.danName);
      });
    },
  });

  // 沙发
  pageConfig.mixins.push({
    data() {
      return {
        sofaPersonList: ['Dan'],
      };
    },
    methods: {
      atSofa(person) {
        return this.sofaPersonList.includes(person);
      },
      _sitSofa(person) {
        this.sofaPersonList.push(person);
      },
    },
  });

  // 电视
  pageConfig.mixins.push({
    data() {
      return {
        tvStatus: 1,
        tvPersonList: ['Dan'],
      };
    },
    methods: {
      atTv(person) {
        return this.tvPersonList.includes(person);
      },
      _openTv(person) {
        if (!this.tvStatus) this.tvStatus = 1;
        this.tvPersonList.push(person);
      },
      leaveTv(person) {
        this.tvPersonList = this.tvPersonList.filter(_it => _it !== person);
        if (this.tvPersonList.length === 0) this.tvStatus = 0;
      },
    },
  });

  // 电脑
  pageConfig.mixins.push({
    data() {
      return {
        pcStatus: 0,
        pcPersonList: [],
      };
    },
    methods: {
      atPc(person) {
        return this.pcPersonList.includes(person);
      },
      _openPc(person) {
        if (!this.pcStatus) this.pcStatus = 1;
        this.pcPersonList.push(person);
      },
      leavePc(person) {
        this.pcPersonList = this.pcPersonList.filter(_it => _it !== person);
        if (this.pcPersonList.length === 0) this.pcStatus = 0;
      },
    },
  });

  export default pageConfig;
</script>
