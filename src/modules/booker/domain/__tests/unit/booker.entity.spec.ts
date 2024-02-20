import { BookerEntity } from '../../booker.entity';
import { CreateBookerProps } from '../../booker.types';

describe('BookerEntity', () => {
  describe('create', () => {
    it('should create a BookerEntity', async () => {
      const createBookerProps: CreateBookerProps = {
        email: 'email',
        password: 'password',
      };

      const booker = await BookerEntity.create(createBookerProps);
      expect(booker).toBeInstanceOf(BookerEntity);
      expect(booker.id).toBeDefined();
      expect(booker.createdAt).toBeDefined();
      expect(booker.updatedAt).toBeDefined();
      expect(booker.email).toBe(createBookerProps.email);
      await expect(
        booker.comparePassword(createBookerProps.password),
      ).resolves.toBe(true);
    });
  });
});
