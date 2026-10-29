// Context allows you to feed information to components without using props
// This is just a simple example file delte later
import { createContext, useContext } from "react";

const ExampleContext = createContext("Hello from Context!");

export function ExampleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ExampleContext.Provider value="Hello from Context!">
      {children}
    </ExampleContext.Provider>
  );
}

export function useExample() {
  return useContext(ExampleContext);
}