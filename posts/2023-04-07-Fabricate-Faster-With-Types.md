Fabricate Faster With Types
2023-04-07 11:23
JavaScript,TypeScript,Releases
---

I enjoy creating simple web apps and web pages with my own
[fabricate.js](https://github.com/c-d-lewis/fabricate.js) web framework
(including this blog!), but one of the challenges even for me is to remember
all the chainable methods available on components, and which parameters appear
in which order for all the callbacks. I put some effort into making all of these
fully documented in the project <code>README.md</code> but more often than not
I default to reading the source code. But that's a whole browser tab away from
my IDE - can it be easier?

The answer was not far away - we have been using TypeScript everywhere in new
projects at work recently, so I've been getting much more up to speed on it.
Aside from challenges reconciling React components with huge props definitions
and auto-generated GraphQL types for database interactions, I had fun defining
the types for project-specific data structures and then enjoying the full
autocompletion provided as a consequence by VS Code.

Naturally, I can make fabricate.js easier to use by providing a types file. How
hard could it be?

### Getting Started

The first step was to define new types for all the methods and properties
actually in use in some example project, to fill in the blanks so to speak. With
a simple <code>ts-config.json</code> file including the strict <code>noImplicitAny</code>
option, the IDE filled with red squigglies and I could begin fixing them by
defining types.

```json
{
  "include": ["src/**/*"],
  "exclude": ["src/types.ts"],
  "compilerOptions": {
    "target": "ES2016",
    "module": "ES2015",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true
  }
}
```

The easiest things to type were the chainable method available to fabricate.js
components, beginning with the ones actually in use:

```typescript
/**
 * Fabricate component extends HTMLElement - and uses shape of app's state.
 */
export interface FabricateComponent<StateShape> extends HTMLElement {
  setStyles: (styles: object) => FabricateComponent<StateShape>;
  setChildren: (children: FabricateComponent<StateShape>[]) => FabricateComponent<StateShape>;
  setText: (text: string) => FabricateComponent<StateShape>;

  onUpdate: (
    cb: (
      el: FabricateComponent<StateShape>,
      state: StateShape,
      keysChanged: string[],
    ) => void,
    watchKeys?: string[],
  ) => FabricateComponent<StateShape>;
  onHover: (
    cb: (
      el: FabricateComponent<StateShape>,
      state: StateShape,
      isHovered: boolean,
    ) => void,
  ) => FabricateComponent<StateShape>;
  onClick: (
    cb: (
      el: FabricateComponent<StateShape>,
      state: StateShape,
    ) => void,
  ) => FabricateComponent<StateShape>;

  when: (
    cb: (state: StateShape) => boolean,
  ) => FabricateComponent<StateShape>;
}
```

As well as methods on the main library variable itself:

```ts
/** Fabricate.js library */
export type Fabricate<StateShape> = {
  (componentName: string, props?: object): FabricateComponent<StateShape>;

  app: (
    root: FabricateComponent<StateShape>,
    initialState: StateShape,
  ) => FabricateComponent<StateShape>;
  update: (
    param1: string | object,
    param2?: Function | object | undefined,
  ) => void;
  isNarrow: () => boolean;
}
```

The trickiest part of this was allowing the types definition to work with the
somewhat arbirtary shape of the global state object that is how fabricate.js
performs state management. After some research into generics, I found I was able
to pass in <code>StateShape</code> and it all fell into place wherever this
type was required, such as callbacks where state was a parameter.

```ts
/** Defined app-specific state shape */
type AppState = {
  counter: integer;
  isActive: boolean;
}

/** Initial app state */
const initialState: AppState = {
  counter: 0,
  isActive: false,
};

/**
 * App component that uses state shape.
 *
 * @returns {FabricateComponent} The app component.
 */
const App = () => fabricate('button')
  .onClick((el, state) => console.log(state.isActive));

fabricate.app(App(), initialState);
```

### Formal Types

After making all this work, I went back to the fabricate.js repository, copied
in the initial types, and expanded them to include all available methods and
props from the source file. I also added a mini compilable TypeScript project
to act as an example and double-check things compiled after a new type was
added.

The full types file exists in the <code>types/fabricate.d.ts</code> file, and
includes full JSDoc code comment documentation:

```ts
/**
 * When a fabricate.js state update occurs.
 *
 * @param {function(el, state, updatedKeys)} cb - Callback when update occurs.
 * @param {string[]} watchKeys - Keys in state to watch.
 * @returns {FabricateComponent<StateShape>} This component.
 */
onUpdate: (
  cb: (
    el: FabricateComponent<StateShape>,
    state: StateShape,
    keysChanged: string[],
  ) => void,
  watchKeys?: string[],
) => FabricateComponent<StateShape>;
```

Thus, VS Code shows maximal information to allow easy use of the method:

![](assets/media/2023/04/fabricate-ts-docs.png)

There is one more step I could not avoid - declaring the library global as
available after <code>script</code> tag import. This seemed the best solution
but I feel it could be improved:

```ts
declare const fabricate: Fabricate<AppState>;
```

### Conclusion

I think the effort was worth it - while not all my projects that use
fabricate.js use TypeScript more and more will in the future. And while it was
not of the same complexity as the React component types in libraries used at
work, I did gain more familiarity with the basics of type definitions, generics,
etc. which is a better base to build upon.

If you're interested, check out the entire new
[types file](https://github.com/C-D-Lewis/fabricate.js/blob/main/types/fabricate.d.ts)
and try to use or break it! I'm sure there's something I missed...
