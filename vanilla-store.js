// Simple observer pattern: ~30 lines
class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.listeners.forEach((listener) => listener(this.state));
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }
}

// Usage
const store = new Store({ count: 0, user: null });

store.subscribe((state) => {
    console.log("State changed:", state);
});

store.setState({ count: 1 }); // Triggers all subscribers

// REACT USE
import { useState, useEffect } from "react";

function useStore(store) {
    const [state, setState] = useState(store.getState());

    useEffect(() => {
        const unsubscribe = store.subscribe((newState) => {
            setState(newState);
        });
        return unsubscribe; // Cleanup on unmount
    }, [store]);

    return state;
}

// In your component
function Counter() {
    const state = useStore(store);

    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => store.setState({ count: state.count + 1 })}>
                Increment
            </button>
        </div>
    );
}
