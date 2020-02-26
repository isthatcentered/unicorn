# paint

Merge default and override styles and classes for react component

```tsx
import { CSSProperties, ReactNode } from "react"

const MyComponent = (props: {className?: string, className?: string, style?: CSSProperties} ) => (
    <div {...paint({className: "a", style: {background: red}},  props)} />
)

<MyComponent
    className="a b"
    style={{color: green}}
/> // <div className="a b" style={{background: "red", color: "green"}}></div>
```
