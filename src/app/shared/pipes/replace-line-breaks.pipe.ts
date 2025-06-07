import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceLineBreaks',
  standalone: true
})
export class ReplaceLineBreaksPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    //console.log(value ? value.replaceAll(/\\n/g, "<br />") : '');
    return value ? value.replaceAll(/\\n/g, "<br />") : '';
  }
}
