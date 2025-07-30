import { keys } from '../../../keys';
import type { AnalyticsProvider } from '../types';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

type GtagCommand = 'config' | 'event' | 'set' | 'js' | 'consent';

class GtagAnalyticsProvider implements AnalyticsProvider {
  private isInitialized = false;

  public async trackPageView(path: string): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if (keys().NEXT_PUBLIC_ANALYTICS_GA_DISABLE_PAGE_VIEWS_TRACKING) {
      return;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }
    if (!this.isInitialized) {
      return;
    }

    const measurementId = keys().NEXT_PUBLIC_ANALYTICS_GA_MEASUREMENT_ID;
    if (!measurementId) {
      console.error('GA Measurement ID missing for trackPageView');
      return;
    }

    const newUrl = new URL(path, window.location.href).href;

    this.gtag('event', 'page_view', {
      page_location: newUrl,
      page_path: path
    });
  }

  public async trackEvent(
    eventName: string,
    eventProperties: Record<string, string | string[] | number | boolean> = {}
  ): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }
    if (!this.isInitialized) {
      return;
    }

    const processedProperties: Record<string, string | number | boolean> = {};
    Object.entries(eventProperties).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        processedProperties[key] = value.join(',');
      } else if (value !== null && value !== undefined) {
        processedProperties[key] = value as string | number | boolean;
      }
    });

    this.gtag('event', eventName, processedProperties);
  }

  public async identify(
    userId: string,
    traits: Record<string, string | number | boolean> = {}
  ): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }
    if (!this.isInitialized) {
      return;
    }

    const measurementId = keys().NEXT_PUBLIC_ANALYTICS_GA_MEASUREMENT_ID;
    if (!measurementId) {
      console.error('GA Measurement ID missing for identify');
      return;
    }

    this.gtag('config', measurementId, {
      user_id: userId
    });

    if (Object.keys(traits).length > 0) {
      this.gtag('set', 'user_properties', traits);
    }
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') {
      return Promise.resolve();
    }

    const measurementId = keys().NEXT_PUBLIC_ANALYTICS_GA_MEASUREMENT_ID;
    if (!measurementId) {
      throw new Error(
        'Measurement ID is not set. Please set the environment variable NEXT_PUBLIC_ANALYTICS_GA_MEASUREMENT_ID.'
      );
    }

    if (keys().NEXT_PUBLIC_ANALYTICS_GA_DISABLE_LOCALHOST_TRACKING) {
      this.setLocalHostTrackingDisabled(measurementId);
    }

    if (this.isInitialized) {
      return Promise.resolve();
    }

    return this.createGtagScript(measurementId);
  }

  private setLocalHostTrackingDisabled(measurementId: string): void {
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
    ) {
      // @ts-expect-error: This is a custom property used by Google Analytics
      window['ga-disable-' + measurementId] = true;
    }
  }

  private createGtagScript(measurementId: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        this.gtag('js', new Date());
        this.gtag('config', measurementId, {
          send_page_view: false
        });
        this.isInitialized = true;
        resolve();
      };

      script.onerror = (error) => {
        console.error(
          `Failed to load Google Analytics script for ${measurementId}:`,
          error
        );
        resolve();
      };

      document.head.appendChild(script);
    });
  }

  private gtag(command: GtagCommand, ...args: unknown[]) {
    if (typeof window === 'undefined') {
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push([command, ...args]);
  }
}

export default new GtagAnalyticsProvider();
