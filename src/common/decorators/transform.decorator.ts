import { Transform, TransformFnParams } from 'class-transformer';

export function RemoveAccents() {
  return Transform((params: TransformFnParams) => {
    const value = params.value;
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  });
}
