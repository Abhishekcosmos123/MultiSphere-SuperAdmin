import { motion } from "framer-motion";
import Loader from "./loader";

/**
 * Props interface for ButtonBox component
 * @property loading - Boolean to show/hide loading spinner
 * @property onClick - Optional click handler function
 * @property children - React children elements to render inside button
 * @property className - Optional additional CSS classes
 * @property type - HTML button type (button/submit/reset)
 */
interface ButtonWithLoaderProps {
  loading: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

/**
 * ButtonBox Component
 * 
 * A reusable animated button component with loading state.
 * Features:
 * - Animated entrance using Framer Motion
 * - Loading spinner integration
 * - Gradient background with hover effects
 * - Customizable through className prop
 * - Accessible focus states
 * 
 * @example
 * <ButtonBox loading={isLoading} type="submit">
 *   Submit Form
 * </ButtonBox>
 */
const ButtonBox: React.FC<ButtonWithLoaderProps> = ({
  loading,
  onClick,
  children,
  className = "",
  type = "button",
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      // Animation properties for smooth entrance
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      // Combines default styles with any additional classes
      className={`w-full flex justify-center items-center bg-gradient-to-r from-green-300 to-green-600 text-gray-700 bold p-3 rounded-md shadow-lg hover:bg-gradient-to-l hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${className}`}
      disabled={loading}
      style={{ padding: "10px", fontWeight: "bold" }}
    >
      {/* Conditionally render loader or children */}
      {loading ? <Loader /> : children}
    </motion.button>
  );
};

export default ButtonBox;
