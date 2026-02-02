import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InteractiveCoursePreview } from "./InteractiveCoursePreview";
import { AdminDashboardPreview } from "./AdminDashboardPreview";
import { ParentProgressPreview } from "./ParentProgressPreview";
import { TutorAssessmentPreview } from "./TutorAssessmentPreview";

type PlayablePreviewProps = {
  play?: boolean;
  restartKey?: number;
  onAnimationComplete?: () => void;
  prefersReducedMotion?: boolean;
};

type DemoDefinition = {
  id: string;
  label: string;
  description: string;
  Component: (props: PlayablePreviewProps) => JSX.Element;
};

const DEMO_DELAY_MS = 6000;
const demos: DemoDefinition[] = [
  {
    id: "demo-1",
    label: "Students",
    description: "An engaging learning journey with progress, practice, and feedback.",
    Component: InteractiveCoursePreview,
  },
  {
    id: "demo-2",
    label: "Centres",
    description: "Manage classes, enrolments, schedules, and day-to-day operations.",
    Component: AdminDashboardPreview,
  },
  {
    id: "demo-3",
    label: "Parents",
    description: "Stay on top of your child's progress, activity, and milestones.",
    Component: ParentProgressPreview,
  },
  {
    id: "demo-4",
    label: "Tutors",
    description: "Create courses easily and teach smoothly with built-in tools.",
    Component: TutorAssessmentPreview,
  },
];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}

export function LandingDemoStage() {
  // Landing demo system summary:
  // - Demos come from the existing preview components (InteractiveCoursePreview, AdminDashboardPreview, ParentProgressPreview, TutorAssessmentPreview).
  // - Demo 1 still waits for scroll visibility on this stage container before it starts (same threshold as before).
  // - Each preview fires onAnimationComplete after its own animation timeline finishes; we treat that as "animation complete".
  // - handleAnimationComplete starts the 6s countdown; countdown never runs while a demo is animating.
  const stageRef = useRef<HTMLDivElement>(null);
  const activeContentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [playSession, setPlaySession] = useState(0);
  const [hasDemo1Started, setHasDemo1Started] = useState(false);
  const [hasDemo1Completed, setHasDemo1Completed] = useState(false);
  const [isDemoAnimating, setIsDemoAnimating] = useState(false);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [countdownProgress, setCountdownProgress] = useState(0);
  const [stageHeight, setStageHeight] = useState<number | undefined>();
  const [tabsHeight, setTabsHeight] = useState(0);
  const [stageVisibility, setStageVisibility] = useState(0);
  const [shouldFloatTabs, setShouldFloatTabs] = useState(false);
  const [dockVisible, setDockVisible] = useState(false);
  const [browserWidth, setBrowserWidth] = useState<number | undefined>();
  const tabBarRef = useRef<HTMLDivElement>(null);
  const dockSentinelRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<HTMLElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const countdownStartRef = useRef<number | null>(null);
  const activeIndexRef = useRef(activeIndex);

  const activeDemo = useMemo(() => demos[activeIndex], [activeIndex]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const observer = new ResizeObserver(() => setTabsHeight(bar.getBoundingClientRect().height));
    observer.observe(bar);
    setTabsHeight(bar.getBoundingClientRect().height);
    return () => observer.disconnect();
  }, []);

  const cancelCountdown = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    countdownStartRef.current = null;
    setIsCountdownRunning(false);
    setCountdownProgress(0);
  }, []);

  const rotateToNext = useCallback(() => {
    const nextIndex = (activeIndexRef.current + 1) % demos.length;
    setActiveIndex(nextIndex);
    setPlaySession((session) => session + 1);
    setIsDemoAnimating(nextIndex === 0 ? hasDemo1Started : true);
  }, [hasDemo1Started]);

  const startCountdown = useCallback(() => {
    const canAutoRotate = hasDemo1Completed || activeIndexRef.current === 0;
    if (!canAutoRotate) return;

    cancelCountdown();
    countdownStartRef.current = performance.now();
    setIsCountdownRunning(true);

    const tick = () => {
      if (!countdownStartRef.current) return;
      const elapsed = performance.now() - countdownStartRef.current;
      const progress = Math.min(elapsed / DEMO_DELAY_MS, 1);
      setCountdownProgress(progress);

      if (progress >= 1) {
        cancelCountdown();
        rotateToNext();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [cancelCountdown, rotateToNext, hasDemo1Completed]);

  const isStageVisible = useCallback(() => {
    const node = stageRef.current;
    if (!node) return false;
    const rect = node.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.8 && rect.bottom > 0 && window.scrollY > 50;
  }, []);

  const tryStartDemo1 = useCallback(() => {
    if (hasDemo1Started || activeIndexRef.current !== 0) return;
    if (isStageVisible()) {
      setHasDemo1Started(true);
      setIsDemoAnimating(true);
      setPlaySession((session) => session + 1);
    }
  }, [hasDemo1Started, isStageVisible]);

  useEffect(() => {
    const handleScroll = () => {
      tryStartDemo1();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tryStartDemo1]);

  useEffect(() => {
    // If the user navigates back to Demo 1 after tabbing around, re-check the scroll trigger.
    if (activeIndex === 0) {
      tryStartDemo1();
    }
  }, [activeIndex, tryStartDemo1]);

  useEffect(() => {
    cancelCountdown();
    setIsDemoAnimating(activeIndex === 0 ? hasDemo1Started : true);
  }, [activeIndex, hasDemo1Started, playSession, cancelCountdown]);

  useEffect(() => {
    const node = activeContentRef.current;
    if (!node) return;
    const updateHeight = () => {
      const rectHeight = node.getBoundingClientRect().height;
      const scrollHeight = node.scrollHeight;
      // Use scrollHeight to capture any animated overflow so the stage never clips.
      setStageHeight(Math.max(rectHeight, scrollHeight));
    };
    updateHeight();
    const resizeObserver = new ResizeObserver(() => updateHeight());
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, [activeIndex, playSession]);

  useEffect(() => {
    const stageNode = stageRef.current;
    if (!stageNode) return;

    const findBrowserNode = () =>
      (stageNode.querySelector(
        ".preview-container, .admin-preview-container, .parent-preview-container, .tutor-preview-container",
      ) as HTMLElement | null);

    const target = findBrowserNode();
    if (!target) return;
    browserRef.current = target;
    const updateWidth = () => {
      setBrowserWidth(target.getBoundingClientRect().width);
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(target);
    window.addEventListener("resize", updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [activeIndex, playSession]);

  useEffect(() => {
    return () => cancelCountdown();
  }, [cancelCountdown]);

  useEffect(() => {
    const stageNode = stageRef.current;
    if (!stageNode) return;
    const thresholds = [0.5, 0.7, 0.85, 0.9, 0.95];
    const observer = new IntersectionObserver(
      ([entry]) => setStageVisibility(entry.intersectionRatio),
      { threshold: thresholds },
    );
    observer.observe(stageNode);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sentinel = dockSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setDockVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const FLOAT_ON = 0.92;
    const FLOAT_OFF = 0.86; // hysteresis to avoid flicker
    setShouldFloatTabs((prev) => {
      if (dockVisible) return false;
      if (stageVisibility >= FLOAT_ON) return true;
      if (stageVisibility <= FLOAT_OFF) return false;
      return prev;
    });
  }, [dockVisible, stageVisibility]);

  const handleTabChange = useCallback(
    (nextIndex: number) => {
      cancelCountdown();
      setActiveIndex(nextIndex);
      setPlaySession((session) => session + 1);
      const demoWillAnimate = nextIndex === 0 ? hasDemo1Started : true;
      setIsDemoAnimating(demoWillAnimate);
      if (nextIndex === 0) {
        // Ensure the scroll gate is re-evaluated when Demo 1 tab is picked.
        tryStartDemo1();
      }
    },
    [cancelCountdown, hasDemo1Started, tryStartDemo1],
  );

  const handleAnimationComplete = useCallback(() => {
    if (activeIndexRef.current === 0) {
      setHasDemo1Completed(true);
    }
    setIsDemoAnimating(false);
    startCountdown();
  }, [startCountdown]);

  const ActiveDemoComponent = activeDemo.Component;
  const shouldPlayActiveDemo = activeIndex === 0 ? hasDemo1Started : true;
  // Docking rule: float the tab bar when the stage is ~80% visible but the tab bar's natural spot (sentinel) isn't on screen.
  const tabBarBaseStyle = { width: "min(900px, calc(100vw - 28px))" } as const;

  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-visible">
      <div
        ref={stageRef}
        className="relative px-4 sm:px-6 pt-3 pb-4 overflow-visible"
        style={{
          height: stageHeight ? `${stageHeight}px` : undefined,
          transition: prefersReducedMotion ? "none" : "height 320ms ease",
        }}
      >
        <div
          id={`demo-panel-${activeDemo.id}`}
          role="tabpanel"
          aria-labelledby={`demo-tab-${activeDemo.id}`}
          className="relative"
        >
          <div ref={activeContentRef} className="w-full overflow-visible">
            <ActiveDemoComponent
              key={`${activeDemo.id}-${playSession}`}
              play={shouldPlayActiveDemo}
              restartKey={playSession}
              onAnimationComplete={handleAnimationComplete}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        </div>
      </div>

      <div ref={dockSentinelRef} aria-hidden />
      {shouldFloatTabs && <div aria-hidden style={{ height: tabsHeight }} />}

      <TooltipProvider delayDuration={120} skipDelayDuration={0}>
        <div
          ref={tabBarRef}
        role="tablist"
        aria-label="LearnCampus demos"
        data-floating={shouldFloatTabs}
        className={`grid grid-cols-2 sm:grid-cols-4 gap-0 px-2 sm:px-2.5 pt-2 pb-2 max-w-5xl mx-auto overflow-hidden rounded-md border border-border bg-card ${
          shouldFloatTabs ? "fixed left-1/2 -translate-x-1/2 z-30" : ""
        }`}
        style={
          shouldFloatTabs
            ? {
                ...tabBarBaseStyle,
                width: browserWidth ? `${browserWidth}px` : tabBarBaseStyle.width,
                bottom: `calc(16px + env(safe-area-inset-bottom))`,
                background: "hsl(var(--card) / 0.96)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                borderRadius: 8,
              }
            : { ...tabBarBaseStyle, width: browserWidth ? `${browserWidth}px` : tabBarBaseStyle.width }
        }
      >
        {demos.map((demo, index) => {
            const isActive = index === activeIndex;
            const showUnderline = isActive && isCountdownRunning && !isDemoAnimating;
            const shouldForceTooltip = showUnderline;
            return (
              <Tooltip key={demo.id} open={shouldForceTooltip ? true : undefined}>
                <TooltipTrigger asChild>
                  <button
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`demo-panel-${demo.id}`}
                    id={`demo-tab-${demo.id}`}
                    className={`relative w-full px-3 py-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors transition-transform duration-150 ease-out border-l border-border/70 first:border-l-0 rounded-none first:rounded-l-[6px] last:rounded-r-[6px] ${
                      isActive
                        ? "bg-background text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                        : "bg-transparent text-muted-foreground hover:bg-background/40"
                    } hover:-translate-y-0.5 focus-visible:-translate-y-0.5`}
                    onClick={() => handleTabChange(index)}
                  >
                    <div className="text-[10.75px] font-semibold leading-tight">{demo.label}</div>
                    {showUnderline && (
                      <span
                        className="pointer-events-none absolute left-2 right-2 bottom-[2.4px] h-px rounded-full"
                        style={{
                          transform: `scaleX(${Math.max(0, countdownProgress)})`,
                          transformOrigin: "left",
                          background: "hsl(var(--accent))",
                          transition: prefersReducedMotion ? "none" : "transform 120ms linear",
                        }}
                      />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  sideOffset={12}
                  className={`max-w-[260px] text-center text-[12.5px] leading-relaxed px-3 py-2 rounded-lg border border-white/20 bg-[hsl(var(--card)/0.66)] backdrop-blur-[12px] shadow-[0_16px_40px_-18px_rgba(0,0,0,0.28)] ${
                    prefersReducedMotion
                      ? "animate-none data-[state=open]:animate-none data-[state=closed]:animate-none"
                      : "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-1"
                  }`}
                  avoidCollisions
                  collisionPadding={12}
                  sideOffset={12}
                >
                  <div className="text-foreground/90">{demo.description}</div>
                  <TooltipPrimitive.Arrow className="fill-[hsl(var(--card)/0.66)]" />
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}
