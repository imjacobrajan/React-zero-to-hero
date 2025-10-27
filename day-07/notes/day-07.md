# Day 7: Conditional Rendering Patterns - Advanced

## 📋 Table of Contents
- [Introduction](#introduction)
- [Ternary Operators - Deep Dive](#ternary-operators---deep-dive)
- [Logical && Operator - Advanced](#logical--operator---advanced)
- [Switch Statements in JSX](#switch-statements-in-jsx)
- [Early Returns and Guards](#early-returns-and-guards)
- [Multiple Conditions](#multiple-conditions)
- [Conditional Styling](#conditional-styling)
- [Conditional Class Names](#conditional-class-names)
- [Conditional Component Rendering](#conditional-component-rendering)
- [Loading States](#loading-states)
- [Error States](#error-states)
- [Empty States](#empty-states)
- [Auth-Based Rendering](#auth-based-rendering)
- [Role-Based Rendering](#role-based-rendering)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to Day 7! Today you'll master **conditional rendering** - one of the most powerful patterns in React. By the end of today, you'll:
- ✅ Master ternary operators for if/else scenarios (complete reference)
- ✅ Use logical && for simple conditions
- ✅ Implement switch statements in JSX
- ✅ Handle loading, error, and empty states
- ✅ Build a complete TodoList with CRUD operations
- ✅ Implement advanced conditional rendering patterns
- ✅ Conditional styling and class names
- ✅ Auth and role-based rendering

> **📌 What's NOT in Day 7**: General conditional rendering patterns for lists (that's Day 3), or complex state management. Day 7 focuses exclusively on conditional rendering techniques and patterns.

**Today's Scope**:
1. Ternary operators (if/else in JSX)
2. Logical && operator
3. Switch statements in JSX
4. Early returns and guards
5. Multiple conditions
6. Conditional styling and classes
7. Loading/error/empty states
8. Auth and role-based rendering

---

## Ternary Operators - Deep Dive

### Basic Ternary Syntax

```javascript
{condition ? (if truthy) : (if falsy)}
```

### Simple Examples

```javascript
// Show different text based on condition
function WelcomeMessage({ user }) {
  return (
    <div>
      {user ? `Welcome, ${user.name}!` : 'Welcome, Guest!'}
    </div>
  );
}

// Show different components
function AuthStatus({ isLoggedIn }) {
  return isLoggedIn ? <Dashboard /> : <LoginForm />;
}

// Conditional rendering with multiple conditions
function DiscountBadge({ price, originalPrice }) {
  const discount = originalPrice - price;
  return (
    <div>
      {discount > 0 ? (
        <span className="badge">Save ${discount}</span>
      ) : (
        <span className="badge">Regular Price</span>
      )}
    </div>
  );
}
```

### Nested Ternary (Use Sparingly)

```javascript
function StatusIndicator({ status }) {
  return (
    <div>
      {status === 'loading' ? (
        <Spinner />
      ) : status === 'error' ? (
        <ErrorIcon />
      ) : status === 'success' ? (
        <SuccessIcon />
      ) : (
        <UnknownIcon />
      )}
    </div>
  );
}

// Better: Use switch or if-else
function StatusIndicatorBetter({ status }) {
  return (
    <div>
      {status === 'loading' && <Spinner />}
      {status === 'error' && <ErrorIcon />}
      {status === 'success' && <SuccessIcon />}
      {status === 'unknown' && <UnknownIcon />}
    </div>
  );
}
```

### Ternary with Multiple Elements

```javascript
function ProductList({ products, viewMode }) {
  return (
    <div>
      {viewMode === 'grid' ? (
        <div className="grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="list">
          {products.map(p => <ProductRow key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
```

---

## Logical && Operator - Advanced

### Basic Usage

```javascript
// Only render if condition is true
{isLoggedIn && <UserMenu />}

// Multiple conditions
{isLoggedIn && isPremium && <PremiumFeatures />}

// Chaining conditions
{isLoading && isFetchingData && <LoadingIndicator />}
```

### Common Pitfalls

```javascript
// ❌ WRONG: 0 is falsy, so "0" will render
{items.length && <ItemList items={items} />}

// ✅ CORRECT: Use comparison
{items.length > 0 && <ItemList items={items} />}

// ❌ WRONG: Empty string is falsy
{message && <Alert message={message} />}

// ✅ CORRECT: Check for truthy value
{message && message.trim() && <Alert message={message} />}
```

### Zero Check Pattern

```javascript
function Cart({ itemCount }) {
  return (
    <div>
      {itemCount > 0 && (
        <span className="badge">{itemCount}</span>
      )}
    </div>
  );
}

// Or use ternary for cleaner code
function CartTernary({ itemCount }) {
  return (
    <div>
      {itemCount > 0 ? (
        <span className="badge">{itemCount}</span>
      ) : null}
    </div>
  );
}
```

---

## Switch Statements in JSX

### Switch in Component

```javascript
function StatusBadge({ status }) {
  const getStatusDisplay = () => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'approved':
        return <span className="badge badge-success">Approved</span>;
      case 'rejected':
        return <span className="badge badge-error">Rejected</span>;
      case 'cancelled':
        return <span className="badge badge-gray">Cancelled</span>;
      default:
        return <span className="badge badge-default">Unknown</span>;
    }
  };

  return <div>{getStatusDisplay()}</div>;
}
```

### Switch with Multiple Values

```javascript
function Icon({ type }) {
  const getIcon = () => {
    switch (type) {
      case 'home':
      case 'dashboard':
        return <HomeIcon />;
      case 'user':
      case 'profile':
        return <UserIcon />;
      case 'settings':
      case 'config':
        return <SettingsIcon />;
      default:
        return <DefaultIcon />;
    }
  };

  return getIcon();
}
```

### Switch with Enums

```javascript
const OrderStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

function OrderBadge({ status }) {
  const getBadge = () => {
    switch (status) {
      case OrderStatus.PENDING:
        return <span className="badge-yellow">Pending</span>;
      case OrderStatus.PROCESSING:
        return <span className="badge-blue">Processing</span>;
      case OrderStatus.SHIPPED:
        return <span className="badge-purple">Shipped</span>;
      case OrderStatus.DELIVERED:
        return <span className="badge-green">Delivered</span>;
      case OrderStatus.CANCELLED:
        return <span className="badge-red">Cancelled</span>;
      default:
        return null;
    }
  };

  return getBadge();
}
```

---

## Early Returns and Guards

### Early Return Pattern

```javascript
function UserProfile({ user }) {
  if (!user) {
    return <div>No user found</div>;
  }
  
  if (user.isLoading) {
    return <div>Loading...</div>;
  }
  
  if (user.isError) {
    return <div>Error loading user</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Guard Clauses

```javascript
function ProductDetails({ product }) {
  if (!product) return null;
  if (product.discontinued) return <DiscontinuedMessage />;
  if (product.outOfStock) return <OutOfStockMessage />;
  
  return (
    <div>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </div>
  );
}
```

---

## Multiple Conditions

### Array of Conditions

```javascript
function Menu({ isLoggedIn, isPremium, isAdmin }) {
  const showBasicMenu = isLoggedIn;
  const showPremiumMenu = isLoggedIn && isPremium;
  const showAdminMenu = isLoggedIn && isAdmin;
  
  return (
    <nav>
      {showBasicMenu && <BasicMenu />}
      {showPremiumMenu && <PremiumMenu />}
      {showAdminMenu && <AdminMenu />}
    </nav>
  );
}
```

### Complex Conditionals

```javascript
function AccessControl({ user, resource }) {
  const canEdit = user.role === 'admin' || 
                  user.role === 'editor' || 
                  resource.authorId === user.id;
  
  const canDelete = user.role === 'admin' && 
                    resource.ownerId === user.id;
  
  return (
    <div>
      <button disabled={!canEdit}>Edit</button>
      <button disabled={!canDelete}>Delete</button>
    </div>
  );
}
```

---

## Conditional Styling

### Inline Styles

```javascript
function StatusButton({ isActive }) {
  return (
    <button style={{
      backgroundColor: isActive ? 'green' : 'gray',
      color: isActive ? 'white' : 'black',
      padding: isActive ? '12px' : '8px'
    }}>
      {isActive ? 'Active' : 'Inactive'}
    </button>
  );
}
```

### Dynamic Classes

```javascript
function Notification({ type, message }) {
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
}

// With clsx library
import clsx from 'clsx';

function Button({ variant, size, disabled }) {
  return (
    <button className={clsx(
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      disabled && 'btn-disabled'
    )}>
      Click me
    </button>
  );
}
```

---

## Conditional Class Names

### Template Literals

```javascript
function Alert({ type, children }) {
  return (
    <div className={`alert alert-${type}`}>
      {children}
    </div>
  );
}
```

### Array Join Pattern

```javascript
function TabButton({ active, label, onClick }) {
  return (
    <button
      className={[
        'tab-button',
        active && 'tab-button-active'
      ].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

### Using Classnames Library

```javascript
import classNames from 'classnames';

function Button({ primary, loading, disabled }) {
  return (
    <button className={classNames(
      'button',
      {
        'button-primary': primary,
        'button-loading': loading,
        'button-disabled': disabled
      }
    )}>
      {loading ? 'Loading...' : 'Click'}
    </button>
  );
}
```

---

## Conditional Component Rendering

### Loading Components

```javascript
function DataDisplay({ data, isLoading, isError }) {
  if (isLoading) return <Spinner />;
  if (isError) return <ErrorIcon />;
  if (!data) return <EmptyState />;
  
  return <DataView data={data} />;
}
```

### Route-Based Rendering

```javascript
function App({ route }) {
  return (
    <>
      {route === 'home' && <HomePage />}
      {route === 'about' && <AboutPage />}
      {route === 'contact' && <ContactPage />}
      {!['home', 'about', 'contact'].includes(route) && <NotFoundPage />}
    </>
  );
}
```

---

## Loading States

### Basic Loading

```javascript
function ProductList({ products, isLoading }) {
  return (
    <div>
      {isLoading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Skeleton Loader

```javascript
function SkeletonLoader() {
  return (
    <div className="skeleton">
      <div className="skeleton-header"></div>
      <div className="skeleton-body"></div>
      <div className="skeleton-footer"></div>
    </div>
  );
}

function ProductCard({ product, isLoading }) {
  return isLoading ? <SkeletonLoader /> : <ProductCardContent product={product} />;
}
```

---

## Error States

### Error Handling

```javascript
function ApiData({ data, error }) {
  return (
    <div>
      {error ? (
        <div className="error">
          <h2>Error: {error.message}</h2>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      ) : (
        <DataView data={data} />
      )}
    </div>
  );
}
```

### Try-Catch Pattern

```javascript
function SafeComponent({ children, fallback }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Component error:', error);
    return fallback || <div>Something went wrong</div>;
  }
}
```

---

## Empty States

### Empty List State

```javascript
function TodoList({ todos }) {
  return todos.length > 0 ? (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  ) : (
    <div className="empty-state">
      <p>No todos yet. Create one!</p>
    </div>
  );
}
```

### Empty Search Results

```javascript
function SearchResults({ results, query }) {
  if (!query) {
    return <div>Start typing to search...</div>;
  }
  
  if (results.length === 0) {
    return <div>No results found for "{query}"</div>;
  }
  
  return (
    <ul>
      {results.map(result => (
        <li key={result.id}>{result.name}</li>
      ))}
    </ul>
  );
}
```

---

## Auth-Based Rendering

### Login Guards

```javascript
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function AdminRoute({ user, children }) {
  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}
```

---

## Role-Based Rendering

### Permission-Based UI

```javascript
function Dashboard({ user }) {
  return (
    <div>
      <WelcomeBanner user={user} />
      
      {user.role === 'admin' && <AdminPanel />}
      {user.role === 'manager' && <ManagerTools />}
      {['admin', 'manager'].includes(user.role) && <Analytics />}
      
      <UserProfile user={user} />
    </div>
  );
}
```

---

## Practice Exercise: TodoList App

### Complete Requirements:
- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ Filter todos (all, active, completed)
- ✅ Clear completed todos
- ✅ Show active count
- ✅ Persist to localStorage

### Solution:

See practice file: `day-07/practice/todo-list-app.jsx`

---

## Advanced Conditional Patterns

### Pattern 1: Compound Conditional Rendering

```javascript
function ProductCard({ product }) {
  const isNew = product.createdAt > new Date() - 7 * 24 * 60 * 60 * 1000;
  const isOnSale = product.salePrice < product.price;
  const isOutOfStock = product.stock === 0;
  
  return (
    <div className="product-card">
      {isNew && <span className="badge">New</span>}
      {isOnSale && <span className="badge sale">Sale</span>}
      {isOutOfStock && <span className="badge">Out of Stock</span>}
      
      <h3>{product.name}</h3>
      <p>${isOnSale ? product.salePrice : product.price}</p>
      
      {!isOutOfStock && (
        <button>Add to Cart</button>
      )}
    </div>
  );
}
```

### Pattern 2: Conditional Props

```javascript
function Button({ primary, secondary, danger, disabled, loading, children }) {
  const className = [
    'btn',
    primary && 'btn-primary',
    secondary && 'btn-secondary',
    danger && 'btn-danger',
    disabled && 'btn-disabled',
    loading && 'btn-loading'
  ].filter(Boolean).join(' ');
  
  return (
    <button className={className} disabled={disabled || loading}>
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

### Pattern 3: Nested Conditionals

```javascript
function Dashboard({ user, permissions }) {
  const canViewAdmin = permissions.includes('admin:view');
  const canEditContent = permissions.includes('content:edit');
  const canDeleteUsers = permissions.includes('users:delete');
  
  return (
    <div>
      <Sidebar user={user} />
      
      <main>
        {canViewAdmin && (
          <AdminPanel>
            {canEditContent && <ContentEditor />}
            {canDeleteUsers && <UserManager />}
          </AdminPanel>
        )}
        
        {!canViewAdmin && (
          <div>You don't have permission to view this section</div>
        )}
      </main>
    </div>
  );
}
```

### Pattern 4: Conditional Rendering with Hooks

```javascript
function useConditionalRendering(condition) {
  return condition ? <SuccessMessage /> : <ErrorMessage />;
}

function FormStatus({ isValid }) {
  const renderStatus = useConditionalRendering(isValid);
  return renderStatus;
}
```

### Pattern 5: Memoized Conditional Renders

```javascript
const ConditionalComponent = React.memo(({ condition, data }) => {
  if (!condition) return null;
  
  return (
    <ExpensiveComponent data={data} />
  );
});
```

---

## Performance Considerations

### When to Use Early Returns

```javascript
// ❌ BAD: Renders parent always
function ProductList({ products }) {
  return (
    <div className="product-list">
      {products && products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      {!products && <EmptyState />}
    </div>
  );
}

// ✅ GOOD: Early return
function ProductList({ products }) {
  if (!products || products.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Lazy Conditional Rendering

```javascript
function HeavyComponent({ shouldRender }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    if (shouldRender) {
      setMounted(true);
    }
  }, [shouldRender]);
  
  return shouldRender && mounted ? <HeavyContent /> : null;
}
```

---

## Common Conditional Patterns in Real Apps

### E-Commerce Product Page

```javascript
function ProductPage({ product, user }) {
  return (
    <div>
      <ProductImage src={product.image} />
      
      <div className="product-info">
        <h1>{product.name}</h1>
        <p>${product.price}</p>
        
        {product.inStock ? (
          <div className="stock-available">
            <InStockMessage stock={product.stock} />
            <AddToCartButton />
          </div>
        ) : (
          <div className="stock-unavailable">
            <OutOfStockMessage />
            <NotifyMeButton />
          </div>
        )}
        
        {user && user.isPremium && <PremiumDiscount />}
        
        {product.features.map(feature => (
          <FeatureHighlight key={feature.id} feature={feature} />
        ))}
      </div>
      
      {product.reviews.length > 0 ? (
        <ReviewsSection reviews={product.reviews} />
      ) : (
        <NoReviewsMessage />
      )}
    </div>
  );
}
```

### Admin Dashboard

```javascript
function AdminDashboard({ user }) {
  const isSuperAdmin = user.role === 'super_admin';
  const hasAccess = ['admin', 'super_admin'].includes(user.role);
  
  return (
    <div className="admin-dashboard">
      <Header user={user} />
      
      {hasAccess && (
        <AdminMenu>
          <MenuItem href="/users">Manage Users</MenuItem>
          <MenuItem href="/settings">Settings</MenuItem>
          
          {isSuperAdmin && (
            <>
              <MenuItem href="/logs">View Logs</MenuItem>
              <MenuItem href="/system">System Config</MenuItem>
            </>
          )}
        </AdminMenu>
      )}
      
      <Statistics />
      
      {user.permissions.includes('view_all') && <AllDataView />}
      {!user.permissions.includes('view_all') && <LimitedDataView />}
    </div>
  );
}
```

### Social Media Feed

```javascript
function FeedPost({ post, currentUser }) {
  const isOwnPost = post.author.id === currentUser.id;
  const isLiked = post.likes.some(like => like.userId === currentUser.id);
  const isFollowing = currentUser.following.includes(post.author.id);
  
  return (
    <article className="feed-post">
      <PostHeader author={post.author} time={post.createdAt} />
      
      {post.image && <PostImage src={post.image} />}
      {post.video && <PostVideo src={post.video} />}
      
      <PostContent>{post.content}</PostContent>
      
      <PostActions>
        <LikeButton liked={isLiked} postId={post.id} />
        <CommentButton count={post.comments.length} />
        <ShareButton postId={post.id} />
      </PostActions>
      
      {post.comments.length > 0 && (
        <CommentsSection comments={post.comments} />
      )}
      
      <CommentInput postId={post.id} />
      
      {isOwnPost && (
        <PostOptions>
          <EditButton postId={post.id} />
          <DeleteButton postId={post.id} />
        </PostOptions>
      )}
      
      {!isOwnPost && !isFollowing && (
        <FollowButton userId={post.author.id} />
      )}
    </article>
  );
}
```

---

## Testing Conditional Rendering

### Testing with Testing Library

```javascript
describe('ConditionalComponent', () => {
  it('renders content when condition is true', () => {
    render(<Component condition={true} />);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  
  it('does not render content when condition is false', () => {
    render(<Component condition={false} />);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
  
  it('shows loading state', () => {
    render(<Component loading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

---

## Conditional Rendering Checklist

### Before Conditional Rendering, Ask:
1. What are all possible states?
2. Are there loading states to handle?
3. What happens when data is empty?
4. What happens on errors?
5. Do we need permission checks?
6. Should we show different UI for different user roles?
7. Is this the best place for this logic?
8. Can we extract this to a custom hook?
9. Should we memoize expensive renders?
10. Are we handling edge cases?

---

## Advanced Conditional Rendering Patterns

### Pattern 1: Feature Flags

```javascript
function FeatureSection({ featureFlags }) {
  return (
    <div>
      {featureFlags.showNewFeature && <NewFeature />}
      {featureFlags.showBeta && <BetaSection />}
      {featureFlags.maintenanceMode && <MaintenanceBanner />}
    </div>
  );
}
```

### Pattern 2: Permission-Based Rendering

```javascript
function DocumentViewer({ document, user }) {
  return (
    <div>
      <h1>{document.title}</h1>
      
      {document.isPublic ? (
        <DocumentContent content={document.content} />
      ) : user.hasAccess ? (
        <DocumentContent content={document.content} />
      ) : (
        <AccessDenied />
      )}
      
      {user.isOwner && (
        <button>Edit Document</button>
      )}
      
      {user.canDelete && (
        <button>Delete Document</button>
      )}
    </div>
  );
}
```

### Pattern 3: Responsive Rendering

```javascript
function ResponsiveLayout({ breakpoint = 768 }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowWidth < breakpoint ? (
    <MobileLayout />
  ) : (
    <DesktopLayout />
  );
}
```

### Pattern 4: Multi-Step Process

```javascript
function MultiStepWizard({ steps, currentStep }) {
  const [step, setStep] = useState(currentStep);
  
  return (
    <div>
      <StepIndicator currentStep={step} totalSteps={steps.length} />
      
      {step === 0 && <Step1 onNext={() => setStep(1)} />}
      {step === 1 && <Step2 onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <Step3 onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <FinalStep onReset={() => setStep(0)} />}
    </div>
  );
}
```

---

## Conditional Rendering with State

### Loading State Pattern

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(user => {
        setUser(user);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) {
    return <div>Loading user...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (!user) {
    return <div>User not found</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Tab Content Pattern

```javascript
function TabContainer({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div>
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={activeTab === index ? 'active' : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {activeTab === 0 && tabs[0].content}
        {activeTab === 1 && tabs[1].content}
        {activeTab === 2 && tabs[2].content}
      </div>
    </div>
  );
}
```

---

## Form Validation Conditional Rendering

```javascript
function ValidatedInput({ value, onChange, validator }) {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  
  const handleBlur = () => {
    setTouched(true);
    const validationError = validator(value);
    setError(validationError);
  };
  
  const handleChange = (e) => {
    onChange(e.target.value);
    if (touched) {
      const validationError = validator(e.target.value);
      setError(validationError);
    }
  };
  
  return (
    <div>
      <input
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
      {!error && value && touched && (
        <span className="success-icon">✓</span>
      )}
    </div>
  );
}
```

---

## Real-World Conditional Rendering Examples

### E-commerce Product Display

```javascript
function ProductCard({ product, currentUser }) {
  const { inStock, discounted, price, originalPrice, featured } = product;
  
  return (
    <div className={`product-card ${featured ? 'featured' : ''}`}>
      {featured && <div className="featured-badge">Featured</div>}
      
      {discounted ? (
        <div className="pricing">
          <span className="price">${price}</span>
          <span className="original-price">${originalPrice}</span>
          <span className="discount">Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%</span>
        </div>
      ) : (
        <div className="price">${price}</div>
      )}
      
      {inStock ? (
        <button className="in-stock">Add to Cart</button>
      ) : (
        <button disabled className="out-of-stock">Out of Stock</button>
      )}
      
      {currentUser?.isAdmin && (
        <div className="admin-actions">
          <button>Edit Product</button>
          <button>Delete Product</button>
        </div>
      )}
    </div>
  );
}
```

### Dashboard with Multiple States

```javascript
function Dashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) {
    return (
      <div className="loading-container">
        <Spinner />
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <ErrorIcon />
        <h2>Failed to load dashboard</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="empty-container">
        <EmptyStateIcon />
        <h2>No data available</h2>
        <p>Get started by creating your first item</p>
      </div>
    );
  }
  
  return (
    <div className="dashboard">
      {user.role === 'admin' && <AdminPanel data={data} />}
      {user.role === 'moderator' && <ModeratorView data={data} />}
      {user.role === 'user' && <UserView data={data} />}
    </div>
  );
}
```

---

## Performance Considerations

### Avoiding Unnecessary Re-renders

```javascript
// ❌ BAD - Creates new object on every render
function BadComponent({ user }) {
  const status = { isActive: user.isActive };
  return status.isActive ? <ActiveUser /> : <InactiveUser />;
}

// ✅ GOOD - Simple condition
function GoodComponent({ user }) {
  return user.isActive ? <ActiveUser /> : <InactiveUser />;
}
```

### Memoizing Heavy Computations

```javascript
function ComputedDisplay({ items }) {
  // ❌ BAD - Recomputes on every render
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name));
  
  // ✅ GOOD - Memoize with useMemo (Day 13)
  const sorted = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );
  
  return (
    <ul>
      {sorted.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

## Conditional Rendering Best Practices

### ✅ DO

1. Use early returns for cleaner code
2. Extract complex conditions to variables
3. Use descriptive variable names for conditions
4. Handle all possible states
5. Use consistent patterns across your app
6. Consider accessibility in conditional content
7. Test edge cases

### ❌ DON'T

1. Don't nest ternaries too deeply
2. Don't create objects/arrays in render
3. Don't forget to handle loading/error states
4. Don't use ternary for simple presence checks
5. Don't mutate state in conditional logic
6. Don't ignore accessibility
7. Don't skip testing edge cases

---

## Interview Preparation

### Common Questions About Conditional Rendering

#### Q1: When to use ternary vs logical &&?

**Answer**: Use ternary for if/else scenarios. Use && for simple presence checks (show/hide).

#### Q2: How do you avoid nested ternaries?

**Answer**: Extract to separate components, use early returns, or use switch statements.

#### Q3: What's the difference between null and undefined in conditional rendering?

**Answer**: Both render nothing, but null is intentional (nothing to show), undefined often indicates missing data.

#### Q4: How do you conditionally apply CSS classes?

**Answer**: Use className={`base ${condition ? 'extra' : ''}` or libraries like clsx/classnames.

#### Q5: When should you use switch vs ternary?

**Answer**: Use switch for 3+ mutually exclusive states. Use ternary for binary (true/false) conditions.

---

## More Real-World Conditional Rendering

### Notification System

```javascript
function NotificationBanner({ notifications }) {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % notifications.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [notifications.length]);
  
  if (!visible || notifications.length === 0) return null;
  
  const currentNotification = notifications[index];
  
  return (
    <div className={`notification ${currentNotification.type}`}>
      <span>{currentNotification.message}</span>
      <button onClick={() => setVisible(false)}>×</button>
    </div>
  );
}
```

### Pagination Component

```javascript
function PaginatedList({ items, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  
  return (
    <div>
      <ul>
        {currentItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Previous
        </button>
        
        <span>Page {currentPage} of {totalPages}</span>
        
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Dynamic Theme Application

```javascript
function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  
  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

---

## Conditional Rendering in Lists

### Conditional List Items

```javascript
function FilterableList({ items, filter }) {
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'active') return item.completed === false;
    if (filter === 'completed') return item.completed === true;
    return true;
  });
  
  return (
    <ul>
      {filteredItems.length === 0 ? (
        <li>No items match the filter</li>
      ) : (
        filteredItems.map(item => (
          <li key={item.id}>
            <span className={item.completed ? 'completed' : ''}>
              {item.text}
            </span>
            {!item.completed && <button>Mark Complete</button>}
          </li>
        ))
      )}
    </ul>
  );
}
```

---

## Conditional Rendering Patterns Summary

### Pattern Selection Guide

```javascript
// Use ternary (?:) for if/else with 2 options
{isLoading ? <Spinner /> : <Content />}

// Use logical && for simple presence check
{isError && <ErrorMessage error={error} />}

// Use early return for complex logic
if (!user) return <Login />;
if (user.isLoading) return <Spinner />;
return <Dashboard user={user} />;

// Use switch for 3+ mutually exclusive options
{(() => {
  switch (status) {
    case 'loading': return <Spinner />;
    case 'error': return <Error />;
    case 'success': return <Success />;
    default: return null;
  }
})()}

// Use multiple conditionals for independent checks
{hasPermission && <AdminPanel />}
{hasFeatureFlag && <NewFeature />}
{isActive && <ActiveBadge />}
```

---

## Conditional Rendering Testing

### Testing Conditional States

```javascript
import { render, screen } from '@testing-library/react';
import ConditionalComponent from './ConditionalComponent';

test('renders loading state', () => {
  render(<ConditionalComponent loading={true} />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('renders error state', () => {
  render(<ConditionalComponent error="Failed" />);
  expect(screen.getByText(/error/i)).toBeInTheDocument();
});

test('renders data when available', () => {
  const data = { name: 'Test' };
  render(<ConditionalComponent data={data} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

---

## Real-World Complete Examples

### E-commerce Checkout Flow

```javascript
function CheckoutFlow({ cart, step, onStepChange }) {
  const [billingInfo, setBillingInfo] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some items to get started</p>
      </div>
    );
  }
  
  return (
    <div className="checkout-flow">
      {step === 1 && (
        <BillingForm
          data={billingInfo}
          onChange={setBillingInfo}
          onNext={() => onStepChange(2)}
        />
      )}
      
      {step === 2 && billingInfo && (
        <ShippingForm
          data={shippingInfo}
          onChange={setShippingInfo}
          onBack={() => onStepChange(1)}
          onNext={() => onStepChange(3)}
        />
      )}
      
      {step === 3 && shippingInfo && (
        <PaymentForm
          data={paymentMethod}
          onChange={setPaymentMethod}
          onBack={() => onStepChange(2)}
          onComplete={handleCheckout}
        />
      )}
    </div>
  );
}
```

### News Feed with Filters

```javascript
function NewsFeed({ user }) {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchNews(filter).then(data => {
      setArticles(data);
      setLoading(false);
    });
  }, [filter]);
  
  const filteredArticles = articles.filter(article => {
    if (filter === 'all') return true;
    return article.category === filter;
  });
  
  if (loading) {
    return (
      <div className="loading-container">
        <Spinner />
        <p>Loading news...</p>
      </div>
    );
  }
  
  if (filteredArticles.length === 0) {
    return (
      <div className="empty-feed">
        <h3>No articles found</h3>
        <p>Try a different filter</p>
      </div>
    );
  }
  
  return (
    <div>
      <FilterBar selectedFilter={filter} onFilterChange={setFilter} />
      
      <div className="articles">
        {filteredArticles.map(article => (
          <article key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            {article.premium && !user.isPremium && (
              <div className="premium-badge">Premium Content</div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
```

### User Settings Page

```javascript
function UserSettings({ user }) {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="settings">
      <div className="settings-tabs">
        <button
          onClick={() => setActiveTab('profile')}
          className={activeTab === 'profile' ? 'active' : ''}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={activeTab === 'security' ? 'active' : ''}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={activeTab === 'notifications' ? 'active' : ''}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={activeTab === 'privacy' ? 'active' : ''}
        >
          Privacy
        </button>
      </div>
      
      <div className="settings-content">
        {activeTab === 'profile' && <ProfileSettings user={user} />}
        {activeTab === 'security' && <SecuritySettings user={user} />}
        {activeTab === 'notifications' && <NotificationSettings user={user} />}
        {activeTab === 'privacy' && <PrivacySettings user={user} />}
      </div>
    </div>
  );
}
```

---

## Resources & Further Reading

### Official Documentation
- [Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [Rendering Lists](https://react.dev/learn/rendering-lists)

### MDN References
- [Logical AND operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)
- [Conditional (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator)

---

## Key Takeaways

### ✅ What You Learned Today

1. **Ternary Operators**: Best for if/else rendering
2. **Logical &&**: Best for simple conditional rendering
3. **Switch Statements**: Best for multiple enum values
4. **Loading States**: Show spinners during async operations
5. **Error States**: Handle and display errors gracefully
6. **Empty States**: Guide users when no data exists

### 🎯 Key Concepts

- Use ternary for two-way conditionals
- Use && for single conditions
- Use switch for multiple values
- Always handle loading and error states
- Provide helpful empty states
- Avoid nested ternaries (use if-else or switch)

### 📚 Next Steps

Tomorrow you'll learn:
- ✅ useEffect hook basics
- ✅ Component lifecycle
- ✅ Side effects in React
- ✅ Dependency array explained

---

**Great work! 🎉 You've mastered conditional rendering from basic to advanced patterns!**

**You're now ready for Day 8: useEffect Hook - Part 1! 🚀**

---

## Conditional Rendering Quick Reference

### When to Use Each Pattern

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Ternary (?:)** | if/else with 2 outcomes | `{loading ? <Spinner /> : <Content />}` |
| **Logical &&** | Single condition (show/hide) | `{error && <Error error={error} />}` |
| **Early return** | Complex logic, multiple conditions | `if (!user) return <Login />;` |
| **Switch** | 3+ mutually exclusive states | Switch statement with cases |
| **Multiple &&** | Independent conditions | `{isAdmin && <Admin />}` |

### Common Patterns Cheat Sheet

```javascript
// Loading State
{loading ? <Spinner /> : <Content data={data} />}

// Error State
{error ? <ErrorMessage error={error} /> : <Success data={data} />}

// Empty State
{items.length === 0 ? <EmptyState /> : <List items={items} />}

// Permission Check
{user && user.isAdmin && <AdminPanel />}

// Feature Flag
{featureFlags.newUI && <NewComponent />}

// Multiple Independent Conditions
{showHeader && <Header />}
{showSidebar && <Sidebar />}
{showFooter && <Footer />}
```

**This completes Day 7! Master conditional rendering like a pro! 🎯**

