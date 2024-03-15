import { Email } from '@clerk/clerk-sdk-node';
import { Website } from './value-objects/website';

export type Emails = Email[];
export type Phones = string[];

export interface ContactInfosProps {
  emails: Emails;
  phones: Phones;
  website: Website;
}
