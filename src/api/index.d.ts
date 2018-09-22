export interface Pageable {
  page:number,
  size:number,
  total: number
}

export interface ResponseResult<T> {
  success:boolean,
  message: string,
  code: string,
  data : T
}
export interface Pageable {
  content: any,
  number: number,
  size: number,
  totalElements: number,
  first:boolean,
  last:boolean,
  totalPages: number,
}
