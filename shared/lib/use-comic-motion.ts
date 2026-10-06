'use client';

import { useEffect } from 'react';
import { animate } from 'animejs';

type Pose = { y: number; rotation: number; scale: number; original: string; priority: string; animation?: ReturnType<typeof animate> };

/** Stable hover poses, smooth reversal, and restrained effects by control type. */
export function useComicMotion(root: HTMLElement | null) {
  useEffect(() => {
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const poses = new Map<HTMLElement, Pose>();
    const fades = new Map<HTMLElement, ReturnType<typeof animate>>();
    const hovered = new Set<HTMLElement>();
    const pressed = new Set<HTMLElement>();
    const button = (target: EventTarget | null) => target instanceof Element ? target.closest<HTMLElement>('[data-slot="button"]') : null;
    const enabled = (element: HTMLElement) => !element.matches(':disabled, [aria-disabled="true"]');
    const quiet = (element: HTMLElement) => element.dataset.motion === 'none' || element.dataset.variant === 'link';
    const hoverPose = (element: HTMLElement) => {
      if (quiet(element)) return { y: 0, rotation: 0, scale: 1 };
      if (element.dataset.motion === 'tilt' || element.dataset.size === 'icon') return { y: -1, rotation: 3, scale: 1 };
      if (element.dataset.motion === 'lift' || element.matches('.kit-filter-grid [data-slot="button"], .editor-upload-option')) return { y: -2, rotation: 0, scale: 1 };
      if (element.dataset.motion === 'scale' || element.dataset.variant === 'default') return { y: 0, rotation: 0, scale: 1.018 };
      return { y: -1, rotation: 0, scale: 1 };
    };
    const restore = (element: HTMLElement) => {
      const pose = poses.get(element);
      if (!pose) return;
      pose.animation?.pause();
      if (pose.original) element.style.setProperty('transform', pose.original, pose.priority);
      else element.style.removeProperty('transform');
      poses.delete(element);
    };
    const moveTo = (element: HTMLElement, target: { y: number; rotation?: number; scale: number }, duration = 170) => {
      if (reduced.matches) { restore(element); return; }
      let pose = poses.get(element);
      if (!pose) {
        if (target.y === 0 && !target.rotation && target.scale === 1) return;
        pose = { y: 0, rotation: 0, scale: 1, original: element.style.getPropertyValue('transform'), priority: element.style.getPropertyPriority('transform') };
        poses.set(element, pose);
      }
      // Animate numeric state, avoiding cached DOM transforms and baseline drift.
      pose.animation?.pause();
      const current = pose;
      current.animation = animate(current, {
        y: target.y, rotation: target.rotation ?? 0, scale: target.scale, duration, ease: 'out(3)',
        onUpdate: () => {
          const prefix = current.original && current.original !== 'none' ? current.original + ' ' : '';
          element.style.setProperty('transform', prefix + 'translateY(' + current.y + 'px) rotate(' + current.rotation + 'deg) scale(' + current.scale + ')', current.priority);
        },
        onComplete: () => {
          current.animation = undefined;
          if (target.y === 0 && !target.rotation && target.scale === 1) restore(element);
        },
      });
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const element = button(event.target);
      if (!element || !enabled(element) || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
      const target = hoverPose(element);
      if (target.rotation) target.rotation *= event.clientX < element.getBoundingClientRect().left + element.offsetWidth / 2 ? -1 : 1;
      if (target.y === 0 && !target.rotation && target.scale === 1) return;
      hovered.add(element);
      if (!pressed.has(element)) moveTo(element, target);
    };
    const leave = (event: PointerEvent) => {
      const element = button(event.target);
      if (!element || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
      hovered.delete(element);
      pressed.delete(element);
      moveTo(element, { y: 0, scale: 1 });
    };
    const press = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const element = button(event.target);
      if (!element || !enabled(element) || quiet(element)) return;
      pressed.add(element);
      moveTo(element, { y: 0, scale: .985 }, 90);
    };
    const release = () => {
      for (const element of pressed) moveTo(element, enabled(element) && hovered.has(element) ? hoverPose(element) : { y: 0, scale: 1 });
      pressed.clear();
    };
    const leaveRoot = () => {
      hovered.clear();
      pressed.clear();
      for (const element of poses.keys()) moveTo(element, { y: 0, scale: 1 });
    };
    const fade = (element: HTMLElement, delay = 0) => {
      fades.get(element)?.revert();
      if (reduced.matches) return;
      const animation = animate(element, { opacity: [.65, 1], duration: 180, delay, ease: 'out(3)', onComplete: () => { animation.revert(); fades.delete(element); } });
      fades.set(element, animation);
    };
    const toggle = (event: Event) => {
      if (!(event.target instanceof HTMLDetailsElement) || !event.target.open) return;
      const list = event.target.querySelector<HTMLElement>('.kit-filter-list');
      if (list) fade(list);
    };
    const reset = () => {
      hovered.clear(); pressed.clear();
      for (const element of poses.keys()) restore(element);
      for (const animation of fades.values()) animation.revert();
      fades.clear();
    };
    // Disabled or removed controls must also release their hover pose.
    const observer = new MutationObserver(() => {
      for (const element of poses.keys()) if (!root.contains(element) || !enabled(element)) {
        hovered.delete(element); pressed.delete(element); restore(element);
      }
    });
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled'] });
    root.querySelectorAll<HTMLElement>('.editor-topbar, .editor-desktop-grid > aside > [data-slot="card"], .editor-preview > [data-slot="card"]').forEach((element, index) => fade(element, index * 25));
    root.addEventListener('pointerover', enter);
    root.addEventListener('pointerout', leave);
    root.addEventListener('pointerleave', leaveRoot);
    root.addEventListener('pointerdown', press);
    root.addEventListener('toggle', toggle, true);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', leaveRoot);
    window.addEventListener('blur', reset);
    reduced.addEventListener('change', reset);
    return () => {
      observer.disconnect(); reset();
      root.removeEventListener('pointerover', enter);
      root.removeEventListener('pointerout', leave);
      root.removeEventListener('pointerleave', leaveRoot);
      root.removeEventListener('pointerdown', press);
      root.removeEventListener('toggle', toggle, true);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', leaveRoot);
      window.removeEventListener('blur', reset);
      reduced.removeEventListener('change', reset);
    };
  }, [root]);
}
