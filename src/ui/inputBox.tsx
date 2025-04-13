import * as React from "react";
// import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { UseFormRegisterReturn } from "react-hook-form";

/**
 * Props interface for InputBox component
 * @property id - Unique identifier for the input field
 * @property type - HTML input type (text, password, email, etc.)
 * @property value - Controlled input value
 * @property label - Label text for the input field
 * @property placeholder - Placeholder text
 * @property onChange - Event handler for input changes (removed as it's not used)
 * @property showPasswordToggle - Enable password visibility toggle
 * @property showPassword - Current password visibility state
 * @property setShowPassword - Function to toggle password visibility
 * @property error - Error message to display
 * @property register - React Hook Form register object
 */
interface InputBoxProps {
  id: string;
  type?: string;
  value?: string;
  label: string;
  placeholder?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  setShowPassword?: (show: boolean) => void;
  error?: string;
  register?: UseFormRegisterReturn; // Proper type for register
}

/**
 * InputBox Component
 * 
 * A reusable animated input field component with integrated features.
 * Features:
 * - Animated entrance effects using Framer Motion
 * - Password visibility toggle
 * - Error state handling
 * - React Hook Form integration
 * - Accessible form controls
 * - Customizable styling with error states
 * 
 * @example
 * <InputBox
 *   id="password"
 *   label="Password"
 *   type="password"
 *   showPasswordToggle={true}
 *   register={register("password")}
 *   error={errors.password?.message}
 * />
 */
const InputBox: React.FC<InputBoxProps> = ({
  id,
  type = "text",
  value,
  label,
  placeholder = "",
  showPasswordToggle = false,
  showPassword,
  setShowPassword,
  error,
  register,
}) => {
  return (
    <div className="mb-4" style={{ position: 'relative' }}>
      {/* Accessible label for the input field */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {/* Animated input field */}
      <motion.input
        // Animation properties for smooth entrance
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        id={id}
        // Dynamic type handling for password fields
        type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
        value={value}
        placeholder={placeholder}
        {...register} // Spread React Hook Form register properties
        // Dynamic classes for styling and error states
        className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-green-300 focus:border-green-300 sm:text-sm text-gray-800 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        required
        style={{ paddingRight: '2.5rem' }} // Space for password toggle icon
      />
      {/* Error message display */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {/* Password visibility toggle button */}
      {showPasswordToggle && setShowPassword && (
        <motion.span
          // Animation for the toggle icon
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          data-testid="password-toggle"
          className="cursor-pointer text-green-500 hover:text-green-700"
          onClick={() => setShowPassword(!showPassword)}
          style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)' }}
        >
          {/* Toggle between show/hide password icons */}
          {showPassword ? (
            <BsFillEyeSlashFill size={24} className="text-green-500" style={{ color: '#6366f1' }} />
          ) : (
            <BsFillEyeFill size={24} className="text-green-500" style={{ color: '#6366f1' }} />
          )}
        </motion.span>
      )}
    </div>
  );
};

export default InputBox;
