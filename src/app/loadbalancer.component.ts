import { IdentityService } from './services/identity.service';
import { Component, OnInit } from '@angular/core';
import { LoadbalancerService } from './services/loadbalancer.service';

@Component({
  selector: 'app-loadbalancer',
  templateUrl: './loadbalancer.component.html',
  styleUrls: ['./loadbalancer.component.css']
})
export class LoadbalancerComponent implements OnInit {

  userLBaaS: any;
  userLBaaSDetails: any;
  currentProjectT: any = null;

  constructor(  private loadBalancerService: LoadbalancerService,
                private identityService: IdentityService ) { }

  ngOnInit() {
    this.loadBalancerService.userLBaaS.subscribe(lbaas => this.userLBaaS = lbaas);
    this.loadBalancerService.LBaaSDetails.subscribe(lbaasdetail => this.userLBaaSDetails = lbaasdetail);
    this.identityService.userPToken.subscribe(currentProjectToken => this.currentProjectT = currentProjectToken);
  }

  LBaaSChange(LBaaS) {
    this.loadBalancerService.getLBaaSDetailOrList(this.currentProjectT, LBaaS.LoadBalancerName);
    //console.log('Change LBaaS Detail => ');
    //console.log(this.userLBaaSDetails);
  }

  onLBaaSDelete(LBaaS) {
    //console.log('Deleting LBaaS => ');
    //console.log(LBaaS);
    this.loadBalancerService.deleteLBaaS(this.currentProjectT, LBaaS.LoadBalancerName);
    this.loadBalancerService.changeLBaaSDetails(null);
    this.loadBalancerService.getLBaaSDetailOrList(this.currentProjectT, 'all');
  }

}
