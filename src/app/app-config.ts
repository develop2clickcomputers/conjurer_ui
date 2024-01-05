import { NgModule, InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';

/** creating injection token for K2_APP_CONFIG */
export let K2_APP_CONFIG = new InjectionToken<AppConfig>('app.config');

/** App Config class */
export class AppConfig {
  apiAuthEndPoint: string;
  apiEndpoint: string;
  everestApiUrl: string;
  authkey: string;
}

/** App url variable */
let APP_MAIN_URL: any;

if (environment.production) { /** For production */
  APP_MAIN_URL = {
    //apiMainUrl: 'http://conjurer.us-east-2.elasticbeanstalk.com/',  // redirecting to k2 service using server(k2 service - 13.126.213.79)
    //SSOUrl: 'http://authengine.us-east-2.elasticbeanstalk.com/',
    //everestUrl: 'http://auctor.us-east-2.elasticbeanstalk.com/',
    //everestUrl: 'http://localhost:12014/',
    //apiMainUrl: 'http://localhost:8080/',
    //SSOUrl: 'http://localhost:12012/',

    //apiMainUrl:'http://conjurer.us-east-2.elasticbeanstalk.com/',
    //SSOUrl: 'http://authengine.us-east-2.elasticbeanstalk.com/',
    //everestUrl:'http://auctor.us-east-2.elasticbeanstalk.com/',

    apiMainUrl:'http://localhost:8080',
    SSOUrl: 'http://localhost:12012/',
    everestUrl:'http://localhost:12014/',

    //apiMainUrl:'http://conjurer.us-east-2.elasticbeanstalk.com/',
    //SSOUrl: 'http://authengine.us-east-2.elasticbeanstalk.com/',
    //everestUrl:'http://auctor.us-east-2.elasticbeanstalk.com/',

    // apiMainUrl: 'http://192.168.0.17:11011/',
    // SSOUrl: 'http://192.168.0.17:12012/',
    // everestUrl: 'http://192.168.0.16:8080/',
    authkey: 'g0EOi4npoPOg3hwI98OHxD1WgWz3MKqx'
  }
} else {
  APP_MAIN_URL = { /** For development */

    //apiMainUrl:'http://conjurer.us-east-2.elasticbeanstalk.com/',
    //SSOUrl: 'http://authengine.us-east-2.elasticbeanstalk.com/',
    //everestUrl:'http://auctor.us-east-2.elasticbeanstalk.com/',

    apiMainUrl:'http://localhost:8080',
    SSOUrl: 'http://localhost:12012/',
    everestUrl:'http://localhost:12014/',

    //apiMainUrl:'http://conjurer.us-east-2.elasticbeanstalk.com/',
    //SSOUrl: 'http://authengine.us-east-2.elasticbeanstalk.com/',
    //everestUrl:'http://auctor.us-east-2.elasticbeanstalk.com/',


    //apiMainUrl: 'http://conjurer.us-east-2.elasticbeanstalk.com/',
    //SSOUrl: 'http://authengine.us-east-2.elasticbeanstalk.com/',
    
    //apiMainUrl: 'http://localhost:8080/',
    //apiMainUrl:'http://pimoney-env-1.eba-zsw3yt7t.us-east-2.elasticbeanstalk.com/',
    
    //SSOUrl: 'http://localhost:12012/',
    //SSOUrl: 'http://authapi-env.eba-r3hmjwdz.us-east-2.elasticbeanstalk.com/',
    //everestUrl: 'http://auctor.us-east-2.elasticbeanstalk.com/',
    
    //everestUrl: 'http://localhost:12014/',
    //everestUrl:'http://auctor-env.eba-npnyqpfr.us-east-2.elasticbeanstalk.com/',

    // apiMainUrl: 'http://192.168.0.20:11011/',
    // SSOUrl: 'http://192.168.0.17:12012/',
    // everestUrl: 'http://192.168.0.16:8080/',
    authkey: 'g0EOi4npoPOg3hwI98OHxD1WgWz3MKqx'
  }
}

/** Configure full url to call rest api */
export const APP_DI_CONFIG: AppConfig = {
  apiAuthEndPoint: APP_MAIN_URL['SSOUrl'],
  apiEndpoint: APP_MAIN_URL.apiMainUrl + 'securek2/',
  everestApiUrl: APP_MAIN_URL.everestUrl + 'api/v1/pimoney/',
  authkey: APP_MAIN_URL['authkey']
};

/**
 * App config module
 *
 * To configure restfull api url for production and development
 */
@NgModule({
  providers: [{
    provide: K2_APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})
export class AppConfigModule { }
