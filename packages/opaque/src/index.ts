const identity = <A>(a: A): A => a

type Opaque<ID, T> = {
	of: (data: T) => ID
	fold: (id: ID) => T
	foldMap: <B>(fa: (a: T) => B) => (id: ID) => B
	map: (fa: (a: T) => T) => (id: ID) => ID
}

export function opaque<ID, T>(): Opaque<ID, T> {
	const of: Opaque<ID, T>["of"] = identity as any
	const fold: Opaque<ID, T>["fold"] = identity as any
	const foldMap: Opaque<ID, T>["foldMap"] = fa => id => fa(fold(id))
	const map: Opaque<ID, T>["map"] = fa => id => of(fa(fold(id)))

	return {
		of,
		fold,
		foldMap,
		map,
	}
}
