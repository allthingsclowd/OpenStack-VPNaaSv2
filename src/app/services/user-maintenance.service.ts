import { Injectable } from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { Http, RequestMethod, Request, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class UserMaintenanceService {

  constructor(private http: Http,
    private utilitiesService: UtilityService) { }

    // undocumented api - just a guess
  // listUserfromCentralPortal(k5GlobalToken: any, user: any) {

  //   let centralIdUrl = 'https://k5-apiportal.paas.cloud.global.fujitsu.com/API/v1/api/users?login_id=';

  //   centralIdUrl = centralIdUrl.concat(user.name);

  //   // With CORS Proxy Service in use here
  //   const authURL = this.utilitiesService.sendViaCORSProxy(centralIdUrl);

  //   const postheaders: Headers = new Headers();
  //   postheaders.append('Content-Type', 'application/json');
  //   postheaders.append('Accept', 'application/json');
  //   postheaders.append('Token', k5GlobalToken.headers.get('X-Access-Token'));

  //   const postopts: RequestOptions = new RequestOptions();
  //   postopts.headers = postheaders;

  //   //console.log('call Update API ===>' + user.id + ' token : ' + user.globalToken);

  //   return this.http.get(authURL, postopts)
  //       .map(res => res.json())
  //       .subscribe((data) => { //console.log('Get Response ' + data);

  //                   },
  //                   (err) => { //console.log('Get Error ' + err);

  //                   });


  // }

  listUserfromCentralPortal(k5GlobalToken: any, user: any) {
    let centralIdUrl = 'https://k5-apiportal.paas.cloud.global.fujitsu.com/API/v1/api/users?login_id=';
    centralIdUrl = centralIdUrl.concat(user.name);
            // With CORS Proxy Service in use here
    const authURL = this.utilitiesService.sendViaCORSProxy(centralIdUrl);

    const body = {'language_code': 'en'};

    const bodyString = JSON.stringify(body); // Stringify payload

    const postheaders: Headers = new Headers();
    postheaders.append('Content-Type', 'application/json');
    postheaders.append('Accept', 'application/json');
    postheaders.append('Token', k5GlobalToken.headers.get('X-Access-Token'));

    const postopts: RequestOptions = new RequestOptions();
    postopts.headers = postheaders;

    return this.http.put(authURL, bodyString, postopts)
        .map((res: any) => {
            //console.log('Response of User Update');
            //console.log(res);
            //console.log('User Queried on Central Portal' + JSON.stringify(res) );
        });

}
}
