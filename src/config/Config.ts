export const CONFIG = {
  appVersion: "v.1.5.0",
  defaultTranslationSettings: {
    displayCityNames: "both",
    translateCityType: "transliterate",
    translateCreatorType: "transliterate",
  },
  chartFontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",' +
    ' "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", ' +
    '"Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  trendsChartOptions: (chartName: string, fontColor: string, gridColor: {color?: string}) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: fontColor,
        },
      },
      title: {
        display: true,
        text: chartName,
        color: fontColor,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: "ctrl" as const,
          },
          pinch: { enabled: true },
          limits: {
            y: { min: "original", max: "original" },
          },
          mode: "x" as const,
        },
        pan: {
          enabled: true,
          mode: "x" as const,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: fontColor },
        grid: { ...gridColor },
      },
      y: {
        ticks: { color: fontColor },
        grid: { ...gridColor },
      },
    },
  })
} as const