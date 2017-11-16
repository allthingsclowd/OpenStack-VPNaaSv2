import { CloudvisualisedService } from './cloudvisualised.service';
import { Injectable} from '@angular/core';
import { Http, RequestMethod, Request, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User, project, projects, ProjectToken } from '../model/user';
import { IdentityService } from '../services/identity.service';
import { UtilityService } from '../services/utility.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NetworkService {

  private userRouterList = new BehaviorSubject<any>(null);
  userRouters = this.userRouterList.asObservable();
  private userRouterDetails = new BehaviorSubject<any>(null);
  routerDetails = this.userRouterDetails.asObservable();

  private userNetworkList = new BehaviorSubject<any>(null);
  userNetworks = this.userNetworkList.asObservable();
  private userNetworkDetails = new BehaviorSubject<any>(null);
  networkDetails = this.userNetworkDetails.asObservable();

  private userSubNetworkList = new BehaviorSubject<any>(null);
  userSubNetworks = this.userSubNetworkList.asObservable();
  private userSubNetworkDetails = new BehaviorSubject<any>(null);
  subNetworkDetails = this.userSubNetworkDetails.asObservable();

  private userPortList = new BehaviorSubject<any>(null);
  userPorts = this.userPortList.asObservable();
  private userPortDetails = new BehaviorSubject<any>(null);
  subPortDetails = this.userPortDetails.asObservable();

  private userRouterStatus = new BehaviorSubject<any>(null);
  routerStatus = this.userRouterStatus.asObservable();

  constructor(private http: Http,
              private utilitiesService: UtilityService,
              private cloudvisualisedService: CloudvisualisedService) { }

  changeRouterList(userRouters: any) {
      this.userRouterList.next(userRouters);
      this.cloudvisualisedService.getNodes('router', userRouters);
  }

  changeRouterDetails(routerDetails: any) {
      this.userRouterDetails.next(routerDetails);
  }

  changeRouterStatus(routerUpdateStatus: any) {
    this.userRouterStatus.next(routerUpdateStatus);
}

  changeNetworkList(userNetworks: any) {
    this.userNetworkList.next(userNetworks);
    this.cloudvisualisedService.getNodes('network', userNetworks);
  }

  changeNetworkDetails(NetworkDetails: any) {
      this.userNetworkDetails.next(NetworkDetails);
  }

  changeSubNetworkList(userSubNetworks: any) {
    this.userSubNetworkList.next(userSubNetworks);
    this.cloudvisualisedService.getNodes('subnetwork', userSubNetworks);
  }

  changeSubNetworkDetails(SubNetworkDetails: any) {
      this.userSubNetworkDetails.next(SubNetworkDetails);
  }

  changePortList(userPorts: any) {
    this.userPortList.next(userPorts);
    this.cloudvisualisedService.getNodes('port', userPorts);
  }

  changePortDetails(PortDetails: any) {
      this.userPortDetails.next(PortDetails);
  }

  updateRouterRoutes(k5scopedtoken: any, router: any, newRoutes: any) {

    let networkURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'networking');
    networkURL = networkURL.concat('/v2.0/routers/', router.id);
    // With CORS Proxy Service in use here
    const proxiedURL = this.utilitiesService.sendViaCORSProxy(networkURL);

    newRoutes = JSON.parse(newRoutes);

    // if (!replace) {
    //     console.log('Before route change');
    //     console.log(newRoutes);
    //     console.log('Existing routes');
    //     console.log(router.routes);
    //     console.log(router);

    //     newRoutes.concat(router.routes);
    //     console.log('After route change');
    //     console.log(newRoutes);
    // }

    const body = {'router': {'routes': newRoutes}};

    console.log(body);

    const bodyString = JSON.stringify(body); // Stringify payload

    const putheaders: Headers = new Headers();
    putheaders.append('Content-Type', 'application/json');
    putheaders.append('Accept', 'application/json');
    putheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

    const headeropts: RequestOptions = new RequestOptions();
    headeropts.headers = putheaders;

    return this.http.put(proxiedURL, bodyString, headeropts)
        .map((res: any) => {
            //console.log('Router details');
            //console.log(res.json().router);
            this.changeRouterDetails(res.json().router);
            this.changeRouterStatus(res);
            console.log(res.json().body);
            console.log(res._body);
            return res;
            })
        .subscribe(
                    data => console.log(data),
                    err => {console.log(err);
                    this.changeRouterStatus(err); },
                    () => console.log('Completed Router Update'));

  }

  getRouterList(k5scopedtoken: any) {

      let networkURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'networking');
      networkURL = networkURL.concat('/v2.0/routers');
      // With CORS Proxy Service in use here
      const proxiedURL = this.utilitiesService.sendViaCORSProxy(networkURL);

      const getheaders: Headers = new Headers();
      getheaders.append('Content-Type', 'application/json');
      getheaders.append('Accept', 'application/json');
      getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

      const headeropts: RequestOptions = new RequestOptions();
      headeropts.headers = getheaders;

      return this.http.get(proxiedURL, headeropts)
          .map((res: any) => {
              //console.log('New Router List ->');
              //console.log(res.json().routers);
              this.changeRouterList(res.json().routers);

              // return res;
              })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('Router list complete'));

  }

  getRouterDetails(k5scopedtoken: any, router: any) {

      let networkURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'networking');
      networkURL = networkURL.concat('/v2.0/routers/', router.id);
      // With CORS Proxy Service in use here
      const proxiedURL = this.utilitiesService.sendViaCORSProxy(networkURL);

      const getheaders: Headers = new Headers();
      getheaders.append('Content-Type', 'application/json');
      getheaders.append('Accept', 'application/json');
      getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

      const headeropts: RequestOptions = new RequestOptions();
      headeropts.headers = getheaders;

      return this.http.get(proxiedURL, headeropts)
          .map((res: any) => {
              //console.log('Router details');
              //console.log(res.json().router);
              this.changeRouterDetails(res.json().router);
              return res;
              })
          .subscribe(
                      data => console.log(data),
                      err => console.log(err),
                      () => console.log('Completed Router Details'));

  }
  getNetworkList(k5scopedtoken: any) {

    let networkURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'networking');
    networkURL = networkURL.concat('/v2.0/networks');
    // With CORS Proxy Service in use here
    const proxiedURL = this.utilitiesService.sendViaCORSProxy(networkURL);

    const getheaders: Headers = new Headers();
    getheaders.append('Content-Type', 'application/json');
    getheaders.append('Accept', 'application/json');
    getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

    const headeropts: RequestOptions = new RequestOptions();
    headeropts.headers = getheaders;

    return this.http.get(proxiedURL, headeropts)
        .map((res: any) => {
            //console.log('New network List ->');
            //console.log(res.json().networks);
            this.changeNetworkList(res.json().networks);

            // return res;
            })
        .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('network list complete'));

  }

  getNetworkDetails(k5scopedtoken: any, network: any) {

      let networkURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'networking');
      networkURL = networkURL.concat('/v2.0/networks/', network.id);
      // With CORS Proxy Service in use here
      const proxiedURL = this.utilitiesService.sendViaCORSProxy(networkURL);

      const getheaders: Headers = new Headers();
      getheaders.append('Content-Type', 'application/json');
      getheaders.append('Accept', 'application/json');
      getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

      const headeropts: RequestOptions = new RequestOptions();
      headeropts.headers = getheaders;

      return this.http.get(proxiedURL, headeropts)
          .map((res: any) => {
              //console.log('network details');
              //console.log(res.json().network);
              this.changeNetworkDetails(res.json().network);
              return res;
              })
          .subscribe(
                      data => console.log(data),
                      err => console.log(err),
                      () => console.log('Completed network Details'));

  }

  getSubnetList(k5scopedtoken: any) {

      let networkURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'networking');
      networkURL = networkURL.concat('/v2.0/subnets');
      // With CORS Proxy Service in use here
      const proxiedURL = this.utilitiesService.sendViaCORSProxy(networkURL);

      const getheaders: Headers = new Headers();
      getheaders.append('Content-Type', 'application/json');
      getheaders.append('Accept', 'application/json');
      getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

      const headeropts: RequestOptions = new RequestOptions();
      headeropts.headers = getheaders;

      return this.http.get(proxiedURL, headeropts)
          .map((res: any) => {
              //console.log('New Subnet List ->');
              //console.log(res.json().subnets);
              this.changeSubNetworkList(res.json().subnets);

              // return res;
              })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('subnet list complete'));

  }

getSubnetDetails(k5scopedtoken: any, subnet: any) {

    let networkURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'networking');
    networkURL = networkURL.concat('/v2.0/subnets/', subnet.id);
    // With CORS Proxy Service in use here
    const proxiedURL = this.utilitiesService.sendViaCORSProxy(networkURL);

    const getheaders: Headers = new Headers();
    getheaders.append('Content-Type', 'application/json');
    getheaders.append('Accept', 'application/json');
    getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

    const headeropts: RequestOptions = new RequestOptions();
    headeropts.headers = getheaders;

    return this.http.get(proxiedURL, headeropts)
        .map((res: any) => {
            //console.log('Subnet details');
            //console.log(res.json().subnet);
            this.changeSubNetworkDetails(res.json().subnet);
            return res;
            })
        .subscribe(
                    data => console.log(data),
                    err => console.log(err),
                    () => console.log('Completed Subnet Details'));

  }

getPortList(k5scopedtoken: any) {

      let networkURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'networking');
      networkURL = networkURL.concat('/v2.0/ports');
      // With CORS Proxy Service in use here
      const proxiedURL = this.utilitiesService.sendViaCORSProxy(networkURL);

      const getheaders: Headers = new Headers();
      getheaders.append('Content-Type', 'application/json');
      getheaders.append('Accept', 'application/json');
      getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

      const headeropts: RequestOptions = new RequestOptions();
      headeropts.headers = getheaders;

      return this.http.get(proxiedURL, headeropts)
          .map((res: any) => {
              //console.log('New Port List ->');
              //console.log(res.json().ports);
              this.changePortList(res.json().ports);

              // return res;
              })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('port list complete'));

  }

  getPortDetails(k5scopedtoken: any, port: any) {

      let networkURL = this.utilitiesService.getEndpoint(k5scopedtoken, 'networking');
      networkURL = networkURL.concat('/v2.0/ports/', port.id);
      // With CORS Proxy Service in use here
      const proxiedURL = this.utilitiesService.sendViaCORSProxy(networkURL);

      const getheaders: Headers = new Headers();
      getheaders.append('Content-Type', 'application/json');
      getheaders.append('Accept', 'application/json');
      getheaders.append('X-Auth-Token', k5scopedtoken.headers.get('x-subject-token'));

      const headeropts: RequestOptions = new RequestOptions();
      headeropts.headers = getheaders;

      return this.http.get(proxiedURL, headeropts)
          .map((res: any) => {
              //console.log('Port details');
              //console.log(res.json().port);
              this.changePortDetails(res.json().port);
              return res;
              })
          .subscribe(
                      data => console.log(data),
                      err => console.log(err),
                      () => console.log('Completed Port Details'));

  }
}
