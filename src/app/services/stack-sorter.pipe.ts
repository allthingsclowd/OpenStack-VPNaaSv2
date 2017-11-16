import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stackSorter'
})
export class StackSorterPipe implements PipeTransform {

  transform(arr: any, args?: any): any {
    if(!arr){ return; }
    return arr.sort((a, b) => {
        if ((a.stack_name).toLowerCase() > (b.stack_name).toLowerCase()) {
          return 1;
        }
        if ((a.stack_name).toLowerCase() < (b.stack_name).toLowerCase()) {
          return -1;
        }
        return 0;
      });
  }

}
