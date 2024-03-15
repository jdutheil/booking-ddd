import { Website } from '../../value-objects/website';

describe('Website Value Object', () => {
  it('should return an error if website is not valid', () => {
    const website = Website.create('wrong-format');
    expect(website.isErr()).toBe(true);
  });

  it('should return a website object if website is valid', () => {
    const website = Website.create('https://www.google.com');
    expect(website.isOk()).toBe(true);
  });

  it('should accept websites without protocol', () => {
    const website = Website.create('www.google.com');
    expect(website.isOk()).toBe(true);
  });

  it('should accept website without www', () => {
    const website = Website.create('https://google.com');
    expect(website.isOk()).toBe(true);
  });

  it('should accept website without protocol nor www', () => {
    const website = Website.create('google.com');
    expect(website.isOk()).toBe(true);
  });
});
