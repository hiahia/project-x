<script>
    export default {
        data() {
            return {
                // 家
                homeName: 'Tian Mi Xiao Jia',
                homeSize: 100,
                homeAddress: 'GuangDong GuangZhou',
                homeStyle: 'Dan\'s Style',
                // 奇
                qiName: 'Qi',
                qiWeight: 140,
                qiHeight: 175,
                qiAge: 27,
                // 丹
                danName: 'Dan',
                danWeight: 110,
                danHeight: 170,
                danAge: 28,
                // 沙发
                sofaName: 'Ikea',
                sofaWeight: 100,
                sofaSize: 50,
                sofaAge: 2,
                // 电视
                tvBrand: 'LG',
                tvSize: 42,
                tvAge: 0.7,
                tvStatus: 1,
                // 电脑
                pcBrand: 'Apple',
                pcAge: 1,
                pcStatus: 0,
            };
        },
        methods: {
            // 家
            backHome(person) {},
            leaveHome(person) {},
            // Qi
            kissDan() {},
            // Dan
            kissQi() {},
            // 沙发
            sitSoft(person) {},
            moveSoft() {},
            // 电视
            openTv() {},
            closeTv() {},
            // 电脑
            openPc() {},
            closePc() {},
        },
    }
</script>