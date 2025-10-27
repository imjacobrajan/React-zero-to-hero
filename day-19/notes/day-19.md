# Day 19: Compound Components Pattern - Building Flexible APIs
## Introduction
Welcome to Day 19! Today you'll master the **Compound Components Pattern** - a powerful pattern for building flexible, composable component APIs. By the end of today, you'll understand:
- ✅ What compound components are
- ✅ How to implement them with Context
- ✅ Using dot notation for cleaner APIs
- ✅ Building flexible, reusable components
- ✅ Real-world applications
- ✅ Advanced patterns and techniques
---


## What are Compound Components?


### Definition
Compound components are a pattern where **multiple components work together** to accomplish a single task, sharing implicit state through Context.


### Key Characteristics
1. **Related components** work together
2. **Shared state** through Context
3. **Flexible composition** by the consumer
4. **Single responsibility** per component
5. **Cohesive API** for the component set


### Basic Example
```javascript
// ❌ Monolithic approach
function Select({ options, value, onChange }) {
  return (
    <div className="select">
      <label>{options.find(o => o.value === value)?.label}</label>
      <div>
        {options.map(opt => (
          <div key={opt.value} onClick={() => onChange(opt.value)}>
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}
// ✅ Compound components approach
<Select>
  <Select.Label>Choose option</Select.Label>
  <Select.Input>
    <Select.Option value="1">Option 1</Select.Option>
    <Select.Option value="2">Option 2</Select.Option>
    <Select.Option value="3">Option 3</Select.Option>
  </Select.Input>
</Select>
```
---


## Simple Compound Components


### Example 1: Toggle Components
```javascript
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  return (
    <ToggleContext.Provider value={{ on, toggle: () => setOn(!on) }}>
      {children}
    </ToggleContext.Provider>
  );
}
const ToggleContext = createContext(null);
function ToggleButton({ children }) {
  const { on, toggle } = useContext(ToggleContext);
  return (
    <button onClick={toggle} aria-pressed={on}>
      {children}
    </button>
  );
}
function ToggleOn({ children }) {
  const { on } = useContext(ToggleContext);
  return on ? children : null;
}
function ToggleOff({ children }) {
  const { on } = useContext(ToggleContext);
  return !on ? children : null;
}
// Attach to main component
Toggle.Button = ToggleButton;
Toggle.On = ToggleOn;
Toggle.Off = ToggleOff;
// Usage
function App() {
  return (
    <Toggle>
      <Toggle.Button>Toggle</Toggle.Button>
      <Toggle.On>The button is on</Toggle.On>
      <Toggle.Off>The button is off</Toggle.Off>
    </Toggle>
  );
}
```


### Example 2: Card Components
```javascript
function Card({ children }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <CardContext.Provider value={{ expanded, setExpanded }}>
      <div className="card">
        {children}
      </div>
    </CardContext.Provider>
  );
}
const CardContext = createContext(null);
function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}
function CardBody({ children }) {
  const { expanded } = useContext(CardContext);
  return (
    <div className={`card-body ${expanded ? 'expanded' : ''}`}>
      {children}
    </div>
  );
}
function CardFooter({ children }) {
  const { expanded, setExpanded } = useContext(CardContext);
  return (
    <div className="card-footer">
      {children}
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
}
// Attach to main component using dot notation
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
// Usage
function App() {
  return (
    <Card>
      <Card.Header>Card Title</Card.Header>
      <Card.Body>Card content here...</Card.Body>
      <Card.Footer>Footer content</Card.Footer>
    </Card>
  );
}
```
---


## Context in Compound Components


### Advanced Context Pattern
```javascript
const MenuContext = createContext(null);
function Menu({ children }) {
  const [activeItem, setActiveItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const value = {
    activeItem,
    setActiveItem,
    isOpen,
    setIsOpen,
    openMenu: () => setIsOpen(true),
    closeMenu: () => setIsOpen(false)
  };
  return (
    <MenuContext.Provider value={value}>
      <div className="menu">{children}</div>
    </MenuContext.Provider>
  );
}
// Menu components
function MenuTrigger({ children }) {
  const { isOpen, openMenu } = useContext(MenuContext);
  return (
    <button onClick={openMenu} aria-expanded={isOpen}>
      {children}
    </button>
  );
}
function MenuList({ children }) {
  const { isOpen } = useContext(MenuContext);
  if (!isOpen) return null;
  return <ul className="menu-list">{children}</ul>;
}
function MenuItem({ value, children }) {
  const { activeItem, setActiveItem, closeMenu } = useContext(MenuContext);
  const handleClick = () => {
    setActiveItem(value);
    closeMenu();
  };
  return (
    <li
      className={activeItem === value ? 'active' : ''}
      onClick={handleClick}
    >
      {children}
    </li>
  );
}
function MenuItemIndicator() {
  const { activeItem } = useContext(MenuContext);
  return activeItem ? <span>✓</span> : null;
}
// Attach using dot notation
Menu.Trigger = MenuTrigger;
Menu.List = MenuList;
Menu.Item = MenuItem;
Menu.ItemIndicator = MenuItemIndicator;
// Usage
function App() {
  return (
    <Menu>
      <Menu.Trigger>Open Menu</Menu.Trigger>
      <Menu.List>
        <Menu.Item value="1">
          Option 1
          <Menu.ItemIndicator />
        </Menu.Item>
        <Menu.Item value="2">
          Option 2
          <Menu.ItemIndicator />
        </Menu.Item>
        <Menu.Item value="3">
          Option 3
          <Menu.ItemIndicator />
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
}
```
---


## Dot Notation Pattern


### Why Dot Notation?
Dot notation provides a **cleaner, more discoverable API**:
```javascript
// Without dot notation - harder to discover
<Tabs>
  <TabHeader>
    <Tab label="One" />
    <Tab label="Two" />
  </TabHeader>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</Tabs>
// With dot notation - clearer relationship
<Tabs>
  <Tabs.Header>
    <Tabs.Tab label="One" />
    <Tabs.Tab label="Two" />
  </Tabs.Header>
  <Tabs.Panels>
    <Tabs.Panel>Content 1</Tabs.Panel>
    <Tabs.Panel>Content 2</Tabs.Panel>
  </Tabs.Panels>
</Tabs>
```


### Implementing Dot Notation
```javascript
// Main component
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}
// Sub-components
function TabsHeader({ children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <div className="tabs-header">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isActive: index === activeTab,
          onClick: () => setActiveTab(index)
        })
      )}
    </div>
  );
}
function Tab({ label, isActive, onClick, children }) {
  return (
    <button
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {children || label}
    </button>
  );
}
function TabsPanels({ children }) {
  const { activeTab } = useContext(TabsContext);
  return (
    <div className="tabs-panels">
      {React.Children.toArray(children).map((panel, index) => (
        <div key={index} hidden={index !== activeTab}>
          {panel}
        </div>
      ))}
    </div>
  );
}
function TabsPanel({ children }) {
  return <div className="tabs-panel">{children}</div>;
}
// Attach sub-components using dot notation
Tabs.Header = TabsHeader;
Tabs.Tab = Tab;
Tabs.Panels = TabsPanels;
Tabs.Panel = TabsPanel;
// Export
export default Tabs;
// Usage
function App() {
  return (
    <Tabs>
      <Tabs.Header>
        <Tabs.Tab label="Tab 1" />
        <Tabs.Tab label="Tab 2" />
        <Tabs.Tab label="Tab 3" />
      </Tabs.Header>
      <Tabs.Panels>
        <Tabs.Panel>Content for Tab 1</Tabs.Panel>
        <Tabs.Panel>Content for Tab 2</Tabs.Panel>
        <Tabs.Panel>Content for Tab 3</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
```


### Alternative: Separate Exports
```javascript
// You can also export separately if preferred
export function TabsHeader({ children }) { /* ... */ }
export function Tab({ children }) { /* ... */ }
export function TabsPanels({ children }) { /* ... */ }
export function TabsPanel({ children }) { /* ... */ }
function Tabs({ children }) { /* ... */ }
export { Tabs as default };
// Usage
import Tabs, { TabsHeader, Tab, TabsPanels, TabsPanel } from './Tabs';
```
---


## Advanced Compound Patterns


### Pattern 1: Validating Children
```javascript
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  // Validate that we have both Header and Panels
  const validChildren = React.Children.toArray(children).filter(
    child => child.type === TabsHeader || child.type === TabsPanels
  );
  if (validChildren.length !== 2) {
    throw new Error('Tabs requires exactly one Tabs.Header and one Tabs.Panels');
  }
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}
```


### Pattern 2: Default Values
```javascript
function Select({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, setValue, isOpen, setIsOpen }}>
      {children}
    </SelectContext.Provider>
  );
}
// Usage with default
<Select defaultValue="option1">
  <Select.Trigger>Choose option</Select.Trigger>
  <Select.Options>
    <Select.Option value="option1">Option 1</Select.Option>
    <Select.Option value="option2">Option 2</Select.Option>
  </Select.Options>
</Select>
```


### Pattern 3: Controlled Components
```javascript
function Accordion({ value: controlledValue, onChange, children, multiple = false }) {
  const [uncontrolledValue, setUncontrolledValue] = useState([]);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const handleChange = (itemValue) => {
    if (multiple) {
      const newValue = value.includes(itemValue)
        ? value.filter(v => v !== itemValue)
        : [...value, itemValue];
      if (!isControlled) setUncontrolledValue(newValue);
      onChange?.(newValue);
    } else {
      const newValue = value === itemValue ? null : itemValue;
      if (!isControlled) setUncontrolledValue(newValue);
      onChange?.(newValue);
    }
  };
  return (
    <AccordionContext.Provider value={{ value, onChange: handleChange }}>
      {children}
    </AccordionContext.Provider>
  );
}
// Usage - uncontrolled
<Accordion>
  <Accordion.Item value="1">Content 1</Accordion.Item>
  <Accordion.Item value="2">Content 2</Accordion.Item>
</Accordion>
// Usage - controlled
<Accordion value={openItems} onChange={setOpenItems} multiple>
  <Accordion.Item value="1">Content 1</Accordion.Item>
  <Accordion.Item value="2">Content 2</Accordion.Item>
</Accordion>
```
---


## Real-World Examples


### Example 1: Modal System
```javascript
const ModalContext = createContext(null);
function Modal({ children, isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  if (!shouldRender) return null;
  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div className={`modal ${isOpen ? 'open' : 'closing'}`}>
        {children}
      </div>
    </ModalContext.Provider>
  );
}
function ModalTrigger({ children, as: As = 'button', ...props }) {
  const { onOpen } = useContext(ModalContext) || {};
  return (
    <As {...props} onClick={onOpen}>
      {children}
    </As>
  );
}
function ModalOverlay({ children }) {
  const { onClose } = useContext(ModalContext);
  return (
    <div className="modal-overlay" onClick={onClose}>
      {children}
    </div>
  );
}
function ModalContent({ children }) {
  return <div className="modal-content">{children}</div>;
}
function ModalHeader({ children }) {
  return <div className="modal-header">{children}</div>;
}
function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>;
}
function ModalFooter({ children }) {
  const { onClose } = useContext(ModalContext);
  return (
    <div className="modal-footer">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
// Attach sub-components
Modal.Trigger = ModalTrigger;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
// Usage
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>Modal Title</Modal.Header>
            <Modal.Body>Modal content here...</Modal.Body>
            <Modal.Footer>Footer content</Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal>
    </>
  );
}
```


### Example 2: Data Table
```javascript
const TableContext = createContext(null);
function Table({ children, data, onRowClick }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  return (
    <TableContext.Provider value={{
      data,
      selectedRows,
      setSelectedRows,
      sortConfig,
      setSortConfig,
      onRowClick
    }}>
      <table className="table">{children}</table>
    </TableContext.Provider>
  );
}
function TableHeader({ children }) {
  return <thead className="table-header">{children}</thead>;
}
function TableRow({ children, onClick }) {
  return <tr onClick={onClick}>{children}</tr>;
}
function TableHead({ children, sortable, field }) {
  const { sortConfig, setSortConfig } = useContext(TableContext);
  const handleClick = () => {
    if (sortable) {
      setSortConfig({
        field,
        direction: sortConfig?.field === field && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
      });
    }
  };
  return (
    <th onClick={sortable ? handleClick : undefined} className={sortable ? 'sortable' : ''}>
      {children}
      {sortConfig?.field === field && (
        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
      )}
    </th>
  );
}
function TableBody({ children }) {
  return <tbody className="table-body">{children}</tbody>;
}
function TableCell({ children }) {
  return <td className="table-cell">{children}</td>;
}
// Attach sub-components
Table.Header = TableHeader;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Cell = TableCell;
// Usage
function App() {
  const data = [
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Jane', age: 30 },
    { id: 3, name: 'Bob', age: 35 }
  ];
  return (
    <Table data={data}>
      <Table.Header>
        <Table.Row>
          <Table.Head sortable field="name">Name</Table.Head>
          <Table.Head sortable field="age">Age</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(row => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.age}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
```
---


## Best Practices


### ✅ DO
1. **Use Context for state sharing**
2. **Attach sub-components with dot notation**
3. **Validate children when appropriate**
4. **Support both controlled and uncontrolled**
5. **Provide sensible defaults**
6. **Document the API clearly**
7. **Keep components focused**
8. **Use TypeScript for better DX**


### ❌ DON'T
1. **Don't expose internal state unnecessarily**
2. **Don't create deep nesting**
3. **Don't forget to validate children**
4. **Don't hardcode behavior**
5. **Don't mix concerns**
---


## Common Pitfalls


### Pitfall 1: Missing Context Provider
```javascript
// ❌ Error: missing provider
function Tab({ children }) {
  const { activeTab } = useContext(TabsContext); // Error!
  return <div>{children}</div>;
}
// ✅ Solution: always check
function Tab({ children }) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab must be inside Tabs');
  }
  const { activeTab } = context;
  return <div>{children}</div>;
}
```


### Pitfall 2: Creating New Arrays in Context
```javascript
// ❌ Creates new object on every render
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}
// ✅ Use useMemo
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);
  return (
    <TabsContext.Provider value={value}>
      {children}
    </TabsContext.Provider>
  );
}
```
---


## Interview Preparation


### Common Questions


#### Q1: What are compound components?
**Answer**: Compound components are multiple components that work together to achieve a single task. They share state through Context and provide a flexible, composable API.


#### Q2: Why use dot notation?
**Answer**: Dot notation (e.g., `Tabs.Tab`) creates a clearer, more discoverable API that shows the relationship between components and makes the API more intuitive.


#### Q3: When would you use compound components?
**Answer**: Use compound components when building complex, flexible UI components like modals, tabs, menus, or forms where you want consumers to have control over composition.
---


## Practice Exercise


### Requirements:
- ✅ Build a complete Tabs component
- ✅ Use compound pattern
- ✅ Implement dot notation
- ✅ Support controlled/uncontrolled
- ✅ Add animations


### Solution:
See practice file: `day-19/practice/tabs-component.jsx`
---


## Key Takeaways


### ✅ What You Learned Today
1. **Compound Components**: Related components working together
2. **Context Sharing**: Implicit state via Context
3. **Dot Notation**: Clean, discoverable APIs
4. **Flexibility**: Consumer controls composition
5. **Real Applications**: Modal, Table, Accordion examples


### 🎯 Key Concepts
- Components work together for a common goal
- Context enables state sharing
- Dot notation improves discoverability
- Flexibility over rigid APIs
- Single responsibility per component


### 📚 Next Steps
Tomorrow you'll learn:
- ✅ Render props pattern
- ✅ Sharing code with render props
- ✅ Function as children
- ✅ Advanced render patterns
---
**Great work! 🎉 You've mastered Compound Components!**
**You're now ready to learn Render Props! 🚀**
---


## Summary Cheat Sheet


### Compound Components Quick Reference
```javascript
// Basic pattern
function Component({ children }) {
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}
function SubComponent({ children }) {
  const context = useContext(Context);
  return <div>{children}</div>;
}
// Attach sub-components
Component.SubComponent = SubComponent;
// Usage
<Component>
  <Component.SubComponent>Content</Component.SubComponent>
</Component>
```
---


## Additional Advanced Examples


### Complete Tabs Implementation
```javascript
import React, { createContext, useContext, useState } from 'react';
const TabsContext = createContext(null);
function Tabs({ children, defaultValue = 0, onChange, controlledValue }) {
  const [uncontrolledTab, setUncontrolledTab] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const activeTab = isControlled ? controlledValue : uncontrolledTab;
  const handleChange = (index) => {
    if (!isControlled) setUncontrolledTab(index);
    onChange?.(index);
  };
  const value = React.useMemo(() => ({
    activeTab,
    onChange: handleChange
  }), [activeTab, handleChange]);
  return (
    <TabsContext.Provider value={value}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}
function TabsList({ children }) {
  const { activeTab, onChange } = useContext(TabsContext);
  return (
    <div className="tabs-list">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isActive: index === activeTab,
          onClick: () => onChange(index)
        })
      )}
    </div>
  );
}
function TabsTrigger({ children, isActive, onClick }) {
  return (
    <button
      className={`tabs-trigger ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-selected={isActive}
    >
      {children}
    </button>
  );
}
function TabsContent({ children, index }) {
  const { activeTab } = useContext(TabsContext);
  return (
    <div
      className="tabs-content"
      role="tabpanel"
      hidden={index !== activeTab}
    >
      {children}
    </div>
  );
}
function TabsPanels({ children }) {
  return <div className="tabs-panels">{children}</div>;
}
// Attach using dot notation
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Panels = TabsPanels;
Tabs.Content = TabsContent;
export default Tabs;
// Usage
function App() {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Trigger>First</Tabs.Trigger>
        <Tabs.Trigger>Second</Tabs.Trigger>
        <Tabs.Trigger>Third</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Content index={0}>Content 1</Tabs.Content>
        <Tabs.Content index={1}>Content 2</Tabs.Content>
        <Tabs.Content index={2}>Content 3</Tabs.Content>
      </Tabs.Panels>
    </Tabs>
  );
}
```


### Complete Select Component
```javascript
const SelectContext = createContext(null);
function Select({ children, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    onChange?.(value);
  };
  const value = React.useMemo(() => ({
    isOpen,
    setIsOpen,
    selectedValue,
    handleSelect,
    placeholder
  }), [isOpen, selectedValue, placeholder]);
  return (
    <SelectContext.Provider value={value}>
      <div className="select">{children}</div>
    </SelectContext.Provider>
  );
}
function SelectTrigger({ children }) {
  const { isOpen, setIsOpen, selectedValue, placeholder } = useContext(SelectContext);
  return (
    <button
      className="select-trigger"
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
    >
      {selectedValue || placeholder || 'Select...'}
    </button>
  );
}
function SelectOptions({ children }) {
  const { isOpen, handleSelect } = useContext(SelectContext);
  if (!isOpen) return null;
  return (
    <div className="select-options">
      {React.Children.map(children, child =>
        React.cloneElement(child, { onSelect: handleSelect })
      )}
    </div>
  );
}
function SelectOption({ children, value, onSelect }) {
  return (
    <div
      className="select-option"
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
}
function SelectValue() {
  const { selectedValue } = useContext(SelectContext);
  return selectedValue || null;
}
// Attach using dot notation
Select.Trigger = SelectTrigger;
Select.Options = SelectOptions;
Select.Option = SelectOption;
Select.Value = SelectValue;
export default Select;
// Usage
function App() {
  const [value, setValue] = useState(null);
  return (
    <Select value={value} onChange={setValue} placeholder="Choose an option">
      <Select.Trigger />
      <Select.Options>
        <Select.Option value="1">Option 1</Select.Option>
        <Select.Option value="2">Option 2</Select.Option>
        <Select.Option value="3">Option 3</Select.Option>
      </Select.Options>
    </Select>
  );
}
```
---


## Testing Compound Components
```javascript
import { render, screen } from '@testing-library/react';
import Tabs from './Tabs';
describe('Tabs', () => {
  it('renders tabs correctly', () => {
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Trigger>Tab 1</Tabs.Trigger>
          <Tabs.Trigger>Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Content index={0}>Content 1</Tabs.Content>
          <Tabs.Content index={1}>Content 2</Tabs.Content>
        </Tabs.Panels>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });
  it('switches tabs on click', () => {
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Trigger>Tab 1</Tabs.Trigger>
          <Tabs.Trigger>Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Content index={0}>Content 1</Tabs.Content>
          <Tabs.Content index={1}>Content 2</Tabs.Content>
        </Tabs.Panels>
      </Tabs>
    );
    const tab2 = screen.getByText('Tab 2');
    tab2.click();
    expect(screen.getByText('Content 2')).toBeVisible();
  });
});
```
---


## Accessibility in Compound Components
```javascript
function AccessibleTabs({ children, defaultValue = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const value = React.useMemo(() => ({
    activeTab,
    setActiveTab,
    tabsId: `tabs-${Math.random().toString(36).substr(2, 9)}`
  }), [activeTab]);
  return (
    <TabsContext.Provider value={value}>
      <div role="tablist" className="tabs">
        {children}
      </div>
    </TabsContext.Provider>
  );
}
function AccessibleTabsTrigger({ children, index }) {
  const { activeTab, setActiveTab, tabsId } = useContext(TabsContext);
  const isActive = index === activeTab;
  return (
    <button
      role="tab"
      id={`${tabsId}-tab-${index}`}
      aria-controls={`${tabsId}-panel-${index}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
}
function AccessibleTabsContent({ children, index }) {
  const { activeTab, tabsId } = useContext(TabsContext);
  const isActive = index === activeTab;
  return (
    <div
      role="tabpanel"
      id={`${tabsId}-panel-${index}`}
      aria-labelledby={`${tabsId}-tab-${index}`}
      hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      {children}
    </div>
  );
}
```
---


## Performance Optimization
```javascript
// Memoize context value
function Tabs({ children, defaultValue = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const onChange = React.useCallback((index) => {
    setActiveTab(index);
  }, []);
  const value = React.useMemo(() => ({
    activeTab,
    onChange
  }), [activeTab, onChange]);
  return (
    <TabsContext.Provider value={value}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}
// Memoize sub-components
const TabsTrigger = React.memo(function({ children, isActive, onClick }) {
  return (
    <button
      className={`tabs-trigger ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
});
const TabsContent = React.memo(function({ children, index, isActive }) {
  return (
    <div hidden={!isActive}>
      {children}
    </div>
  );
});
```
---


## Common Patterns Summary


### Pattern 1: Provider + Consumer with Dot Notation
```javascript
function Component({ children }) {
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}
function SubComponent({ children }) {
  const context = useContext(Context);
  return <div>{children}</div>;
}
Component.SubComponent = SubComponent;
```


### Pattern 2: Controlled + Uncontrolled
```javascript
function Component({ value: controlledValue, onChange, children }) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const handleChange = (newValue) => {
    if (controlledValue === undefined) setUncontrolledValue(newValue);
    onChange?.(newValue);
  };
  return (
    <Context.Provider value={{ value, onChange: handleChange }}>
      {children}
    </Context.Provider>
  );
}
```


### Pattern 3: Validation
```javascript
function Component({ children }) {
  React.Children.forEach(children, child => {
    if (!isValidChild(child)) {
      throw new Error('Invalid child');
    }
  });
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
```
---


## Key Takeaways Recap


### ✅ Compound Components Benefits
1. **Flexibility**: Consumer controls composition
2. **Discoverability**: Dot notation shows relationships
3. **Separation of Concerns**: Each component has single responsibility
4. **Reusability**: Components can be used independently
5. **Maintainability**: Changes isolated to relevant parts


### 🎯 When to Use
- Building component libraries
- Creating flexible, composable UIs
- When you want consumer control
- Working with complex, multi-part components


### 📚 Alternatives to Consider
- **Render Props**: When you need more rendering flexibility
- **Hooks**: For logic extraction and reuse
- **HOCs**: For cross-cutting concerns
- **Regular Props**: When simple composition is enough
---
---


## More Real-World Examples


### Complete Accordion Component
```javascript
const AccordionContext = createContext(null);
function Accordion({ children, multiple = false, defaultValue = [] }) {
  const [openItems, setOpenItems] = useState(defaultValue);
  const [activeItem, setActiveItem] = useState(null);
  const value = useMemo(() => ({
    openItems,
    setOpenItems,
    activeItem,
    setActiveItem,
    multiple
  }), [openItems, activeItem, multiple]);
  return (
    <AccordionContext.Provider value={value}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}
function AccordionItem({ value, children }) {
  const { openItems, setOpenItems, multiple, activeItem, setActiveItem } = useContext(AccordionContext);
  const isOpen = openItems.includes(value);
  const handleToggle = () => {
    if (multiple) {
      if (isOpen) {
        setOpenItems(openItems.filter(item => item !== value));
      } else {
        setOpenItems([...openItems, value]);
      }
    } else {
      setOpenItems(isOpen ? [] : [value]);
    }
    setActiveItem(isOpen ? null : value);
  };
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          isOpen,
          onToggle: handleToggle,
          value
        })
      )}
    </div>
  );
}
function AccordionHeader({ children, isOpen, onToggle }) {
  return (
    <button className="accordion-header" onClick={onToggle}>
      {children}
      <span>{isOpen ? '−' : '+'}</span>
    </button>
  );
}
function AccordionContent({ children, isOpen }) {
  return (
    <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
      {children}
    </div>
  );
}
// Attach components
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;
// Usage
function App() {
  return (
    <Accordion multiple>
      <Accordion.Item value="item1">
        <Accordion.Header>Item 1</Accordion.Header>
        <Accordion.Content>Content 1</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item2">
        <Accordion.Header>Item 2</Accordion.Header>
        <Accordion.Content>Content 2</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
```


### Complete Dropdown Component
```javascript
const DropdownContext = createContext(null);
function Dropdown({ children, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const value = useMemo(() => ({
    isOpen,
    setIsOpen,
    selectedValue,
    setSelectedValue,
    selectedLabel,
    setSelectedLabel,
    onSelect
  }), [isOpen, selectedValue, selectedLabel, onSelect]);
  return (
    <DropdownContext.Provider value={value}>
      <div className="dropdown">{children}</div>
    </DropdownContext.Provider>
  );
}
function DropdownTrigger({ children }) {
  const { isOpen, setIsOpen, selectedLabel } = useContext(DropdownContext);
  return (
    <button
      className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
    >
      {children || selectedLabel || 'Select...'}
    </button>
  );
}
function DropdownMenu({ children }) {
  const { isOpen } = useContext(DropdownContext);
  if (!isOpen) return null;
  return (
    <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  );
}
function DropdownItem({ value, children }) {
  const { setIsOpen, setSelectedValue, setSelectedLabel, onSelect } = useContext(DropdownContext);
  const handleSelect = () => {
    setSelectedValue(value);
    setSelectedLabel(children);
    setIsOpen(false);
    onSelect?.(value);
  };
  return (
    <div className="dropdown-item" onClick={handleSelect}>
      {children}
    </div>
  );
}
// Attach components
Dropdown.Trigger = DropdownTrigger;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;
// Usage
function App() {
  return (
    <Dropdown onSelect={(value) => console.log('Selected:', value)}>
      <Dropdown.Trigger />
      <Dropdown.Menu>
        <Dropdown.Item value="1">Option 1</Dropdown.Item>
        <Dropdown.Item value="2">Option 2</Dropdown.Item>
        <Dropdown.Item value="3">Option 3</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
```
---


## TypeScript Support


### Type-Safe Compound Components
```typescript
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
interface TabsContextValue {
  activeTab: number;
  setActiveTab: (index: number) => void;
}
const TabsContext = createContext<TabsContextValue | null>(null);
interface TabsProps {
  children: ReactNode;
  defaultValue?: number;
  onChange?: (index: number) => void;
}
function Tabs({ children, defaultValue = 0, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const handleChange = (index: number) => {
    setActiveTab(index);
    onChange?.(index);
  };
  const value = useMemo(() => ({
    activeTab,
    setActiveTab: handleChange
  }), [activeTab]);
  return (
    <TabsContext.Provider value={value}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}
interface TabsTriggerProps {
  children: ReactNode;
  index: number;
}
function TabsTrigger({ children, index }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be inside Tabs');
  const { activeTab, setActiveTab } = context;
  const isActive = index === activeTab;
  return (
    <button
      className={`tabs-trigger ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(index)}
      aria-selected={isActive}
    >
      {children}
    </button>
  );
}
interface TabsContentProps {
  children: ReactNode;
  index: number;
}
function TabsContent({ children, index }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be inside Tabs');
  const { activeTab } = context;
  const isActive = index === activeTab;
  return (
    <div className="tabs-content" hidden={!isActive}>
      {children}
    </div>
  );
}
// Attach with proper typing
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
export default Tabs;
// Usage
function App() {
  return (
    <Tabs defaultValue={0} onChange={(index) => console.log('Tab:', index)}>
      <Tabs.Trigger index={0}>Tab 1</Tabs.Trigger>
      <Tabs.Trigger index={1}>Tab 2</Tabs.Trigger>
      <Tabs.Content index={0}>Content 1</Tabs.Content>
      <Tabs.Content index={1}>Content 2</Tabs.Content>
    </Tabs>
  );
}
```
---


## Advanced Patterns and Techniques


### Pattern 4: Conditional Children
```javascript
function ConditionalWrapper({ condition, children, fallback }) {
  if (condition) {
    return children;
  }
  return fallback || null;
}
// Usage with compound components
function App() {
  return (
    <Card>
      <Card.Header>Title</Card.Header>
      <ConditionalWrapper condition={isExpanded}>
        <Card.Body>Long content...</Card.Body>
      </ConditionalWrapper>
      {isExpanded && (
        <Card.Footer>Extra info</Card.Footer>
      )}
    </Card>
  );
}
```


### Pattern 5: Dynamic Component Composition
```javascript
function DynamicTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs">
      <div className="tabs-list">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={index === activeTab ? 'active' : ''}
            onClick={() => onChange(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}
// Usage
function App() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: 'Tab 1', content: <div>Content 1</div> },
    { label: 'Tab 2', content: <div>Content 2</div> },
    { label: 'Tab 3', content: <div>Content 3</div> }
  ];
  return (
    <DynamicTabs
      tabs={tabs}
      activeTab={activeTab}
      onChange={setActiveTab}
    />
  );
}
```
---


## Pattern Variations


### Variation 1: Slot Pattern
```javascript
function Layout({ children }) {
  const slots = { header: null, sidebar: null, main: null, footer: null };
  React.Children.forEach(children, child => {
    if (child?.props.slot) {
      slots[child.props.slot] = child.props.children;
    } else {
      slots.main = child.props.children;
    }
  });
  return (
    <div className="layout">
      <header>{slots.header}</header>
      <div className="body">
        <aside>{slots.sidebar}</aside>
        <main>{slots.main}</main>
      </div>
      <footer>{slots.footer}</footer>
    </div>
  );
}
// Usage
function App() {
  return (
    <Layout>
      <div slot="header">Header</div>
      <div slot="sidebar">Sidebar</div>
      <div slot="main">Main Content</div>
      <div slot="footer">Footer</div>
    </Layout>
  );
}
```


### Variation 2: Feature Toggle Pattern
```javascript
function FeatureProvider({ features, children }) {
  return (
    <FeatureContext.Provider value={features}>
      {children}
    </FeatureContext.Provider>
  );
}
function Feature({ name, fallback, children }) {
  const features = useContext(FeatureContext);
  const isEnabled = features?.[name] || false;
  if (isEnabled) {
    return children;
  }
  return fallback || null;
}
// Usage
function App() {
  const features = {
    darkMode: true,
    newLayout: false
  };
  return (
    <FeatureProvider features={features}>
      <Feature name="darkMode">
        <DarkModeSettings />
      </Feature>
      <Feature name="newLayout" fallback={<OldLayout />}>
        <NewLayout />
      </Feature>
    </FeatureProvider>
  );
}
```
---


## Migration Patterns


### Converting to Compound Components
```javascript
// Before: Monolithic component
function OldTabs({ items }) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="tabs">
      <div className="tabs-list">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={index === activeTab ? 'active' : ''}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {items[activeTab].content}
      </div>
    </div>
  );
}
// After: Compound component
function NewTabs({ children, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}
function TabsList({ children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <div className="tabs-list">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isActive: index === activeTab,
          onClick: () => setActiveTab(index)
        })
      )}
    </div>
  );
}
// Benefits:
// 1. More flexible composition
// 2. Better control over rendering
// 3. Easier to test individual parts
// 4. More maintainable
```
---


## Production-Ready Implementations


### Enterprise Modal System
```javascript
const ModalContext = createContext(null);
function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);
  const openModal = useCallback((id, content) => {
    setModals(prev => [...prev, { id, content }]);
  }, []);
  const closeModal = useCallback((id) => {
    setModals(prev => prev.filter(m => m.id !== id));
  }, []);
  const closeAll = useCallback(() => {
    setModals([]);
  }, []);
  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAll }}>
      {children}
      {modals.map(modal => (
        <Modal key={modal.id} onClose={() => closeModal(modal.id)}>
          {modal.content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
}
function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
}
// Usage
function App() {
  const { openModal } = useModal();
  return (
    <button onClick={() => openModal('modal1', <div>Hello</div>)}>
      Open Modal
    </button>
  );
}
function Root() {
  return (
    <ModalProvider>
      <App />
    </ModalProvider>
  );
}
```
---
**Complete! You've mastered Compound Components from basics to advanced patterns! 🎯**
