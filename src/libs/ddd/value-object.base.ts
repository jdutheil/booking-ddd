export abstract class ValueObject<ValueObjectProps> {
  protected readonly props: ValueObjectProps;

  constructor(props: ValueObjectProps) {
    this.props = props;
  }

  public equals(vo?: ValueObject<ValueObjectProps>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
