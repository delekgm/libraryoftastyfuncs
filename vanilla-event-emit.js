// Custom event bus: ~20 lines

class EventBus {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }

    emit(event, data) {
        if (!this.events[event]) return;

        // Copy to prevent issues if listeners mutate the list
        [...this.events[event]].forEach((callback) => {
            callback(data);
        });
    }

    once(event, callback) {
        const wrapper = (data) => {
            // Unsubscribe first to guarantee "once"
            this.off(event, wrapper);
            callback(data);
        };

        this.on(event, wrapper);
    }
}

// REACT USE
import { useEffect } from "react";

// Create global event bus
export const eventBus = new EventBus();

// Custom hook for events
function useEvent(event, callback) {
    useEffect(() => {
        eventBus.on(event, callback);
        return () => eventBus.off(event, callback);
    }, [event, callback]);
}

// In your components
function Notification() {
    useEvent("notification:show", (message) => {
        alert(message);
    });

    return <div>Notifications enabled</div>;
}

function LoginButton() {
    const handleLogin = () => {
        // Login logic...
        eventBus.emit("user:login", { id: 1, name: "John" });
        eventBus.emit("notification:show", "Welcome back!");
    };

    return <button onClick={handleLogin}>Login</button>;
}
