import { getReportingInfo } from '../library/library.js';

export default {
    name: 'reportviewer',
    components: {

    },
    props: {
        token: '',
        serverUrl: '',
        docTitle: '',
        reportId: ''
    },
    data() {
        return {
            viewer: null
        }
    },
    async beforeMount() {
        if (this.viewer == null) {
            const info = await getReportingInfo(this.serverUrl, this.token);
            this.addViewerCssLink(this.serverUrl, info.pluginVersion, info.theme);

            let serverUrl = this.serverUrl;
            let token = this.token;
            this.viewer = window.GrapeCity.WynReports.Viewer.create({
                element: 'report-viewer-app',
                portalUrl: serverUrl,
                referenceToken: token,
                locale: info.locale,
                makeTitle: (reportName) => reportName
            });
        }
        if (this.reportId != "")
            await this.viewer.openReport(this.reportId);
    },
    mounted() {
        console.log('mounted');
    },
    async beforeUpdate() {
        console.log('beforeUpdate');
        if (this.viewer == null) {
            const info = await getReportingInfo(this.serverUrl, this.token);
            this.addViewerCssLink(this.serverUrl, info.pluginVersion, info.theme);

            let serverUrl = this.serverUrl;
            let token = this.token;
            this.viewer = window.GrapeCity.WynReports.Viewer.create({
                element: 'report-viewer-app',
                portalUrl: serverUrl,
                referenceToken: token,
                locale: info.locale,
                makeTitle: (reportName) => reportName
            });
        }
        if (this.reportId != "")
            await this.viewer.openReport(this.reportId);
    },
    unmounted() {
        console.log('unmounted');
        this.viewer.destroy();
    },
    methods: {
        created() {
            console.log('created');
        },
        concatUrls(...urls) {
            const skipNullOrEmpty = (value) => !!value;
            const trimLeft = (value, char) => (value.substr(0, 1) === char ? value.substr(1) : value);
            const trimRight = (value, char) => (value.substr(value.length - 1) === char ? value.substr(0, value.length - 1) : value);
            return urls
                .map(x => x && x.trim())
                .filter(skipNullOrEmpty)
                .map((x, i) => (i > 0 ? trimLeft(x, '/') : x))
                .map((x, i, arr) => (i < arr.length - 1 ? trimRight(x, '/') : x))
                .join('/');
        },
        addCssLink(cssUrl) {
            const head = document.getElementsByTagName('head')[0];
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssUrl;
            head.appendChild(link);
        },
        addViewerCssLink(portalUrl, pluginVersion, theme) {
            const themeSuffix = theme !== 'default' ? `.${theme}` : '';
            const viewerCssUrl = this.concatUrls(portalUrl, `api/pluginassets/reports-${pluginVersion}/viewer-app${themeSuffix}.css`);
            this.addCssLink(viewerCssUrl);
        }
    }
}