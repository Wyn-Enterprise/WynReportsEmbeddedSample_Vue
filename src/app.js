import signin from './components/sign-in/sign-in.vue';
import reportslist from './components/reports-list/reports-list.vue';
import { getReportList } from './components/library/library.js';
import reportviewer from './components/report-viewer/report-viewer.vue';
import reportdesigner from './components/report-designer/report-designer.vue';

export default {
    name: 'App',
    components: {
        signin,
        reportslist,
        reportviewer,
        reportdesigner
    },
    data() {
        return {
            selectedReport: "",
            title: "WynReportsEmbeddedSample",
            isViewer: null,
            token: "",
            serverUrl: "",
            username: "",
            reportID: "",
            docTitle: "",
            reportType: "",
            visible: false,
            newReport: false,
            reportsList: [],
            initialized : false
        }
    },
    computed: {
        reportkey() {
            return this.reportType + this.reportID
        }
    },
    mounted() {
        
    },
    methods: {
        selectReport(reportName) {
            this.selectedReport = reportName;
        },
        async handleSubmit(baseUrl, accesstoken, user) {
            const re = /\/$/;
            this.serverUrl = baseUrl.replace(re, "");
            this.token = accesstoken;
            this.username = user;            
            this.reportsList = await getReportList(this.serverUrl, this.token);
        },
        handleLogout() {
            this.token = '';
            this.reportID = '';
            this.docTitle = '';
        },
        reportSelected(reportID, docTitle) {
            this.isViewer = true;
            this.reportType = "";
            this.reportID = reportID;
            this.docTitle = docTitle;
            this.visible = !this.visible;
        },
        createRDLReport() {
            this.initialized = true;
            this.reportType = "CPL";
            this.newReport = true;
            this.reportID = null;
            this.docTitle = '';
            this.isViewer = false;
        },
        createPageReport() {
            this.initialized = true;
            this.reportType = "FPL";
            this.newReport = true;
            this.reportID = null;
            this.docTitle = '';
            this.isViewer = false;
        },
        openReportInDesigner() {
            this.initialized = true;
            this.newReport = false;
            this.isViewer = false;
        },
        toggleVisible() {
            this.visible = !this.visible;
        }
    }
}