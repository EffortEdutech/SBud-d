import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { getApiBaseUrl } from "./src/config/environment";

type TabKey = "dashboard" | "buddy" | "library";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "dashboard", label: "Dashboard" },
  { key: "buddy", label: "BLIE" },
  { key: "library", label: "Library" },
];

const tabContent: Record<TabKey, { title: string; body: string }> = {
  dashboard: {
    title: "Learning Dashboard",
    body: "Your semester, subjects, and learning progress will appear here.",
  },
  buddy: {
    title: "BLIE",
    body: "The Buddy Learning Intelligent Engine will guide study sessions through the API.",
  },
  library: {
    title: "Learning Library",
    body: "Uploaded notes, PDFs, and extracted knowledge will be organized here.",
  },
};

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const content = tabContent[activeTab];
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>AI Study Buddy</Text>
        <Text style={styles.heading}>{content.title}</Text>
        <Text style={styles.body}>{content.body}</Text>

        <View style={styles.statusPanel}>
          <Text style={styles.statusLabel}>API base URL</Text>
          <Text style={styles.statusValue}>{apiBaseUrl}</Text>
        </View>

        <View style={styles.tabs}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, isActive && styles.activeTab]}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7f8fb",
  },
  container: {
    flex: 1,
    gap: 18,
    justifyContent: "center",
    padding: 24,
  },
  eyebrow: {
    color: "#47636b",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  heading: {
    color: "#14272e",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0,
  },
  body: {
    color: "#40545b",
    fontSize: 17,
    lineHeight: 25,
  },
  statusPanel: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe3e7",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  statusLabel: {
    color: "#65777e",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  statusValue: {
    color: "#15282e",
    fontSize: 15,
    marginTop: 6,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    alignItems: "center",
    borderColor: "#cad5da",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  activeTab: {
    backgroundColor: "#14323b",
    borderColor: "#14323b",
  },
  tabText: {
    color: "#30474f",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
  },
  activeTabText: {
    color: "#ffffff",
  },
});
