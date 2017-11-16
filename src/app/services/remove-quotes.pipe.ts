import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeQuotes'
})
export class RemoveQuotesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.indexOf('"') > -1) {
      return value.replace (/"/g,'');
    } else {
      return value;
    }
  }

}
