const MonitoringProvider = {
  log: (...args: unknown[]) => console.log('[Monitoring]', ...args),
};

export default MonitoringProvider;