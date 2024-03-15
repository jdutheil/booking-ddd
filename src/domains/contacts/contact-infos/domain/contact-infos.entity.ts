import { Email } from '@clerk/clerk-sdk-node';
import { Option } from 'oxide.ts';
import { Address } from './value-objects/address';
import { Website } from './value-objects/website';

export type Emails = Email[];
export type Phones = string[];

export interface ContactInfosProps {
  emails: Emails;
  phones: Phones;
  website: Website;
  address: Option<Address>;
}
