import { ApiProperty } from '@nestjs/swagger';

export class OrganizerResponse {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  constructor({ id, name }: { id: string; name: string }) {
    this.id = id;
    this.name = name;
  }
}

export class OrganizersResponse {
  @ApiProperty({
    isArray: true,
    type: () => OrganizerResponse,
  })
  readonly data: OrganizerResponse[];

  constructor(data: OrganizerResponse[]) {
    this.data = data;
  }
}
