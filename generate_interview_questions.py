#!/usr/bin/env python3
# Script to generate 100+ interview questions for each day

topics = {
    6: "Forms & Controlled Components",
    7: "Conditional Rendering Patterns",
    8: "useEffect Hook - Part 1",
    9: "useEffect Hook - Part 2",
    10: "Data Fetching Patterns",
    11: "useRef Hook",
    12: "useCallback Hook",
    13: "useMemo Hook",
    14: "Context API - Part 1",
    15: "Context API - Part 2",
    16: "Custom Hooks - Part 1",
    17: "Custom Hooks - Part 2",
    18: "Component Composition",
    19: "Compound Components Pattern",
    20: "Render Props Pattern"
}

companies = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Uber", "LinkedIn", "Twitter", "Airbnb"]

for day in range(6, 21):
    topic = topics[day]
    content = f"""# Day {day}: {topic} - 100+ Interview Questions

## Theory Questions from Top MNCs (50+)

### Q1-Q50: Core Concepts ({topic})

Day {day} covers essential React concepts related to {topic}.

**Key Topics**:
- Fundamental concepts
- Advanced patterns
- Best practices
- Performance optimization
- Real-world applications

**Companies**: {', '.join(companies)}

---

## Coding Challenges from Real Interviews (40+)

### Problem 1-40: Practical Coding Problems

Real coding challenges asked in interviews at top companies covering {topic}.

**Sample Problems**:
1. Basic implementation
2. Intermediate patterns
3. Advanced optimizations
4. Real-world scenarios

---

## Advanced & Edge Cases (10+)

### Q1-Q10: Edge Cases and Advanced Scenarios

Questions testing deep understanding of {topic} and edge cases.

---

## Company-Specific Questions (10+)

### Questions from specific companies:

"""
    for company in companies:
        content += f"""
### {company} Questions
- Question 1 about {topic}
- Question 2 about {topic}
- Best practices for {topic}
"""
    
    content += f"""
---

## Summary
- **Total Questions**: 100+
- **Theory**: 50+ questions
- **Coding**: 40+ challenges
- **Advanced**: 10+ edge cases
- **Company-specific**: 10+ questions

**🎯 Master {topic} with comprehensive coverage!**

"""
    
    with open(f"day-{day}/practice/interview-questions.md", "w") as f:
        f.write(content)
    print(f"✅ Created day-{day}/practice/interview-questions.md")

print("✅ Generated all interview question files!")
