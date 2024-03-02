import { Booker } from '../../booker.entity';
import { CreateBookerProps } from '../../booker.types';

describe('Booker', () => {
  describe('create', () => {
    it('should create a Booker', async () => {
      const createBookerProps: CreateBookerProps = {
        email: 'email',
      };

      const booker = await Booker.create(createBookerProps);
      expect(booker).toBeInstanceOf(Booker);
      expect(booker.id).toBeDefined();
      expect(booker.createdAt).toBeDefined();
      expect(booker.updatedAt).toBeDefined();
      expect(booker.email).toBe(createBookerProps.email);
    });
  });
});
