// src/utils/validation.js
//
// Centralized validation so every form (sign up, login, edit profile)
// checks input the same way and gives consistent error messages.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// At least 8 chars, 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
// Basic international-friendly phone check: digits, spaces, +, -, 7-15 digits total
const PHONE_REGEX = /^\+?[\d\s-]{7,15}$/;

export function validateName(name) {
  if (!name || !name.trim()) return "Full name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  if (name.trim().length > 60) return "Name is too long.";
  return null; // null = valid
}

export function validateEmail(email) {
  if (!email || !email.trim()) return "Email is required.";
  if (!EMAIL_REGEX.test(email.trim())) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (!PASSWORD_REGEX.test(password)) {
    return "Password must be 8+ characters and include an uppercase letter, a lowercase letter, and a number.";
  }
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
}

export function validatePhone(phone) {
  // Optional field example - only validate format if the user entered something
  if (!phone) return null;
  if (!PHONE_REGEX.test(phone.trim())) return "Enter a valid phone number.";
  return null;
}

/**
 * Runs a set of validators against a form's values.
 * @param {Object} validators - { fieldName: (value) => errorString|null }
 * @param {Object} values - { fieldName: value }
 * @returns {Object} errors - { fieldName: errorString } only for invalid fields
 */
export function runValidators(validators, values) {
  const errors = {};
  Object.keys(validators).forEach((field) => {
    const error = validators[field](values[field]);
    if (error) errors[field] = error;
  });
  return errors;
}
