import { useCallback, useEffect } from "react";
import {
	type NavigateOptions,
	type To,
	useLocation,
	useNavigate,
} from "react-router";

const TRANSITION_DURATION_MS = 180;

type FadeNavigate = (to: To, options?: NavigateOptions) => void;

function prefersReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setEnteringState() {
	const { body } = document;

	body.classList.add("page-fade-ready");
	body.classList.remove("page-fade-out");

	requestAnimationFrame(() => {
		body.classList.add("page-fade-in");
	});
}

function runFadeNavigation(
	navigate: FadeNavigate,
	to: To,
	options?: NavigateOptions,
) {
	if (typeof window === "undefined" || prefersReducedMotion()) {
		navigate(to, options);
		return;
	}

	const { body } = document;

	if (body.dataset.pageFadeState === "leaving") {
		return;
	}

	body.dataset.pageFadeState = "leaving";
	body.classList.add("page-fade-ready");
	body.classList.remove("page-fade-in");

	void body.offsetHeight;

	body.classList.add("page-fade-out");

	window.setTimeout(() => {
		navigate(to, options);
	}, TRANSITION_DURATION_MS);
}

export function useFadeNavigate() {
	const navigate = useNavigate();

	return useCallback<FadeNavigate>(
		(to, options) => {
			runFadeNavigation(navigate, to, options);
		},
		[navigate],
	);
}

export default function RouteTransition() {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const handleDocumentClick = (event: MouseEvent) => {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			) {
				return;
			}

			const target = event.target;

			if (!(target instanceof Element)) {
				return;
			}

			const anchor = target.closest("a[href]");

			if (!(anchor instanceof HTMLAnchorElement)) {
				return;
			}

			if (
				anchor.target === "_blank" ||
				anchor.hasAttribute("download") ||
				anchor.dataset.noPageFade !== undefined
			) {
				return;
			}

			const nextUrl = new URL(anchor.href, window.location.href);
			const currentUrl = new URL(window.location.href);

			if (nextUrl.origin !== currentUrl.origin) {
				return;
			}

			const isSamePageNavigation =
				nextUrl.pathname === currentUrl.pathname &&
				nextUrl.search === currentUrl.search;

			if (isSamePageNavigation) {
				return;
			}

			event.preventDefault();

			runFadeNavigation(
				navigate,
				`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`,
			);
		};

		document.addEventListener("click", handleDocumentClick, true);

		return () => {
			document.removeEventListener("click", handleDocumentClick, true);
		};
	}, [navigate]);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const { body } = document;

		body.dataset.pageFadeState = "entering";

		setEnteringState();
	}, [location]);

	return null;
}
