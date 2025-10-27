# Day 6: Forms & Controlled Components - Interview Questions

## 📋 Basic Concepts

### 1. What is a controlled component in React?
**Answer:**
A controlled component is one where React controls the value of form elements through state. The input's value is tied to React state, and any changes to the input update the state, which then re-renders the component with the new value.

```javascript
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

**Follow-up:** Why would you use controlled components?

---

### 2. What is an uncontrolled component?
**Answer:**
An uncontrolled component is one where the form element's value is managed by the DOM itself, not by React. We use refs to access the value when needed (typically on form submission).

```javascript
function UncontrolledInput() {
  const inputRef = useRef(null);
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return (
    <input ref={inputRef} type="text" />
  );
}
```

**Follow-up:** When would you prefer uncontrolled components?

---

### 3. What's the difference between controlled and uncontrolled components?
**Answer:**
| Aspect | Controlled | Uncontrolled |
|--------|-----------|--------------|
| Value Source | React state | DOM |
| Updates | On every keystroke | Only when needed |
| Validation | Real-time | On submission |
| Re-renders | Yes | No |
| Use Case | Most forms | Legacy code, file inputs |

**Follow-up:** Which is better for performance?

---

### 4. How do you prevent default form submission in React?
**Answer:**
Use `e.preventDefault()` in the form's onSubmit handler:

```javascript
function Form() {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh
    // Handle form submission
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Follow-up:** What happens if you forget preventDefault()?

---

### 5. How do you handle multiple form inputs?
**Answer:**
Use a single state object and access fields by name:

```javascript
function MultiInputForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
    </>
  );
}
```

**Follow-up:** Why use [e.target.name] instead of individual handlers?

---

## 🔧 Intermediate Concepts

### 6. How do you implement form validation in React?
**Answer:**
Validation can be done in multiple ways:

1. **On blur validation:**
```javascript
const [errors, setErrors] = useState({});

const handleBlur = (e) => {
  const error = validate(e.target.name, e.target.value);
  setErrors({ ...errors, [e.target.name]: error });
};
```

2. **Real-time validation:**
```javascript
const handleChange = (e) => {
  const value = e.target.value;
  setValue(value);
  const error = validate(value);
  setError(error);
};
```

**Follow-up:** What are the pros and cons of each approach?

---

### 7. How do you handle checkbox and radio inputs in controlled components?
**Answer:**
Use the `checked` prop instead of `value`:

```javascript
function ControlledCheckbox() {
  const [checked, setChecked] = useState(false);
  
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}
```

For radio buttons:
```javascript
function ControlledRadio() {
  const [selected, setSelected] = useState('');
  
  return (
    <>
      <input
        type="radio"
        name="option"
        value="option1"
        checked={selected === 'option1'}
        onChange={(e) => setSelected(e.target.value)}
      />
    </>
  );
}
```

**Follow-up:** Why use checked instead of value for checkboxes?

---

### 8. How do you implement a textarea as a controlled component?
**Answer:**
Use the `value` prop like any other input:

```javascript
function ControlledTextarea() {
  const [text, setText] = useState('');
  
  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      rows={5}
      cols={40}
    />
  );
}
```

**Follow-up:** Can you make it auto-expand based on content?

---

### 9. How do you handle select dropdowns in controlled components?
**Answer:**
Bind the value to state:

```javascript
function ControlledSelect() {
  const [country, setCountry] = useState('');
  
  return (
    <select value={country} onChange={(e) => setCountry(e.target.value)}>
      <option value="">Select...</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
    </select>
  );
}
```

**Follow-up:** How do you handle multi-select selects?

---

### 10. How do you implement file upload in React?
**Answer:**
File inputs should typically be uncontrolled:

```javascript
function FileUpload() {
  const fileRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const file = fileRef.current.files[0];
    console.log('File:', file);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={fileRef} type="file" />
      <button type="submit">Upload</button>
    </form>
  );
}
```

**Follow-up:** How would you show a preview of the uploaded file?

---

## 🎯 Advanced Concepts

### 11. How do you create a multi-step form in React?
**Answer:**
Manage step state and conditionally render different sections:

```javascript
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  return (
    <>
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      <button onClick={prevStep}>Previous</button>
      <button onClick={nextStep}>Next</button>
    </>
  );
}
```

**Follow-up:** How would you validate each step?

---

### 12. How do you implement dynamic form fields (add/remove fields)?
**Answer:**
Use array in state and manage add/remove operations:

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
  
  return (
    <>
      {fields.map(field => (
        <div key={field.id}>
          <input
            value={field.value}
            onChange={(e) => updateField(field.id, e.target.value)}
          />
          <button onClick={() => removeField(field.id)}>Remove</button>
        </div>
      ))}
      <button onClick={addField}>Add Field</button>
    </>
  );
}
```

**Follow-up:** How would you validate dynamic fields?

---

### 13. How do you implement password strength indicator?
**Answer:**
Create validation rules and score the password:

```javascript
function PasswordStrength({ password }) {
  const checkStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return { score, labels: ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'] };
  };
  
  const { score, labels } = checkStrength();
  
  return <progress value={score} max={5} />;
}
```

**Follow-up:** How would you add visual feedback?

---

### 14. How do you debounce input validation?
**Answer:**
Use useEffect with a timer:

```javascript
function DebouncedValidation({ value }) {
  const [error, setError] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // Validate here
      const error = validateEmail(value);
      setError(error);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  return <span>{error}</span>;
}
```

**Follow-up:** Why is debouncing important for validation?

---

### 15. How do you handle async validation (e.g., email exists check)?
**Answer:**
Use async/await with loading states:

```javascript
function AsyncValidation() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, checking, valid, invalid
  
  const checkEmail = async (email) => {
    setStatus('checking');
    try {
      const response = await fetch(`/api/check-email?email=${email}`);
      const { available } = await response.json();
      setStatus(available ? 'valid' : 'invalid');
    } catch (error) {
      setStatus('error');
    }
  };
  
  const handleBlur = () => {
    if (email) checkEmail(email);
  };
  
  return (
    <>
      <input value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleBlur} />
      {status === 'checking' && <span>Checking...</span>}
      {status === 'valid' && <span>Email available</span>}
      {status === 'invalid' && <span>Email already taken</span>}
    </>
  );
}
```

**Follow-up:** How would you prevent excessive API calls?

---

## 🔥 Real-World Scenarios

### 16. How do you implement form data persistence (localStorage)?
**Answer:**
Use useEffect to sync with localStorage:

```javascript
function PersistentForm() {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('formData');
    return saved ? JSON.parse(saved) : { name: '', email: '' };
  });
  
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);
  
  return (
    <form>
      <input
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
      />
    </form>
  );
}
```

**Follow-up:** What about security concerns with localStorage?

---

### 17. How do you implement phone number formatting?
**Answer:**
Format on input change:

```javascript
function PhoneInput() {
  const [phone, setPhone] = useState('');
  
  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return cleaned;
  };
  
  return (
    <input
      value={phone}
      onChange={(e) => setPhone(formatPhone(e.target.value))}
      maxLength={14}
    />
  );
}
```

**Follow-up:** How would you handle international formats?

---

### 18. How do you implement credit card number formatting?
**Answer:**
Add spaces every 4 digits:

```javascript
function CreditCardInput() {
  const [cardNumber, setCardNumber] = useState('');
  
  const formatCard = (value) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    return cleaned.match(/.{1,4}/g)?.join(' ').substr(0, 19) || cleaned;
  };
  
  return (
    <input
      value={cardNumber}
      onChange={(e) => setCardNumber(formatCard(e.target.value))}
      maxLength={19}
    />
  );
}
```

**Follow-up:** How would you detect card type (Visa, Mastercard, etc.)?

---

### 19. How do you handle disabled submit button until form is valid?
**Answer:**
Create a validation function:

```javascript
function FormWithDisabledSubmit() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const isFormValid = () => {
    return formData.email && formData.password && 
           /\S+@\S+\.\S+/.test(formData.email);
  };
  
  return (
    <form>
      <input
        name="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit" disabled={!isFormValid()}>
        Submit
      </button>
    </form>
  );
}
```

**Follow-up:** How would you show validation errors on submit click?

---

### 20. How do you implement form reset?
**Answer:**
Create a reset function:

```javascript
function ResettableForm() {
  const initialData = { name: '', email: '' };
  const [formData, setFormData] = useState(initialData);
  
  const handleReset = () => {
    setFormData(initialData);
  };
  
  return (
    <form>
      <input
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
      />
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
}
```

**Follow-up:** How would you clear validation errors on reset?

---

## 💡 Best Practices

### 21. Why should you use controlled components over uncontrolled?
**Answer:**
- React has full control over the input
- Easier to implement validation
- Better for form libraries integration
- Enables real-time updates
- More predictable behavior
- Easier to test

**Follow-up:** When might uncontrolled be better?

---

### 22. What's the issue with using array index as key in dynamic forms?
**Answer:**
Using index as key can cause issues when items are added/removed because React can't properly track which element changed. Use stable IDs instead.

```javascript
// ❌ BAD
{fields.map((field, index) => (
  <input key={index} />
))}

// ✅ GOOD
{fields.map(field => (
  <input key={field.id} />
))}
```

**Follow-up:** What are stable IDs best practices?

---

### 23. How do you prevent state mutation in forms?
**Answer:**
Always create new objects/arrays:

```javascript
// ❌ BAD
formData.name = newValue;
setFormData(formData);

// ✅ GOOD
setFormData({ ...formData, name: newValue });

// For arrays
setItems([...items, newItem]);
```

**Follow-up:** What happens if you mutate state directly?

---

### 24. How do you handle nested form data?
**Answer:**
Use nested state structure:

```javascript
function NestedForm() {
  const [formData, setFormData] = useState({
    personal: { name: '', email: '' },
    address: { street: '', city: '' }
  });
  
  const updateField = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };
  
  return (
    <>
      <input
        value={formData.personal.name}
        onChange={(e) => updateField('personal', 'name', e.target.value)}
      />
    </>
  );
}
```

**Follow-up:** How would you implement deep cloning for nested objects?

---

### 25. What are common form-related performance issues?
**Answer:**
- Too many re-renders from inline handlers
- Not using useCallback for handlers
- Validating entire form on every keystroke
- Creating new objects unnecessarily in onChange

**Follow-up:** How would you optimize a form with many fields?

---

## 🎯 Scenario-Based Questions

### 26. You have 20 input fields. How do you optimize onChange?
**Answer:**
Use a single handler function and memoize it:

```javascript
function OptimizedForm() {
  const [formData, setFormData] = useState({ /* 20 fields */ });
  
  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);
  
  // Reuse the same handler
  return (
    <>
      <input name="field1" onChange={handleChange} />
      <input name="field2" onChange={handleChange} />
      {/* ... */}
    </>
  );
}
```

**Follow-up:** Would you use useCallback in every form?

---

### 27. How do you implement cross-field validation?
**Answer:**
Validate multiple fields together:

```javascript
function CrossFieldValidation() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };
  
  // Validate when either changes
  useEffect(() => {
    if (formData.confirmPassword) {
      const error = validatePasswords();
      // Set error
    }
  }, [formData.password, formData.confirmPassword]);
}
```

**Follow-up:** How would you show different error messages?

---

### 28. How do you implement conditional fields?
**Answer:**
Show fields based on other field values:

```javascript
function ConditionalForm() {
  const [formData, setFormData] = useState({
    hasAddress: false,
    street: ''
  });
  
  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={formData.hasAddress}
          onChange={(e) => setFormData({ ...formData, hasAddress: e.target.checked })}
        />
        Add address
      </label>
      
      {formData.hasAddress && (
        <input
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
        />
      )}
    </form>
  );
}
```

**Follow-up:** How would you handle required field validation for conditionals?

---

### 29. How do you submit a form to an API?
**Answer:**
Use fetch with error handling:

```javascript
async function handleSubmit(e) {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Submission failed');
    
    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Follow-up:** How would you show loading state during submission?

---

### 30. How do you handle form submission errors from server?
**Answer:**
Display server-side validation errors:

```javascript
function FormWithServerErrors() {
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        return;
      }
      
      // Success
    } catch (error) {
      setErrors({ general: 'Something went wrong' });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {errors.general && <div>{errors.general}</div>}
      <input name="email" />
      {errors.email && <span>{errors.email}</span>}
    </form>
  );
}
```

**Follow-up:** How would you handle network errors differently from validation errors?

---

**These questions cover all aspects of forms in React, from basic to advanced concepts. Practice implementing these patterns to master form handling in React!**

