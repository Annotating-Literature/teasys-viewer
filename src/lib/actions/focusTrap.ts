export function focusTrap(node: HTMLElement, enabled: boolean) {
    let focusableElements: HTMLElement[];
    let firstFocusable: HTMLElement;
    let lastFocusable: HTMLElement;

    function update() {
        focusableElements = Array.from(
            node.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        );
        firstFocusable = focusableElements[0];
        lastFocusable = focusableElements[focusableElements.length - 1];
        if (enabled && firstFocusable) {
            firstFocusable.focus();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (!enabled) return;
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable || !node.contains(document.activeElement)) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    }

    if (enabled) {
        setTimeout(update, 0);
        window.addEventListener('keydown', handleKeydown);
    }

    return {
        update(newEnabled: boolean) {
            enabled = newEnabled;
            if (enabled) {
                setTimeout(update, 0);
                window.addEventListener('keydown', handleKeydown);
            } else {
                window.removeEventListener('keydown', handleKeydown);
            }
        },
        destroy() {
            window.removeEventListener('keydown', handleKeydown);
        }
    };
}
