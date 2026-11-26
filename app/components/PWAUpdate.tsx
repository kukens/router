"use client";

import { useEffect } from "react";

export default function PWAUpdate() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        let updateDetected = false;
        let hasReloaded = false;

        const reloadAfterUpdate = () => {
            if (!updateDetected || hasReloaded) return;
            hasReloaded = true;
            window.location.reload();
        };

        navigator.serviceWorker.addEventListener("controllerchange", reloadAfterUpdate);

        const registerWorker = async () => {
            try {
                const registration = await navigator.serviceWorker.register("/sw.js", {
                    updateViaCache: "none",
                });

                const activateWaitingWorker = () => {
                    if (!registration.waiting) return;
                    updateDetected = true;
                    registration.waiting.postMessage({ type: "SKIP_WAITING" });
                };

                registration.addEventListener("updatefound", () => {});

                const checkForUpdate = async () => {
                    if (document.visibilityState !== "visible") return;

                    await registration.update();
                    activateWaitingWorker();
                };

                // Check when the PWA/page opens.
                checkForUpdate();

                // Check only when the user returns to the app/tab.
                document.addEventListener("visibilitychange", checkForUpdate);

                return () => {
                    document.removeEventListener("visibilitychange", checkForUpdate);
                };
            } catch (error) {
                console.error("PWA service worker registration failed", error);
            }
        };

        let cleanup: (() => void) | undefined;
        void registerWorker().then((cleanupFunction) => {
            cleanup = cleanupFunction;
        });

        return () => {
            navigator.serviceWorker.removeEventListener("controllerchange", reloadAfterUpdate);
            cleanup?.();
        };
    }, []);

    return null;
}
