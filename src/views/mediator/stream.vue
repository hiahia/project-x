<script>
  // 如果世界有流
  export default {
    data() {
      return {
        // 家
        homePersonList: ['Dan'],
        // 奇
        qiName: 'Qi',
        // 丹
        danName: 'Dan',
        // 沙发
        sofaPersonList: ['Dan'],
        // 电视
        tvStatus: 1,
        tvPersonList: ['Dan'],
        // 电脑
        pcStatus: 0,
        pcPersonList: [],
      };
    },
    methods: {
      // 家
      atHome(person) {
        return this.homePersonList.includes(person);
      },
      backHome(person) {
        this.homePersonList.push(person);
      },
      leaveHome(person) {
        this.homePersonList = this.homePersonList.filter(_it => _it !== person);
      },

      // person
      kiss(person1, person2) {
        console.log(person1 + 'kiss' + person2);
      },

      // 沙发
      atSofa(person) {
        return this.sofaPersonList.includes(person);
      },
      sitSofa(person) {
        this.sofaPersonList.push(person);
      },

      // 电视
      atTv(person) {
        return this.tvPersonList.includes(person);
      },
      openTv(person) {
        if (!this.tvStatus) this.tvStatus = 1;
        this.tvPersonList.push(person);
      },
      leaveTv(person) {
        this.tvPersonList = this.tvPersonList.filter(_it => _it !== person);
        if (this.tvPersonList.length === 0) this.tvStatus = 0;
      },

      // 电脑
      atPc(person) {
        return this.pcPersonList.includes(person);
      },
      openPc(person) {
        if (!this.pcStatus) this.pcStatus = 1;
        this.pcPersonList.push(person);
      },
      leavePc(person) {
        this.pcPersonList = this.pcPersonList.filter(_it => _it !== person);
        if (this.pcPersonList.length === 0) this.pcStatus = 0;
      },
    },
    mounted() {
      // 家
      this.$watch('homePersonList', (newValue, oldValue) => {
        if (oldValue.includes(this.qiName)) return;
        if (newValue.includes(this.qiName) && newValue.includes(this.danName)) {
          this.kiss(this.qiName, this.danName);
        }
      });
      // 沙发
      this.$watch('sofaPersonList', (newValue, oldValue) => {
        if (!oldValue.includes(this.qiName)) return;
        if (newValue.includes(this.qiName) && newValue.includes(this.danName)) {
          this.kiss(this.danName, this.qiName);
        }
      });
      // 电视
      this.$watch('tvPersonList', (newValue, oldValue) => {
        if (!oldValue.includes(this.qiName) && newValue.includes(this.qiName) && newValue.includes(this.danName)) {
          this.leaveTv(this.danName);
        }
        if (newValue.includes(this.qiName) && this.atPc(this.qiName)) {
          this.leaveHome(this.danName);
        }
        if (newValue.includes(this.qiName) && !this.atPc(this.qiName)) {
          this.openPc(this.danName);
        }
      });
      // 电脑
      this.$watch('tvPersonList', (newValue, oldValue) => {
        if (!oldValue.includes(this.qiName) && newValue.includes(this.qiName) && newValue.includes(this.danName)) {
          this.leavePc(this.danName);
        }
        if (newValue.includes(this.qiName) && this.atTv(this.qiName)) {
          this.leaveHome(this.danName);
        }
        if (newValue.includes(this.qiName) && !this.atTv(this.qiName)) {
          this.openTv(this.danName);
        }
      });
    },
  }
</script>
