import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { Http, RequestMethod, Request, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class IpsecvpnService {

  private listIpsecPolicies = new BehaviorSubject<any>(null);
  ipsecPolicies = this.listIpsecPolicies.asObservable();

  private currentIpsecPolicy = new BehaviorSubject<any>(null);
  ipsecPolicy = this.currentIpsecPolicy.asObservable();

  private listIkePolicies = new BehaviorSubject<any>(null);
  ikePolicies = this.listIkePolicies.asObservable();

  private currentIkePolicy = new BehaviorSubject<any>(null);
  ikePolicy = this.currentIkePolicy.asObservable();

  private listVpnServices = new BehaviorSubject<any>(null);
  vpnServices = this.listVpnServices.asObservable();

  private currentVpnService = new BehaviorSubject<any>(null);
  vpnService = this.currentVpnService.asObservable();

  private listIpsecConnections = new BehaviorSubject<any>(null);
  ipsecConnections = this.listIpsecConnections.asObservable();

  private currentIpsecConnection = new BehaviorSubject<any>(null);
  ipsecConnection = this.currentIpsecConnection.asObservable();

  constructor(  private http: Http,
                private utilitiesService: UtilityService) { }

  changeIpsecPolicies(policies: any) {
                  this.listIpsecPolicies.next(policies);
  }

  changeIpsecPolicy(policy: any) {
                this.currentIpsecPolicy.next(policy);
  }

  changeIkePolicies(policies: any) {
    this.listIkePolicies.next(policies);
  }

  changeIkePolicy(policy: any) {
    this.currentIkePolicy.next(policy);
  }

  changeVpnServices(services: any) {
    this.listVpnServices.next(services);
  }

  changeVpnService(service: any) {
    this.currentVpnService.next(service);
  }

  changeIpsecConnections(connections: any) {
    this.listIpsecConnections.next(connections);
  }

  changeIpsecConnection(connection: any) {
    this.currentIpsecConnection.next(connection);
  }

  setRequestHeaders(k5token: any) {

    const requestHeaders: Headers = new Headers();
    requestHeaders.append('Content-Type', 'application/json');
    requestHeaders.append('Accept', 'application/json');
    requestHeaders.append('X-Auth-Token', k5token.headers.get('x-subject-token'));

    const headeropts: RequestOptions = new RequestOptions();
    headeropts.headers = requestHeaders;

    return headeropts;

  }

  ipsecPoliciesList(k5token) {

    let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
    vpnURL = vpnURL.concat('/v2.0/vpn/ipsecpolicies');
    // With CORS Proxy Service in use here
    const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

    const headeropts = this.setRequestHeaders(k5token);

    return this.http.get(proxiedURL, headeropts)
      .map((response: Response) => {
            response.json();
            console.log('List IPSEC VPNs');
            console.log(response.json());
            this.changeIpsecPolicies(response.json());
            return response.json(); })
      .subscribe(
              data => console.log(data),
              err => console.log(err),
              () => console.log('IPSEC VPN List Success'));
  }

  ipsecPolicyShow(k5token, policyId) {
    
    let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
    vpnURL = vpnURL.concat('/v2.0/vpn/ipsecpolicies/', policyId);
    // With CORS Proxy Service in use here
    const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

    const headeropts = this.setRequestHeaders(k5token);
    
        return this.http.get(proxiedURL, headeropts)
          .map((response: Response) => {
                response.json();
                console.log('IPSEC Policy Show');
                console.log(response.json()); 
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IPSEC Policy Show Success'));
    }

    ipsecPolicyCreate(k5token, name, desc, protocol, auth_alg, enc_alg, encapmode, pfsgroup,  ipseclt, az) {

      let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
      vpnURL = vpnURL.concat('/v2.0/vpn/ipsecpolicies');
      // With CORS Proxy Service in use here
      const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

      const headeropts = this.setRequestHeaders(k5token);

      const body = {
        'ipsecpolicy': {
            'name': name,
            'description': desc,
            'transform_protocol': protocol,
            'auth_algorithm': auth_alg,
            'encapsulation_mode': encapmode,
            'encryption_algorithm': enc_alg,
            'pfs': pfsgroup,
            'lifetime': {
                'units': 'seconds',
                'value': ipseclt},
            'availability_zone': az
        }
    };

    const bodyString = JSON.stringify(body); // Stringify payload

      return this.http.post(proxiedURL, bodyString, headeropts)
        .map((response: Response) => {
              console.log('IPSEC Policy Creation');
              console.log(response.json());
              this.ipsecPoliciesList(k5token);
              this.changeIpsecPolicy(response.json());
              return response.json(); })
        .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('IPSEC Policy Create Success'));
    }

    ipsecPolicyUpdate(k5token, policyId, name, enc_alg, pfsgroup, ipseclt, description) {
        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ipsecpolicies/', policyId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        const body = {
          'ipsecpolicy': {
              'name': name,
              'encryption_algorithm': enc_alg,
              'pfs': pfsgroup,
              'lifetime': {
                  'units': 'seconds',
                  'value': ipseclt},
              'description': description
          }
      };

      const bodyString = JSON.stringify(body); // Stringify payload

        return this.http.put(proxiedURL, bodyString, headeropts)
          .map((response: Response) => {
                response.json();
                console.log('IPSEC Policy Update');
                console.log(response.json());
                this.ipsecPoliciesList(k5token);
                this.changeIpsecPolicy(response.json());
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IPSEC Policy Update Success'));
      }

      ipsecPolicyDelete(k5token, policyId) {
        
        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ipsecpolicies/', policyId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);
    
        const headeropts = this.setRequestHeaders(k5token);
        
            return this.http.delete(proxiedURL, headeropts)
              .map((response: Response) => {
                    response.json();
                    console.log('IPSEC Delete Policy');
                    console.log(response.json());
                    this.ipsecPoliciesList(k5token);
                    this.changeIpsecPolicy(null);
                    return response.json(); })
              .subscribe(
                      data => console.log(data),
                      err => console.log(err),
                      () => console.log('IPSEC Delete Policy Success'));

      }

      ipsecSiteConnectionsList(k5token) {

        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ipsec-site-connections');
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        return this.http.get(proxiedURL, headeropts)
          .map((response: Response) => {
                response.json();
                console.log('List IPSEC Site Connections');
                console.log(response.json());
                this.changeIpsecConnections(response.json());
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IPSEC Site Connections List Success'));

      }

      ipsecSiteConnectionShow(k5token, connectionId) {
        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ipsec-site-connections/', connectionId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        return this.http.get(proxiedURL, headeropts)
        .map((response: Response) => {
              response.json();
              console.log('IPSEC Site Connection Show');
              console.log(response.json()); 
              return response.json(); })
        .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('IPSEC Site Connection Show Success'));

      }

      ipsecSiteConnectionCreate(k5token, name, desc, initiator, vpnsid, ikepid,
                                secpid, peerid, peeradr, peercidr, psk, adminstate,
                                dpdprotocol, dpdinterval, dpdtimeout, az) {

        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ipsec-site-connections');
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        const body = {
          'ipsec_site_connection': {
              'psk': psk,
              'initiator': initiator,
              'ipsecpolicy_id': secpid,
              'admin_state_up': adminstate,
              'peer_cidrs': peercidr,
              'ikepolicy_id': ikepid,
              'dpd': {
                  'action': dpdprotocol,
                  'interval': dpdinterval,
                  'timeout': dpdtimeout
              },
              'vpnservice_id': vpnsid,
              'peer_address': peeradr,
              'peer_id': peerid,
              'name': name,
              'description': desc,
              'availability_zone': az
          }
      };

        const bodyString = JSON.stringify(body); // Stringify payload

        return this.http.post(proxiedURL, bodyString, headeropts)
          .map((response: Response) => {
                console.log('IPSEC Policy Creation');
                console.log(response.json());
                this.changeIpsecConnection(response.json());
                this.ipsecSiteConnectionsList(k5token);
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IPSEC Policy Create Success'));
      }

      ipsecSiteConnectionUpdate(k5token, connectionId, initiator, peerid, peeradr, peercidr, psk, name, desc, adminstate,
        dpdprotocol, dpdinterval, dpdtimeout) {
        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ipsec-site-connections/', connectionId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        const body = {
          'ipsec_site_connection': {
              'psk': psk,
              'initiator': initiator,
              'admin_state_up': adminstate,
              'peer_cidrs': peercidr,
              'dpd': {
                  'action': dpdprotocol,
                  'interval': dpdinterval,
                  'timeout': dpdtimeout
              },
              'peer_address': peeradr,
              'peer_id': peerid,
              'name': name,
              'description': desc
          }
      };

        const bodyString = JSON.stringify(body); // Stringify payload

        return this.http.put(proxiedURL, bodyString, headeropts)
          .map((response: Response) => {
                console.log('IPSEC Policy Creation');
                console.log(response.json());
                this.changeIpsecConnection(response.json());
                this.ipsecSiteConnectionsList(k5token);
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IPSEC Policy Create Success'));
      }

      ipsecSiteConnectionDelete(k5token, connectionId) {
        
        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ipsec-site-connections/', connectionId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        return this.http.delete(proxiedURL, headeropts)
        .map((response: Response) => {
              response.json();
              console.log('IPSEC Site Connection Delete');
              console.log(response.json());
              this.changeIpsecConnection(null);
              this.ipsecSiteConnectionsList(k5token);
              return response.json(); })
        .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('IPSEC Site Connection Delete Success'));

      }

      vpnServicesList(k5token) {

        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/vpnservices');
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        return this.http.get(proxiedURL, headeropts)
          .map((response: Response) => {
                response.json();
                console.log('List IPSEC VPN Services');
                console.log(response.json());
                this.changeVpnServices(response.json());
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IPSEC VPN Services List Success'));

      }

      vpnServiceShow(k5token, serviceId) {
        
        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/vpnservices/', serviceId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        return this.http.get(proxiedURL, headeropts)
        .map((response: Response) => {
              response.json();
              console.log('IPSEC VPN Service Show');
              console.log(response.json());
              this.changeVpnService(response.json());
              return response.json(); })
        .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('IPSEC VPN Service Show Success'));
      }

      vpnServiceCreate(k5token, name, desc, routerid, subnetid, az) {

        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/vpnservices');
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        const body = {
          'vpnservice': {
              'subnet_id': subnetid,
              'router_id': routerid,
              'name': name,
              'description': desc,
              'admin_state_up': true,
              'availability_zone': az
          }
        };

        const bodyString = JSON.stringify(body); // Stringify payload

        return this.http.post(proxiedURL, bodyString, headeropts)
          .map((response: Response) => {
                console.log('IPSEC VPN Service Creation');
                console.log(response.json());
                this.vpnServicesList(k5token);
                this.changeVpnService(response.json());
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IPSEC VPN Service Create Success'));
      }

      vpnServiceUpdate(k5token, serviceId, name, adminState, desc) {

        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/vpnservices/', serviceId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        const body = {
          'vpnservice': {
              'name': name,
              'admin_state_up': adminState,
              'description': desc
          }
        };

        const bodyString = JSON.stringify(body); // Stringify payload

        return this.http.put(proxiedURL, bodyString, headeropts)
          .map((response: Response) => {
                console.log('IPSEC VPN Service Update');
                console.log(response.json());
                this.vpnServicesList(k5token);
                this.changeVpnService(response.json());
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IPSEC VPN Service Update Success'));

      }

      vpnServiceDelete(k5token, serviceId) {
                
        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/vpnservices/', serviceId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        return this.http.delete(proxiedURL, headeropts)
        .map((response: Response) => {
              response.json();
              console.log('IPSEC VPN Service Deletion');
              console.log(response.json());
              this.vpnServicesList(k5token);
              this.changeVpnService(null);
              return response.json(); })
        .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log('IPSEC VPN Service Delete Success'));

      }

      ikePoliciesList(k5token) { 

        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ikepolicies');
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);
    
        const headeropts = this.setRequestHeaders(k5token);
    
        return this.http.get(proxiedURL, headeropts)
          .map((response: Response) => {
                response.json();
                console.log('List IKE Policies');
                console.log(response.json());
                this.changeIkePolicies(response.json());
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IKE Policies List Success'));

      }

      ikePolicyShow(k5token, policyId) {
        
        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ikepolicies/', policyId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);
    
        const headeropts = this.setRequestHeaders(k5token);
        
            return this.http.get(proxiedURL, headeropts)
              .map((response: Response) => {
                    response.json();
                    console.log('IKE Policy Show');
                    console.log(response.json());
                    this.changeIkePolicy(response.json());
                    return response.json(); })
              .subscribe(
                      data => console.log(data),
                      err => console.log(err),
                      () => console.log('IKE Policy Show Success'));

      }

      ikePolicyDelete(k5token, policyId) {
                
        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ikepolicies/', policyId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);
    
        const headeropts = this.setRequestHeaders(k5token);
        
            return this.http.delete(proxiedURL, headeropts)
              .map((response: Response) => {
                    response.json();
                    console.log('IKE Policy Deletion');
                    console.log(response.json());
                    this.ikePoliciesList(k5token);
                    this.changeIkePolicy(null);
                    return response.json(); })
              .subscribe(
                      data => console.log(data),
                      err => console.log(err),
                      () => console.log('IKE Policy Deletion Success'));

      }

      ikePolicyCreate(k5token, name, desc, authalg, encryalg, ikelt, ikev, pfs, neg, az) {
        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ikepolicies');
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        const body = {
          'ikepolicy': {
              'phase1_negotiation_mode': neg,
              'auth_algorithm': authalg,
              'encryption_algorithm': encryalg,
              'pfs': pfs,
              'lifetime': {
                  'units': 'seconds',
                  'value': ikelt
              },
              'ike_version': ikev,
              'name': name,
              'description': desc,
              'availability_zone': az
          }
      };

        const bodyString = JSON.stringify(body); // Stringify payload

        return this.http.post(proxiedURL, bodyString, headeropts)
          .map((response: Response) => {
                console.log('IKE Policy Creation');
                console.log(response.json());
                this.ikePoliciesList(k5token);
                this.changeIkePolicy(response.json());
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IKE Policy Create Success'));
      }

      ikePolicyUpdate(k5token, policyId, name, encryalg, ikelt, pfs, desc) {

        let vpnURL = this.utilitiesService.getEndpoint(k5token, 'networking');
        vpnURL = vpnURL.concat('/v2.0/vpn/ikepolicies/', policyId);
        // With CORS Proxy Service in use here
        const proxiedURL = this.utilitiesService.sendViaCORSProxy(vpnURL);

        const headeropts = this.setRequestHeaders(k5token);

        const body = {
          'ikepolicy': {
              'encryption_algorithm': encryalg,
              'pfs': pfs,
              'lifetime': {
                  'units': 'seconds',
                  'value': ikelt
              },
              'name': name,
              'description': desc
          }
      };

        const bodyString = JSON.stringify(body); // Stringify payload

        return this.http.put(proxiedURL, bodyString, headeropts)
          .map((response: Response) => {
                console.log('IKE Policy Update');
                console.log(response.json());
                this.ikePoliciesList(k5token);
                this.changeIkePolicy(response.json());
                return response.json(); })
          .subscribe(
                  data => console.log(data),
                  err => console.log(err),
                  () => console.log('IKE Policy Update Success'));

      }
}


