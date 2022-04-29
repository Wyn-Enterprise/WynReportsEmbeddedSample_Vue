export default {
    name: 'signin',
    components: {

    },
    props: ['handleSubmitCallbackFunction'],
    data() {
        return {
            serverUrl: "",
            username: "",
            password: "",
            error: ""
        }
    },
    beforeCreate() {

    },
    methods: {
        async onSubmit () {
            var me = this;
            var token = '';
            var re = /\/$/;
            var baseUrl = this.serverUrl.replace(re, "");

            var urlencoded = new URLSearchParams();
            urlencoded.append("grant_type", "password");
            urlencoded.append("username", this.username);
            urlencoded.append("password", this.password);
            urlencoded.append("client_id", "integration");
            urlencoded.append("client_secret", "eunGKas3Pqd6FMwx9eUpdS7xmz");

            const response = await fetch(baseUrl + "/connect/token", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                body: urlencoded // body data type must match "Content-Type" header
            });

            await response.json().then(res => {
                
                token = res.access_token;
                if (token) {                    
                    this.handleSubmitCallbackFunction(me.serverUrl, token, me.username);
                } else {
                    me.error = "Authorization error";
                }
            }).catch(err => {
                me.error = "Authorization error - " + err;
            });
            //const token = await GrapeCity.WynReports.getReferenceToken(this.serverUrl, this.username, this.password);
            //if (token) {
            //    this.handleSubmitCallbackFunction(this.serverUrl, token, this.username);
            //} else {
            //    this.error = "Authorization error";
            //}
            //this.reportsList = await getReportList(this.serverUrl, this.token);            
        }
    }
}