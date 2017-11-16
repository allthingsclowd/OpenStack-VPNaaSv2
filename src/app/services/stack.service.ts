import { Injectable } from '@angular/core';
import { Http, RequestMethod, Request, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User, project, projects, ProjectToken } from '../model/user';
import { IdentityService } from '../services/identity.service';
import { UtilityService } from '../services/utility.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class StackService {
  private userStackList = new BehaviorSubject<any>(null);
  userStacks = this.userStackList.asObservable();
  private userStackDetails = new BehaviorSubject<any>(null);
  stackDetails = this.userStackDetails.asObservable();
  private userStackOutputs = new BehaviorSubject<any>(null);
  stackOutputs = this.userStackOutputs.asObservable();
  currentProject: project = null;
  currentProjectToken: Response = null;

  constructor(private http: Http,
              private utilitiesService: UtilityService) { }

  changeStackList(userStacks: any) {
      this.userStackList.next(userStacks);
  }

  changeStackOutputs(stackOutputs: any) {
    this.userStackOutputs.next(stackOutputs);
}

  changeStackDetails(stackDetails: any) {
      this.userStackDetails.next(stackDetails);
  }

  getStackList(k5scopedtoken: any) {

      let stackURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'orchestration');
      stackURL = stackURL.concat('/stacks');
      // With CORS Proxy Service in use here
      const proxiedURL = this.utilitiesService.sendViaCORSProxy(stackURL);

      const getheaders: Headers = new Headers();
      getheaders.append('Content-Type', 'application/json');
      getheaders.append('Accept', 'application/json');
      getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

      const headeropts: RequestOptions = new RequestOptions();
      headeropts.headers = getheaders;

      return this.http.get(proxiedURL, headeropts)
          .map((res: any) => {
              //console.log('New Stack List ->');
              //console.log(res.json().stacks);
              this.changeStackList(res.json().stacks);

              // return res;
              })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('yay'));

  }

  getStackDetails(k5scopedtoken: any, stack: any) {

      let stackURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'orchestration');
      stackURL = stackURL.concat('/stacks/', stack.stack_name, '/', stack.id);
      // With CORS Proxy Service in use here
      const proxiedURL = this.utilitiesService.sendViaCORSProxy(stackURL);

      const getheaders: Headers = new Headers();
      getheaders.append('Content-Type', 'application/json');
      getheaders.append('Accept', 'application/json');
      getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

      const headeropts: RequestOptions = new RequestOptions();
      headeropts.headers = getheaders;

      return this.http.get(proxiedURL, headeropts)
          .map((res: any) => {
              //console.log('Heat Stack Details');
              //console.log(res.json());
              this.changeStackDetails(res.json());
              // added following 'hack' as the outputs API call is not currently implemented on FJ K5 IaaS
              this.changeStackOutputs(res.json().stack.outputs);
              // return res;
              })
          .subscribe(
                      data => console.log(data),
                      err => console.log(err),
                      () => console.log('yay'));

  }

  deleteStack(k5scopedtoken, stack) {

    let stackURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'orchestration');
    stackURL = stackURL.concat('/stacks/', stack.stack.stack_name, '/', stack.stack.id);
    // With CORS Proxy Service in use here
    const proxiedURL = this.utilitiesService.sendViaCORSProxy(stackURL);

    const getheaders: Headers = new Headers();
    getheaders.append('Content-Type', 'application/json');
    getheaders.append('Accept', 'application/json');
    getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

    const headeropts: RequestOptions = new RequestOptions();
    headeropts.headers = getheaders;

    return this.http.delete(proxiedURL, headeropts)
        .map((res: any) => {
            //console.log('Delete Stack');
            //console.log(res.json());
            this.changeStackDetails(null);
            // added following 'hack' as the outputs API call is not currently implemented on FJ K5 IaaS
            this.changeStackOutputs(null);
            return res;
            })
        .subscribe(
                    data => console.log(data),
                    err => console.log(err),
                    () => console.log('yay'));

  }

  // API not currently implemented on Fujitsu K5 IaaS 12/09/2017 - Graham Land
  // Just grab the outputs from the server details
  getStackOutputs(k5scopedtoken: any, stack: any) {
    
          let stackURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'orchestration');
          stackURL = stackURL.concat('/stacks/', stack.stack_name, '/', stack.id, '/outputs');
          // With CORS Proxy Service in use here
          const proxiedURL = this.utilitiesService.sendViaCORSProxy(stackURL);
    
          const getheaders: Headers = new Headers();
          getheaders.append('Content-Type', 'application/json');
          getheaders.append('Accept', 'application/json');
          getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));
    
          const headeropts: RequestOptions = new RequestOptions();
          headeropts.headers = getheaders;
    
          return this.http.get(proxiedURL, headeropts)
              .map((res: any) => {
                  //console.log('Heat Stack Outputs');
                  //console.log(res.json().outputs);
                  this.changeStackOutputs(res.json().outputs);
                  // return res;
                  })
              .subscribe(
                          data => console.log(data),
                          err => console.log(err),
                          () => console.log('yay'));
    
      }  
}
