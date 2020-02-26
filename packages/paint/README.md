# paint

Merge default and override styles and classes for react component

```tsx
import { StyleProps } from "@isthatcentered/paint"
import paint from "@isthatcentered/paint"


const MyComponent = (props: StyleProps<{myCustomProp: any}> ) => (
    {/* You can provide only "className" or only "style" or both, as you wish 🤗 */}
    <div {...paint({className: "a", style: {background: red}},  props)} />
)

<MyComponent
    className="a b"
    style={{color: green}}
/> // <div className="a b" style={{background: "red", color: "green"}}></div>
```
