export default {
    name: 'reportslist',
    components: {

    },
    props: {
        token: '',
        serverUrl: '',
        reportsList: []
    },
    data() {
        return {
            selectedReport: '',
            reportID: "",
            rptIconSrc: "./assets/report.svg"
        }
    },
    emits: ['reportSelectedCallbackFn'],
    methods: {
        onClick(rpt) {
            this.$emit('reportSelectedCallbackFn', rpt.id, rpt.name);
        },
        getIconSrc() {
            return this.rptIconSrc;
        }
    }
}