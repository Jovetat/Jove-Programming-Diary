export interface ExObj {
  id: any
  name: string
  telephone: string | number
  address?: string
  [key: string]: any
}

export enum ExEnum {
  NoVip = 'NoVip',
  Facial = 'Facial',
  Card = 'Card',
  Phone = 'Phone',
}
