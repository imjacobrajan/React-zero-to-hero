# Day 6: Forms & Controlled Components

## Introduction

Welcome to Day 6! Today you'll master forms in React - one of the most essential aspects of web development. By the end of today, you'll:
- ✅ Understand controlled vs uncontrolled components
- ✅ Handle various form elements (input, textarea, select, checkbox, radio)
- ✅ Implement form submission properly
- ✅ Add input validation
- ✅ Build complex forms with multiple fields
- ✅ Create a full-featured login/registration form

---

## Understanding Controlled Components

### What are Controlled Components?

A **controlled component** has its value controlled by React through state. Every change triggers a re-render with the new value.

**Analogy**: Think of controlled components like a **puppet on strings**:
- React holds all the strings (state)
- Every movement is controlled by React
- React knows exactly what the component is doing at all times

### Basic Controlled Input

```javascript
import { useState } from 'react';

function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### How it Works

1. The input's `value` is bound to state
2. `onChange` updates the state
3. Re-render happens with new value
4. Input shows the new value

```javascript
function NameInput() {
  const [name, setName] = useState('');
  
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Your name is: {name}</p>
    </div>
  );
}
```

---

## Understanding Uncontrolled Components

### What are Uncontrolled Components?

**Uncontrolled components** store their own state in the DOM. React doesn't control their values directly.

**Analogy**: Think of uncontrolled components like **wild animals**:
- They manage themselves
- You only check on them when needed
- React doesn't track every change

### Basic Uncontrolled Input

```javascript
import { useRef } from 'react';

function UncontrolledInput() {
  const inputRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Value:', inputRef.current.value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Accessing Uncontrolled Values

```javascript
function UncontrolledForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Name: ${nameRef.current.value}, Email: ${emailRef.current.value}`);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} type="text" placeholder="Name" />
      <input ref={emailRef} type="email" placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Differences: Controlled vs Uncontrolled

### Quick Comparison Table

| Feature | Controlled | Uncontrolled |
|---------|-----------|--------------|
| **Value Source** | React state | DOM |
| **Change Tracking** | Every keystroke | Only on submission |
| **Validation** | Can validate on change | Only on submission |
| **Default Values** | Use `useState(initialValue)` | Use `defaultValue` prop |
| **Required for forms** | Yes | Generally no |
| **Performance** | Slightly slower (re-renders) | Faster (no re-renders) |
| **When to Use** | Most forms | File inputs, legacy code |

### Visual Example

```javascript
// Controlled Component ✅
function ControlledExample() {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>Current: {value}</p> {/* Updates in real-time */}
    </div>
  );
}

// Uncontrolled Component
function UncontrolledExample() {
  const ref = useRef();
  
  return (
    <div>
      <input ref={ref} />
      <button onClick={() => console.log(ref.current.value)}>
        Show Value
      </button>
    </div>
  );
}
```

---

## Form Elements in React

### Text Input

```javascript
function TextInputExample() {
  const [text, setText] = useState('');
  
  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Enter text..."
    />
  );
}
```

### Number Input

```javascript
function NumberInputExample() {
  const [number, setNumber] = useState(0);
  
  return (
    <input
      type="number"
      value={number}
      onChange={(e) => setNumber(Number(e.target.value))}
      min="0"
      max="100"
    />
  );
}
```

### Email Input

```javascript
function EmailInputExample() {
  const [email, setEmail] = useState('');
  
  return (
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter email..."
    />
  );
}
```

### Password Input

```javascript
function PasswordInputExample() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div>
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password..."
      />
      <button onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? 'Hide' : 'Show'} Password
      </button>
    </div>
  );
}
```

### Textarea

```javascript
function TextareaExample() {
  const [message, setMessage] = useState('');
  
  return (
    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      rows={5}
      cols={40}
      placeholder="Enter your message..."
    />
  );
}
```

### Select (Dropdown)

```javascript
function SelectExample() {
  const [country, setCountry] = useState('');
  
  return (
    <select value={country} onChange={(e) => setCountry(e.target.value)}>
      <option value="">Select a country</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
      <option value="ca">Canada</option>
      <option value="au">Australia</option>
    </select>
  );
}
```

### Checkbox

```javascript
function CheckboxExample() {
  const [isChecked, setIsChecked] = useState(false);
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        I agree to the terms and conditions
      </label>
    </div>
  );
}
```

### Radio Buttons

```javascript
function RadioExample() {
  const [selectedOption, setSelectedOption] = useState('');
  
  return (
    <div>
      <label>
        <input
          type="radio"
          name="option"
          value="option1"
          checked={selectedOption === 'option1'}
          onChange={(e) => setSelectedOption(e.target.value)}
        />
        Option 1
      </label>
      
      <label>
        <input
          type="radio"
          name="option"
          value="option2"
          checked={selectedOption === 'option2'}
          onChange={(e) => setSelectedOption(e.target.value)}
        />
        Option 2
      </label>
    </div>
  );
}
```

### Range Slider

```javascript
function RangeExample() {
  const [value, setValue] = useState(50);
  
  return (
    <div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>Value: {value}</p>
    </div>
  );
}
```

### File Input

```javascript
function FileInputExample() {
  const [file, setFile] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  
  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
      />
      {file && <p>Selected: {file.name}</p>}
    </div>
  );
}
```

---

## Form Submission Handling

### Basic Form Submission

```javascript
function BasicForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Process form data here
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Advanced Form Submission with Validation

```javascript
function AdvancedForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    country: '',
    bio: '',
    terms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 18) {
      newErrors.age = 'Must be 18 or older';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        age: '',
        country: '',
        bio: '',
        terms: false
      });
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      
      <div>
        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <label>Age:</label>
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
        />
        {errors.age && <span className="error">{errors.age}</span>}
      </div>
      
      <div>
        <label>Country:</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
        >
          <option value="">Select country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
        </select>
      </div>
      
      <div>
        <label>Bio:</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
        />
      </div>
      
      <div>
        <label>
          <input
            name="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange}
          />
          I accept the terms and conditions
        </label>
        {errors.terms && <span className="error">{errors.terms}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

---

## Input Validation Basics

### Real-time Validation

```javascript
function ValidationExample() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (newEmail && !validateEmail(newEmail)) {
      setError('Please enter a valid email address');
    } else {
      setError('');
    }
  };
  
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  );
}
```

### Password Strength Validation

```javascript
function PasswordValidationExample() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({
    score: 0,
    feedback: ''
  });
  
  const checkPasswordStrength = (pass) => {
    let score = 0;
    let feedback = [];
    
    if (pass.length >= 8) score++;
    else feedback.push('Use at least 8 characters');
    
    if (/[A-Z]/.test(pass)) score++;
    else feedback.push('Add uppercase letters');
    
    if (/[a-z]/.test(pass)) score++;
    else feedback.push('Add lowercase letters');
    
    if (/[0-9]/.test(pass)) score++;
    else feedback.push('Add numbers');
    
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    else feedback.push('Add special characters');
    
    return { score, feedback: feedback.slice(0, 2) };
  };
  
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) {
      setStrength(checkPasswordStrength(newPassword));
    }
  };
  
  const getStrengthColor = () => {
    const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green'];
    return colors[strength.score] || 'gray';
  };
  
  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
      />
      <div style={{ marginTop: '10px' }}>
        <div
          style={{
            width: '100%',
            height: '5px',
            background: 'lightgray',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: `${(strength.score / 5) * 100}%`,
              height: '100%',
              background: getStrengthColor(),
              transition: 'all 0.3s'
            }}
          />
        </div>
        {strength.feedback.length > 0 && (
          <ul>
            {strength.feedback.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

### Credit Card Number Validation

```javascript
function CreditCardValidation() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('');
  
  const detectCardType = (number) => {
    if (/^4/.test(number)) return 'Visa';
    if (/^5[1-5]/.test(number)) return 'Mastercard';
    if (/^3[47]/.test(number)) return 'Amex';
    if (/^6(?!011)/.test(number)) return 'Discover';
    return 'Unknown';
  };
  
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };
  
  const handleCardChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardType(detectCardType(formatted.replace(/\s/g, '')));
  };
  
  const isValidLength = () => {
    const digits = cardNumber.replace(/\s/g, '');
    return digits.length >= 13 && digits.length <= 16;
  };
  
  return (
    <div>
      <input
        type="text"
        value={cardNumber}
        onChange={handleCardChange}
        placeholder="Card Number"
        maxLength={19}
      />
      {cardType && <p>Type: {cardType}</p>}
      {cardNumber && !isValidLength() && (
        <p style={{ color: 'red' }}>Invalid card length</p>
      )}
    </div>
  );
}
```

---

## Advanced Form Patterns

### Multi-Step Form

```javascript
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: { name: '', email: '', phone: '' },
    address: { street: '', city: '', zip: '' },
    payment: { cardNumber: '', cvv: '' }
  });
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  const handleSubmit = () => {
    console.log('Final data:', formData);
    alert('Form completed!');
  };
  
  return (
    <div>
      <progress value={step / 3 * 100} max={100} />
      
      {step === 1 && (
        <div>
          <h3>Personal Information</h3>
          <input
            placeholder="Name"
            value={formData.personal.name}
            onChange={(e) => setFormData({
              ...formData,
              personal: { ...formData.personal, name: e.target.value }
            })}
          />
          <input
            placeholder="Email"
            value={formData.personal.email}
            onChange={(e) => setFormData({
              ...formData,
              personal: { ...formData.personal, email: e.target.value }
            })}
          />
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h3>Address</h3>
          <input
            placeholder="Street"
            value={formData.address.street}
            onChange={(e) => setFormData({
              ...formData,
              address: { ...formData.address, street: e.target.value }
            })}
          />
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      
      {step === 3 && (
        <div>
          <h3>Payment</h3>
          <input placeholder="Card Number" />
          <button onClick={prevStep}>Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}
```

### Dynamic Form Fields

```javascript
function DynamicForm() {
  const [fields, setFields] = useState([{ id: 1, value: '' }]);
  
  const addField = () => {
    setFields([...fields, { id: Date.now(), value: '' }]);
  };
  
  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };
  
  const updateField = (id, value) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, value } : field
    ));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Fields:', fields);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {fields.map(field => (
        <div key={field.id}>
          <input
            value={field.value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder="Enter value"
          />
          {fields.length > 1 && (
            <button type="button" onClick={() => removeField(field.id)}>
              Remove
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addField}>
        Add Field
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Multiplying Input Fields

### Contact Form with Multiple Addresses

```javascript
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    addresses: [{ type: 'home', street: '', city: '' }]
  });
  
  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [...formData.addresses, { type: 'home', street: '', city: '' }]
    });
  };
  
  const removeAddress = (index) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter((_, i) => i !== index)
    });
  };
  
  const updateAddress = (index, field, value) => {
    const newAddresses = formData.addresses.map((addr, i) =>
      i === index ? { ...addr, [field]: value } : addr
    );
    setFormData({ ...formData, addresses: newAddresses });
  };
  
  return (
    <form>
      <input
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      
      {formData.addresses.map((address, index) => (
        <div key={index}>
          <input
            placeholder="Street"
            value={address.street}
            onChange={(e) => updateAddress(index, 'street', e.target.value)}
          />
          <input
            placeholder="City"
            value={address.city}
            onChange={(e) => updateAddress(index, 'city', e.target.value)}
          />
          {formData.addresses.length > 1 && (
            <button type="button" onClick={() => removeAddress(index)}>
              Remove Address
            </button>
          )}
        </div>
      ))}
      
      <button type="button" onClick={addAddress}>
        Add Address
      </button>
    </form>
  );
}
```

---

## Password Validation

### Comprehensive Password Validator

```javascript
function PasswordValidator() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rules, setRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false
  });
  
  React.useEffect(() => {
    setRules({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      match: password === confirmPassword && password.length > 0
    });
  }, [password, confirmPassword]);
  
  const allValid = Object.values(rules).every(Boolean);
  
  return (
    <div>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      
      <div>
        <p className={rules.length ? 'valid' : 'invalid'}>
          ✓ At least 8 characters
        </p>
        <p className={rules.uppercase ? 'valid' : 'invalid'}>
          ✓ Contains uppercase letter
        </p>
        <p className={rules.lowercase ? 'valid' : 'invalid'}>
          ✓ Contains lowercase letter
        </p>
        <p className={rules.number ? 'valid' : 'invalid'}>
          ✓ Contains number
        </p>
        <p className={rules.special ? 'valid' : 'invalid'}>
          ✓ Contains special character
        </p>
        <p className={rules.match ? 'valid' : 'invalid'}>
          ✓ Passwords match
        </p>
      </div>
      
      {allValid && <p style={{ color: 'green' }}>Password is valid!</p>}
    </div>
  );
}
```

---

## Email Validation

### Email Validator with API Check

```javascript
function EmailValidator() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, checking, valid, invalid
  
  const validateEmail = async (email) => {
    // Basic validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      return { valid: false, message: 'Invalid email format' };
    }
    
    // Advanced validation (optional API check)
    setStatus('checking');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app: await api.checkEmail(email);
      return { valid: true, message: 'Email is valid' };
    } catch (error) {
      return { valid: false, message: 'Email verification failed' };
    }
  };
  
  const handleEmailChange = async (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && value.includes('@')) {
      const result = await validateEmail(value);
      setStatus(result.valid ? 'valid' : 'invalid');
    } else {
      setStatus('idle');
    }
  };
  
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter email"
      />
      {status === 'checking' && <p>Checking...</p>}
      {status === 'valid' && <p style={{ color: 'green' }}>Email is valid</p>}
      {status === 'invalid' && <p style={{ color: 'red' }}>Email is invalid</p>}
    </div>
  );
}
```

---

## Phone Number Validation

### International Phone Number Validator

```javascript
function PhoneValidator() {
  const [phone, setPhone] = useState('');
  const [formatted, setFormatted] = useState('');
  const [valid, setValid] = useState(false);
  
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length >= 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        setFormatted(`(${match[1]}) ${match[2]}-${match[3]}`);
        setValid(true);
      }
    } else if (cleaned.length >= 6) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d+)/);
      if (match) {
        setFormatted(`(${match[1]}) ${match[2]}-${match[3]}`);
        setValid(false);
      }
    } else if (cleaned.length >= 3) {
      const match = cleaned.match(/^(\d{3})(\d+)/);
      if (match) {
        setFormatted(`(${match[1]}) ${match[2]}`);
        setValid(false);
      }
    } else if (cleaned.length > 0) {
      const match = cleaned.match(/^(\d+)/);
      if (match) {
        setFormatted(`(${match[1]}`);
        setValid(false);
      }
    } else {
      setFormatted('');
      setValid(false);
    }
  };
  
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    formatPhoneNumber(value);
  };
  
  return (
    <div>
      <input
        type="tel"
        value={formatted}
        onChange={handlePhoneChange}
        placeholder="(555) 123-4567"
        maxLength={14}
      />
      {valid && <span style={{ color: 'green' }}>✓ Valid</span>}
    </div>
  );
}
```

---

## Form Patterns and Best Practices

### 1. Unified Handler Pattern

```javascript
function UnifiedHandlerForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="age"
        value={formData.age}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 2. Custom Hook Pattern

```javascript
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const reset = () => setValues(initialValues);
  
  return { values, handleChange, reset };
}

function CustomHookForm() {
  const { values, handleChange, reset } = useForm({
    name: '',
    email: ''
  });
  
  return (
    <form>
      <input
        name="name"
        value={values.name}
        onChange={handleChange}
      />
      <button type="button" onClick={reset}>Reset</button>
    </form>
  );
}
```

### 3. Error-First Validation

```javascript
function ErrorFirstForm() {
  const [values, setValues] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validate = (name, value) => {
    if (name === 'email') {
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
    }
    return '';
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validate(name, values[name]);
    setErrors({ ...errors, [name]: error });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    if (touched[name]) {
      const error = validate(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };
  
  return (
    <form>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && (
        <span>{errors.email}</span>
      )}
    </form>
  );
}
```

---

## Common Form Pitfalls

### Pitfall 1: Not Preventing Default

```javascript
// ❌ WRONG
function BadForm() {
  const [name, setName] = useState('');
  
  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Submit</button>
      {/* Form will refresh the page! */}
    </form>
  );
}

// ✅ CORRECT
function GoodForm() {
  const [name, setName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Pitfall 2: Mutating State Directly

```javascript
// ❌ WRONG
function BadUpdate() {
  const [user, setUser] = useState({ name: '', email: '' });
  
  const handleChange = (e) => {
    user[e.target.name] = e.target.value; // Mutation!
    setUser(user);
  };
}

// ✅ CORRECT
function GoodUpdate() {
  const [user, setUser] = useState({ name: '', email: '' });
  
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };
}
```

### Pitfall 3: Using value without onChange

```javascript
// ❌ WRONG - Creates read-only input
<input value={state} />

// ✅ CORRECT
<input value={state} onChange={(e) => setState(e.target.value)} />

// Or use defaultValue for uncontrolled
<input defaultValue="initial" />
```

---

## Practice Exercise

Create a complete registration form with:

### Requirements:
- ✅ Full name, email, password fields
- ✅ Password confirmation field
- ✅ Phone number with formatting
- ✅ Date of birth picker
- ✅ Terms and conditions checkbox
- ✅ Real-time validation
- ✅ Error messages for each field
- ✅ Submit button with loading state

### Solution:

See the practice file: `day-06/practice/registration-form.jsx`

---

## Form Accessibility Best Practices

### Labels and ARIA Attributes

```javascript
function AccessibleForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  return (
    <form>
      <label htmlFor="email-input">
        Email Address
        <span aria-label="required">*</span>
      </label>
      <input
        id="email-input"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        aria-required="true"
        aria-describedby={error ? 'email-error' : undefined}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && <div id="email-error" role="alert">{error}</div>}
    </form>
  );
}
```

### Keyboard Navigation

```javascript
function KeyboardAccessibleForm() {
  const inputs = useRef([]);
  
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inputs.current[index + 1]?.focus();
    }
  };
  
  return (
    <form>
      {['Name', 'Email', 'Phone'].map((label, index) => (
        <input
          key={index}
          ref={el => inputs.current[index] = el}
          onKeyDown={(e) => handleKeyDown(e, index)}
          placeholder={label}
        />
      ))}
    </form>
  );
}
```

---

## Form State Management Patterns

### Single State Object

```javascript
function SingleStateForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <form>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
    </form>
  );
}
```

### Separate States for Each Field

```javascript
function SeparateStateForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <form>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
    </form>
  );
}
```

---

## Advanced Validation Patterns

### Debounced Validation

```javascript
function DebouncedValidationInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // Validate after user stops typing
      if (value && value.length < 3) {
        setError('Must be at least 3 characters');
      } else {
        setError('');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} />
      {error && <span>{error}</span>}
    </div>
  );
}
```

### Async Validation

```javascript
function AsyncValidationInput() {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  
  const checkUsername = async (name) => {
    setIsChecking(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isAvailable = name !== 'taken';
    setError(isAvailable ? '' : 'Username is taken');
    setIsChecking(false);
  };
  
  useEffect(() => {
    if (username) {
      checkUsername(username);
    }
  }, [username]);
  
  return (
    <div>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      {isChecking && <span>Checking...</span>}
      {error && <span>{error}</span>}
    </div>
  );
}
```

---

## Select Element Deep Dive

### Basic Select

```javascript
function CountrySelector({ countries = ['US', 'UK', 'CA'] }) {
  const [selectedCountry, setSelectedCountry] = useState('');
  
  return (
    <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
      <option value="">Select a country</option>
      {countries.map(country => (
        <option key={country} value={country}>{country}</option>
      ))}
    </select>
  );
}
```

### Multi-Select

```javascript
function MultiSelect({ options }) {
  const [selectedValues, setSelectedValues] = useState([]);
  
  const handleChange = (e) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedValues(values);
  };
  
  return (
    <select multiple value={selectedValues} onChange={handleChange}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

### Dependent Selects

```javascript
function DependentSelects() {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  
  const citiesByCountry = {
    US: ['New York', 'Los Angeles', 'Chicago'],
    UK: ['London', 'Manchester', 'Birmingham'],
    CA: ['Toronto', 'Vancouver', 'Montreal']
  };
  
  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setCity(''); // Reset city when country changes
  };
  
  return (
    <div>
      <select value={country} onChange={handleCountryChange}>
        <option value="">Select country</option>
        <option value="US">United States</option>
        <option value="UK">United Kingdom</option>
        <option value="CA">Canada</option>
      </select>
      
      {country && (
        <select value={city} onChange={e => setCity(e.target.value)}>
          <option value="">Select city</option>
          {citiesByCountry[country].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
    </div>
  );
}
```

---

## Checkbox Group Pattern

```javascript
function CheckboxGroup({ options }) {
  const [selected, setSelected] = useState([]);
  
  const handleToggle = (value) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };
  
  return (
    <div>
      {options.map(option => (
        <label key={option.value}>
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => handleToggle(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
```

---

## Radio Group Pattern

```javascript
function RadioGroup({ name, options, value, onChange }) {
  return (
    <div>
      {options.map(option => (
        <label key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

// Usage
function PaymentMethodSelector() {
  const [method, setMethod] = useState('');
  
  return (
    <RadioGroup
      name="payment"
      value={method}
      onChange={e => setMethod(e.target.value)}
      options={[
        { value: 'credit', label: 'Credit Card' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'bank', label: 'Bank Transfer' }
      ]}
    />
  );
}
```

---

## Form Data Serialization

### Building FormData

```javascript
function FormWithFormData() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    file: null
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    if (formData.file) {
      data.append('file', formData.file);
    }
    
    // Submit to server
    fetch('/api/submit', {
      method: 'POST',
      body: data
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
      />
      <input
        value={formData.email}
        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
      />
      <input
        type="file"
        onChange={e => setFormData(prev => ({ ...prev, file: e.target.files[0] }))}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## File Upload Handling

```javascript
function FileUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '200px' }} />}
    </div>
  );
}
```

---

## Form Validation Libraries Preview

> **📌 Note**: Libraries like React Hook Form, Formik will be covered in Day 25.

For now, understanding controlled components is essential before learning form libraries.

---

## Resources & Further Reading

### Official Documentation
- [Forms](https://react.dev/reference/react-dom/components/input)
- [Input Elements](https://react.dev/reference/react-dom/components/form)

### MDN References
- [HTML Form Elements](https://developer.mozilla.org/en-US/docs/Learn/Forms)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

---

## Key Takeaways

### ✅ What You Learned Today

1. **Controlled Components**: React controls the value via state
2. **Uncontrolled Components**: DOM manages the value, accessed via refs
3. **Form Elements**: Text, email, password, textarea, select, checkbox, radio
4. **Form Submission**: Use preventDefault() to handle submission
5. **Validation**: Real-time and submission-time validation
6. **Advanced Patterns**: Multi-step forms, dynamic fields, validation hooks

### 🎯 Key Concepts

- Most forms should be controlled for better React integration
- Always prevent default form submission
- Validate on blur and change for best UX
- Create reusable form components and hooks
- Handle loading states and errors properly

### 📚 Next Steps

Tomorrow (Day 7) you'll learn:
- ✅ Conditional rendering patterns (ternary, logical &&)
- ✅ Switch statements in JSX
- ✅ Building TodoList with full CRUD
- ✅ Advanced conditional rendering techniques
- ✅ Loading, error, and empty states

---

**Great work! 🎉 You've mastered forms and controlled components! See you tomorrow for Day 7: Conditional Rendering Patterns!**

---

## Form Handling Quick Reference

### Controlled Input
```javascript
<input
  value={value}
  onChange={e => setValue(e.target.value)}
/>
```

### Form Submission
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Form data:', formData);
};

<form onSubmit={handleSubmit}>
```

### Select Element
```javascript
<select value={selected} onChange={e => setSelected(e.target.value)}>
  <option value="">Choose...</option>
  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
</select>
```

### Checkbox
```javascript
<input
  type="checkbox"
  checked={isChecked}
  onChange={e => setIsChecked(e.target.checked)}
/>
```

### Radio Group
```javascript
<input
  type="radio"
  name="option"
  value={option}
  checked={selected === option}
  onChange={e => setSelected(e.target.value)}
/>
```

**This completes Day 6. Ready for conditional rendering! 🚀**

