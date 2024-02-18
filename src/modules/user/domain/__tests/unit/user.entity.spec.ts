import { UserEntity } from '../../user.entity';
import { CreateUserProps } from '../../user.types';

describe('UserEntity', () => {
  describe('create', () => {
    it('should create a UserEntity', async () => {
      const createUserProps: CreateUserProps = {
        email: 'email',
        password: 'password',
      };

      const user = await UserEntity.create(createUserProps);
      expect(user).toBeInstanceOf(UserEntity);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.email).toBe(createUserProps.email);
      await expect(
        user.comparePassword(createUserProps.password),
      ).resolves.toBe(true);
    });
  });
});
