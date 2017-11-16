import { Pipe, PipeTransform } from '@angular/core';
import { IdentityService } from '../services/identity.service';

@Pipe({
  name: 'convertProjectIDtoName'
})
export class ConvertProjectIDtoNamePipe implements PipeTransform {

  contractProjects: any = null;

  constructor(private identityService: IdentityService) {
    this.identityService.contractProjects.subscribe(projects => this.contractProjects = projects);
    
    // //console.log('Contract Project IDs in Pipe constructor');
    // //console.log(this.contractProjects);

               }

  transform(value: any, args?: any): any {
    // //console.log('Contract Users iside Pipe');
    // //console.log(this.contractProjects);
    let itemName = 'None';

    for (let item in this.contractProjects) {

        if (this.contractProjects[item].id === value) {
            // //console.log('Comparison');
            // //console.log(value);
            // //console.log((this.contractProjects[item].id));
            // //console.log('PipeMatch' + (this.contractProjects[item].name));
            itemName = this.contractProjects[item].name;
            break;
        } else {
          // //console.log('Comparison');
          // //console.log(value);
          // //console.log((this.contractProjects[item].id));
        }

    }

    return itemName;
  }

}
