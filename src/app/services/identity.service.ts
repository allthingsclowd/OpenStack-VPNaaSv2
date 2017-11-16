import { IpsecvpnService } from './ipsecvpn.service';
import { CloudvisualisedService } from './cloudvisualised.service';
import { NetworkService } from './network.service';
import { StackService } from './stack.service';
import { LoadbalancerService } from './loadbalancer.service';
import { User, project, ProjectToken } from './../model/user';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, RequestMethod, Request, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UtilityService } from './utility.service';
import { ComputeService } from './compute.service';

@Injectable()
export class IdentityService {
    user = new User();

    // k5projects: projects;
    vpnServices: any;
    vpnService: any;
    ipsecPolicies: any;
    ipsecPolicy: any;
    ikePolicies: any;
    ikePolicy: any;
    ipsecConnections: any;
    ipsecConnection: any;
    
    private userProjectList = new BehaviorSubject<project[]>(null);
    userProjects = this.userProjectList.asObservable();
    private contractProjectList = new BehaviorSubject<any>(null);
    contractProjects = this.contractProjectList.asObservable();
    private contractUserList = new BehaviorSubject<any>(null);
    contractUsers = this.contractUserList.asObservable();
    private contractRoleList = new BehaviorSubject<any>(null);
    contractRoles = this.contractRoleList.asObservable();
    private contractGroupList = new BehaviorSubject<any>(null);
    contractGroups = this.contractGroupList.asObservable();
    private userRegionalToken = new BehaviorSubject<Response>(null);
    userRToken = this.userRegionalToken.asObservable();
    private userGlobalToken = new BehaviorSubject<Response>(null);
    userGToken = this.userGlobalToken.asObservable();

    // k5response: Response;
    // k5Globalresponse: Response;
    // loggedIn :boolean = false;
    private userLoggedIn = new BehaviorSubject<boolean>(false);
    loggedIn = this.userLoggedIn.asObservable();
    // currentProject: project;
    private selectedProject = new BehaviorSubject<project>(null);
    currentProject = this.selectedProject.asObservable();
    private userProjectToken = new BehaviorSubject<Response>(null);
    userPToken = this.userProjectToken.asObservable();
    private projectRoleAssignments = new BehaviorSubject<Response>(null);
    roleAssignments = this.projectRoleAssignments.asObservable();
    private usersInGroupList = new BehaviorSubject<Response>(null);
    usersInGroup = this.usersInGroupList.asObservable();
    private availabilityZoneList = new BehaviorSubject<Response>(null);
    availabilityZones = this.availabilityZoneList.asObservable();
    private currentAvailabilityZone = new BehaviorSubject<Response>(null);
    currentAZ = this.currentAvailabilityZone.asObservable();
    //servers: any = null;
    // k5currentScopedToken: Response;

    constructor(private http: Http,
                private utilityService: UtilityService,
                private computeService: ComputeService,
                private stackService: StackService,
                private loadBalancerService: LoadbalancerService,
                private networkService: NetworkService,
                private cloudvisualisedService: CloudvisualisedService,
                private ipsecvpnService: IpsecvpnService) {

        // this.computeService.userServers.subscribe(currentServers => this.servers = currentServers);
        this.ipsecvpnService.ipsecPolicies.subscribe(policies => this.ipsecPolicies = policies);
        this.ipsecvpnService.ipsecPolicy.subscribe(policy => this.ipsecPolicy = policy);
        this.ipsecvpnService.ikePolicies.subscribe(policies => this.ikePolicies = policies);
        this.ipsecvpnService.ikePolicy.subscribe(policy => this.ikePolicy = policy);
        this.ipsecvpnService.vpnServices.subscribe(services => this.vpnServices = services);
        this.ipsecvpnService.vpnService.subscribe(service => this.vpnService = service);
        this.ipsecvpnService.ipsecConnections.subscribe(connections => this.ipsecConnections = connections);
        this.ipsecvpnService.ipsecConnection.subscribe(connection => this.ipsecConnection = connection);
    }

    changeAZList(azones: any) {
        this.availabilityZoneList.next(azones);
    }

    changeAZ(azone: any) {
        this.currentAvailabilityZone.next(azone);
    }

    changeUsersInGroup(users: any) {
        this.usersInGroupList.next(users);
    }


    changeRoleAssignments(roleAssignments: any) {
        this.projectRoleAssignments.next(roleAssignments);
    }


    changeContractUsers(contractUsers: any) {
        this.contractUserList.next(contractUsers);
    }
    changeContractGroups(contractGroups: any) {
        this.contractGroupList.next(contractGroups);
    }
    changeContractRoles(contractRoles: any) {
        this.contractRoleList.next(contractRoles);
    }
    changeContractProjects(contractProjects: any) {
        this.contractProjectList.next(contractProjects);
    }

    changeProject(currentProject: project) {
        this.selectedProject.next(currentProject);
    }

    changeProjectList(userProjects: project[]) {
        this.userProjectList.next(userProjects);
    }

    changeLoginStatus(loggedInStatus: boolean) {
        this.userLoggedIn.next(loggedInStatus);
    }

    changeRegionalToken(userRToken: Response) {
        this.userRegionalToken.next(userRToken);
    }

    changeGlobalToken(userGToken: Response) {
        this.userGlobalToken.next(userGToken);
    }

    changeProjectToken(userPToken: Response) {
        this.userProjectToken.next(userPToken);
    }

    getKeystoneObjectList(objectType: string) {
        // const k5token = this.k5response;
        // //console.log('Keystone Token Details ' + JSON.stringify(this.userRegionalToken.getValue()));
        //console.log('Keystone ObjectType Details ' + objectType);
        const identityURL = this.utilityService.getEndpoint(this.userRegionalToken.getValue(), 'identityv3');
        const endpointDetail = identityURL.concat(  '/',
                                                    objectType,
                                                    '?domain_id=',
                                                    this.userRegionalToken.getValue().json().token.user.domain.id);
        // With CORS Proxy Service in use here
        const authURL = this.utilityService.sendViaCORSProxy(endpointDetail);

        // retrieve the K5/OpenStack authentication token from the response header
        const token = this.userRegionalToken.getValue().headers.get('x-subject-token');
        //console.log('Getting KeystoneObject List' + JSON.stringify(authURL));

        const postheaders: Headers = new Headers();
        postheaders.append('Content-Type', 'application/json');
        postheaders.append('Accept', 'application/json');
        postheaders.append('X-Auth-Token', token);

        const postopts: RequestOptions = new RequestOptions();
        postopts.headers = postheaders;

        return this.http.get(authURL, postopts)
            .map((res: Response) => {
                // //console.log(' Map ObjectList => ' + JSON.stringify(res));
                return res;
             });

    }

    getProjectScopedToken(projectId: string) {

        // const k5token = this.k5response;
        //console.log('New Scoped Project Pre-Response');
        //console.log(this.userRegionalToken.getValue());
        const identityURL = this.utilityService.getEndpoint(this.userRegionalToken.getValue(), 'identityv3');
        const endpointDetail = identityURL.concat('/auth/tokens');
        // With CORS Proxy Service in use here
        const authURL = this.utilityService.sendViaCORSProxy(endpointDetail);

        const body = { 'auth':
                        { 'identity':
                            { 'methods':
                                [ 'token'],
                                'token':
                                    { 'id': this.userRegionalToken.getValue().headers.get('x-subject-token') }
                            }, 'scope':
                                    { 'project':
                                        { 'id': projectId  }
                                         }
                                     }
                                 };

        const bodyString = JSON.stringify(body); // Stringify payload

        const postheaders: Headers = new Headers();
        postheaders.append('Content-Type', 'application/json');
        postheaders.append('Accept', 'application/json');

        const postopts: RequestOptions = new RequestOptions();
        postopts.headers = postheaders;

        return this.http.post(authURL, bodyString, postopts)
            .map((res: any) => {
                // const projectToken = new ProjectToken();

                // retrieve the K5/OpenStack authentication token from the response header
                // projectToken.scopedToken = res.headers.get('x-subject-token');
                // projectToken.projectId = projectId;
                // console.log('New Project Scoped Token response ->');
                // console.log(res);

                this.changeProjectToken(res);
                //this.ipsecvpnService.ipsecPolicyCreate(res, 'freddy', 'esp', 'sha1', 'aes-256', 'tunnel', 'group5', 3600, 'uk-1a');
                // console.log('Return Policy Below');
                // console.log(policy);
                //this.ipsecvpnService.ipsecPolicyUpdate(res, '23674bf7-6638-47e4-890f-324ed21fcf13', 'freddy', 'aes-256', 'group5', 3600, 'updated ipsec policy');
                this.ipsecvpnService.ipsecPoliciesList(res);
                this.ipsecvpnService.ipsecSiteConnectionsList(res);
                this.ipsecvpnService.ikePoliciesList(res);
                this.ipsecvpnService.vpnServicesList(res);
                //this.ipsecvpnService.ipsecPolicyShow(res, '23674bf7-6638-47e4-890f-324ed21fcf13');
                //this.ipsecvpnService.ipsecPolicyDelete(res, '23674bf7-6638-47e4-890f-324ed21fcf13');
                //this.ipsecvpnService.ipsecPolicyShow(res, '23674bf7-6638-47e4-890f-324ed21fcf13');
 
                this.cloudvisualisedService.resetNodeList();
                this.computeService.getServerList(res);
                this.stackService.getStackList(res);
                this.loadBalancerService.getLBaaSDetailOrList(res, 'all');
                this.networkService.getPortList(res);
                this.networkService.getSubnetList(res);
                this.networkService.getNetworkList(res);
                this.networkService.getRouterList(res);
                this.getRoleAssignments().subscribe();
                
                //console.log('New Project Scoped Token observable ->');
                //console.log(this.userProjectToken.getValue());
                // //console.log('New Server List ->');
                // //console.log(this.servers.getValue());

                return res;
            });
            

    }


    getProjectList() {

        // const k5token = this.k5response;
        // //console.log(this.currentProject);
        const identityURL = this.utilityService.getEndpoint(this.userRegionalToken.getValue(), 'identityv3');
        // role_assignments?scope.project.id={project_id}
        const endpointDetail = identityURL.concat('/users/', this.userRegionalToken.getValue().json().token.user.id, '/projects');
        
        //console.log(endpointDetail);
        // With CORS Proxy Service in use here
        const authURL = this.utilityService.sendViaCORSProxy(endpointDetail);
        //console.log(authURL);

        // retrieve the K5/OpenStack authentication token from the response header
        const token = this.userRegionalToken.getValue().headers.get('x-subject-token');
        //console.log('Getting Project List');

        const postheaders: Headers = new Headers();
        postheaders.append('Content-Type', 'application/json');
        postheaders.append('Accept', 'application/json');
        postheaders.append('X-Auth-Token', token);

        const postopts: RequestOptions = new RequestOptions();
        postopts.headers = postheaders;

        return this.http.get(authURL, postopts)
            .map((res: Response) => {



                    this.changeProjectList(res.json().projects);
                    this.changeProject(res.json().projects[0]);
                    //console.log('111111111. Get Project List with projects and actual project as follows: ');
                    //console.log('All Unparsed Projects');
                    // //console.log(res);
                    // //console.log(res.json());
                    // //console.log(res.json().projects);
                    //console.log(this.userProjectList.getValue());
                    //console.log(this.selectedProject.getValue().name);
                    // return res.json().projects as projects;
                    // return projects;
            });



    }
    getUserInfo(user) {
        
                // const k5token = this.k5response;
                // //console.log(this.currentProject);
                const identityURL = this.utilityService.getEndpoint(this.userProjectToken.getValue(), 'identityv3');
                const endpointDetail = identityURL.concat('/users/', user.id);
        
                //console.log(endpointDetail);
                // With CORS Proxy Service in use here
                const authURL = this.utilityService.sendViaCORSProxy(endpointDetail);
                
        
                // retrieve the K5/OpenStack authentication token from the response header
                const token = this.userProjectToken.getValue().headers.get('x-subject-token');
                
        
                const postheaders: Headers = new Headers();
                postheaders.append('Content-Type', 'application/json');
                postheaders.append('Accept', 'application/json');
                postheaders.append('X-Auth-Token', token);
        
                const postopts: RequestOptions = new RequestOptions();
                postopts.headers = postheaders;

        
                return this.http.get(authURL, postopts)
                    // .map((res: Response) => {


                    //         // return res.json().projects as projects;
                    //         // return projects;
                    // })
                    .subscribe(
                            res => {
                                console.log('Getting User Info via API');
                                console.log(this.userProjectToken.getValue());
                                // console.log(authURL);
                                // console.log(postopts);
                                // console.log(postheaders);
                                // console.log('New User Info' + JSON.stringify(res));
                                // console.log(res.json());
                                // console.log(res);
                            }
                                ,
                            err => console.log(err),
                            () => console.log('Getting User Info via API Complete'));
        
    }

    getRoleAssignments() {
        
                // const k5token = this.k5response;
                // //console.log(this.currentProject);
                const identityURL = this.utilityService.getEndpoint(this.userProjectToken.getValue(), 'identityv3');
                const endpointDetail = identityURL.concat('/role_assignments?scope.project.id=',
                this.userProjectToken.getValue().json().token.project.id,
                '&include_names');
        
                //console.log(endpointDetail);
                // With CORS Proxy Service in use here
                const authURL = this.utilityService.sendViaCORSProxy(endpointDetail);
                //console.log(authURL);
        
                // retrieve the K5/OpenStack authentication token from the response header
                const token = this.userProjectToken.getValue().headers.get('x-subject-token');
                //console.log('Getting Role Assignments');
        
                const postheaders: Headers = new Headers();
                postheaders.append('Content-Type', 'application/json');
                postheaders.append('Accept', 'application/json');
                postheaders.append('X-Auth-Token', token);
        
                const postopts: RequestOptions = new RequestOptions();
                postopts.headers = postheaders;
        
                return this.http.get(authURL, postopts)
                    .map((res: Response) => {
                            //console.log('New Role Assignments' + JSON.stringify(res));
                            this.changeRoleAssignments(res.json().role_assignments);
                            //console.log(this.userProjectList.getValue());
                            //console.log(this.selectedProject.getValue().name);
                            // return res.json().projects as projects;
                            // return projects;
                    });
                    // .subscribe(
                    //         data => console.log(data),
                    //         err => console.log(err),
                    //         () => console.log('Role Assignments Complete'));
        
    }

    getUsersInGroup(group) {
                //console.log(group.group.id);
                // const k5token = this.k5response;
                // //console.log(this.currentProject);
                const identityURL = this.utilityService.getEndpoint(this.userProjectToken.getValue(), 'identityv3');
                const endpointDetail = identityURL.concat('/groups/', group.group.id, '/users');
        
                //console.log(endpointDetail);
                // With CORS Proxy Service in use here
                const authURL = this.utilityService.sendViaCORSProxy(endpointDetail);
                //console.log(authURL);
        
                // retrieve the K5/OpenStack authentication token from the response header
                const token = this.userProjectToken.getValue().headers.get('x-subject-token');
                //console.log('Getting Users in Group');
        
                const postheaders: Headers = new Headers();
                postheaders.append('Content-Type', 'application/json');
                postheaders.append('Accept', 'application/json');
                postheaders.append('X-Auth-Token', token);
        
                const postopts: RequestOptions = new RequestOptions();
                postopts.headers = postheaders;
        
                return this.http.get(authURL, postopts)
                    .map((res: Response) => {
                            //console.log('New Group User List' + JSON.stringify(res));
                            this.changeUsersInGroup(res.json().users);
                            //console.log(this.usersInGroupList.getValue());
                            
                            // return res.json().projects as projects;
                            // return projects;
                    })
                    .subscribe(
                            data => console.log(data),
                            err => console.log(err),
                            () => console.log('Group Roles Complete'));
        
    }    

    // Get unscoped K5 global token
    getCentralPortalToken(username: string, password: string, contract: string) {
        // Without CORS Proxy Service in use
        const identityURL = 'https://auth-api.jp-east-1.paas.cloud.global.fujitsu.com/API/paas/auth/token';
        // With CORS Proxy Service in use here
        const authURL = this.utilityService.sendViaCORSProxy(identityURL);

        const body = {'auth':
                        {'identity':
                            {'password':
                                {'user':
                                   {'contract_number': contract,
                                    'name': username,
                                    'password': password
                                           }}}}};

        const bodyString = JSON.stringify(body); // Stringify payload

        const postheaders: Headers = new Headers();
        postheaders.append('Content-Type', 'application/json');
        postheaders.append('Accept', 'application/json');

        const postopts: RequestOptions = new RequestOptions();
        postopts.headers = postheaders;

        return this.http.post(authURL, bodyString, postopts)
            .map((gres: Response) => {

                this.changeGlobalToken(gres);
                // this.k5Globalresponse = gres;
                // retrieve the K5/OpenStack authentication token from the response header
                // this.user.globalToken = gres.headers.get('X-Access-Token');
                console.log('Central Portal Token => \n');
                console.log(this.userGlobalToken.getValue().json());

           });



    }



    // Get unscoped K5 regional token
    login(username: string, password: string, contract: string, region: string) {
        // Without CORS Proxy Service in use
        const identityURL = 'https://identity.'.concat(region, '.cloud.global.fujitsu.com/v3/auth/tokens');
        // With CORS Proxy Service in use here
        const authURL = this.utilityService.sendViaCORSProxy(identityURL);

        const body = {'auth':
                        {'identity':
                                {'methods': ['password'], 'password':
                                {'user':
                                    {'domain':
                                            {'name': contract},
                                             'name': username,
                                             'password': password
                                            }}}}};

        const bodyString = JSON.stringify(body); // Stringify payload

        const postheaders: Headers = new Headers();
        postheaders.append('Content-Type', 'application/json');
        postheaders.append('Accept', 'application/json');

        const postopts: RequestOptions = new RequestOptions();
        postopts.headers = postheaders;

        return this.http.post(authURL, bodyString, postopts)
            .map((res: Response) => {

                this.changeRegionalToken(res);
                this.changeLoginStatus(true);
                this.changeAZList([region + 'a', region + 'b']);
                this.changeAZ(region + 'b');
                console.log('New AZs');
                console.log(this.availabilityZoneList.getValue());
                console.log('Default AZone');
                console.log(this.currentAvailabilityZone.getValue());
                

                // retrieve Global token
                this.getCentralPortalToken(username, password, contract).subscribe();


                this.getKeystoneObjectList('projects').subscribe(projects => this.changeContractProjects(projects.json().projects));
                this.getKeystoneObjectList('users').subscribe(users => this.changeContractUsers(users.json().users));
                this.getKeystoneObjectList('roles').subscribe(roles => this.changeContractRoles(roles.json().roles));
                this.getKeystoneObjectList('groups').subscribe(groups => this.changeContractGroups(groups.json().groups));
                
                this.getProjectList().subscribe();


            });



    }


    logout() {
        this.changeLoginStatus(false);
    }
}



