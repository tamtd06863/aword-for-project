export interface ColorScheme {
  primary: {
    main: string;
    dark: string;
    light: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    header: string;
    button: string;
  };
  border: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    overlay: string;
  };
  accent: {
    red: string;
    green: string;
    yellow: string;
    blue: string;
    purple: string;
    orange: string;
  };
}

export const lightColors: ColorScheme = {
  primary: {
    main: "#0659E7", // primary-500
    dark: "#1E40AF", // primary-700
    light: "#60A5FA", // primary-400
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    tertiary: "#F3F4F6",
  },
  text: {
    primary: "#000000",
    secondary: "rgba(0, 0, 0, 0.6)",
    tertiary: "rgba(0, 0, 0, 0.5)",
    inverse: "#FFFFFF",
    header: "#FFFFFF",
    button: "#FFFFFF",
  },
  border: {
    primary: "rgba(0, 0, 0, 0.1)",
    secondary: "rgba(0, 0, 0, 0.2)",
    tertiary: "rgba(0, 0, 0, 0.05)",
  },
  surface: {
    primary: "rgba(255, 255, 255, 0.9)",
    secondary: "rgba(255, 255, 255, 0.7)",
    tertiary: "rgba(240, 240, 240, 1)",
    overlay: "rgba(255, 255, 255, 0.1)",
  },
  accent: {
    red: "#EF4444",
    green: "#10B981",
    yellow: "#F59E0B",
    blue: "#3B82F6",
    purple: "#8B5CF6",
    orange: "#F97316",
  },
};

export const darkColors: ColorScheme = {
  primary: {
    main: "#1E40AF", // primary-700 for dark mode
    dark: "#1E3A8A", // primary-800
    light: "#3B82F6", // primary-400
  },
  background: {
    primary: "#111827",
    secondary: "#1F2937",
    tertiary: "#374151",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.7)",
    tertiary: "rgba(255, 255, 255, 0.6)",
    inverse: "#000000",
    header: "#FFFFFF",
    button: "#FFFFFF",
  },
  border: {
    primary: "rgba(255, 255, 255, 0.1)",
    secondary: "rgba(255, 255, 255, 0.2)",
    tertiary: "rgba(255, 255, 255, 0.05)",
  },
  surface: {
    primary: "rgba(255, 255, 255, 0.1)",
    secondary: "rgba(255, 255, 255, 0.2)",
    tertiary: "rgba(75, 85, 99, 1)",
    overlay: "rgba(0, 0, 0, 0.1)",
  },
  accent: {
    red: "#F87171",
    green: "#34D399",
    yellow: "#FBBF24",
    blue: "#60A5FA",
    purple: "#A78BFA",
    orange: "#FB923C",
  },
};

export const getColors = (isDark: boolean): ColorScheme => {
  return isDark ? darkColors : lightColors;
};
