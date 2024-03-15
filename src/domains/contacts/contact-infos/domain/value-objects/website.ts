import { Guard } from '@src/libs/core/guard';
import { ValueObject } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { InvalidWebsiteError } from '../contact-infos.errors';

export interface WebsiteProps {
  link: string;
}

export class Website extends ValueObject<WebsiteProps> {
  get link(): string {
    return this.props.link;
  }

  private constructor(props: WebsiteProps) {
    super(props);
  }

  public static create(link: string): Result<Website, InvalidWebsiteError> {
    const linkResult = Guard.againstNullOrUndefined(link, 'link');
    if (linkResult.isErr()) {
      return Err(new InvalidWebsiteError(linkResult.unwrapErr()));
    }

    if (!this.isValidWebsite(link)) {
      return Err(new InvalidWebsiteError('Invalid website'));
    }

    return Ok(new Website({ link }));
  }

  private static isValidWebsite(link: string): boolean {
    const websiteRegex =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    return websiteRegex.test(link);
  }
}
