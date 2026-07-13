import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type {
  BlieChatResponse,
  DashboardSummary,
  DocumentLibrarySummary,
  LearningDocument,
  PlkgNode,
  PlkgSummary,
  StudyPreparationPlan,
  StudyRevisionItem,
  StudySummary,
  SyncStatusSummary,
} from "@sbud-d/types";

import { fallbackBlieResponse, sendBlieChat } from "./src/blie/blie-service";
import { getApiBaseUrl } from "./src/config/environment";
import { fallbackDashboardSummary, fetchDashboardSummary } from "./src/dashboard/dashboard-service";
import {
  createLearningDocument,
  fallbackDocumentLibrarySummary,
  fetchDocumentLibrarySummary,
} from "./src/documents/document-service";
import {
  createPlkgLearningActivity,
  fallbackPlkgSummary,
  fetchPlkgSummary,
} from "./src/plkg/plkg-service";
import {
  createStudyReflection,
  fallbackStudySummary,
  fetchStudySummary,
} from "./src/study/study-service";
import {
  cacheLearningSnapshot,
  enqueueOfflineChange,
  fallbackSyncStatus,
  fetchSyncStatus,
  getLearningSnapshot,
  getLocalSyncStatus,
  pushPendingQueue,
} from "./src/sync/sync-service";

type TabKey = "dashboard" | "study" | "buddy" | "library" | "plkg" | "sync";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "dashboard", label: "Dashboard" },
  { key: "study", label: "Study" },
  { key: "buddy", label: "BLIE" },
  { key: "library", label: "Library" },
  { key: "plkg", label: "PLKG" },
  { key: "sync", label: "Sync" },
];

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [dashboard, setDashboard] = useState<DashboardSummary>(fallbackDashboardSummary);
  const [documentLibrary, setDocumentLibrary] = useState<DocumentLibrarySummary>(
    fallbackDocumentLibrarySummary,
  );
  const [plkgSummary, setPlkgSummary] = useState<PlkgSummary>(fallbackPlkgSummary);
  const [studySummary, setStudySummary] = useState<StudySummary>(fallbackStudySummary);
  const [syncStatus, setSyncStatus] = useState<SyncStatusSummary>(fallbackSyncStatus);
  const [apiStatus, setApiStatus] = useState("Loading dashboard...");
  const [libraryStatus, setLibraryStatus] = useState("Loading library...");
  const [plkgStatus, setPlkgStatus] = useState("Loading PLKG...");
  const [studyStatus, setStudyStatus] = useState("Loading study guidance...");
  const [syncStatusLabel, setSyncStatusLabel] = useState("Checking sync status...");
  const [uploadState, setUploadState] = useState("Ready for metadata upload");
  const [blieQuestion, setBlieQuestion] = useState("Explain recursion with a simple example");
  const [blieStatus, setBlieStatus] = useState("Ready for context-aware chat");
  const [blieResponse, setBlieResponse] = useState<BlieChatResponse | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  useEffect(() => {
    let isMounted = true;

    fetchDashboardSummary()
      .then((summary) => {
        if (isMounted) {
          setDashboard(summary);
          setApiStatus("Connected to API");
          setSelectedSubjectId(summary.subjects[0]?.id ?? null);
          cacheLearningSnapshot({ dashboard: summary });
        }
      })
      .catch(() => {
        if (isMounted) {
          const cachedDashboard = getLearningSnapshot().dashboard;

          setDashboard(cachedDashboard ?? fallbackDashboardSummary);
          setApiStatus(cachedDashboard ? "Using cached dashboard" : "Using offline fallback");
          setSyncStatus(getLocalSyncStatus());
        }
      });

    fetchDocumentLibrarySummary()
      .then((summary) => {
        if (isMounted) {
          setDocumentLibrary(summary);
          setLibraryStatus("Connected to document API");
          cacheLearningSnapshot({ documentLibrary: summary });
        }
      })
      .catch(() => {
        if (isMounted) {
          const cachedLibrary = getLearningSnapshot().documentLibrary;

          setDocumentLibrary(cachedLibrary ?? fallbackDocumentLibrarySummary);
          setLibraryStatus(
            cachedLibrary ? "Using cached library" : "Using offline library fallback",
          );
          setSyncStatus(getLocalSyncStatus());
        }
      });

    fetchPlkgSummary()
      .then((summary) => {
        if (isMounted) {
          setPlkgSummary(summary);
          setPlkgStatus("Connected to PLKG API");
          cacheLearningSnapshot({ plkgSummary: summary });
        }
      })
      .catch(() => {
        if (isMounted) {
          const cachedPlkg = getLearningSnapshot().plkgSummary;

          setPlkgSummary(cachedPlkg ?? fallbackPlkgSummary);
          setPlkgStatus(cachedPlkg ? "Using cached PLKG" : "Using offline PLKG fallback");
          setSyncStatus(getLocalSyncStatus());
        }
      });

    fetchStudySummary()
      .then((summary) => {
        if (isMounted) {
          setStudySummary(summary);
          setStudyStatus("Connected to study API");
          cacheLearningSnapshot({ studySummary: summary });
        }
      })
      .catch(() => {
        if (isMounted) {
          const cachedStudy = getLearningSnapshot().studySummary;

          setStudySummary(cachedStudy ?? fallbackStudySummary);
          setStudyStatus(cachedStudy ? "Using cached study plan" : "Using offline study fallback");
          setSyncStatus(getLocalSyncStatus());
        }
      });

    fetchSyncStatus()
      .then((status) => {
        if (isMounted) {
          setSyncStatus(status);
          setSyncStatusLabel("Connected to sync API");
        }
      })
      .catch(() => {
        if (isMounted) {
          setSyncStatus(getLocalSyncStatus());
          setSyncStatusLabel("Using local sync queue");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateDocument = async (): Promise<void> => {
    setUploadState("Creating document metadata...");

    try {
      const document = await createLearningDocument({
        subjectId: dashboard.subjects[0]?.id ?? "subject-programming",
        fileName: "sample-study-note.pdf",
        mimeType: "application/pdf",
        fileSizeBytes: 2048,
        topicLabel: dashboard.subjects[0]?.currentTopic ?? "Topic pending",
      });

      setDocumentLibrary((current) => ({
        ...current,
        documents: [document, ...current.documents],
      }));
      setUploadState("Upload metadata ready for processing");
    } catch {
      const item = enqueueOfflineChange("document_metadata", "sample-study-note.pdf", {
        fileName: "sample-study-note.pdf",
        subjectId: dashboard.subjects[0]?.id ?? "subject-programming",
      });

      setSyncStatus(getLocalSyncStatus());
      setUploadState(`Queued offline metadata: ${item.id}`);
    }
  };

  const handleSendBlieQuestion = async (): Promise<void> => {
    setBlieStatus("Thinking with retrieved context...");

    try {
      const response = await sendBlieChat({
        message: blieQuestion,
        subjectId: selectedSubjectId,
        preferredMode: "simple",
      });

      setBlieResponse(response);
      setBlieStatus("Learning response ready");
    } catch {
      setBlieResponse(fallbackBlieResponse);
      setBlieStatus("BLIE request failed");
    }
  };

  const handleAddLearningActivity = async (): Promise<void> => {
    setPlkgStatus("Adding learning activity...");

    try {
      await createPlkgLearningActivity({
        subjectId: selectedSubjectId ?? dashboard.subjects[0]?.id ?? null,
        label: "Reviewed BLIE explanation",
        description: "Student reviewed one BLIE explanation and added it to PLKG memory.",
        sourceId: blieResponse?.id ?? "mobile-plkg-action",
      });
      const summary = await fetchPlkgSummary();

      setPlkgSummary(summary);
      setPlkgStatus("Learning activity added");
    } catch {
      const item = enqueueOfflineChange("plkg_learning_activity", "mobile-plkg-action", {
        label: "Reviewed BLIE explanation",
        subjectId: selectedSubjectId ?? dashboard.subjects[0]?.id ?? null,
        sourceId: blieResponse?.id ?? "mobile-plkg-action",
      });

      setSyncStatus(getLocalSyncStatus());
      setPlkgStatus(`Queued offline PLKG activity: ${item.id}`);
    }
  };

  const handleStudyReflection = async (revisionItem: StudyRevisionItem): Promise<void> => {
    setStudyStatus("Recording revision reflection...");

    try {
      const updated = await createStudyReflection({
        revisionItemId: revisionItem.id,
        confidenceLevel: 75,
        reflection: `Reviewed ${revisionItem.topicLabel} from the mobile Study tab.`,
      });

      setStudySummary((current) => ({
        ...current,
        revisionItems: current.revisionItems.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      }));
      setStudyStatus("Revision reflection recorded");
    } catch {
      const item = enqueueOfflineChange("study_reflection", revisionItem.id, {
        confidenceLevel: 75,
        reflection: `Reviewed ${revisionItem.topicLabel} from the mobile Study tab.`,
      });

      setSyncStatus(getLocalSyncStatus());
      setStudyStatus(`Queued offline reflection: ${item.id}`);
    }
  };

  const handleSyncNow = async (): Promise<void> => {
    setSyncStatusLabel("Synchronizing pending changes...");

    try {
      await pushPendingQueue();
      const status = await fetchSyncStatus();

      setSyncStatus(status);
      setSyncStatusLabel("Sync complete");
    } catch {
      setSyncStatus(getLocalSyncStatus());
      setSyncStatusLabel("Sync failed; pending changes preserved locally");
    }
  };

  const renderDashboard = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Academic Overview</Text>
        <Text style={styles.metricText}>
          {dashboard.academicOverview.fieldOfStudy ?? "Field of study pending"}
        </Text>
        <Text style={styles.mutedText}>
          {dashboard.subjects.length} subjects - {dashboard.learningStatus.readinessLabel}
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Subject Progress</Text>
        {dashboard.subjects.length === 0 ? (
          <Text style={styles.mutedText}>Add your first subject to start building context.</Text>
        ) : (
          dashboard.subjects.map((subject) => (
            <View key={subject.id} style={styles.subjectRow}>
              <View style={styles.subjectText}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.mutedText}>
                  {subject.code} - {subject.learningStatus}
                </Text>
              </View>
              <Text style={styles.progressText}>{subject.progressPercent}%</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>BLIE Guidance</Text>
        <Text style={styles.metricText}>{dashboard.blieRecommendation.title}</Text>
        <Text style={styles.mutedText}>{dashboard.blieRecommendation.body}</Text>
      </View>
    </>
  );

  const renderPreparationPlan = (plan: StudyPreparationPlan): React.JSX.Element => (
    <View key={plan.id} style={styles.documentRow}>
      <View style={styles.documentHeader}>
        <Text style={styles.subjectName}>{plan.topicLabel}</Text>
        <Text style={styles.statusPill}>{plan.readinessStatus}</Text>
      </View>
      <Text style={styles.mutedText}>{plan.subjectName}</Text>
      <Text style={styles.mutedText}>Prerequisites: {plan.prerequisiteLabels.join(", ")}</Text>
      {plan.tasks.slice(0, 2).map((task) => (
        <View key={task.id} style={styles.taskBlock}>
          <Text style={styles.responseLabel}>{task.title}</Text>
          <Text style={styles.mutedText}>
            {task.guidance} - {task.estimatedMinutes} min
          </Text>
        </View>
      ))}
      <Text style={styles.statusMeta}>{plan.trace.reason}</Text>
    </View>
  );

  const renderRevisionItem = (item: StudyRevisionItem): React.JSX.Element => (
    <View key={item.id} style={styles.documentRow}>
      <View style={styles.documentHeader}>
        <Text style={styles.subjectName}>{item.topicLabel}</Text>
        <Text style={styles.statusPill}>{item.priorityLabel}</Text>
      </View>
      <Text style={styles.mutedText}>
        {item.subjectName} - {item.status} - due {item.dueLabel}
      </Text>
      <Text style={styles.mutedText}>{item.recommendedAction}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${item.masteryScore}%` }]} />
      </View>
      {item.flashcards[0] ? (
        <View style={styles.taskBlock}>
          <Text style={styles.responseLabel}>Flashcard</Text>
          <Text style={styles.mutedText}>{item.flashcards[0].front}</Text>
          <Text style={styles.mutedText}>{item.flashcards[0].back}</Text>
        </View>
      ) : null}
      {item.quizQuestions[0] ? (
        <View style={styles.taskBlock}>
          <Text style={styles.responseLabel}>Quiz</Text>
          <Text style={styles.mutedText}>{item.quizQuestions[0].prompt}</Text>
        </View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void handleStudyReflection(item);
        }}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Mark reviewed</Text>
      </Pressable>
    </View>
  );

  const renderStudy = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Study Readiness</Text>
        <Text style={styles.metricText}>{studySummary.recommendedFocusLabel}</Text>
        <Text style={styles.mutedText}>{studyStatus}</Text>
        <View style={styles.graphMetricRow}>
          <Text style={styles.graphMetric}>{studySummary.preparationReadinessLabel}</Text>
          <Text style={styles.graphMetric}>{studySummary.revisionProgressLabel}</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Preparation</Text>
        {studySummary.preparationPlans.length === 0 ? (
          <Text style={styles.mutedText}>No preparation plans loaded yet.</Text>
        ) : (
          studySummary.preparationPlans.map(renderPreparationPlan)
        )}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Revision</Text>
        {studySummary.revisionItems.length === 0 ? (
          <Text style={styles.mutedText}>No revision items loaded yet.</Text>
        ) : (
          studySummary.revisionItems.map(renderRevisionItem)
        )}
      </View>
    </>
  );

  const renderLibraryDocument = (document: LearningDocument): React.JSX.Element => (
    <View key={document.id} style={styles.documentRow}>
      <View style={styles.documentHeader}>
        <Text style={styles.subjectName}>{document.title}</Text>
        <Text style={styles.statusPill}>{document.processing.status}</Text>
      </View>
      <Text style={styles.mutedText}>
        {document.subjectName} - {document.topicLabel ?? "Topic pending"}
      </Text>
      <Text style={styles.mutedText}>{document.processing.label}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${document.processing.progressPercent}%` }]} />
      </View>
    </View>
  );

  const renderLibrary = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Document Upload</Text>
        <Text style={styles.metricText}>{uploadState}</Text>
        <Text style={styles.mutedText}>Private bucket: {documentLibrary.upload.storageBucket}</Text>
        <Text style={styles.mutedText}>Path: {documentLibrary.upload.storagePathPattern}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleCreateDocument();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Create sample metadata</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Document Library</Text>
        <Text style={styles.mutedText}>{libraryStatus}</Text>
        {documentLibrary.documents.length === 0 ? (
          <>
            <Text style={styles.metricText}>{documentLibrary.emptyState.title}</Text>
            <Text style={styles.mutedText}>{documentLibrary.emptyState.body}</Text>
          </>
        ) : (
          documentLibrary.documents.map(renderLibraryDocument)
        )}
      </View>
    </>
  );

  const renderBuddyResponse = (response: BlieChatResponse): React.JSX.Element => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>BLIE Response</Text>
      <Text style={styles.metricText}>{response.response.explanation}</Text>
      <Text style={styles.mutedText}>{response.response.connection}</Text>
      <Text style={styles.responseLabel}>Example</Text>
      <Text style={styles.mutedText}>{response.response.example}</Text>
      <Text style={styles.responseLabel}>Check Understanding</Text>
      <Text style={styles.mutedText}>{response.response.checkUnderstanding}</Text>
      <Text style={styles.responseLabel}>Next Step</Text>
      <Text style={styles.mutedText}>{response.response.nextStep}</Text>
      <Text style={styles.statusMeta}>
        {response.trace.intent} - {response.trace.retrievalStatus} - {response.trace.provider}
      </Text>
    </View>
  );

  const renderBuddy = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>BLIE Chat</Text>
        <Text style={styles.metricText}>{blieStatus}</Text>
        <Text style={styles.mutedText}>
          Subject context:{" "}
          {dashboard.subjects.find((subject) => subject.id === selectedSubjectId)?.name ??
            "First available subject"}
        </Text>
        <View style={styles.subjectSelector}>
          {dashboard.subjects.map((subject) => {
            const isSelected = subject.id === selectedSubjectId;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                key={subject.id}
                onPress={() => setSelectedSubjectId(subject.id)}
                style={[styles.subjectChip, isSelected && styles.activeSubjectChip]}
              >
                <Text style={[styles.subjectChipText, isSelected && styles.activeSubjectChipText]}>
                  {subject.code}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <TextInput
          accessibilityLabel="BLIE learning question"
          multiline
          onChangeText={setBlieQuestion}
          placeholder="Ask BLIE a learning question"
          style={styles.chatInput}
          value={blieQuestion}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleSendBlieQuestion();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Ask BLIE</Text>
        </Pressable>
      </View>

      {blieResponse ? (
        renderBuddyResponse(blieResponse)
      ) : (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Retrieved Context</Text>
          <Text style={styles.mutedText}>
            BLIE will assemble academic profile, subject, document, and PLKG placeholder context
            before generating a response.
          </Text>
        </View>
      )}
    </>
  );

  const renderPlkgNode = (node: PlkgNode): React.JSX.Element => (
    <View key={node.id} style={styles.documentRow}>
      <View style={styles.documentHeader}>
        <Text style={styles.subjectName}>{node.label}</Text>
        <Text style={styles.statusPill}>{node.learningStatus}</Text>
      </View>
      <Text style={styles.mutedText}>
        {node.type} - mastery {node.masteryScore}% - confidence {node.confidenceLevel}%
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${node.masteryScore}%` }]} />
      </View>
    </View>
  );

  const renderPlkg = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Knowledge Growth</Text>
        <Text style={styles.metricText}>{plkgSummary.statusLabel}</Text>
        <Text style={styles.mutedText}>{plkgStatus}</Text>
        <Text style={styles.mutedText}>{plkgSummary.growthLabel}</Text>
        <View style={styles.graphMetricRow}>
          <Text style={styles.graphMetric}>{plkgSummary.nodeCount} nodes</Text>
          <Text style={styles.graphMetric}>{plkgSummary.edgeCount} links</Text>
          <Text style={styles.graphMetric}>{plkgSummary.averageMasteryScore}% mastery</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleAddLearningActivity();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Add learning activity</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Knowledge Gaps</Text>
        {plkgSummary.knowledgeGaps.length === 0 ? (
          <Text style={styles.mutedText}>No knowledge gaps loaded yet.</Text>
        ) : (
          plkgSummary.knowledgeGaps.map((gap) => (
            <View key={gap.nodeId} style={styles.documentRow}>
              <Text style={styles.subjectName}>{gap.label}</Text>
              <Text style={styles.mutedText}>{gap.reason}</Text>
              <Text style={styles.mutedText}>{gap.recommendedAction}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Knowledge Nodes</Text>
        {plkgSummary.nodes.slice(0, 6).map(renderPlkgNode)}
      </View>
    </>
  );

  const renderSync = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Synchronization</Text>
        <Text style={styles.metricText}>{syncStatus.connectionStatus}</Text>
        <Text style={styles.mutedText}>{syncStatusLabel}</Text>
        <View style={styles.graphMetricRow}>
          <Text style={styles.graphMetric}>{syncStatus.pendingCount} pending</Text>
          <Text style={styles.graphMetric}>{syncStatus.failedCount} failed</Text>
          <Text style={styles.graphMetric}>
            {syncStatus.lastSyncedAt ? "Synced recently" : "No sync yet"}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleSyncNow();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Sync now</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Offline Access</Text>
        {syncStatus.offlineAvailableSections.map((section) => (
          <View key={section} style={styles.subjectRow}>
            <Text style={styles.subjectName}>{section}</Text>
            <Text style={styles.statusPill}>cached</Text>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Pending Queue</Text>
        {syncStatus.queue.length === 0 ? (
          <Text style={styles.mutedText}>No pending offline changes.</Text>
        ) : (
          syncStatus.queue.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.documentRow}>
              <View style={styles.documentHeader}>
                <Text style={styles.subjectName}>{item.entityType}</Text>
                <Text style={styles.statusPill}>{item.status}</Text>
              </View>
              <Text style={styles.mutedText}>
                {item.operation} - {item.entityId}
              </Text>
              <Text style={styles.statusMeta}>Retries: {item.retryCount}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Conflict Rules</Text>
        {syncStatus.conflictRules.map((rule) => (
          <View key={rule.entityType} style={styles.documentRow}>
            <Text style={styles.subjectName}>{rule.entityType}</Text>
            <Text style={styles.mutedText}>
              {rule.strategy} - {rule.description}
            </Text>
          </View>
        ))}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>AI Study Buddy</Text>
        <Text style={styles.heading}>Learning Dashboard</Text>
        <Text style={styles.body}>
          {dashboard.academicOverview.currentSemester.label} -{" "}
          {dashboard.academicOverview.programmeName}
        </Text>

        <View style={styles.statusPanel}>
          <Text style={styles.statusLabel}>API base URL</Text>
          <Text style={styles.statusValue}>{apiBaseUrl}</Text>
          <Text style={styles.statusMeta}>{apiStatus}</Text>
        </View>

        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "study" && renderStudy()}
        {activeTab === "buddy" && renderBuddy()}
        {activeTab === "library" && renderLibrary()}
        {activeTab === "plkg" && renderPlkg()}
        {activeTab === "sync" && renderSync()}

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7f8fb",
  },
  container: {
    gap: 18,
    padding: 24,
    paddingBottom: 34,
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
  statusMeta: {
    color: "#52707a",
    fontSize: 13,
    marginTop: 8,
  },
  panel: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe3e7",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  panelTitle: {
    color: "#65777e",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  metricText: {
    color: "#162b32",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0,
  },
  mutedText: {
    color: "#52666d",
    fontSize: 14,
    lineHeight: 20,
  },
  responseLabel: {
    color: "#24464f",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 4,
    textTransform: "uppercase",
  },
  subjectSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  subjectChip: {
    alignItems: "center",
    borderColor: "#cad5da",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  activeSubjectChip: {
    backgroundColor: "#14323b",
    borderColor: "#14323b",
  },
  subjectChipText: {
    color: "#30474f",
    fontSize: 13,
    fontWeight: "800",
  },
  activeSubjectChipText: {
    color: "#ffffff",
  },
  chatInput: {
    backgroundColor: "#ffffff",
    borderColor: "#cad5da",
    borderRadius: 8,
    borderWidth: 1,
    color: "#162b32",
    fontSize: 15,
    lineHeight: 21,
    minHeight: 96,
    padding: 12,
    textAlignVertical: "top",
  },
  subjectRow: {
    alignItems: "center",
    borderTopColor: "#edf1f3",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingTop: 12,
  },
  subjectText: {
    flex: 1,
    gap: 3,
  },
  subjectName: {
    color: "#162b32",
    fontSize: 15,
    fontWeight: "800",
  },
  progressText: {
    color: "#14323b",
    fontSize: 15,
    fontWeight: "800",
  },
  graphMetricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  graphMetric: {
    backgroundColor: "#e8f0ee",
    borderRadius: 8,
    color: "#24463f",
    fontSize: 13,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  documentRow: {
    borderTopColor: "#edf1f3",
    borderTopWidth: 1,
    gap: 7,
    paddingTop: 12,
  },
  documentHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  statusPill: {
    backgroundColor: "#e8f0ee",
    borderRadius: 8,
    color: "#24463f",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    textTransform: "uppercase",
  },
  progressTrack: {
    backgroundColor: "#e6ecef",
    borderRadius: 8,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: "#24756b",
    height: 8,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#14323b",
    borderRadius: 8,
    minHeight: 44,
    justifyContent: "center",
    marginTop: 6,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#14323b",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: "center",
    marginTop: 4,
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    color: "#14323b",
    fontSize: 13,
    fontWeight: "800",
  },
  taskBlock: {
    gap: 4,
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
