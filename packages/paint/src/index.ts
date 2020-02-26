import { CSSProperties, ReactNode } from "react"
import { mergeClassnames, shallowMerge } from "./helpers"

export type StyleProps<T = {}> = {
	className?: string
	style?: CSSProperties
} & T

export type StylePropsWithChildren<T = {}> = StyleProps<
	{ children?: ReactNode } & T
>

const paint = (defaults: StyleProps, provided: StyleProps): StyleProps => ({
	className: mergeClassnames(defaults.className)(provided.className),
	style: shallowMerge(defaults.style)(provided.style),
})

export default paint
