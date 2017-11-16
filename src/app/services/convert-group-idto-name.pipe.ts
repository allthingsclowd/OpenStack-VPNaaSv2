import { Pipe, PipeTransform } from '@angular/core';
import { IdentityService } from '../services/identity.service';

@Pipe({
  name: 'convertGroupIDtoName'
})
export class ConvertGroupIDtoNamePipe implements PipeTransform {

  contractGroups: any = null;

  constructor(private identityService: IdentityService) {
    this.identityService.contractGroups.subscribe(groups => this.contractGroups = groups);
   
    // //console.log('Contract  Group IDs in Pipe constructor');
    // //console.log(this.contractGroups);

               }

  transform(value: any, args?: any): any {
    // //console.log('Contract Users iside Pipe');
    // //console.log(this.contractGroups);
    let itemName = 'None';

    for (let item in this.contractGroups) {

        if (this.contractGroups[item].id === value) {
            // //console.log('Group Comparison');
            // //console.log(value);
            // //console.log((this.contractGroups[item].id));
            // //console.log('Group PipeMatch' + (this.contractGroups[item].name));
            itemName = this.contractGroups[item].name;
            break;
        } else {
          // //console.log('Group Comparison');
          // //console.log(value);
          // //console.log((this.contractGroups[item].id));
        }

    }

    return itemName;
  }

}
