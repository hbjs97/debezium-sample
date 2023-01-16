/* eslint-disable @typescript-eslint/naming-convention */
import { Enum, EnumType } from 'ts-jenum';

export type ERoleProps = 'STUDENT' | 'TUTOR' | 'ADMIN' | 'UNAUTHORIZED';

@Enum('code')
export class ERole extends EnumType<ERole>() {
  static readonly STUDENT: ERole = new ERole('STUDENT', '학생');
  static readonly TUTOR: ERole = new ERole('TUTOR', '튜터');
  static readonly ADMIN: ERole = new ERole('ADMIN', '관리자');
  static readonly UNAUTHORIZED: ERole = new ERole('UNAUTHORIZED', '미인증');

  protected constructor(private readonly _code: ERoleProps, private readonly _name: string) {
    super();
  }

  get code(): ERoleProps {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  equals(code: string | ERoleProps | ERole): boolean {
    if (typeof code === 'string') {
      return code === this.code;
    }
    return this === code;
  }

  isStudent(): boolean {
    return ERole.STUDENT.equals(this.code);
  }

  isTutor(): boolean {
    return ERole.TUTOR.equals(this.code);
  }

  isAdmin(): boolean {
    return ERole.ADMIN.equals(this.code);
  }

  static pick(...props: ERoleProps[]): ERole[] {
    return this.values().filter((e) => props.map((v) => v.toString()).includes(e.code.toString()));
  }

  static omit(...props: ERoleProps[]): ERole[] {
    return this.values().filter((e) => !props.map((v) => v.toString()).includes(e.code.toString()));
  }

  static asString(): string[] {
    return this.values().map((v) => v.code.toString());
  }
}
