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

                let updateCheckRunning = false;

                const checkForUpdate = async () => {
                    if (document.visibilityState !== "visible" || updateCheckRunning) return;

                    updateCheckRunning = true;
                    try {
                        await registration.update();
                        activateWaitingWorker();
                    } finally {
                        updateCheckRunning = false;
                    }
                };

                // Check immediately when the PWA opens.
                void checkForUpdate();

                // Android PWAs may report task resume through focus/pageshow instead of visibilitychange.
                document.addEventListener("visibilitychange", checkForUpdate);
                window.addEventListener("focus", checkForUpdate);
                window.addEventListener("pageshow", checkForUpdate);

                return () => {
                    document.removeEventListener("visibilitychange", checkForUpdate);
                    window.removeEventListener("focus", checkForUpdate);
                    window.removeEventListener("pageshow", checkForUpdate);
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
