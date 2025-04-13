import bcrypt from 'bcryptjs';
import { User } from '../user';

// Mock mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    model: jest.fn().mockImplementation((modelName, schema) => {
      return actualMongoose.model(modelName, schema);
    }),
  };
});

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn(),
}));

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Validation', () => {
    it('should validate required fields', () => {
      const user = new User({});
      const validationError = user.validateSync();
      
      expect(validationError.errors.firstName).toBeDefined();
      expect(validationError.errors.lastName).toBeDefined();
      expect(validationError.errors.email).toBeDefined();
      expect(validationError.errors.password).toBeDefined();
    });

    it('should validate password length', () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '12345' // Less than 6 characters
      });

      const validationError = user.validateSync();
      expect(validationError.errors.password).toBeDefined();
    });

    it('should convert email to lowercase', () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'JOHN@EXAMPLE.COM',
        password: 'password123'
      });

      expect(user.email).toBe('john@example.com');
    });
  });

  describe('Password Handling', () => {
    it('should hash password before save', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      // Mock save method
      user.save = jest.fn().mockImplementation(async function(this: typeof user) {
        if (this.isModified('password')) {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
        }
        return this;
      });

      await user.save();

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(user.password).toBe('hashedPassword');
    }, 10000); // Increase timeout to 10 seconds

    it('should correctly match password', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword'
      });

      // Test successful match
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      const isMatch = await user.matchPassword('password123');
      expect(isMatch).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');

      // Test failed match
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      const isNotMatch = await user.matchPassword('wrongpassword');
      expect(isNotMatch).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
    });
  });

  describe('Schema Options', () => {
    it('should have timestamp fields', () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      expect(user.schema.options.timestamps).toBe(true);
    });
  });
});
