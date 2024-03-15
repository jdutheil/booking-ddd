import { Email } from '@clerk/clerk-sdk-node';

export type Emails = Email[];
export type Phones = string[];

export interface ContactInfosProps {
  emails: Emails;
  phones: Phones;
}
