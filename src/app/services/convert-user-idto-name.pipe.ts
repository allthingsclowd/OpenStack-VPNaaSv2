import { Pipe, PipeTransform } from '@angular/core';
import { IdentityService } from '../services/identity.service';

@Pipe({
  name: 'convertUserIDtoName'
})
export class ConvertUserIDtoNamePipe implements PipeTransform {

  contractUsers: any  = null;

  constructor(private identityService: IdentityService) {
    this.identityService.contractUsers.subscribe(users => this.contractUsers = users);

    // //console.log('Contract User IDs in Pipe constructor');
    // //console.log(this.contractUsers);

               }

  transform(value: any, args?: any): any {
    // //console.log('Contract Users iside Pipe');
    // //console.log(this.contractUsers);
    let itemName = 'None';

    for (let item in this.contractUsers) {

        if (this.contractUsers[item].id === value) {
            // //console.log('Comparison');
            // //console.log(value);
            // //console.log((this.contractUsers[item].id));
            // //console.log('PipeMatch' + (this.contractUsers[item].name));
            itemName = this.contractUsers[item].name;
            break;
        } else {
          // //console.log('Comparison');
          // //console.log(value);
          // //console.log((this.contractUsers[item].id));
        }

    }

    return itemName;
  }

}
