<script>
  // 中介者，协调各个用例的依赖关系，各个用例间并不知情
  const pageConfig = {
    mixins: [],
    methods: {
      backHome(person) {
        this._backHome(person);
        if (person === this.qiName && this.atHome(this.danName)) this.kiss(this.qiName, this.danName);
      },
      kiss(person1, person2) {
        console.log(person1 + 'kiss' + person2);
      },
      sitSofa(person) {
        this._sitSofa(person);
        if (person === this.qiName && this.atSofa(this.danName)) this.kiss(this.danName, this.qiName);
      },
      openTv(person) {
        this._openTv(person);
        if (person === this.qiName && this.atTv(this.danName)) {
          this.leaveTv(this.danName);
        }
        if (!this.atPc(this.qiName)) {
          this.openPc(this.danName);
        } else {
          this.leaveHome(this.danName);
        }
      },
      openPc(person) {
        this._openPc(person);
        if (person === this.qiName && this.atPc(this.danName)) {
          this.leavePc(this.danName);
        }
        if (!this.atTv(this.qiName)) {
          this.openTv(this.danName);
        } else {
          this.leaveHome(this.danName);
        }
      },
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
      _backHome(person) {
        this.homePersonList.push(person);
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
