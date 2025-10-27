import { useState } from 'react';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
    } else if (cleaned.length >= 6) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d+)/);
      if (match) return `(${match[1]}) ${match[2]}-${match[2]}`;
    } else if (cleaned.length >= 3) {
      const match = cleaned.match(/^(\d{3})(\d+)/);
      if (match) return `(${match[1]}) ${match[2]}`;
    } else if (cleaned.length > 0) {
      const match = cleaned.match(/^(\d+)/);
      if (match) return `(${match[1]}`;
    }
    return value;
  };
  
  const validate = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        break;
      
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email is invalid';
        break;
      
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else if (!/[A-Z]/.test(value)) error = 'Password must contain uppercase letter';
        else if (!/[a-z]/.test(value)) error = 'Password must contain lowercase letter';
        else if (!/[0-9]/.test(value)) error = 'Password must contain a number';
        else if (!/[^A-Za-z0-9]/.test(value)) error = 'Password must contain special character';
        break;
      
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      
      case 'phoneNumber':
        if (!value) error = 'Phone number is required';
        else {
          const cleaned = value.replace(/\D/g, '');
          if (cleaned.length !== 10) error = 'Phone number must be 10 digits';
        }
        break;
      
      case 'dateOfBirth':
        if (!value) error = 'Date of birth is required';
        else {
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) error = 'You must be 18 or older';
        }
        break;
      
      case 'agreeToTerms':
        if (!value) error = 'You must agree to the terms';
        break;
      
      default:
        break;
    }
    
    return error;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let newValue = type === 'checkbox' ? checked : value;
    
    if (name === 'phoneNumber' && type !== 'checkbox') {
      newValue = formatPhoneNumber(value);
    }
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    if (touched[name]) {
      const error = validate(name, newValue);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    const error = validate(name, formData[name]);
    setErrors({
      ...errors,
      [name]: error
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Registration successful!');
      console.log('Form data:', formData);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        dateOfBirth: '',
        agreeToTerms: false
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const passwordStrength = () => {
    const { password } = formData;
    if (!password) return { score: 0, label: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    
    return { score, label: labels[score] };
  };
  
  const { score, label } = passwordStrength();
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Create Account</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="fullName" style={{ display: 'block', marginBottom: '5px' }}>
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            style={{
              width: '100%',
              padding: '8px',
              border: touched.fullName && errors.fullName
                ? '2px solid red'
                : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {touched.fullName && errors.fullName && (
            <span style={{ color: 'red', fontSize: '14px' }}>
              {errors.fullName}
            </span>
          )}
        </div>
        
        {/* Email */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '8px',
              border: touched.email && errors.email
                ? '2px solid red'
                : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {touched.email && errors.email && (
            <span style={{ color: 'red', fontSize: '14px' }}>
              {errors.email}
            </span>
          )}
        </div>
        
        {/* Phone Number */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px' }}>
            Phone Number *
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(555) 123-4567"
            maxLength={14}
            style={{
              width: '100%',
              padding: '8px',
              border: touched.phoneNumber && errors.phoneNumber
                ? '2px solid red'
                : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {touched.phoneNumber && errors.phoneNumber && (
            <span style={{ color: 'red', fontSize: '14px' }}>
              {errors.phoneNumber}
            </span>
          )}
        </div>
        
        {/* Password */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '8px',
              border: touched.password && errors.password
                ? '2px solid red'
                : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {formData.password && (
            <div style={{ marginTop: '5px' }}>
              <div style={{
                height: '5px',
                background: '#ddd',
                borderRadius: '3px',
                position: 'relative'
              }}>
                <div style={{
                  width: `${(score / 5) * 100}%`,
                  height: '100%',
                  background: score <= 2 ? 'red' : score <= 3 ? 'orange' : score <= 4 ? 'yellow' : 'green',
                  borderRadius: '3px',
                  transition: 'all 0.3s'
                }} />
              </div>
              {label && (
                <span style={{ fontSize: '12px', color: '#666' }}>
                  Password strength: {label}
                </span>
              )}
            </div>
          )}
          {touched.password && errors.password && (
            <span style={{ color: 'red', fontSize: '14px' }}>
              {errors.password}
            </span>
          )}
        </div>
        
        {/* Confirm Password */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirm your password"
            style={{
              width: '100%',
              padding: '8px',
              border: touched.confirmPassword && errors.confirmPassword
                ? '2px solid red'
                : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <span style={{ color: 'red', fontSize: '14px' }}>
              {errors.confirmPassword}
            </span>
          )}
        </div>
        
        {/* Date of Birth */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="dateOfBirth" style={{ display: 'block', marginBottom: '5px' }}>
            Date of Birth *
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '8px',
              border: touched.dateOfBirth && errors.dateOfBirth
                ? '2px solid red'
                : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {touched.dateOfBirth && errors.dateOfBirth && (
            <span style={{ color: 'red', fontSize: '14px' }}>
              {errors.dateOfBirth}
            </span>
          )}
        </div>
        
        {/* Terms Checkbox */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ marginRight: '8px' }}
            />
            <span>
              I agree to the terms and conditions *
            </span>
          </label>
          {touched.agreeToTerms && errors.agreeToTerms && (
            <span style={{ color: 'red', fontSize: '14px', display: 'block', marginTop: '5px' }}>
              {errors.agreeToTerms}
            </span>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            background: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;

