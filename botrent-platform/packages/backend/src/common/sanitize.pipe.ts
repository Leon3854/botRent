import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      // Блокируем SQL-инъекции и XSS
      const dangerous = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|SCRIPT|ONLOAD)\b)|[<>{}]/gi;
      if (dangerous.test(value)) {
        throw new BadRequestException('Invalid input detected');
      }
      // Очищаем
      return value.replace(/[<>{}]/g, '').trim();
    }
    if (typeof value === 'object' && value !== null) {
      for (const key of Object.keys(value)) {
        value[key] = this.transform(value[key]);
      }
    }
    return value;
  }
}
