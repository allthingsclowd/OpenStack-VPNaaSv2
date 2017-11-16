import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayObject'
})
export class DisplayObjectPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Object.keys(value).map(key => {
      Object.assign({ key }, value[key]);
      // //console.log("Piping Object");
      // //console.log(key);
      // //console.log(value[key].name);
    });
  }

}
