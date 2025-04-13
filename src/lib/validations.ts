export const validationPatterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    name: /^[a-zA-Z\s]{2,50}$/,
  };
  
  export const validationMessages = {
    email: "Please enter a valid email address",
    password: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
    name: "Name must be between 2 and 50 characters and contain only letters and spaces",
    confirmPassword: "Passwords do not match",
    required: "This field is required",
  };
  
  export const validateEmail = (email: string): boolean => {
    return validationPatterns.email.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    return validationPatterns.password.test(password);
  };
  
  export const validateName = (name: string): boolean => {
    return validationPatterns.name.test(name);
  };
  
  export const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  }; 