import { Component, OnInit } from '@angular/core';
import { NetworkService } from './services/network.service';
import { IdentityService } from './services/identity.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.css']
})
export class RouterComponent implements OnInit {
  userRouters: any;
  currentProjectT: any;
  routerDetails: any;
  newRoutesForm: FormGroup;
  currentRouter: any;
  routerStatus: any;

  constructor(  private networkService: NetworkService,
                private identityService: IdentityService) { }

  ngOnInit() {
    this.networkService.userRouters.subscribe(routers => this.userRouters = routers);
    this.networkService.routerDetails.subscribe(routerDetail => this.routerDetails = routerDetail);
    this.networkService.routerStatus.subscribe(routerUpdateStatus => this.routerStatus = routerUpdateStatus);
    this.identityService.userPToken.subscribe(currentProjectToken => this.currentProjectT = currentProjectToken);

    this.newRoutesForm = new FormGroup({
      'routeData': new FormGroup({
        'routes': new FormControl(null, [Validators.required])
      })
    });

    console.log('Router Details');
    console.log(this.userRouters);
  }

  routerChange(router) {
    console.log(router);
    this.networkService.getRouterDetails(this.currentProjectT, router);
    this.currentRouter = router;
    //console.log('Change LBaaS Detail => ');
    //console.log(this.userLBaaSDetails);
  }


  onRouteReplace(routes) {
    this.networkService.updateRouterRoutes(this.currentProjectT, this.currentRouter, routes);
    this.newRoutesForm.reset();
  }

  onRouteAppend(routes) {
    let newRoutes = null;
    if (this.routerDetails.routes.length > 0) {
      newRoutes = JSON.parse(routes);
      let existingRoutes = this.routerDetails.routes;
      for (const newRoute of newRoutes){
        existingRoutes.push(newRoute);
        newRoutes = existingRoutes;
      }
      newRoutes = JSON.stringify(existingRoutes);
    }
    this.networkService.updateRouterRoutes(this.currentProjectT, this.currentRouter, newRoutes);
    this.newRoutesForm.reset();
    console.log(this.routerStatus);
  }

  onRouteDelete() {
    this.networkService.updateRouterRoutes(this.currentProjectT, this.currentRouter, '[]');
    this.newRoutesForm.reset();
  }

}
