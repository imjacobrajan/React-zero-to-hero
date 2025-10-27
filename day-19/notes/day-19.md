# Day 19: Compound Components Pattern - Building Flexible Components

## 📋 Table of Contents
- [Introduction](#introduction)
- [Building Flexible Components](#building-flexible-components)
- [Context in Compound Components](#context-in-compound-components)
- [Dot Notation for Components](#dot-notation-for-components)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Compound components allow building flexible, powerful component APIs using composition and context.

---

## Building Flexible Components

```javascript
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>
    {children}
  </TabsContext.Provider>;
}

Tabs.Tab = TabComponent;
Tabs.Panel = PanelComponent;
```

---

## Context in Compound Components

```javascript
const TabsContext = createContext();

function Tab({ index, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button 
      onClick={() => setActiveTab(index)}
      className={activeTab === index ? 'active' : ''}
    >
      {children}
    </button>
  );
}
```

---

## Dot Notation

```javascript
function App() {
  return (
    <Tabs>
      <Tabs.Tab index={0}>Home</Tabs.Tab>
      <Tabs.Tab index={1}>About</Tabs.Tab>
      <Tabs.Panel index={0}>Home content</Tabs.Panel>
      <Tabs.Panel index={1}>About content</Tabs.Panel>
    </Tabs>
  );
}
```

---

## Practice Exercise

Build a Tabs component with Tab and TabPanel using compound pattern.

See practice file: `day-19/practice/compound-components.jsx`

---

## Key Takeaways

- Compound components use composition
- Context enables communication
- Dot notation for sub-components
- Flexible, powerful APIs

**See you tomorrow for Day 20: Render Props Pattern!**

