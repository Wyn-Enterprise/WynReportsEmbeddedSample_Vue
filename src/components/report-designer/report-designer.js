import { getReportingInfo } from '../library/library.js';

export default {
    name: 'reportviewer',
    components: {

    },
    props: {
        token: '',
        serverUrl: '',
        docTitle: '',
        reportId: '',
        reportType: '',
        newReport: false,
        reportsList: [],
        isViewer: null,
        isInitialized: false
    },
    data() {
        return {
            viewer: null,
            initializeDesigner: false
        }
    },
    async beforeMount() {
        if (this.isInitialized) {
            this.initializeDesigner = true;
        }
        this.openDesigner();
    },
    mounted() {

    },
    unmounted() {
        window.GrapeCity.WynReports.Designer.destroy();
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
        addDesignerAndViewerCssLinks(portalUrl, pluginVersion, theme) {
            const themeSuffix = theme !== 'default' ? `.${theme}` : '';
            const viewerCssUrl = this.concatUrls(portalUrl, `api/pluginassets/reports-${pluginVersion}/viewer-app${themeSuffix}.css`);
            const designerCssUrl = this.concatUrls(portalUrl, `api/pluginassets/reports-${pluginVersion}/designer-app${themeSuffix}.css`);

            this.addCssLink(viewerCssUrl);
            this.addCssLink(designerCssUrl);
        },
        sortReports() {
            this.reportsList = this.reportsList.sort((x, y) => x.name.localeCompare(y.name));
        },
        onSavedReport(report) {
            let index = this.reportsList.findIndex(x => report.id === x.id || report.name === x.name);
            if (index === -1) {
                this.reportsList.push(report);
                this.sortReports();
            }
        },
        async openDesigner() {
            if (this.initializeDesigner) {
                let me = this;
                const info = await getReportingInfo(this.serverUrl, this.token);
                this.addDesignerAndViewerCssLinks(this.serverUrl, info.pluginVersion, info.theme);

                const designerOptions = window.GrapeCity.WynReports.Designer.createDesignerOptions(this.serverUrl, this.token);
                designerOptions.locale = info.locale;
                designerOptions.onSaved = this.onSavedReport;

                designerOptions.makeTitle = (reportName, options) => {
                    const title = `${reportName}${options.dirty ? ' *' : ''}`;
                    return title;
                };

                let viewer;
                designerOptions.openViewer = (options) => {
                    if (!viewer) {
                        viewer = window.GrapeCity.WynReports.Viewer.create({
                            element: options.element,
                            portalUrl: me.serverUrl,
                            referenceToken: me.token,
                            locale: options.locale,
                        });
                    }
                    viewer.openReport(options.reportInfo.id);
                };

                await window.GrapeCity.WynReports.Designer.renderApplication('report-designer-app', designerOptions);
            }

            if (this.newReport == true) {
                window.GrapeCity.WynReports.Designer.closeViewer();
                window.GrapeCity.WynReports.Designer.api.createReport({
                    reportType: (this.reportType || '').toUpperCase() === 'FPL' ? 'FPL' : 'CPL',
                });
            }
            else {
                window.GrapeCity.WynReports.Designer.closeViewer();
                const reportInfo = {
                    id: this.reportId,
                    name: this.docTitle,
                    permissions: ['all'],
                };
                window.GrapeCity.WynReports.Designer.api.openReport({ reportInfo });
            }
        }
    }
}