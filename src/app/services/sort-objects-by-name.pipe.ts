import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortObjectsByName'
})
export class SortObjectsByNamePipe implements PipeTransform {

  transform(arr: any, args?: any): any {
    if(!arr){ return; }
    return arr.sort((a, b) => {
        if ((a.name).toLowerCase() > (b.name).toLowerCase()) {
          return 1;
        }
        if ((a.name).toLowerCase() < (b.name).toLowerCase()) {
          return -1;
        }
        return 0;
      });
  }

}
