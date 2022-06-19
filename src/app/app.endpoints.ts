import { environment } from "../environments/environment";
class Endpoints {

    // Toggle this setting to determine which 
    // API endpoints are used
    private devMode = !environment.production;

    private devEndpoints = 
    {   
        baseEndpoint: ''//'http://localhost:8080'//
    };


    // Define live endpoints
    private liveEndpoints =
    {
        baseEndpoint: ''//https://hapinistay-backend.herokuapp.com
    };


    // Determine which endpoints are returned devMode setting
    private getEndpoints() {
        if (this.devMode === true) {
            return this.devEndpoints;
        }

        return this.liveEndpoints;
    }

    // Return baseEndpoint api
    public baseEndpoint() {
        return this.getEndpoints().baseEndpoint;
    }


}

export default new Endpoints();