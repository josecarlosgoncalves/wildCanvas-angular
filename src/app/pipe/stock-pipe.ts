import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stock',
  standalone: true,
})
export class StockPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 10) {
      return `Stock : ${value} (Disponível)`;
    } else if (value > 3) {
      return `Stock : ${value} (Restrito)`;
    } else if (value > 0) {
      return `Stock : ${value} (pouco stock)`;
    } else {
      return 'Sem Stock';
    }
  }
}
