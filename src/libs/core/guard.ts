import { Err, Ok, Result } from 'oxide.ts';

export interface GuardArgument {
  argument: any;
  argumentName: string;
}
export type GuardArguments = GuardArgument[];

export class Guard {
  public static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): Result<void, string> {
    if (argument === null || argument === undefined) {
      return Err(`${argumentName} is null or undefined`);
    } else {
      return Ok(undefined);
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArguments,
  ): Result<void, string> {
    args.forEach((arg: GuardArgument) => {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName,
      );
      if (result.isErr()) {
        return result;
      }
    });

    return Ok(undefined);
  }
}
