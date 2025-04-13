import authReducer, {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} from '../authSlice';

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle loginRequest', () => {
    const actual = authReducer(initialState, loginRequest({ email: 'test@example.com', password: 'password' }));
    expect(actual.loading).toBe(true);
    expect(actual.error).toBe(null);
  });

  it('should handle loginSuccess', () => {
    const user = { id: 1, email: 'test@example.com' };
    const token = 'test-token';
    const actual = authReducer(
      { ...initialState, loading: true },
      loginSuccess({ user, token })
    );
    expect(actual.loading).toBe(false);
    expect(actual.user).toEqual(user);
    expect(actual.token).toBe(token);
    expect(actual.error).toBe(null);
  });

  it('should handle loginFailure', () => {
    const error = 'Invalid credentials';
    const actual = authReducer(
      { ...initialState, loading: true },
      loginFailure(error)
    );
    expect(actual.loading).toBe(false);
    expect(actual.error).toBe(error);
  });

  it('should handle logout', () => {
    const loggedInState = {
      user: { id: 1, email: 'test@example.com' },
      token: 'test-token',
      loading: false,
      error: null,
    };
    const actual = authReducer(loggedInState, logout());
    expect(actual).toEqual(initialState);
  });
});
