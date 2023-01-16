import { ArgumentNotProvidedException } from '@libs/exception';
import { isEmpty } from 'lodash';

export type Primitives = string | number | boolean;
export interface DomainPrimitive<T extends Primitives | Date> {
  value: T;
}

type ValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T;

export abstract class ValueObject<T> {
  readonly props: ValueObjectProps<T>;

  constructor(props: ValueObjectProps<T>) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  protected abstract validate(props: ValueObjectProps<T>): void;

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(vo);
  }

  private checkIfEmpty(props: ValueObjectProps<T>): void {
    if (isEmpty(props) || (this.isDomainPrimitive(props) && !props.value)) {
      throw new ArgumentNotProvidedException('Property cannot be empty');
    }
  }

  private isDomainPrimitive(obj: unknown): obj is DomainPrimitive<T & (Primitives | Date)> {
    const props = Object.getOwnPropertyNames(obj);
    return props.includes('value');
  }
}
