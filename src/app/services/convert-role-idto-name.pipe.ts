import { Pipe, PipeTransform } from '@angular/core';
import { IdentityService } from '../services/identity.service';

@Pipe({
  name: 'convertRoleIDtoName'
})
export class ConvertRoleIDtoNamePipe implements PipeTransform {

  contractRoles: any = null;


  constructor(private identityService: IdentityService) {
    this.identityService.contractRoles.subscribe(roles => this.contractRoles = roles);
    
    // //console.log('Contract IDs in Pipe constructor');
    // //console.log(this.contractRoles);

               }

  transform(value: any, args?: any): any {
    // //console.log('Contract Users iside Pipe');
    // //console.log(this.contractRoles);
    let itemName = 'None';

    for (let item in this.contractRoles) {

        if (this.contractRoles[item].id === value) {
            // //console.log('Comparison');
            // //console.log(value);
            // //console.log((this.contractRoles[item].id));
            // //console.log('PipeMatch' + (this.contractRoles[item].name));
            itemName = this.contractRoles[item].name;
            break;
        } else {
          // //console.log('Comparison');
          // //console.log(value);
          // //console.log((this.contractRoles[item].id));
        }

    }

    return itemName;
  }

}
