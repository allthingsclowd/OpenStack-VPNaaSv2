import { NetworkService } from './services/network.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from './services/identity.service';
import { Component, OnInit } from '@angular/core';
import { IpsecvpnService } from './services/ipsecvpn.service';

@Component({
  selector: 'app-ipsecvpn',
  templateUrl: './ipsecvpn.component.html',
  styleUrls: ['./ipsecvpn.component.css']
})
export class IpsecvpnComponent implements OnInit {
  vpnServices: any;
  vpnService: any;
  ipsecPolicies: any;
  ipsecPolicy: any;
  ikePolicies: any;
  ikePolicy: any;
  ipsecConnections: any;
  ipsecConnection: any;
  currentProjectT: any;
  azones: any;
  subnets: any;
  routers: any;
  amendVpnServiceForm: FormGroup;
  addVpnServiceForm: FormGroup;
  amendIpsecPolicyForm: FormGroup;
  addIpsecPolicyForm: FormGroup;
  amendIkePolicyForm: FormGroup;
  addIkePolicyForm: FormGroup;
  amendConnectionForm: FormGroup;
  addConnectionForm: FormGroup;

  // api parameters
  defaultName = 'Enter resource name';
  defaultDescription = 'Enter resource description';
  auth_algorithm = ['sha1'];
  encryption_algorithm = ['aes-128', 'aes-256', 'aes-192'];
  pfs = ['group2', 'group5', 'group14'];
  phase1_negotiation_mode = ['main'];
  ike_version = ['v1'];
  transform_protocol = ['esp'];
  encapsulation_mode = ['tunnel'];
  initiator = ['bi-directional', 'response-only'];
  dpdProtocol = ['hold', 'restart'];
  adminState = [true, false];





  constructor(private ipsecvpnService: IpsecvpnService,
              private identityService: IdentityService,
              private networkService: NetworkService) {

    this.ipsecvpnService.ipsecPolicies.subscribe(policies => this.ipsecPolicies = policies);
    this.ipsecvpnService.ipsecPolicy.subscribe(policy => this.ipsecPolicy = policy);
    this.ipsecvpnService.ikePolicies.subscribe(policies => this.ikePolicies = policies);
    this.ipsecvpnService.ikePolicy.subscribe(policy => this.ikePolicy = policy);
    this.ipsecvpnService.vpnServices.subscribe(services => this.vpnServices = services);
    this.ipsecvpnService.vpnService.subscribe(service => this.vpnService = service);
    this.ipsecvpnService.ipsecConnections.subscribe(connections => this.ipsecConnections = connections);
    this.ipsecvpnService.ipsecConnection.subscribe(connection => this.ipsecConnection = connection);
    this.identityService.userPToken.subscribe(currentProjectToken => this.currentProjectT = currentProjectToken);
    this.identityService.availabilityZones.subscribe(azList => this.azones = azList);
    this.networkService.userRouters.subscribe(projectRouters => this.routers = projectRouters);
    this.networkService.userSubNetworks.subscribe(projectSubnets => this.subnets = projectSubnets);

  }

  ngOnInit() {

    this.amendVpnServiceForm = new FormGroup({
      'name': new FormControl(null),
      'adminState': new FormControl(null),
      'description': new FormControl(null)
      });

    this.addVpnServiceForm = new FormGroup({
      'name': new FormControl(this.defaultName, [Validators.required]),
      'description': new FormControl(this.defaultDescription, [Validators.required]),
      'subnet_id': new FormControl('Select Subnet', [Validators.required]),
      'router_id': new FormControl('Select Router', [Validators.required]),
      'availability_zone': new FormControl(this.azones[0], [Validators.required])
      });

    this.amendIpsecPolicyForm = new FormGroup({
      'name': new FormControl(null),
      'encryption_algorithm': new FormControl(null),
      'pfs': new FormControl(null),
      'ipsecLtValue': new FormControl(null),
      'description': new FormControl(null)
      });

    this.addIpsecPolicyForm = new FormGroup({
      'name': new FormControl(this.defaultName, [Validators.required]),
      'description': new FormControl(this.defaultDescription, [Validators.required]),
      'transform_protocol': new FormControl(this.transform_protocol[0], [Validators.required]),
      'auth_algorithm': new FormControl(this.auth_algorithm[0], [Validators.required]),
      'encapsulation_mode': new FormControl(this.encapsulation_mode[0], [Validators.required]),
      'encryption_algorithm': new FormControl(this.encryption_algorithm[1], [Validators.required]),
      'pfs': new FormControl(this.pfs[2], [Validators.required]),
      'ipsecLtValue': new FormControl(7200, [Validators.required]),
      'availability_zone': new FormControl(this.azones[0], [Validators.required])
      });

    this.amendIkePolicyForm = new FormGroup({
      'encryption_algorithm': new FormControl(null),
      'pfs': new FormControl(null),
      'ikeLtValue': new FormControl(null),
      'name': new FormControl(null),
      'description': new FormControl(null)
      });

    this.addIkePolicyForm = new FormGroup({
      'phase1_negotiation_mode': new FormControl(this.phase1_negotiation_mode[0], [Validators.required]),
      'auth_algorithm': new FormControl(this.auth_algorithm[0], [Validators.required]),
      'encryption_algorithm': new FormControl(this.encryption_algorithm[1], [Validators.required]),
      'pfs': new FormControl(this.pfs[2], [Validators.required]),
      'ikeLtValue': new FormControl(7200, [Validators.required]),
      'ike_version': new FormControl(this.ike_version[0], [Validators.required]),
      'name': new FormControl(this.defaultName, [Validators.required]),
      'description': new FormControl(this.defaultName, [Validators.required]),
      'availability_zone': new FormControl(this.azones[0], [Validators.required])
      });

    this.amendConnectionForm = new FormGroup({
      'psk': new FormControl(null),
      'peer_cidrs': new FormControl(null),
      'peer_address': new FormControl(null),
      'peer_id': new FormControl(null),
      'name': new FormControl(null),
      'description': new FormControl(null),
      'initiator': new FormControl(null),
      'dpd_protocol': new FormControl(null),
      'dpd_interval': new FormControl(null),
      'dpd_timeout': new FormControl(null),
      'admin_state_up': new FormControl(null)
      });

    this.addConnectionForm = new FormGroup({
      'psk': new FormControl(null, [Validators.required]),
      'ipsecpolicy_id': new FormControl('Select IPSec Policy', [Validators.required]),
      'peer_cidrs': new FormControl(null, [Validators.required]),
      'initiator': new FormControl(this.initiator[0], [Validators.required]),
      'ikepolicy_id': new FormControl('Select IKE Policy', [Validators.required]),
      'vpnservice_id': new FormControl('Select VPN Service', [Validators.required]),
      'peer_address': new FormControl('Enter remote ip address', [Validators.required]),
      'peer_id': new FormControl('Enter any remote identifier', [Validators.required]),
      'dpd_protocol': new FormControl(this.dpdProtocol[0], [Validators.required]),
      'dpd_interval': new FormControl(30, [Validators.required]),
      'dpd_timeout': new FormControl(120, [Validators.required]),
      'admin_state_up': new FormControl(true, [Validators.required]),
      'name': new FormControl(this.defaultName, [Validators.required]),
      'description': new FormControl(this.defaultDescription, [Validators.required]),
      'availability_zone': new FormControl(this.azones[0], [Validators.required])
      });

      
  }

  vpnChange(service) {
    console.log(service);
    this.ipsecvpnService.vpnServiceShow(this.currentProjectT, service.id);
    this.amendVpnServiceForm.patchValue({name: service.name, description: service.description, adminState: service.admin_state_up});
    this.ipsecvpnService.changeVpnService(service);
  }

  ipsecPolicyChange(policy) {
    console.log(policy);
    this.ipsecvpnService.ipsecPolicyShow(this.currentProjectT, policy.id);
    this.amendIpsecPolicyForm.patchValue({name: policy.name,
                                          description: policy.description,
                                          encryption_algorithm: policy.encryption_algorithm,
                                          pfs: policy.pfs,
                                          ipsecLtValue: policy.lifetime.value
                                           });
    this.ipsecvpnService.changeIpsecPolicy(policy);
  }

  ikePolicyChange(policy) {
    console.log(policy);
    this.ipsecvpnService.ikePolicyShow(this.currentProjectT, policy.id);
    this.amendIkePolicyForm.patchValue({name: policy.name,
      description: policy.description,
      encryption_algorithm: policy.encryption_algorithm,
      pfs: policy.pfs,
      ikeLtValue: policy.lifetime.value
       });
    this.ipsecvpnService.changeIkePolicy(policy);
  }

  connectionChange(connection) {
    console.log(connection);
    this.ipsecvpnService.ipsecSiteConnectionShow(this.currentProjectT, connection.id);
    this.amendConnectionForm.patchValue({

        name: connection.name,
        description: connection.description,
        psk: connection.psk,
        initiator: connection.initiator,
        peer_cidrs: connection.peer_cidrs,
        peer_address: connection.peer_address,
        peer_id: connection.peer_id,
        dpd_protocol: connection.dpd.action,
        dpd_interval: connection.dpd.interval,
        dpd_timeout: connection.dpd.timeout,
        admin_state_up: connection.admin_state_up


    });
    this.ipsecvpnService.changeIpsecConnection(connection);
  }

  addVpnService() {
    this.ipsecvpnService.vpnServiceCreate(this.currentProjectT,
                this.addVpnServiceForm.get('name').value,
                this.addVpnServiceForm.get('description').value,
                this.addVpnServiceForm.get('router_id').value,
                this.addVpnServiceForm.get('subnet_id').value,
                this.addVpnServiceForm.get('availability_zone').value
              );
    this.addVpnServiceForm.reset();

  }

  updateVpnService() {
    console.log(this.vpnService);
    this.ipsecvpnService.vpnServiceUpdate(this.currentProjectT,
      this.vpnService.vpnservice.id,
      this.amendVpnServiceForm.get('name').value,
      this.amendVpnServiceForm.get('adminState').value,
      this.amendVpnServiceForm.get('description').value

    );
    this.amendVpnServiceForm.reset();

  }

  deleteVpnService() {
    this.ipsecvpnService.vpnServiceDelete(this.currentProjectT,
                      this.vpnService.vpnservice.id);
    this.amendVpnServiceForm.reset();

  }

  deleteIpsecPolicy() {
    this.ipsecvpnService.ipsecPolicyDelete(this.currentProjectT,
        this.ipsecPolicy.id);
    this.amendIpsecPolicyForm.reset();

  }

  updateIpsecPolicy() {
    console.log(this.ipsecPolicy);
    this.ipsecvpnService.ipsecPolicyUpdate(this.currentProjectT,
      this.ipsecPolicy.id,
      this.amendIpsecPolicyForm.get('name').value,
      this.amendIpsecPolicyForm.get('encryption_algorithm').value,
      this.amendIpsecPolicyForm.get('pfs').value,
      this.amendIpsecPolicyForm.get('ipsecLtValue').value,
      this.amendIpsecPolicyForm.get('description').value,
    );
    this.amendIpsecPolicyForm.reset();

  }

  addIpsecPolicy() {
    console.log(this.addIpsecPolicyForm);
    this.ipsecvpnService.ipsecPolicyCreate(this.currentProjectT,
      this.addIpsecPolicyForm.get('name').value,
      this.addIpsecPolicyForm.get('description').value,
      this.addIpsecPolicyForm.get('transform_protocol').value,
      this.addIpsecPolicyForm.get('auth_algorithm').value,
      this.addIpsecPolicyForm.get('encryption_algorithm').value,
      this.addIpsecPolicyForm.get('encapsulation_mode').value,
      this.addIpsecPolicyForm.get('pfs').value,
      this.addIpsecPolicyForm.get('ipsecLtValue').value,
      this.addIpsecPolicyForm.get('availability_zone').value
    );
    this.addIpsecPolicyForm.reset();

  }

  deleteIkePolicy() {
    this.ipsecvpnService.ikePolicyDelete(this.currentProjectT,
        this.ikePolicy.ikepolicy.id);
    this.amendIkePolicyForm.reset();

  }

  updateIkePolicy() {
    console.log(this.ikePolicy);
    this.ipsecvpnService.ikePolicyUpdate(this.currentProjectT,
      this.ikePolicy.ikepolicy.id,
      this.amendIkePolicyForm.get('name').value,
      this.amendIkePolicyForm.get('encryption_algorithm').value,
      this.amendIkePolicyForm.get('ikeLtValue').value,
      this.amendIkePolicyForm.get('pfs').value,
      this.amendIkePolicyForm.get('description').value,
    );
    this.amendIkePolicyForm.reset();

  }

  addIkePolicy() {
    console.log(this.addIkePolicyForm);
    this.ipsecvpnService.ikePolicyCreate(this.currentProjectT,
      this.addIkePolicyForm.get('name').value,
      this.addIkePolicyForm.get('description').value,
      this.addIkePolicyForm.get('auth_algorithm').value,
      this.addIkePolicyForm.get('encryption_algorithm').value,
      this.addIkePolicyForm.get('ikeLtValue').value,
      this.addIkePolicyForm.get('ike_version').value,
      this.addIkePolicyForm.get('pfs').value,
      this.addIkePolicyForm.get('phase1_negotiation_mode').value,
      this.addIkePolicyForm.get('availability_zone').value
    );
    this.addIkePolicyForm.reset();

  }

  deleteSiteConnection() {
    this.ipsecvpnService.ipsecSiteConnectionDelete(this.currentProjectT,
        this.ipsecConnection.id);
    this.amendConnectionForm.reset();

  }

  updateSiteConnection() {
    console.log(this.ipsecConnection);
    console.log(this.amendConnectionForm);
    this.ipsecvpnService.ipsecSiteConnectionUpdate(this.currentProjectT,
      this.ipsecConnection.id,
      this.amendConnectionForm.get('initiator').value,
      this.amendConnectionForm.get('peer_id').value,
      this.amendConnectionForm.get('peer_address').value,
      this.amendConnectionForm.get('peer_cidrs').value,
      this.amendConnectionForm.get('psk').value,
      this.amendConnectionForm.get('name').value,
      this.amendConnectionForm.get('description').value,
      this.amendConnectionForm.get('admin_state_up').value,
      this.amendConnectionForm.get('dpd_protocol').value,
      this.amendConnectionForm.get('dpd_interval').value,
      this.amendConnectionForm.get('dpd_timeout').value
    );
    this.amendConnectionForm.reset();

  }

  addSiteConnection() {
    console.log(this.addConnectionForm);
    this.ipsecvpnService.ipsecSiteConnectionCreate(this.currentProjectT,
      this.addConnectionForm.get('name').value,
      this.addConnectionForm.get('description').value,
      this.addConnectionForm.get('initiator').value,
      this.addConnectionForm.get('vpnservice_id').value,
      this.addConnectionForm.get('ikepolicy_id').value,
      this.addConnectionForm.get('ipsecpolicy_id').value,
      this.addConnectionForm.get('peer_id').value,
      this.addConnectionForm.get('peer_address').value,
      this.addConnectionForm.get('peer_cidrs').value,
      this.addConnectionForm.get('psk').value,
      this.addConnectionForm.get('admin_state_up').value,
      this.addConnectionForm.get('dpd_protocol').value,
      this.addConnectionForm.get('dpd_interval').value,
      this.addConnectionForm.get('dpd_timeout').value,
      this.addConnectionForm.get('availability_zone').value
    );
    this.addConnectionForm.reset();

  }
}
