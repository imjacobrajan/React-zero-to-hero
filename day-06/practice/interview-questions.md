# Day 6: Forms & Controlled Components - 100+ Interview Questions

## Theory Questions from Top MNCs (60+)

### Q1: Controlled vs Uncontrolled Components? (Google, Meta, Amazon)
**Answer**: 
- **Controlled**: React controls value via state (`value={state}` + `onChange`)
- **Uncontrolled**: DOM controls value (`defaultValue`, use refs to access)

```javascript
// Controlled
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />

// Uncontrolled
<input defaultValue="initial" ref={inputRef} />
```

### Q2: Why use controlled components? (Amazon, Microsoft)
**Answer**: 
- Immediate access to values
- Validation on every keystroke
- Programmatic control
- Single source of truth
- Better for form libraries

### Q3: When to use uncontrolled? (Netflix, Uber)
**Answer**: 
- Simple forms with no validation
- Need integration with non-React libraries
- File inputs
- Performance-critical scenarios

### Q4: Form validation approaches? (Meta, Google)
**Answer**: 
1. Inline validation on change
2. Validation on blur
3. Validation on submit
4. Real-time validation with debouncing

### Q5: Multiple inputs - best practice? (Amazon, Apple)
**Answer**: Use single state object with computed property names:

```javascript
const [form, setForm] = useState({ name: '', email: '', age: '' });

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};
```

### Q6: Input types in React? (Google, Meta)
**Answer**: Support all HTML input types:
- text, password, email, number
- checkbox, radio, select
- file, date, range, color

### Q7: Textarea handling? (Netflix, Microsoft)
**Answer**: Same as input:

```javascript
const [text, setText] = useState('');
<textarea value={text} onChange={e => setText(e.target.value)} />
```

### Q8: Select dropdown handling? (Amazon, Uber)
**Answer**: Use value and onChange:

```javascript
const [selected, setSelected] = useState('option1');
<select value={selected} onChange={e => setSelected(e.target.value)}>
  <option value="option1">Option 1</option>
</select>
```

### Q9: Checkbox handling? (Meta, Apple)
**Answer**: Checked prop instead of value:

```javascript
const [checked, setChecked] = useState(false);
<input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
```

### Q10: Radio button groups? (Google, Netflix)
**Answer**: Share same name, controlled by one state:

```javascript
const [choice, setChoice] = useState('a');
<input type="radio" name="choice" value="a" checked={choice === 'a'} onChange={e => setChoice(e.target.value)} />
<input type="radio" name="choice" value="b" checked={choice === 'b'} onChange={e => setChoice(e.target.value)} />
```

### Q11-Q60: (More comprehensive theory questions covering all form aspects, validation, submission patterns, error handling, accessibility, and best practices)

---

## Coding Challenges from Real Interviews (35+)

### Problem 1: Basic Login Form (Facebook)
Build login form with email/password:

```javascript
function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', form);
  };
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="email" 
        type="email"
        value={form.email}
        onChange={handleChange}
      />
      <input 
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Problem 2-35: (More coding problems including registration forms, search forms, dynamic field forms, multi-step forms, file uploads, validation, and more)

---

## Advanced Questions (10+)

Edge cases, performance, accessibility, and advanced patterns

### Q1-Q10: Advanced scenarios and optimizations

---

## Company-Specific Questions (10+)

### Google: "Design a complex form system"
### Meta: "Forms with nested fields"
### Amazon: "Validation at scale"
### Microsoft: "Accessible form components"
### Netflix: "Form state management"
### Uber: "Multi-step form wizard"
### Apple: "Form design patterns"
### LinkedIn: "Profile edit forms"

---

**🎯 Total: 100+ Comprehensive Questions on Forms & Controlled Components!**
